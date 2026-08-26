import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useFinance } from '../../context/FinanceContext';
import { categories } from '../../data/mockData';

import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';

export default function AddTransaction() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEditing = !!id;
  const defaultType = searchParams.get('type') || 'expense';
  
  const { transactions, addTransaction, updateTransaction } = useFinance();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: defaultType,
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      const transactionToEdit = transactions.find(t => t.id === id || t._id === id);
      if (transactionToEdit) {
        setFormData({
          ...transactionToEdit,
          date: String(transactionToEdit.date).split('T')[0]
        });
      } else if (transactions.length > 0) {
        navigate('/transactions');
      }
    }
  }, [id, isEditing, transactions, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const dataToSave = {
      ...formData,
      amount: Number(formData.amount),
      date: new Date(formData.date).toISOString()
    };

    try {
      if (isEditing) {
        await updateTransaction(id, dataToSave);
      } else {
        await addTransaction(dataToSave);
      }
      navigate('/transactions');
    } catch { /* toast handled in context */ }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Transaction' : 'Add Transaction'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={[
                  { label: 'Expense', value: 'expense' },
                  { label: 'Income', value: 'income' }
                ]}
              />

              <Input
                label="Amount (₹)"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={handleChange}
                error={errors.amount}
                placeholder="0.00"
              />

              <Input
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
                placeholder="e.g. Grocery shopping"
                className="md:col-span-2"
              />

              <Select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                error={errors.category}
                options={categories.map(c => ({ label: c, value: c }))}
              />

              <Input
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                error={errors.date}
              />

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 1 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="flex w-full rounded-md border border-slate-300 1 bg-white 1 px-3 py-2 text-sm placeholder:text-slate-400 1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Any additional details..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-zinc-700">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => navigate('/transactions')}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Save Changes' : 'Save Transaction'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
