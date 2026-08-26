import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

// Automatically attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auth
export const login = (credentials) => API.post("/auth/login", credentials);
export const register = (data) => API.post("/auth/register", data);

// Transactions
export const getTransactions = () => API.get("/transactions/getAllTransactions");
export const createTransaction = (data) => API.post("/transactions/createTransaction", data);
export const updateTransaction = (id, data) =>
  API.put(`/transactions/updateTransaction/${id}`, data);
export const deleteTransaction = (id) =>
  API.delete(`/transactions/deleteTransaction/${id}`);

// Groups
export const getGroups = () => API.get("/groups/getGroups");
export const createGroup = (data) => API.post("/groups/createGroup", data);
export const addMember = (groupId, memberId) =>
  API.post(`/groups/addMember/${groupId}`, { memberId });

// Group expenses
export const addExpense = (groupId, data) =>
  API.post(`/groupExpenses/addExpense/${groupId}`, data);
export const getExpenses = (groupId) =>
  API.get(`/groupExpenses/getExpenses/${groupId}`);

// Settlements
export const getSettlement = (groupId) =>
  API.get(`/settlement/calculateSettlement/${groupId}`);

// Budgets
export const createBudget = (data) => API.post("/budgets", data);
export const getBudgets = () => API.get("/budgets");
export const checkBudget = (id) => API.get(`/budgets/${id}/check`);

export default API;
