import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';

import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c', '#d0ed57'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-800 p-3 border border-slate-200 dark:border-zinc-700 rounded-lg shadow-premium">
        <p className="font-medium text-slate-900 dark:text-white mb-2">{label}</p>
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

export default function Analytics() {
  const { transactions } = useFinance();

  const { 
    monthlyData, 
    categoryData, 
    summary, 
    dailyTrend 
  } = useMemo(() => {
    let tIncome = 0;
    let tExpense = 0;
    let highestExpense = 0;
    
    const categories = {};
    const months = {};
    const days = {};

    transactions.forEach(t => {
      const amount = Number(t.amount);
      const date = new Date(t.date);
      
      // Calculate Summary
      if (t.type === 'income') {
        tIncome += amount;
      } else {
        tExpense += amount;
        if (amount > highestExpense) highestExpense = amount;
        
        // Category distribution
        if (!categories[t.category]) categories[t.category] = 0;
        categories[t.category] += amount;
      }
      
      // Monthly Income vs Expense
      const monthKey = date.toLocaleString('default', { month: 'short' });
      if (!months[monthKey]) months[monthKey] = { name: monthKey, Income: 0, Expense: 0 };
      
      if (t.type === 'income') months[monthKey].Income += amount;
      else months[monthKey].Expense += amount;
      
      // Daily Trend (last 30 days simplified)
      const dayKey = date.toISOString().split('T')[0];
      if (!days[dayKey]) days[dayKey] = { date: dayKey, amount: 0 };
      if (t.type === 'expense') days[dayKey].amount += amount;
    });

    // Formatting for charts
    const catData = Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
      
    const monthOrder = { Jan:1, Feb:2, Mar:3, Apr:4, May:5, Jun:6, Jul:7, Aug:8, Sep:9, Oct:10, Nov:11, Dec:12 };
    const monData = Object.values(months).sort((a, b) => monthOrder[a.name] - monthOrder[b.name]);
    
    const trendData = Object.values(days).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Summary calculations
    const mostExpCat = catData.length > 0 ? catData[0].name : 'N/A';
    const numMonths = monData.length || 1;
    const avgMonthly = tExpense / numMonths;

    return {
      monthlyData: monData,
      categoryData: catData,
      dailyTrend: trendData,
      summary: {
        totalIncome: tIncome,
        totalExpense: tExpense,
        highestExpense,
        avgMonthly,
        mostExpCat
      }
    };
  }, [transactions]);

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Analytics</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
          Detailed insights into your spending habits.
        </p>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Total Income</p>
            <p className="mt-1 text-xl font-bold text-emerald-600 1">{formatCurrency(summary.totalIncome)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Total Expenses</p>
            <p className="mt-1 text-xl font-bold text-red-600 1">{formatCurrency(summary.totalExpense)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Avg Monthly Expense</p>
            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(summary.avgMonthly)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Highest Expense</p>
            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(summary.highestExpense)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Top Category</p>
            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white truncate">{summary.mostExpCat}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Income vs Expense */}
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expense</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'currentColor' }} className="text-slate-500 dark:text-zinc-400" />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} tick={{ fill: 'currentColor' }} className="text-slate-500 dark:text-zinc-400" />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} />
                  <Legend />
                  <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500 dark:text-zinc-400">No data available</div>
            )}
          </CardContent>
        </Card>

        {/* Category Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Category Analysis</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500 dark:text-zinc-400">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Spending Trend (Line Chart) */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Trend (Expenses)</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {dailyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    return `${d.getDate()} ${d.toLocaleString('default', {month:'short'})}`;
                  }} 
                />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} tick={{ fill: 'currentColor' }} className="text-slate-500 dark:text-zinc-400" />
                <Tooltip 
                  content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}
                />
                <Line type="monotone" dataKey="amount" name="Expense" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500 dark:text-zinc-400">No data available</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
