import { createContext, useContext, useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import {
  getTransactions,
  createTransaction,
  updateTransaction as updateTransactionApi,
  deleteTransaction as deleteTransactionApi,
  getGroups,
  createGroup,
  addMember,
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

const avatarFor = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=0D8ABC&color=fff`;

const normalizeUser = (user) => {
  const u = withId(user);
  return {
    ...u,
    avatar: u.avatar || avatarFor(u.name),
  };
};

const extractUsersFromGroups = (groups) => {
  const map = new Map();
  groups.forEach((group) => {
    (group.members || []).forEach((m) => {
      if (typeof m === 'object' && m !== null) {
        const user = normalizeUser(m);
        map.set(String(user.id), user);
      }
    });
  });
  return Array.from(map.values());
};

const DISCOVERED_USERS_KEY = 'expenseflow_discovered_users';

const loadDiscoveredUsers = () => {
  try {
    const raw = localStorage.getItem(DISCOVERED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveDiscoveredUsers = (users) => {
  localStorage.setItem(DISCOVERED_USERS_KEY, JSON.stringify(users));
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isNetworkError = (error) =>
  !error?.response &&
  (error?.code === 'ERR_NETWORK' ||
    error?.code === 'ECONNABORTED' ||
    error?.message?.includes('Network Error'));

const getLoadErrorMessage = (error) => {
  if (isNetworkError(error)) {
    return "Can't reach the server. Run npm start from the project root (starts both frontend and backend).";
  }
  return error.response?.data?.message || 'Failed to load data';
};

export function FinanceProvider({ children }) {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [users, setUsers] = useState([]);
  const [discoveredUsers, setDiscoveredUsers] = useState(loadDiscoveredUsers);
  const [loading, setLoading] = useState(false);
  const loadInFlightRef = useRef(false);

  const mergeUsers = useCallback((groupUsers, discovered, authUser) => {
    const map = new Map();
    discovered.forEach((u) => map.set(String(u.id), normalizeUser(u)));
    groupUsers.forEach((u) => map.set(String(u.id), normalizeUser(u)));
    if (authUser?.id) {
      map.set(String(authUser.id), normalizeUser(authUser));
    }
    return Array.from(map.values());
  }, []);

  const allUsers = mergeUsers(users, discoveredUsers, currentUser);

  const inviteUserByEmail = useCallback((email) => {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = allUsers.find((u) => u.email?.toLowerCase() === normalizedEmail);
    if (existing) return existing;

    const name = normalizedEmail.split('@')[0];
    const invited = normalizeUser({
      id: `pending:${normalizedEmail}`,
      email: normalizedEmail,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      isPending: true,
    });

    setDiscoveredUsers((prev) => {
      const next = [...prev.filter((u) => u.id !== invited.id), invited];
      saveDiscoveredUsers(next);
      return next;
    });

    return invited;
  }, [allUsers]);

  const loadFinance = useCallback(async ({ silent = false } = {}) => {
    if (!currentUser || !localStorage.getItem('token')) {
      setTransactions([]);
      setGroups([]);
      setGroupExpenses([]);
      setBudgets([]);
      setSettlements([]);
      setUsers([]);
      setDiscoveredUsers(loadDiscoveredUsers());
      return;
    }

    if (loadInFlightRef.current) return;
    loadInFlightRef.current = true;
    setLoading(true);

    const fetchCoreData = async () => {
      const [txRes, groupRes, budgetRes] = await Promise.all([
        getTransactions(),
        getGroups(),
        getBudgets(),
      ]);
      return { txRes, groupRes, budgetRes };
    };

    try {
      let coreData;
      const maxAttempts = 4;

      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        try {
          coreData = await fetchCoreData();
          break;
        } catch (error) {
          const shouldRetry = isNetworkError(error) && attempt < maxAttempts - 1;
          if (!shouldRetry) throw error;
          await sleep(750 * (attempt + 1));
        }
      }

      const { txRes, groupRes, budgetRes } = coreData;
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
      if (!silent) {
        toast.error(getLoadErrorMessage(error));
      }
      throw error;
    } finally {
      loadInFlightRef.current = false;
      setLoading(false);
    }
  }, [currentUser]);

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

  const syncGroupMembers = async (groupId, memberIds) => {
    let updatedGroup = null;
    const failed = [];

    for (const memberId of memberIds) {
      try {
        const { data } = await addMember(groupId, memberId);
        updatedGroup = mapGroup(data.data);
      } catch {
        failed.push(memberId);
      }
    }

    return { updatedGroup, failed };
  };

  const applyMembersToGroup = (groupId, memberIds) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId && g._id !== groupId) return g;
        const merged = [...new Set([...(g.members || []), ...memberIds])];
        return { ...g, members: merged };
      })
    );
  };

  const registerUsersFromMembers = (memberIds) => {
    const toAdd = memberIds
      .map((id) => allUsers.find((u) => String(u.id) === String(id)))
      .filter(Boolean);

    if (toAdd.length === 0) return;

    setUsers((prev) => {
      const map = new Map(prev.map((u) => [String(u.id), u]));
      toAdd.forEach((u) => map.set(String(u.id), u));
      return Array.from(map.values());
    });
  };

  const addGroup = async (group) => {
    try {
      const { data } = await createGroup({
        name: group.name,
        description: group.description,
        members: group.members,
      });
      let created = mapGroup(data.data);
      const extraMembers = (group.members || []).filter(
        (id) => !created.members?.some((m) => String(m) === String(id))
      );

      if (extraMembers.length > 0) {
        const { updatedGroup, failed } = await syncGroupMembers(created.id, extraMembers);
        if (updatedGroup) {
          created = updatedGroup;
        } else {
          created = {
            ...created,
            members: [...new Set([...(created.members || []), ...extraMembers])],
          };
        }
        registerUsersFromMembers(extraMembers);
        if (failed.length > 0 && failed.length < extraMembers.length) {
          toast.success('Group created — some members saved locally until backend syncs');
        } else if (failed.length === extraMembers.length) {
          toast.success('Group created — members added locally');
        }
      } else {
        toast.success('Group created');
      }

      setGroups((prev) => [created, ...prev]);
      return created;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create group');
      throw error;
    }
  };

  const addMemberToGroup = async (groupId, memberIds) => {
    const ids = Array.isArray(memberIds) ? memberIds : [memberIds];
    const newIds = ids.filter(
      (id) => !groups.find((g) => g.id === groupId || g._id === groupId)?.members?.some((m) => String(m) === String(id))
    );

    if (newIds.length === 0) return;

    const { updatedGroup, failed } = await syncGroupMembers(groupId, newIds);

    if (updatedGroup) {
      setGroups((prev) =>
        prev.map((g) => (g.id === groupId || g._id === groupId ? updatedGroup : g))
      );
      const populated = extractUsersFromGroups([updatedGroup]);
      setUsers((prev) => {
        const map = new Map(prev.map((u) => [String(u.id), u]));
        populated.forEach((u) => map.set(String(u.id), u));
        return Array.from(map.values());
      });
      toast.success(
        failed.length > 0
          ? `Added ${newIds.length - failed.length} member(s) — ${failed.length} saved locally`
          : `Added ${newIds.length} member(s)`
      );
    } else {
      applyMembersToGroup(groupId, newIds);
      registerUsersFromMembers(newIds);
      toast.success(`Added ${newIds.length} member(s) locally`);
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
    allUsers,
    loading,
    refresh: loadFinance,

    addTransaction,
    updateTransaction,
    deleteTransaction,

    addGroup,
    addMemberToGroup,
    inviteUserByEmail,
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
