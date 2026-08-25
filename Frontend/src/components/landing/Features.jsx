import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import {
  MdOutlineAccountBalanceWallet,
  MdOutlineGroups,
  MdOutlineInsights,
  MdOutlineSavings,
  MdOutlineNotificationsActive,
  MdOutlineSecurity,
} from 'react-icons/md';
import DragChip from './DragChip';

const features = [
  { icon: MdOutlineAccountBalanceWallet, title: 'Live balance radar', body: 'Income and expenses update instantly with cyan gains and fuchsia spends.' },
  { icon: MdOutlineGroups, title: 'Frictionless splits', body: 'Settle trips and roommate bills without spreadsheet chaos.' },
  { icon: MdOutlineInsights, title: 'Animated insights', body: 'Charts that draw as you scroll — trends you can feel.' },
  { icon: MdOutlineSavings, title: 'Budget guardrails', body: 'Amber warnings before you overspend, calm when you are on track.' },
  { icon: MdOutlineNotificationsActive, title: 'Calm alerts', body: 'Only the signals that matter — spikes, due dates, settlements.' },
  { icon: MdOutlineSecurity, title: 'Private by design', body: 'Your ledger stays yours with session-aware access.' },
];

function FeatureCard({ feature, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const Icon = feature.icon;

  const spring = useSpring({
    opacity: inView ? 1 : 0,
    y: inView ? 0 : 40,
    scale: inView ? 1 : 0.97,
    delay: index * 60,
    config: { tension: 210, friction: 20 },
  });

  return (
    <animated.article
      ref={ref}
      style={spring}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md transition hover:border-violet-400/30 hover:shadow-premium-hover"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-violet-500/20 blur-2xl transition group-hover:bg-fuchsia-500/25" />
      <div className="relative mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/30 to-violet-600/20 text-fuchsia-200 ring-1 ring-white/10">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="relative font-display text-lg font-semibold text-white">{feature.title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-white/50">{feature.body}</p>
    </animated.article>
  );
}

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300/80">Capabilities</p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Built for clarity, <span className="aurora-text">not clutter</span>
          </h2>
          <p className="mt-3 text-base text-white/50 sm:text-lg">
            Six surfaces that turn raw transactions into confident decisions.
          </p>
          <div className="mt-6 flex justify-center">
            <DragChip className="rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-xs font-semibold text-violet-200 shadow-[0_0_20px_-6px_rgba(139,92,246,0.6)]">
              Drag me — spring physics
            </DragChip>
          </div>
        </motion.div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
