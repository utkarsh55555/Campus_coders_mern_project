import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, TrendingUp, TrendingDown, Users, Plus, ArrowRight, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import {
  MdOutlineRestaurant, MdOutlineDirectionsCar, MdOutlineMovie, MdOutlineShoppingBag,
  MdOutlineHealthAndSafety, MdOutlineSchool, MdOutlineReceiptLong, MdOutlineWorkOutline,
} from 'react-icons/md';

import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { calculateBalances } from '../../utils/calculations';
import { cn } from '../../utils/cn';
import { StatCard } from '../../components/common/StatCard';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const CATEGORY_ICONS = {
  Food: MdOutlineRestaurant, Travel: MdOutlineDirectionsCar, Entertainment: MdOutlineMovie,
  Shopping: MdOutlineShoppingBag, Health: MdOutlineHealthAndSafety, Education: MdOutlineSchool,
  Bills: MdOutlineReceiptLong, Salary: MdOutlineWorkOutline, Freelance: MdOutlineWorkOutline,
};

const PIE_COLORS = ['#e879f9', '#8b5cf6', '#22d3ee', '#a78bfa', '#c084fc', '#67e8f9'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { transactions, groupExpenses, settlements, users } = useFinance();

  const { totalIncome, totalExpenses, balance, sparkData, categoryData } = useMemo(() => {
    let income = 0;
    let expense = 0;
    const categories = {};
    const byDay = {};

    transactions.forEach((t) => {
      const amount = Number(t.amount);
      if (t.type === 'income') income += amount;
      else {
        expense += amount;
        categories[t.category] = (categories[t.category] || 0) + amount;
      }
      const day = t.date?.slice(0, 10);
      if (day) {
        if (!byDay[day]) byDay[day] = { date: day, income: 0, expense: 0 };
        if (t.type === 'income') byDay[day].income += amount;
        else byDay[day].expense += amount;
      }
    });

    return {
      totalIncome: income,
      totalExpenses: expense,
      balance: income - expense,
      sparkData: Object.values(byDay).sort((a, b) => a.date.localeCompare(b.date)).slice(-10),
      categoryData: Object.entries(categories).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5),
    };
  }, [transactions]);

  const moneyOwedToYou = useMemo(() => {
    if (!currentUser) return 0;
    const allBalances = calculateBalances(groupExpenses, settlements, users.map((u) => u.id));
    return allBalances[currentUser.id] > 0 ? allBalances[currentUser.id] : 0;
  }, [groupExpenses, settlements, currentUser, users]);

  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mx-auto max-w-6xl space-y-10 pb-8">
      <motion.div variants={itemVariants} className="flex flex-col justify-between gap-4 pt-2 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">
            {getGreeting()}, {currentUser?.name.split(' ')[0]}
          </h1>
          <p className="mt-1 text-white/50">
            You&apos;re currently {balance >= 0 ? 'up' : 'down'} by{' '}
            <span className="font-semibold text-white">{formatCurrency(Math.abs(balance))}</span> this period.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/transactions/add?type=expense">
            <Button variant="secondary" className="gap-2"><Plus size={16} /> Expense</Button>
          </Link>
          <Link to="/transactions/add?type=income">
            <Button className="gap-2"><Plus size={16} /> Income</Button>
          </Link>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={formatCurrency(balance)}
          icon={Wallet}
          trend={balance >= 0 ? 'up' : 'down'}
          className="border-transparent bg-gradient-to-br from-violet-600/40 via-fuchsia-600/25 to-cyan-500/10"
          iconClassName="bg-white/10 text-white ring-white/20"
          titleClassName="text-white/60"
          valueClassName="text-white"
        />
        <StatCard title="Total Income" value={formatCurrency(totalIncome)} icon={TrendingUp} trend="up" />
        <StatCard title="Total Expenses" value={formatCurrency(totalExpenses)} icon={TrendingDown} trend="down" />
        <StatCard title="Owed To You" value={formatCurrency(moneyOwedToYou)} icon={Users} trend={moneyOwedToYou > 0 ? 'up' : null} />
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3" whileHover={false}>
          <CardContent className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white/80">Cashflow pulse</h3>
              <Link to="/analytics" className="text-xs font-medium text-violet-300 hover:text-fuchsia-300">Full analytics</Link>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData}>
                  <defs>
                    <linearGradient id="dashIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip formatter={(v, n) => [formatCurrency(v), n]} contentStyle={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: '#0e0a1a', fontSize: 12 }} />
                  <Area type="monotone" dataKey="income" name="Income" stroke="#22d3ee" fill="url(#dashIncome)" strokeWidth={2} isAnimationActive animationDuration={900} />
                  <Area type="monotone" dataKey="expense" name="Expense" stroke="#e879f9" fill="transparent" strokeWidth={2} isAnimationActive animationDuration={900} animationBegin={100} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2" whileHover={false}>
          <CardContent className="p-5">
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-white/80">Spend mix</h3>
            <div className="h-48">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" innerRadius={48} outerRadius={70} paddingAngle={3} isAnimationActive animationDuration={1200}>
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: '#0e0a1a' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-white/40">No expenses yet</div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="mb-4 flex items-center justify-between px-1">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white/80">Recent Activity</h3>
          <Link to="/transactions" className="flex items-center gap-1 text-sm text-violet-300 hover:text-fuchsia-300">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <Card className="overflow-hidden" whileHover={false}>
          <CardContent className="p-0">
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }} className="divide-y divide-white/5">
              {recentTransactions.map((transaction) => {
                const CatIcon = CATEGORY_ICONS[transaction.category] || CreditCard;
                return (
                  <motion.div
                    key={transaction.id}
                    variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0 } }}
                    className="flex items-center justify-between p-4 transition-colors hover:bg-white/[0.03] sm:px-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1',
                        transaction.type === 'income'
                          ? 'bg-cyan-500/15 text-income ring-cyan-400/20'
                          : 'bg-fuchsia-500/15 text-expense ring-fuchsia-400/20'
                      )}>
                        {transaction.type === 'income' ? <TrendingUp size={16} /> : <CatIcon size={16} />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{transaction.description}</p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className="text-xs text-white/40">{transaction.category}</span>
                          <span className="h-1 w-1 rounded-full bg-white/20" />
                          <span className="text-xs text-white/40">{formatDate(transaction.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className={cn('whitespace-nowrap text-sm font-semibold', transaction.type === 'income' ? 'text-income' : 'text-expense')}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                  </motion.div>
                );
              })}
              {recentTransactions.length === 0 && (
                <div className="p-8 text-center text-sm text-white/40">No recent transactions. Add one to begin.</div>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
