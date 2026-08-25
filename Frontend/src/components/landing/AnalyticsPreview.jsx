import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

const lineData = [
  { day: 'Mon', spend: 820 }, { day: 'Tue', spend: 640 }, { day: 'Wed', spend: 1100 },
  { day: 'Thu', spend: 780 }, { day: 'Fri', spend: 1450 }, { day: 'Sat', spend: 980 }, { day: 'Sun', spend: 560 },
];

const categories = [
  { name: 'Food', value: 34 }, { name: 'Travel', value: 22 }, { name: 'Bills', value: 18 },
  { name: 'Shopping', value: 16 }, { name: 'Health', value: 10 },
];

const COLORS = ['#e879f9', '#8b5cf6', '#22d3ee', '#a78bfa', '#c084fc'];

export default function AnalyticsPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <section id="analytics" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-300/80">Analytics</p>
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Charts that <span className="aurora-text">draw themselves</span>
          </h2>
          <p className="mt-3 text-white/50">
            Neon paths animate in as you arrive. Donut segments sweep to reveal where every rupee went.
          </p>
        </div>

        <div ref={ref} className="grid gap-6 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-premium backdrop-blur-md sm:p-6 lg:col-span-3"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-white">Weekly spend</h3>
              <span className="rounded-lg bg-fuchsia-500/15 px-2 py-1 text-xs font-medium text-expense">−₹6,330</span>
            </div>
            <div className="h-64">
              {inView && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: '#0e0a1a', fontSize: 13 }} />
                    <Line type="monotone" dataKey="spend" stroke="#e879f9" strokeWidth={2.5} dot={{ r: 3, fill: '#e879f9' }} activeDot={{ r: 5 }} isAnimationActive animationDuration={1000} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-premium backdrop-blur-md sm:p-6 lg:col-span-2"
          >
            <h3 className="mb-2 font-display text-lg font-semibold text-white">Category mix</h3>
            <div className="h-56">
              {inView && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categories} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={4} isAnimationActive animationDuration={1600} animationBegin={200}>
                      {categories.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: '#0e0a1a' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <ul className="mt-2 space-y-1.5">
              {categories.map((c, i) => (
                <li key={c.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-white/60">
                    <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
                    {c.name}
                  </span>
                  <span className="font-medium text-white">{c.value}%</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
