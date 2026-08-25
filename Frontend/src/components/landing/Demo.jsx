import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiTrendingUp, FiArrowUpRight } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

const spark = [{ v: 12 }, { v: 18 }, { v: 14 }, { v: 22 }, { v: 28 }, { v: 24 }, { v: 32 }, { v: 38 }];
const donut = [
  { name: 'Food', value: 32 },
  { name: 'Rent', value: 28 },
  { name: 'Travel', value: 18 },
  { name: 'Other', value: 22 },
];
const DONUT_COLORS = ['#e879f9', '#8b5cf6', '#22d3ee', '#a78bfa'];

export default function Demo() {
  const root = useRef(null);
  const panel = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top 70%',
          end: 'bottom 40%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.from(panel.current, {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      }).from(
        '.demo-stat',
        { y: 24, opacity: 0, stagger: 0.12, duration: 0.55, ease: 'power2.out' },
        '-=0.4'
      );
    },
    { scope: root }
  );

  return (
    <section id="demo" ref={root} className="relative overflow-hidden py-24 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[100px]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 max-w-xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">Product</p>
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Your dashboard, <span className="aurora-text">already in motion</span>
          </h2>
          <p className="mt-3 text-white/50">
            Scroll to watch a live preview assemble — balances, trends, and category mix.
          </p>
        </motion.div>

        <div ref={panel} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0e0a1a]/80 shadow-premium backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-white/8 px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-fuchsia-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-violet-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400/80" />
            <span className="ml-3 text-xs font-medium text-white/35">expenseflow.app / dashboard</span>
          </div>

          <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-12">
            <div className="demo-stat space-y-4 lg:col-span-4">
              <div className="rounded-2xl bg-gradient-to-br from-violet-600/40 via-fuchsia-600/20 to-transparent p-5 ring-1 ring-white/10">
                <p className="text-xs uppercase tracking-wider text-white/50">Available balance</p>
                <p className="mt-2 font-display text-3xl font-bold text-white">₹48,420</p>
                <p className="mt-2 inline-flex items-center gap-1 text-sm text-cyan-300">
                  <FiTrendingUp /> +12.4% this month
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-white/45">Income</p>
                  <p className="mt-1 font-display text-lg font-semibold text-income">₹55,000</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-white/45">Expenses</p>
                  <p className="mt-1 font-display text-lg font-semibold text-expense">₹6,580</p>
                </div>
              </div>
            </div>

            <div className="demo-stat h-52 rounded-2xl border border-white/10 bg-white/[0.03] p-4 lg:col-span-5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-white/80">Cashflow</p>
                <FiArrowUpRight className="text-fuchsia-300" />
              </div>
              <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={spark}>
                  <defs>
                    <linearGradient id="demoFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e879f9" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="#e879f9" strokeWidth={2.5} fill="url(#demoFill)" isAnimationActive animationDuration={1600} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="demo-stat flex h-52 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-4 lg:col-span-3">
              <p className="mb-1 text-sm font-medium text-white/80">Spend mix</p>
              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={donut} dataKey="value" innerRadius={38} outerRadius={55} paddingAngle={3} isAnimationActive animationDuration={1400} animationBegin={400}>
                      {donut.map((_, i) => (
                        <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
