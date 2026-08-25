import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { WalletCards, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by context/toast
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 text-indigo-600 1 mb-4">
            <WalletCards size={32} />
          </div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-zinc-400">
            Sign in to manage your finances
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <Input
              label="Email address"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@example.com"
            />
            
            <div className="relative">
              <Input
                label="Password"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-slate-400 1 hover:text-slate-500 dark:text-zinc-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 1 text-indigo-600 1 focus:ring-indigo-600"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900 dark:text-white">
                Remember me
              </label>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={loading}
            >
              Sign in
            </Button>
          </div>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-zinc-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-indigo-600 1 hover:text-indigo-500 1">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
