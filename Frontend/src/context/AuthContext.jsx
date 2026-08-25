import { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { demoUser } from '../data/mockData';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useLocalStorage('expenseflow_user', null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'demo@example.com' && password === 'password123') {
          setCurrentUser(demoUser);
          toast.success('Login successful!');
          resolve(demoUser);
        } else {
          toast.error('Invalid credentials');
          reject(new Error('Invalid credentials'));
        }
        setLoading(false);
      }, 800);
    });
  };

  const register = async (userData) => {
    setLoading(true);
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          id: `u${Date.now()}`,
          name: userData.name,
          email: userData.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=0D8ABC&color=fff`,
          createdAt: new Date().toISOString()
        };
        setCurrentUser(newUser);
        toast.success('Registration successful!');
        resolve(newUser);
        setLoading(false);
      }, 800);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = (updates) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
    toast.success('Profile updated');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateProfile,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
