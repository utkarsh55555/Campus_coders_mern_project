import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import {
  getTransactions,
  createTransaction,
  updateTransaction as updateTransactionApi,
  deleteTransaction as deleteTransactionApi,
  getGroups,
  createGroup,
  addExpense,
  getExpenses,
  getBudgets,
  createBudget,
  checkBudget,
  getSettlement,
} from '../api';

const FinanceContext = createContext();

const withId = (doc) => {
  if (!doc) return doc;
  const plain = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  const id = plain._id || plain.id;
  return { ...plain, id, _id: id };
};

const monthBounds = (month) => {
  const [year, m] = month.split('-').map(Number);
  const startDate = new Date(Date.UTC(year, m - 1, 1));
  const endDate = new Date(Date.UTC(year, m, 0, 23, 59, 59, 999));
  return { startDate, endDate };
};

const mapBudget = (budget) => {
  const b = withId(budget);
  const start = b.startDate ? new Date(b.startDate) : new Date();
  const month = `${start.getUTCFullYear()}-${String(start.getUTCMonth() + 1).padStart(2, '0')}`;
  return {
    ...b,
    amount: b.limit ?? b.amount,
    month,
  };
};

const mapGroup = (group) => {
  const g = withId(group);
  const members = (g.members || []).map((m) =>
    typeof m === 'object' && m !== null ? m._id || m.id : m
  );
  return { ...g, members };
};

const extractUsersFromGroups = (groups) => {
  const map = new Map();
  groups.forEach((group) => {
    (group.members || []).forEach((m) => {
      if (typeof m === 'object' && m !== null) {
        const user = withId(m);
        map.set(String(user.id), {
          ...user,
          avatar:
            user.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0D8ABC&color=fff`,
        });
      }
    });
  });
  return Array.from(map.values());
};

export function FinanceProvider({ children }) {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadFinance = useCallback(async () => {
    if (!currentUser || !localStorage.getItem('token')) {
      setTransactions([]);
      setGroups([]);
      setGroupExpenses([]);
      setBudgets([]);
      setSettlements([]);
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const [txRes, groupRes, budgetRes] = await Promise.all([
        getTransactions(),
        getGroups(),
        getBudgets(),
      ]);

      const txList = (txRes.data || []).map(withId);
      const rawGroups = groupRes.data?.data || [];
      const mappedGroups = rawGroups.map(mapGroup);
      const budgetList = (budgetRes.data?.data || []).map(mapBudget);

      setTransactions(txList);
      setGroups(mappedGroups);
      setBudgets(budgetList);
      setUsers(extractUsersFromGroups(rawGroups));

      const expenseLists = await Promise.all(
        mappedGroups.map(async (g) => {
          try {
            const res = await getExpenses(g.id);
            return (res.data?.data || []).map((e) => {
              const expense = withId(e);
              return {
                ...expense,
                groupId: expense.groupId?._id || expense.groupId,
                paidBy: expense.paidBy?._id || expense.paidBy?.id || expense.paidBy,
              };
            });
          } catch {
            return [];
          }
        })
      );
      setGroupExpenses(expenseLists.flat());
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadFinance();
  }, [loadFinance]);

  const addTransaction = async (transaction) => {
    try {
      const { data } = await createTransaction(transaction);
      const created = withId(data.data);
      setTransactions((prev) => [created, ...prev]);
      toast.success('Transaction added');
      return created;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add transaction');
      throw error;
    }
  };

  const updateTransaction = async (id, updates) => {
    try {
      const { data } = await updateTransactionApi(id, updates);
      const updated = withId(data.data);
      setTransactions((prev) => prev.map((t) => (t.id === id || t._id === id ? updated : t)));
      toast.success('Transaction updated');
      return updated;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update transaction');
      throw error;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await deleteTransactionApi(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id && t._id !== id));
      toast.success('Transaction deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete transaction');
      throw error;
    }
  };

  const addGroup = async (group) => {
    try {
      const { data } = await createGroup({
        name: group.name,
        description: group.description,
      });
      const created = mapGroup(data.data);
      setGroups((prev) => [created, ...prev]);
      toast.success('Group created');
      return created;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create group');
      throw error;
    }
  };

  const addGroupExpense = async (expense) => {
    try {
      const { data } = await addExpense(expense.groupId, {
        amount: expense.amount,
        description: expense.description,
        date: expense.date,
      });
      const created = withId(data.data);
      const normalized = {
        ...created,
        groupId: created.groupId?._id || created.groupId || expense.groupId,
        paidBy: created.paidBy?._id || created.paidBy || expense.paidBy,
        splits: expense.splits,
        splitType: expense.splitType,
      };
      setGroupExpenses((prev) => [...prev, normalized]);
      toast.success('Group expense added');
      return normalized;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add expense');
      throw error;
    }
  };

  const addSettlement = (settlement) => {
    const newSettlement = {
      ...settlement,
      id: `s${Date.now()}`,
      date: new Date().toISOString(),
    };
    setSettlements((prev) => [...prev, newSettlement]);
    toast.success('Settlement recorded');
  };

  const fetchSettlement = async (groupId) => {
    try {
      const { data } = await getSettlement(groupId);
      return data;
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to calculate settlement');
      throw error;
    }
  };

  const addBudget = async (budget) => {
    try {
      const { startDate, endDate } = monthBounds(budget.month);
      const { data } = await createBudget({
        category: budget.category,
        limit: budget.amount,
        startDate,
        endDate,
      });
      const created = mapBudget(data.data);
      setBudgets((prev) => [...prev, created]);
      toast.success('Budget created');
      return created;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create budget');
      throw error;
    }
  };

  const updateBudget = async (id, updates) => {
    // Backend has no update-budget route yet — refresh via check when possible
    try {
      if (updates?.check) {
        const { data } = await checkBudget(id);
        const updated = mapBudget(data.data);
        setBudgets((prev) => prev.map((b) => (b.id === id || b._id === id ? updated : b)));
        toast.success('Budget updated');
        return updated;
      }
      setBudgets((prev) =>
        prev.map((b) => (b.id === id || b._id === id ? { ...b, ...updates } : b))
      );
      toast.success('Budget updated locally');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update budget');
      throw error;
    }
  };

  const deleteBudget = (id) => {
    // Backend has no delete-budget route yet
    setBudgets((prev) => prev.filter((b) => b.id !== id && b._id !== id));
    toast.success('Budget removed');
  };

  const refreshBudget = async (id) => {
    try {
      const { data } = await checkBudget(id);
      const updated = mapBudget(data.data);
      setBudgets((prev) => prev.map((b) => (b.id === id || b._id === id ? updated : b)));
      return updated;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to check budget');
      throw error;
    }
  };

  const value = {
    transactions,
    groups,
    groupExpenses,
    budgets,
    settlements,
    users,
    loading,
    refresh: loadFinance,

    addTransaction,
    updateTransaction,
    deleteTransaction,

    addGroup,
    addGroupExpense,
    addSettlement,
    fetchSettlement,

    addBudget,
    updateBudget,
    deleteBudget,
    refreshBudget,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  return useContext(FinanceContext);
}
