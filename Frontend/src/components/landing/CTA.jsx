import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useUiStore } from '../../store/uiStore';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { LottieIcon } from '../common/LottieIcon';

const fieldVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 + i * 0.08, type: 'spring', stiffness: 280, damping: 24 },
  }),
};

export default function CTA() {
  const { landingCtaMode, setLandingCtaMode } = useUiStore();
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState({ name: '', email: 'demo@example.com', password: 'password123' });
  const isRegister = landingCtaMode === 'register';

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await register({ name: form.name || 'New User', email: form.email, password: form.password });
      } else {
        await login(form.email, form.password);
      }
      setShowSuccess(true);
      setTimeout(() => navigate('/dashboard'), 900);
    } catch { /* toast */ }
  };

  return (
    <section id="cta" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-64 -translate-y-1/2 bg-gradient-to-r from-fuchsia-600/15 via-violet-600/20 to-cyan-400/10 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0e0a1a]/70 shadow-premium backdrop-blur-xl">
          <div className="grid lg:grid-cols-2">
            <div className="relative p-8 sm:p-12 lg:p-14">
              <div className="pointer-events-none absolute inset-0 mesh-surface opacity-60" />
              <div className="relative">
                <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Start flowing in <span className="aurora-text">under a minute</span>
                </h2>
                <p className="mt-4 max-w-md text-white/50">
                  Create an account or jump into the demo ledger. Same polished experience either way.
                </p>
                <div className="mt-8 flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5">
                  <button
                    type="button"
                    onClick={() => setLandingCtaMode('register')}
                    className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition ${isRegister ? 'btn-aurora text-white' : 'text-white/55 hover:text-white'}`}
                  >
                    Register
                  </button>
                  <button
                    type="button"
                    onClick={() => setLandingCtaMode('login')}
                    className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition ${!isRegister ? 'btn-aurora text-white' : 'text-white/55 hover:text-white'}`}
                  >
                    Sign in
                  </button>
                </div>
                <p className="mt-6 text-sm text-white/40">
                  Prefer a dedicated page?{' '}
                  <Link to={isRegister ? '/register' : '/login'} className="text-violet-300 underline-offset-2 hover:underline">
                    Continue there
                  </Link>
                </p>
              </div>
            </div>

            <div className="border-t border-white/10 bg-white/[0.02] p-8 sm:p-12 lg:border-l lg:border-t-0">
              {showSuccess ? (
                <div className="flex h-full flex-col items-center justify-center py-8">
                  <LottieIcon type="success" loop={false} className="h-28 w-28" />
                  <p className="mt-4 font-display text-lg font-semibold text-white">You&apos;re in — redirecting…</p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  {isRegister && (
                    <motion.div custom={0} variants={fieldVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                      <Input label="Full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Alex Morgan" required />
                    </motion.div>
                  )}
                  <motion.div custom={1} variants={fieldVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
                  </motion.div>
                  <motion.div custom={2} variants={fieldVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <Input label="Password" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />
                  </motion.div>
                  <motion.div custom={3} variants={fieldVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <Button type="submit" size="lg" className="w-full" isLoading={loading}>
                      {isRegister ? 'Create account' : 'Sign in to ExpenseFlow'}
                    </Button>
                  </motion.div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
