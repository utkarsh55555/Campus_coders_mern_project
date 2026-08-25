import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, TrendingUp, TrendingDown, Users, Plus, ArrowRight, PieChart, Receipt, Target, CreditCard } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { calculateBalances } from '../../utils/calculations';
import { cn } from '../../utils/cn';

import { StatCard } from '../../components/common/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { transactions, groupExpenses, settlements, users } = useFinance();

  // Derived calculations
  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach(t => {
      const amount = Number(t.amount);
      if (t.type === 'income') {
        income += amount;
      } else {
        expense += amount;
      }
    });

    return {
      totalIncome: income,
      totalExpenses: expense,
      balance: income - expense,
    };
  }, [transactions]);

  // Calculate money owed to user
  const moneyOwedToYou = useMemo(() => {
    if (!currentUser) return 0;
    const allBalances = calculateBalances(groupExpenses, settlements, users.map(u => u.id));
    return allBalances[currentUser.id] > 0 ? allBalances[currentUser.id] : 0;
  }, [groupExpenses, settlements, currentUser, users]);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-12 pb-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="pt-6 pb-2 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
            {getGreeting()}, {currentUser?.name.split(' ')[0]}
          </h1>
          <p className="text-slate-600 dark:text-zinc-400">
            You're currently {balance >= 0 ? 'up' : 'down'} by <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(Math.abs(balance))}</span> this period.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/transactions/add?type=expense">
            <Button variant="secondary" className="gap-2">
              <Plus size={16} /> Expense
            </Button>
          </Link>
          <Link to="/transactions/add?type=income">
            <Button className="gap-2">
              <Plus size={16} /> Income
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={formatCurrency(balance)}
          icon={Wallet}
          trend={balance >= 0 ? 'up' : 'down'}
          className="border-transparent bg-primary-600 text-white shadow-sm"
          iconClassName="text-white bg-white/20"
          titleClassName="text-primary-50"
          valueClassName="text-white"
        />
        <StatCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          icon={TrendingUp}
          trend="up"
          className="border-slate-100 dark:border-zinc-800 shadow-none bg-white dark:bg-zinc-900"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={TrendingDown}
          trend="down"
          className="border-slate-100 dark:border-zinc-800 shadow-none bg-white dark:bg-zinc-900"
        />
        <StatCard
          title="Owed To You"
          value={formatCurrency(moneyOwedToYou)}
          icon={Users}
          trend={moneyOwedToYou > 0 ? 'up' : null}
          className="border-slate-100 dark:border-zinc-800 shadow-none bg-white dark:bg-zinc-900"
        />
      </div>



      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">Recent Activity</h3>
          <Link to="/transactions" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        
        <Card className="border-slate-100 dark:border-zinc-800 shadow-none bg-white dark:bg-zinc-900 overflow-hidden">
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-zinc-800/50">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 sm:px-6 hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center shrink-0 border",
                      transaction.type === 'income' 
                        ? 'bg-emerald-50/50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/10 dark:border-emerald-900/30 dark:text-emerald-400' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400'
                    )}>
                      {transaction.type === 'income' ? <TrendingUp size={16} /> : <CreditCard size={16} />}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-white">{transaction.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500 dark:text-zinc-500">{transaction.category}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-600"></span>
                        <span className="text-xs text-slate-500 dark:text-zinc-500">{formatDate(transaction.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className={cn(
                    "font-medium text-sm whitespace-nowrap",
                    transaction.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                  )}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
              {recentTransactions.length === 0 && (
                <div className="p-8 text-center text-sm text-slate-500 dark:text-zinc-400">
                  No recent transactions found. Start by adding one.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
