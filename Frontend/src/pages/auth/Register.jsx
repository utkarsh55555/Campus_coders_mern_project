import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } },
};

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
      await register({ name: formData.name, email: formData.email, password: formData.password });
      navigate('/dashboard');
    } catch { /* handled */ }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-72 w-72 rounded-full bg-fuchsia-500/25 blur-[100px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/3 h-56 w-56 rounded-full bg-cyan-400/15 blur-[90px]" />

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
          <h1 className="mt-4 font-display text-xl font-semibold text-white">Create an account</h1>
          <p className="mt-1 text-sm text-white/45">Start managing your finances today</p>
        </motion.div>

        <motion.form variants={fadeUp} className="space-y-4" onSubmit={handleSubmit}>
          <Input label="Full Name" id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="Alex Morgan" />
          <Input label="Email address" id="email" name="email" type="email" required value={formData.email} onChange={handleChange} />
          <div className="relative">
            <Input label="Password" id="password" name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handleChange} placeholder="Min. 8 characters" />
            <button type="button" className="absolute right-3 top-8 text-white/40 hover:text-white" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <Input label="Confirm Password" id="confirmPassword" name="confirmPassword" type={showPassword ? 'text' : 'password'} required value={formData.confirmPassword} onChange={handleChange} />
          <Button type="submit" className="w-full" size="lg" isLoading={loading}>Sign up</Button>
        </motion.form>

        <motion.p variants={fadeUp} className="text-center text-sm text-white/45">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-violet-300 hover:text-fuchsia-300">Sign in</Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
