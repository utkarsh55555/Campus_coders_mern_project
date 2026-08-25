/**
 * Calculates equal split among members
 * @param {number} totalAmount 
 * @param {Array<string>} memberIds 
 * @returns {Object} splits - { memberId: amount }
 */
export const calculateEqualSplit = (totalAmount, memberIds) => {
  if (!memberIds || memberIds.length === 0) return {};
  
  const amountPerPerson = Number((totalAmount / memberIds.length).toFixed(2));
  const splits = {};
  
  // Handle slight rounding errors by giving the remainder to the first person
  let totalDistributed = 0;
  
  memberIds.forEach((id, index) => {
    if (index === memberIds.length - 1) {
      splits[id] = Number((totalAmount - totalDistributed).toFixed(2));
    } else {
      splits[id] = amountPerPerson;
      totalDistributed += amountPerPerson;
    }
  });
  
  return splits;
};

/**
 * Validates custom split amounts
 * @param {number} totalAmount 
 * @param {Object} customSplits - { memberId: amount }
 * @returns {boolean}
 */
export const validateCustomSplit = (totalAmount, customSplits) => {
  const sum = Object.values(customSplits).reduce((acc, val) => acc + Number(val), 0);
  // Allow small floating point differences
  return Math.abs(sum - totalAmount) < 0.01;
};

/**
 * Calculates net balances for all members in a group
 * @param {Array} expenses 
 * @param {Array} settlements 
 * @param {Array<string>} memberIds
 * @returns {Object} balances - { memberId: netBalance } positive means they are owed money, negative means they owe money
 */
export const calculateBalances = (expenses = [], settlements = [], memberIds = []) => {
  const balances = {};
  
  // Initialize balances
  memberIds.forEach(id => {
    balances[id] = 0;
  });
  
  // Process expenses
  expenses.forEach(expense => {
    // Add full amount to the person who paid
    if (balances[expense.paidBy] !== undefined) {
      balances[expense.paidBy] += Number(expense.amount);
    }
    
    // Subtract each person's share
    Object.entries(expense.splits || {}).forEach(([memberId, splitAmount]) => {
      if (balances[memberId] !== undefined) {
        balances[memberId] -= Number(splitAmount);
      }
    });
  });
  
  // Process settlements
  settlements.forEach(settlement => {
    if (balances[settlement.paidBy] !== undefined) {
      balances[settlement.paidBy] += Number(settlement.amount);
    }
    if (balances[settlement.paidTo] !== undefined) {
      balances[settlement.paidTo] -= Number(settlement.amount);
    }
  });
  
  // Round all balances to 2 decimal places to avoid floating point issues
  Object.keys(balances).forEach(id => {
    balances[id] = Number(balances[id].toFixed(2));
    // If balance is practically zero (e.g., -0.00), set to exactly 0
    if (Math.abs(balances[id]) < 0.01) balances[id] = 0;
  });
  
  return balances;
};

/**
 * Calculates who owes whom based on net balances
 * @param {Object} balances - Result from calculateBalances
 * @returns {Array} simplified debts - [{ from: memberId, to: memberId, amount: number }]
 */
export const calculateSettlements = (balances) => {
  const debtors = [];
  const creditors = [];
  const settlements = [];
  
  Object.entries(balances).forEach(([id, balance]) => {
    if (balance < 0) {
      debtors.push({ id, amount: Math.abs(balance) });
    } else if (balance > 0) {
      creditors.push({ id, amount: balance });
    }
  });
  
  // Sort by amount descending
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);
  
  let dIndex = 0;
  let cIndex = 0;
  
  while (dIndex < debtors.length && cIndex < creditors.length) {
    const debtor = debtors[dIndex];
    const creditor = creditors[cIndex];
    
    const amount = Math.min(debtor.amount, creditor.amount);
    
    if (amount > 0) {
      settlements.push({
        from: debtor.id,
        to: creditor.id,
        amount: Number(amount.toFixed(2))
      });
    }
    
    debtor.amount -= amount;
    creditor.amount -= amount;
    
    if (Math.abs(debtor.amount) < 0.01) dIndex++;
    if (Math.abs(creditor.amount) < 0.01) cIndex++;
  }
  
  return settlements;
};
