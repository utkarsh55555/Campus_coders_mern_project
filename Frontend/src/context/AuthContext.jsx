import { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { login as loginApi, register as registerApi } from '../api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

function mapUser(userData) {
  const id = userData._id || userData.id;
  return {
    id,
    _id: id,
    name: userData.name,
    email: userData.email,
    avatar:
      userData.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=0D8ABC&color=fff`,
  };
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useLocalStorage('expenseflow_user', null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await loginApi({ email, password });
      localStorage.setItem('token', data.token);
      const user = mapUser(data);
      setCurrentUser(user);
      toast.success('Login successful!');
      return user;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const { data } = await registerApi(userData);
      localStorage.setItem('token', data.token);
      const user = mapUser(data);
      setCurrentUser(user);
      toast.success('Registration successful!');
      return user;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = (updates) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
    toast.success('Profile updated');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateProfile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
