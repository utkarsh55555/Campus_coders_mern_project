import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';

const COLORS = ['#e879f9', '#8b5cf6', '#22d3ee', '#a78bfa', '#c084fc', '#67e8f9', '#d946ef', '#06b6d4'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#0e0a1a] p-3 shadow-premium">
        <p className="mb-2 font-medium text-white">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, type: 'spring', stiffness: 260, damping: 24 } }),
};

export default function Analytics() {
  const { transactions } = useFinance();

  const { monthlyData, categoryData, summary, dailyTrend } = useMemo(() => {
    let tIncome = 0;
    let tExpense = 0;
    let highestExpense = 0;
    const categories = {};
    const months = {};
    const days = {};

    transactions.forEach((t) => {
      const amount = Number(t.amount);
      const date = new Date(t.date);
      if (t.type === 'income') tIncome += amount;
      else {
        tExpense += amount;
        if (amount > highestExpense) highestExpense = amount;
        if (!categories[t.category]) categories[t.category] = 0;
        categories[t.category] += amount;
      }
      const monthKey = date.toLocaleString('default', { month: 'short' });
      if (!months[monthKey]) months[monthKey] = { name: monthKey, Income: 0, Expense: 0 };
      if (t.type === 'income') months[monthKey].Income += amount;
      else months[monthKey].Expense += amount;
      const dayKey = date.toISOString().split('T')[0];
      if (!days[dayKey]) days[dayKey] = { date: dayKey, amount: 0 };
      if (t.type === 'expense') days[dayKey].amount += amount;
    });

    const catData = Object.entries(categories).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    const monthOrder = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
    const monData = Object.values(months).sort((a, b) => monthOrder[a.name] - monthOrder[b.name]);
    const trendData = Object.values(days).sort((a, b) => new Date(a.date) - new Date(b.date));
    const numMonths = monData.length || 1;

    return {
      monthlyData: monData,
      categoryData: catData,
      dailyTrend: trendData,
      summary: {
        totalIncome: tIncome,
        totalExpense: tExpense,
        highestExpense,
        avgMonthly: tExpense / numMonths,
        mostExpCat: catData.length > 0 ? catData[0].name : 'N/A',
      },
    };
  }, [transactions]);

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-white">Analytics</h2>
        <p className="mt-1 text-sm text-white/45">Detailed insights into your spending habits.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: 'Total Income', value: formatCurrency(summary.totalIncome), className: 'text-income' },
          { label: 'Total Expenses', value: formatCurrency(summary.totalExpense), className: 'text-expense' },
          { label: 'Avg Monthly Expense', value: formatCurrency(summary.avgMonthly), className: 'text-white' },
          { label: 'Highest Expense', value: formatCurrency(summary.highestExpense), className: 'text-white' },
          { label: 'Top Category', value: summary.mostExpCat, className: 'text-warning' },
        ].map((stat, i) => (
          <motion.div key={stat.label} custom={i} variants={fadeUp} initial="hidden" animate="visible">
            <Card whileHover={{ y: -3 }}>
              <CardContent className="p-5">
                <p className="text-sm font-medium text-white/45">{stat.label}</p>
                <p className={`mt-1 truncate font-display text-xl font-bold ${stat.className}`}>{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card whileHover={false}>
          <CardHeader><CardTitle>Income vs Expense</CardTitle></CardHeader>
          <CardContent className="h-80">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)' }} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} tick={{ fill: 'rgba(255,255,255,0.4)' }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139,92,246,0.08)' }} />
                  <Legend />
                  <Bar dataKey="Income" fill="#22d3ee" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={800} />
                  <Bar dataKey="Expense" fill="#e879f9" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={800} animationBegin={80} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-white/40">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card whileHover={false}>
          <CardHeader><CardTitle>Category Analysis</CardTitle></CardHeader>
          <CardContent className="h-80">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={88} paddingAngle={4} dataKey="value" isAnimationActive animationDuration={1400}>
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-white/40">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card whileHover={false}>
        <CardHeader><CardTitle>Spending Trend (Expenses)</CardTitle></CardHeader>
        <CardContent className="h-80">
          {dailyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.4)' }}
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
                  }}
                />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} tick={{ fill: 'rgba(255,255,255,0.4)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="amount" name="Expense" stroke="#e879f9" strokeWidth={3} dot={{ r: 3, fill: '#e879f9' }} activeDot={{ r: 5 }} isAnimationActive animationDuration={1000} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-white/40">No data available</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
