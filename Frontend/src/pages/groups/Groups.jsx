import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users as UsersIcon, ArrowRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { calculateBalances } from '../../utils/calculations';
import { formatCurrency, formatDate } from '../../utils/formatters';

import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';

export default function Groups() {
  const { groups, groupExpenses, settlements } = useFinance();
  const { currentUser } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Groups</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            Split expenses with friends, family, and roommates.
          </p>
        </div>
        <div>
          <Link to="/groups/create">
            <Button className="gap-2">
              <Plus size={16} /> Create Group
            </Button>
          </Link>
        </div>
      </div>

      {groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => {
            // Filter expenses and settlements for this group
            const groupExp = groupExpenses.filter(e => e.groupId === group.id);
            const groupSettlements = settlements.filter(s => s.groupId === group.id);
            
            // Calculate total expenses for the group
            const totalExpenses = groupExp.reduce((sum, exp) => sum + Number(exp.amount), 0);
            
            // Calculate balances
            const balances = calculateBalances(groupExp, groupSettlements, group.members);
            const userBalance = currentUser ? (balances[currentUser.id] || 0) : 0;
            
            // Find last activity
            const activities = [
              ...groupExp.map(e => new Date(e.date)),
              ...groupSettlements.map(s => new Date(s.date)),
              new Date(group.createdAt)
            ].sort((a, b) => b - a);
            const lastActivity = activities.length > 0 ? activities[0] : null;

            return (
              <Card key={group.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3 border-b-0">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{group.name}</CardTitle>
                    <div className="flex items-center text-sm text-slate-500 dark:text-zinc-400 bg-slate-100 1 px-2 py-1 rounded-full">
                      <UsersIcon size={14} className="mr-1" />
                      {group.members.length}
                    </div>
                  </div>
                  {group.description && (
                    <p className="text-sm text-slate-500 dark:text-zinc-400 line-clamp-1">{group.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-zinc-400">Total Expenses</span>
                      <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(totalExpenses)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-zinc-400">Your Balance</span>
                      <span className={`font-medium ${
                        userBalance > 0 ? 'text-cyan-300' : 
                        userBalance < 0 ? 'text-fuchsia-300' : 
                        'text-white'
                      }`}>
                        {userBalance > 0 ? `Gets back ${formatCurrency(userBalance)}` : 
                         userBalance < 0 ? `Owes ${formatCurrency(Math.abs(userBalance))}` : 
                         'Settled up'}
                      </span>
                    </div>
                    {lastActivity && (
                      <div className="text-xs text-slate-400 1 pt-2 border-t border-slate-200 dark:border-zinc-700">
                        Last activity: {formatDate(lastActivity)}
                      </div>
                    )}
                  </div>
                  <div className="mt-6">
                    <Link to={`/groups/${group.id}`}>
                      <Button variant="secondary" className="w-full gap-2">
                        Open Group <ArrowRight size={16} />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent>
            <EmptyState
              icon={UsersIcon}
              title="No groups yet"
              description="Create a group to start splitting expenses with your friends."
              action={
                <Link to="/groups/create">
                  <Button>Create your first group</Button>
                </Link>
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
