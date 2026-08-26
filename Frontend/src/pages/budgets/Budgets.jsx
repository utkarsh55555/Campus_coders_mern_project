import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, WalletCards } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { categories } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';

import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export default function Budgets() {
  const { budgets, transactions, addBudget, updateBudget, deleteBudget } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: new Date().toISOString().slice(0, 7) // YYYY-MM
  });

  // Calculate spent amounts for current month (or budget month)
  const budgetsWithProgress = useMemo(() => {
    return budgets.map(budget => {
      const spentFromTx = transactions
        .filter(t => 
          t.type === 'expense' && 
          t.category === budget.category &&
          String(t.date).startsWith(budget.month)
        )
        .reduce((sum, t) => sum + Number(t.amount), 0);
      const spent = Number(budget.spent ?? spentFromTx);
      const limit = Number(budget.amount || budget.limit || 0);
      const remaining = limit - spent;
      const percentage = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
      
      let status = 'normal';
      if (percentage >= 100) status = 'over';
      else if (percentage >= 80) status = 'near';

      return {
        ...budget,
        amount: limit,
        spent,
        remaining,
        percentage,
        status
      };
    });
  }, [budgets, transactions]);

  const handleOpenModal = (budget = null) => {
    if (budget) {
      setEditingBudget(budget);
      setFormData({
        category: budget.category,
        amount: budget.amount,
        month: budget.month
      });
    } else {
      setEditingBudget(null);
      setFormData({
        category: categories[0] || '',
        amount: '',
        month: new Date().toISOString().slice(0, 7)
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.amount) return;

    const budgetData = {
      category: formData.category,
      amount: Number(formData.amount),
      month: formData.month
    };

    try {
      if (editingBudget) {
        await updateBudget(editingBudget.id, budgetData);
      } else {
        await addBudget(budgetData);
      }
      setIsModalOpen(false);
    } catch { /* toast handled in context */ }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteBudget(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Budgets</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            Set monthly limits for your expense categories.
          </p>
        </div>
        <div>
          <Button onClick={() => handleOpenModal()} className="gap-2">
            <Plus size={16} /> Add Budget
          </Button>
        </div>
      </div>

      {budgetsWithProgress.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgetsWithProgress.map(budget => {
            const isOver = budget.status === 'over';
            const isNear = budget.status === 'near';
            
            // Format month
            const [year, month] = budget.month.split('-');
            const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });

            return (
              <Card key={budget.id} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${
                  isOver ? 'bg-fuchsia-500' : isNear ? 'bg-violet-400' : 'bg-cyan-400'
                }`} />
                <CardHeader className="pb-3 border-b-0 flex flex-row items-center justify-between pl-6">
                  <div>
                    <CardTitle className="text-lg">{budget.category}</CardTitle>
                    <p className="text-sm text-slate-500 dark:text-zinc-400">{monthName} {year}</p>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => handleOpenModal(budget)}
                      className="p-2 text-slate-400 1 hover:text-indigo-600 1 rounded-md hover:bg-slate-100"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => setDeleteId(budget.id)}
                      className="p-2 text-slate-400 1 hover:text-fuchsia-300 rounded-md hover:bg-fuchsia-500/10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="pl-6 pt-0">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(budget.spent)}</p>
                      <p className="text-sm text-slate-500 dark:text-zinc-400">spent of {formatCurrency(budget.amount)}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        isOver ? 'text-fuchsia-300' : isNear ? 'text-violet-300' : 'text-cyan-300'
                      }`}>
                        {isOver ? (
                          `${formatCurrency(Math.abs(budget.remaining))} over limit`
                        ) : (
                          `${formatCurrency(budget.remaining)} left`
                        )}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">{budget.percentage}% used</p>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="h-2 w-full bg-slate-100 1 rounded-full overflow-hidden mt-3">
                    <div 
                      className={`h-full rounded-full ${
                        isOver ? 'bg-fuchsia-500' : isNear ? 'bg-violet-400' : 'bg-cyan-400'
                      }`} 
                      style={{ width: `${Math.min(100, budget.percentage)}%` }} 
                    />
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
              icon={WalletCards}
              title="No budgets set"
              description="Create a budget to track your spending limits across categories."
              action={
                <Button onClick={() => handleOpenModal()}>Create your first budget</Button>
              }
            />
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingBudget ? 'Edit Budget' : 'Add Budget'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Category"
            name="category"
            required
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            options={categories.map(c => ({ label: c, value: c }))}
          />
          
          <Input
            label="Budget Amount (₹)"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            required
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            placeholder="0.00"
          />
          
          <Input
            label="Month"
            name="month"
            type="month"
            required
            value={formData.month}
            onChange={(e) => setFormData({...formData, month: e.target.value})}
          />
          
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingBudget ? 'Save Changes' : 'Create Budget'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Budget"
        message="Are you sure you want to delete this budget? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}
