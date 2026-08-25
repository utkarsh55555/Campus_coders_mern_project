export const demoUser = {
  id: 'u1',
  name: 'Demo User',
  email: 'demo@example.com',
  avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff',
  createdAt: '2023-01-15T10:00:00Z'
};

export const mockUsers = [
  demoUser,
  { id: 'u2', name: 'Rahul', avatar: 'https://ui-avatars.com/api/?name=Rahul&background=E53E3E&color=fff' },
  { id: 'u3', name: 'Aman', avatar: 'https://ui-avatars.com/api/?name=Aman&background=38A169&color=fff' },
  { id: 'u4', name: 'Karan', avatar: 'https://ui-avatars.com/api/?name=Karan&background=D69E2E&color=fff' },
  { id: 'u5', name: 'Priya', avatar: 'https://ui-avatars.com/api/?name=Priya&background=805AD5&color=fff' },
  { id: 'u6', name: 'Manvendra', avatar: 'https://ui-avatars.com/api/?name=Manvendra&background=3182CE&color=fff' }
];

export const mockTransactions = [
  { id: 't1', type: 'expense', amount: 450, description: 'Movie tickets', category: 'Entertainment', date: '2023-10-25T14:30:00Z', notes: 'Weekend movie' },
  { id: 't2', type: 'income', amount: 35000, description: 'Monthly Salary', category: 'Salary', date: '2023-10-01T09:00:00Z', notes: 'October salary' },
  { id: 't3', type: 'expense', amount: 1500, description: 'Restaurant', category: 'Food', date: '2023-10-20T20:00:00Z', notes: 'Dinner with friends' },
  { id: 't4', type: 'expense', amount: 2500, description: 'Electricity bill', category: 'Bills', date: '2023-10-05T10:00:00Z', notes: '' },
  { id: 't5', type: 'expense', amount: 800, description: 'Uber to office', category: 'Travel', date: '2023-10-22T08:30:00Z', notes: '' },
  { id: 't6', type: 'income', amount: 15000, description: 'Freelance project', category: 'Freelance', date: '2023-10-15T15:00:00Z', notes: 'Website design' },
  { id: 't7', type: 'expense', amount: 3200, description: 'Amazon shopping', category: 'Shopping', date: '2023-10-18T18:45:00Z', notes: 'New headphones' },
  { id: 't8', type: 'expense', amount: 1200, description: 'Gym membership', category: 'Health', date: '2023-10-02T07:00:00Z', notes: 'Monthly fee' },
  { id: 't9', type: 'expense', amount: 400, description: 'College canteen', category: 'Food', date: '2023-10-24T13:00:00Z', notes: 'Lunch' },
  { id: 't10', type: 'expense', amount: 2000, description: 'Petrol', category: 'Travel', date: '2023-10-12T17:20:00Z', notes: 'Car fuel' },
  { id: 't11', type: 'expense', amount: 500, description: 'Netflix subscription', category: 'Entertainment', date: '2023-10-10T10:00:00Z', notes: '' },
  { id: 't12', type: 'expense', amount: 1500, description: 'Online course', category: 'Education', date: '2023-10-08T11:00:00Z', notes: 'React course' },
  { id: 't13', type: 'income', amount: 5000, description: 'Sold old phone', category: 'Other', date: '2023-10-26T16:00:00Z', notes: '' },
  { id: 't14', type: 'expense', amount: 600, description: 'Pharmacy', category: 'Health', date: '2023-10-19T09:30:00Z', notes: 'Medicines' },
  { id: 't15', type: 'expense', amount: 2200, description: 'Groceries', category: 'Food', date: '2023-10-05T18:00:00Z', notes: 'Weekly groceries' }
];

export const mockGroups = [
  {
    id: 'g1',
    name: 'Goa Trip',
    description: 'Year end trip to Goa',
    members: ['u1', 'u2', 'u3', 'u4'],
    createdAt: '2023-09-15T10:00:00Z'
  },
  {
    id: 'g2',
    name: 'Roommates',
    description: 'Apartment expenses',
    members: ['u1', 'u5', 'u6'],
    createdAt: '2023-08-01T10:00:00Z'
  }
];

export const mockGroupExpenses = [
  {
    id: 'ge1',
    groupId: 'g1',
    description: 'Hotel Booking',
    amount: 12000,
    paidBy: 'u1',
    date: '2023-09-20T10:00:00Z',
    splitType: 'equal',
    splits: { u1: 3000, u2: 3000, u3: 3000, u4: 3000 }
  },
  {
    id: 'ge2',
    groupId: 'g1',
    description: 'Dinner & Drinks',
    amount: 4500,
    paidBy: 'u2',
    date: '2023-09-22T20:00:00Z',
    splitType: 'custom',
    splits: { u1: 1500, u2: 1000, u3: 1000, u4: 1000 }
  },
  {
    id: 'ge3',
    groupId: 'g2',
    description: 'Electricity Bill',
    amount: 1500,
    paidBy: 'u5',
    date: '2023-10-05T10:00:00Z',
    splitType: 'equal',
    splits: { u1: 500, u5: 500, u6: 500 }
  }
];

export const mockSettlements = [
  {
    id: 's1',
    groupId: 'g1',
    paidBy: 'u3',
    paidTo: 'u1',
    amount: 3000,
    date: '2023-09-25T10:00:00Z'
  }
];

export const mockBudgets = [
  { id: 'b1', category: 'Food', amount: 8000, month: '2023-10' },
  { id: 'b2', category: 'Travel', amount: 5000, month: '2023-10' },
  { id: 'b3', category: 'Shopping', amount: 3000, month: '2023-10' },
  { id: 'b4', category: 'Entertainment', amount: 2000, month: '2023-10' },
];

export const categories = [
  'Food', 'Travel', 'Shopping', 'Bills', 'Entertainment',
  'Health', 'Education', 'Salary', 'Freelance', 'Other'
];
