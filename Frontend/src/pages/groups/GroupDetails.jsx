import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, Users as UsersIcon, Receipt, ArrowLeft, CheckCircle2 } from 'lucide-react';

import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { calculateBalances, calculateSettlements } from '../../utils/calculations';
import { formatCurrency, formatDate } from '../../utils/formatters';

import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export default function GroupDetails() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { groups, users, groupExpenses, settlements, addSettlement } = useFinance();
  const { currentUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState('expenses');
  const [settlementToConfirm, setSettlementToConfirm] = useState(null);

  const group = groups.find(g => g.id === groupId);
  
  // If group not found, return or redirect
  if (!group) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Group not found</h2>
        <Button className="mt-4" onClick={() => navigate('/groups')}>Back to Groups</Button>
      </div>
    );
  }

  // Derived data
  const groupMembers = users.filter(u => group.members.includes(u.id));
  const expenses = groupExpenses.filter(e => e.groupId === groupId).sort((a, b) => new Date(b.date) - new Date(a.date));
  const groupSettlements = settlements.filter(s => s.groupId === groupId).sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  
  // Balances logic
  const balances = useMemo(() => calculateBalances(expenses, groupSettlements, group.members), [expenses, groupSettlements, group.members]);
  const simplifiedSettlements = useMemo(() => calculateSettlements(balances), [balances]);

  const userBalance = currentUser ? balances[currentUser.id] || 0 : 0;
  
  // Handlers
  const handleSettle = () => {
    if (settlementToConfirm) {
      addSettlement({
        groupId,
        paidBy: settlementToConfirm.from,
        paidTo: settlementToConfirm.to,
        amount: settlementToConfirm.amount
      });
      setSettlementToConfirm(null);
    }
  };

  const getUser = (id) => users.find(u => u.id === id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link to="/groups" className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-500 hover:text-primary-700 dark:hover:text-primary-400 mb-4">
          <ArrowLeft size={16} className="mr-1" /> Back to Groups
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{group.name}</h2>
            {group.description && <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">{group.description}</p>}
          </div>
          <Link to={`/groups/${groupId}/add-expense`}>
            <Button className="gap-2 w-full sm:w-auto">
              <Plus size={16} /> Add Expense
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Total Group Expenses</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{formatCurrency(totalExpenses)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Your Balance</p>
            <p className={`mt-2 text-2xl font-semibold ${
              userBalance > 0 ? 'text-emerald-600 dark:text-emerald-400' : 
              userBalance < 0 ? 'text-red-600 dark:text-red-400' : 
              'text-slate-900 dark:text-white'
            }`}>
              {userBalance > 0 ? `+${formatCurrency(userBalance)}` : 
               userBalance < 0 ? `-${formatCurrency(Math.abs(userBalance))}` : 
               '₹0'}
            </p>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              {userBalance > 0 ? 'You are owed' : userBalance < 0 ? 'You owe' : 'Settled up'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Members</p>
            <div className="mt-3 flex -space-x-2 overflow-hidden">
              {groupMembers.map(member => (
                <Avatar 
                  key={member.id} 
                  src={member.avatar} 
                  name={member.name} 
                  className="inline-block border-2 border-white" 
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-zinc-700">
        <nav className="-mb-px flex space-x-8">
          {['expenses', 'balances', 'settlements'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize
                ${activeTab === tab 
                  ? 'border-indigo-500 text-indigo-600 1' 
                  : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-700 1 hover:border-slate-300 1'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white 1 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-700 overflow-hidden min-h-[400px]">
        {/* EXPENSES TAB */}
        {activeTab === 'expenses' && (
          <div>
            {expenses.length > 0 ? (
              <ul className="divide-y divide-slate-200 1">
                {expenses.map((expense) => {
                  const paidByUser = getUser(expense.paidBy);
                  // Did current user participate in this expense?
                  const userShare = expense.splits[currentUser?.id] || 0;
                  const userPaid = expense.paidBy === currentUser?.id ? expense.amount : 0;
                  const netForUser = userPaid - userShare;
                  
                  return (
                    <li key={expense.id} className="p-4 sm:px-6 hover:bg-slate-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 dark:bg-primary-900/40 text-indigo-600 1">
                            <Receipt size={20} />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{expense.description}</p>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                              {paidByUser?.name} paid {formatCurrency(expense.amount)} • {formatDate(expense.date)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500 dark:text-zinc-400 mb-1">Your share</p>
                          <p className={`text-sm font-medium ${
                            netForUser > 0 ? 'text-emerald-600 1' : 
                            netForUser < 0 ? 'text-red-600 1' : 
                            'text-slate-900 dark:text-white'
                          }`}>
                            {netForUser > 0 ? `+${formatCurrency(netForUser)}` : 
                             netForUser < 0 ? `-${formatCurrency(Math.abs(netForUser))}` : 
                             'Not involved'}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <EmptyState
                icon={Receipt}
                title="No expenses yet"
                description="Add an expense to start splitting costs."
                action={
                  <Link to={`/groups/${groupId}/add-expense`}>
                    <Button>Add Expense</Button>
                  </Link>
                }
              />
            )}
          </div>
        )}

        {/* BALANCES TAB */}
        {activeTab === 'balances' && (
          <div className="p-4 sm:p-6">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">How to settle up</h3>
            
            {simplifiedSettlements.length > 0 ? (
              <ul className="space-y-4">
                {simplifiedSettlements.map((settlement, idx) => {
                  const fromUser = getUser(settlement.from);
                  const toUser = getUser(settlement.to);
                  const isUserInvolved = currentUser?.id === fromUser?.id || currentUser?.id === toUser?.id;
                  
                  return (
                    <li key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 rounded-lg border border-slate-200 dark:border-zinc-700">
                      <div className="flex items-center gap-3">
                        <Avatar src={fromUser?.avatar} name={fromUser?.name} size="sm" />
                        <span className="text-sm text-slate-500 dark:text-zinc-400">owes</span>
                        <Avatar src={toUser?.avatar} name={toUser?.name} size="sm" />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {fromUser?.name} owes {toUser?.name} <span className="font-bold">{formatCurrency(settlement.amount)}</span>
                        </span>
                      </div>
                      
                      {isUserInvolved && (
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => setSettlementToConfirm(settlement)}
                        >
                          Settle up
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <EmptyState
                icon={CheckCircle2}
                title="You're all settled up!"
                description="No one owes anything in this group right now."
              />
            )}
            
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-4">Individual Balances</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupMembers.map(member => {
                const bal = balances[member.id] || 0;
                return (
                  <div key={member.id} className="flex items-center p-3 border rounded-lg">
                    <Avatar src={member.avatar} name={member.name} />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{member.name}</p>
                      <p className={`text-xs font-medium ${
                        bal > 0 ? 'text-emerald-600 1' : 
                        bal < 0 ? 'text-red-600 1' : 
                        'text-slate-500 dark:text-zinc-400'
                      }`}>
                        {bal > 0 ? `Gets back ${formatCurrency(bal)}` : 
                         bal < 0 ? `Owes ${formatCurrency(Math.abs(bal))}` : 
                         'Settled up'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* SETTLEMENTS TAB */}
        {activeTab === 'settlements' && (
          <div>
            {groupSettlements.length > 0 ? (
              <ul className="divide-y divide-slate-200 1">
                {groupSettlements.map((settlement) => {
                  const paidByUser = getUser(settlement.paidBy);
                  const paidToUser = getUser(settlement.paidTo);
                  
                  return (
                    <li key={settlement.id} className="p-4 sm:px-6">
                      <div className="flex items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 1">
                          <CheckCircle2 size={20} />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {paidByUser?.name} paid {paidToUser?.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-zinc-400">
                            {formatCurrency(settlement.amount)} • {formatDate(settlement.date)}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <EmptyState
                icon={CheckCircle2}
                title="No settlements yet"
                description="When members pay each other back, it will show up here."
              />
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!settlementToConfirm}
        onClose={() => setSettlementToConfirm(null)}
        onConfirm={handleSettle}
        title="Record Settlement"
        message={settlementToConfirm ? `Record a payment of ${formatCurrency(settlementToConfirm.amount)} from ${getUser(settlementToConfirm.from)?.name} to ${getUser(settlementToConfirm.to)?.name}?` : ''}
        confirmText="Mark as Settled"
      />
    </div>
  );
}
