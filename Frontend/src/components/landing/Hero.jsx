import React, { Suspense, useRef, useEffect, useState, lazy } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { useUiStore } from '../../store/uiStore';
import { Button } from '../common/Button';
import { FiMenu, FiX, FiArrowRight } from 'react-icons/fi';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';

const HeroScene = lazy(() => import('./HeroScene'));

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#demo', label: 'Product' },
  { href: '#analytics', label: 'Analytics' },
  { href: '#cta', label: 'Pricing' },
];

const spark = [
  { v: 18 }, { v: 24 }, { v: 20 }, { v: 32 }, { v: 28 }, { v: 40 }, { v: 36 }, { v: 48 },
];

export function LandingNavbar() {
  const { isNavScrolled, setNavScrolled } = useUiStore();
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on('change', (v) => setNavScrolled(v > 24));
  }, [scrollY, setNavScrolled]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isNavScrolled ? 'border-b border-white/10 bg-[#05020d]/80 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
          Expense<span className="aurora-text">Flow</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-white/55 transition hover:text-white">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Get started</Button>
          </Link>
        </div>

        <button type="button" className="rounded-xl p-2 text-white md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </nav>

      {open && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="border-t border-white/10 bg-[#0e0a1a]/95 px-4 py-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/5">
                {l.label}
              </a>
            ))}
            <Link to="/login" onClick={() => setOpen(false)}><Button variant="secondary" className="mt-2 w-full">Sign in</Button></Link>
            <Link to="/register" onClick={() => setOpen(false)}><Button className="w-full">Get started</Button></Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}

export function Hero() {
  const { scrollY } = useScroll();
  const sceneY = useTransform(scrollY, [0, 600], [0, 100]);
  const sceneOpacity = useTransform(scrollY, [0, 400], [0.55, 0.1]);

  const spring = useSpring({
    from: { opacity: 0, y: 36 },
    to: { opacity: 1, y: 0 },
    config: { tension: 170, friction: 22 },
    delay: 80,
  });

  return (
    <section id="top" className="relative overflow-hidden grain pt-24 pb-16 sm:pt-28 sm:pb-24">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[720px] -translate-x-1/2 hero-glow blur-2xl" />
      <div className="pointer-events-none absolute -left-20 top-40 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-[100px]" />
      <div className="pointer-events-none absolute -right-16 top-56 h-72 w-72 rounded-full bg-cyan-400/15 blur-[110px]" />

      <motion.div style={{ y: sceneY, opacity: sceneOpacity }} className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] opacity-60">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </motion.div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <animated.div style={spring}>
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/70 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_8px_#e879f9]" />
            Personal finance, reimagined
          </div>

          <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            <span className="block">Expense<span className="aurora-text">Flow</span></span>
            <span className="mt-3 block text-3xl font-semibold text-white/90 sm:text-4xl lg:text-5xl">
              Cashflow with cinematic clarity
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">
            Track, split, and forecast in a workspace built to feel premium — not like another spreadsheet clone.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link to="/register">
              <Button size="lg" className="gap-2">
                Start free <FiArrowRight />
              </Button>
            </Link>
            <a href="#demo">
              <Button variant="secondary" size="lg">Watch the product</Button>
            </a>
          </div>
        </animated.div>

        {/* Floating product preview */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-14 max-w-4xl"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-fuchsia-500/20 via-violet-500/25 to-cyan-400/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/12 bg-[#0e0a1a]/85 shadow-premium backdrop-blur-xl">
            <div className="flex items-center gap-2 border-b border-white/8 px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-fuchsia-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-violet-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400/80" />
              <span className="ml-3 text-xs text-white/35">expenseflow.app</span>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-12 sm:p-6">
              <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-violet-600/30 to-fuchsia-600/10 p-5 sm:col-span-4">
                <p className="text-xs uppercase tracking-wider text-white/50">Balance</p>
                <p className="mt-2 font-display text-3xl font-bold text-white">₹48,420</p>
                <p className="mt-2 text-sm text-cyan-300">+12.4% this month</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 sm:col-span-5">
                <p className="mb-2 text-sm font-medium text-white/70">Cashflow</p>
                <div className="h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={spark}>
                      <defs>
                        <linearGradient id="heroSpark" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="v" stroke="#e879f9" strokeWidth={2.5} fill="url(#heroSpark)" isAnimationActive animationDuration={1800} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-3 sm:col-span-3">
                <div className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
                  <p className="text-xs text-white/45">Income</p>
                  <p className="font-display text-lg font-semibold text-income">₹55k</p>
                </div>
                <div className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
                  <p className="text-xs text-white/45">Expenses</p>
                  <p className="font-display text-lg font-semibold text-expense">₹6.5k</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
