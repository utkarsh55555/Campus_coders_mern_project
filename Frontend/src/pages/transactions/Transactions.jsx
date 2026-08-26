import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Trash2, Edit } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';

export default function Transactions() {
  const { transactions, deleteTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  const [deleteId, setDeleteId] = useState(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category));
    return Array.from(cats).sort();
  }, [transactions]);

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    // Search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.description.toLowerCase().includes(lowerSearch) ||
        t.category.toLowerCase().includes(lowerSearch)
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter(t => t.type === typeFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(t => t.category === categoryFilter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'highest':
          return Number(b.amount) - Number(a.amount);
        case 'lowest':
          return Number(a.amount) - Number(b.amount);
        default:
          return 0;
      }
    });

    return result;
  }, [transactions, searchTerm, typeFilter, categoryFilter, sortBy]);

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteTransaction(deleteId);
      } catch { /* toast handled in context */ }
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Transactions</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            Showing {filteredAndSortedTransactions.length} transaction{filteredAndSortedTransactions.length !== 1 && 's'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/transactions/add?type=expense">
            <Button variant="danger" className="gap-2">
              <Plus size={16} /> Add Expense
            </Button>
          </Link>
          <Link to="/transactions/add?type=income">
            <Button variant="success" className="gap-2">
              <Plus size={16} /> Add Income
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-700 flex flex-col lg:flex-row gap-4 items-end">
        <div className="flex-1 w-full relative">
          <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
            </div>
            <input
              type="text"
              className="pl-10 flex h-10 w-full rounded-md border border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
              placeholder="Search description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="w-full lg:w-48">
          <Select
            label="Type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={[
              { label: 'All Types', value: 'all' },
              { label: 'Income', value: 'income' },
              { label: 'Expense', value: 'expense' }
            ]}
          />
        </div>

        <div className="w-full lg:w-48">
          <Select
            label="Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { label: 'All Categories', value: 'all' },
              ...categories.map(c => ({ label: c, value: c }))
            ]}
          />
        </div>

        <div className="w-full lg:w-48">
          <Select
            label="Sort by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { label: 'Newest First', value: 'newest' },
              { label: 'Oldest First', value: 'oldest' },
              { label: 'Highest Amount', value: 'highest' },
              { label: 'Lowest Amount', value: 'lowest' }
            ]}
          />
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-700 overflow-hidden">
        {filteredAndSortedTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-zinc-700">
              <thead className="bg-slate-50 dark:bg-zinc-800/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-zinc-800 divide-y divide-slate-200 dark:divide-zinc-700">
                {filteredAndSortedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-slate-50 dark:hover:bg-zinc-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-zinc-400">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{transaction.description}</div>
                      {transaction.notes && <div className="text-xs text-slate-500 dark:text-zinc-400">{transaction.notes}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={transaction.type === 'income' ? 'success' : 'default'}>
                        {transaction.category}
                      </Badge>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${
                      transaction.type === 'income' ? 'text-cyan-300' : 'text-fuchsia-300'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link to={`/transactions/edit/${transaction.id}`}>
                          <button className="text-primary-600 dark:text-primary-500 hover:text-primary-900 p-1 rounded hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors">
                            <Edit size={16} />
                          </button>
                        </Link>
                        <button 
                          onClick={() => setDeleteId(transaction.id)}
                          className="rounded p-1 text-fuchsia-300 transition-colors hover:bg-fuchsia-500/10 hover:text-fuchsia-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Filter}
            title="No transactions found"
            description={
              transactions.length === 0 
                ? "You haven't added any transactions yet."
                : "No transactions match your current filters."
            }
            action={
              transactions.length === 0 && (
                <Link to="/transactions/add?type=expense">
                  <Button>Add your first transaction</Button>
                </Link>
              )
            }
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}
