import { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { 
  mockTransactions, 
  mockGroups, 
  mockGroupExpenses, 
  mockBudgets, 
  mockSettlements,
  mockUsers 
} from '../data/mockData';
import toast from 'react-hot-toast';

const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  // Initialize with mock data if localStorage is empty
  const [transactions, setTransactions] = useLocalStorage('expenseflow_transactions', mockTransactions);
  const [groups, setGroups] = useLocalStorage('expenseflow_groups', mockGroups);
  const [groupExpenses, setGroupExpenses] = useLocalStorage('expenseflow_groupExpenses', mockGroupExpenses);
  const [budgets, setBudgets] = useLocalStorage('expenseflow_budgets', mockBudgets);
  const [settlements, setSettlements] = useLocalStorage('expenseflow_settlements', mockSettlements);
  
  // We'll also store mock users so we can display names and avatars easily
  const [users, setUsers] = useLocalStorage('expenseflow_users', mockUsers);

  // === TRANSACTIONS ===
  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: `t${Date.now()}`,
    };
    setTransactions(prev => [newTransaction, ...prev]);
    toast.success('Transaction added');
  };

  const updateTransaction = (id, updates) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    toast.success('Transaction updated');
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast.success('Transaction deleted');
  };

  // === GROUPS ===
  const addGroup = (group) => {
    const newGroup = {
      ...group,
      id: `g${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setGroups(prev => [newGroup, ...prev]);
    toast.success('Group created');
  };

  const addGroupExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: `ge${Date.now()}`,
    };
    setGroupExpenses(prev => [...prev, newExpense]);
    toast.success('Group expense added');
  };

  const addSettlement = (settlement) => {
    const newSettlement = {
      ...settlement,
      id: `s${Date.now()}`,
      date: new Date().toISOString()
    };
    setSettlements(prev => [...prev, newSettlement]);
    toast.success('Settlement recorded');
  };

  // === BUDGETS ===
  const addBudget = (budget) => {
    const newBudget = {
      ...budget,
      id: `b${Date.now()}`,
    };
    setBudgets(prev => [...prev, newBudget]);
    toast.success('Budget created');
  };

  const updateBudget = (id, updates) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    toast.success('Budget updated');
  };

  const deleteBudget = (id) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
    toast.success('Budget deleted');
  };

  const value = {
    transactions,
    groups,
    groupExpenses,
    budgets,
    settlements,
    users,
    
    addTransaction,
    updateTransaction,
    deleteTransaction,
    
    addGroup,
    addGroupExpense,
    addSettlement,
    
    addBudget,
    updateBudget,
    deleteBudget
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  return useContext(FinanceContext);
}
