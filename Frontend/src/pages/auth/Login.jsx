import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Eye, EyeOff } from 'lucide-react';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } },
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch { /* handled */ }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-600/30 blur-[100px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-[90px]" />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-premium backdrop-blur-xl"
      >
        <motion.div variants={fadeUp} className="flex flex-col items-center text-center">
          <Link to="/" className="font-display text-2xl font-bold text-white">
            Expense<span className="aurora-text">Flow</span>
          </Link>
          <h1 className="mt-4 font-display text-xl font-semibold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-white/45">Sign in to manage your finances</p>
        </motion.div>

        <motion.form variants={fadeUp} className="space-y-5" onSubmit={handleSubmit}>
          <Input label="Email address" id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="relative">
            <Input label="Password" id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" className="absolute right-3 top-8 text-white/40 hover:text-white" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <Button type="submit" className="w-full" size="lg" isLoading={loading}>Sign in</Button>
        </motion.form>

        <motion.p variants={fadeUp} className="text-center text-sm text-white/45">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-violet-300 hover:text-fuchsia-300">Sign up</Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
