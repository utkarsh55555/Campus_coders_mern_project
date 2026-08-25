import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { WalletCards, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate('/dashboard');
    } catch (error) {
      // Error is handled
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
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-zinc-400">
            Start managing your finances today
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <Input
              label="Full Name"
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
            />
            
            <Input
              label="Email address"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />
            
            <div className="relative">
              <Input
                label="Password"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-slate-400 1 hover:text-slate-500 dark:text-zinc-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <Input
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={loading}
            >
              Sign up
            </Button>
          </div>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-zinc-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 1 hover:text-indigo-500 1">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
