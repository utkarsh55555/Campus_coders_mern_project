import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { calculateEqualSplit, validateCustomSplit } from '../../utils/calculations';

import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Avatar } from '../../components/common/Avatar';
import toast from 'react-hot-toast';

export default function AddGroupExpense() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { groups, allUsers, addGroupExpense } = useFinance();
  const { currentUser } = useAuth();
  
  const group = groups.find(g => g.id === groupId || g._id === groupId);
  const groupMembers = useMemo(
    () =>
      (group?.members || [])
        .map((id) => allUsers.find((u) => String(u.id) === String(id)))
        .filter(Boolean),
    [allUsers, group]
  );
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paidBy: currentUser?.id || '',
    splitType: 'equal' // 'equal' | 'custom'
  });
  
  // Custom split values { userId: amount }
  const [customSplits, setCustomSplits] = useState({});
  const [errors, setErrors] = useState({});

  if (!group) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    if (name === 'splitType') setErrors(prev => ({ ...prev, splitTotal: null }));
  };

  const handleCustomSplitChange = (userId, value) => {
    setCustomSplits(prev => ({ ...prev, [userId]: value }));
    if (errors.splitTotal) setErrors(prev => ({ ...prev, splitTotal: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.description.trim()) newErrors.description = 'Description required';
    if (!formData.amount || Number(formData.amount) <= 0) newErrors.amount = 'Valid amount required';
    if (!formData.paidBy) newErrors.paidBy = 'Who paid?';
    
    if (formData.splitType === 'custom' && formData.amount) {
      const isValid = validateCustomSplit(Number(formData.amount), customSplits);
      if (!isValid) {
        const sum = Object.values(customSplits).reduce((a, b) => a + Number(b || 0), 0);
        newErrors.splitTotal = `Amounts don't add up! Total is ${sum}, expected ${formData.amount}`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    const amount = Number(formData.amount);
    let finalSplits = {};
    
    if (formData.splitType === 'equal') {
      finalSplits = calculateEqualSplit(amount, group.members);
    } else {
      Object.keys(customSplits).forEach(id => {
        finalSplits[id] = Number(customSplits[id]);
      });
      group.members.forEach(id => {
        if (finalSplits[id] === undefined) finalSplits[id] = 0;
      });
    }
    
    try {
      await addGroupExpense({
        groupId,
        description: formData.description,
        amount,
        date: new Date(formData.date).toISOString(),
        paidBy: formData.paidBy,
        splitType: formData.splitType,
        splits: finalSplits
      });
      navigate(`/groups/${groupId}`);
    } catch { /* toast handled in context */ }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add Group Expense - {group.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
                placeholder="e.g. Dinner at XYZ"
                className="md:col-span-2"
              />
              
              <Input
                label="Total Amount (₹)"
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
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                error={errors.date}
              />
              
              <Select
                label="Paid By"
                name="paidBy"
                value={formData.paidBy}
                onChange={handleChange}
                error={errors.paidBy}
                options={groupMembers.map(m => ({ label: m.name + (m.id === currentUser?.id ? ' (You)' : ''), value: m.id }))}
                className="md:col-span-2"
              />
            </div>
            
            <div className="border-t border-slate-200 dark:border-zinc-700 pt-6 mt-6">
              <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-4">Split Options</h4>
              
              <div className="flex space-x-4 mb-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="splitType"
                    value="equal"
                    checked={formData.splitType === 'equal'}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 1 border-slate-300 1 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-slate-700 1">Split Equally</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="splitType"
                    value="custom"
                    checked={formData.splitType === 'custom'}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 1 border-slate-300 1 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-slate-700 1">Custom Amounts</span>
                </label>
              </div>
              
              {formData.splitType === 'equal' && formData.amount && (
                <div className="bg-indigo-50 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 p-4 rounded-md">
                  <p className="text-sm text-indigo-800">
                    Everyone pays <strong>₹{(Number(formData.amount) / group.members.length).toFixed(2)}</strong>
                  </p>
                </div>
              )}
              
              {formData.splitType === 'custom' && (
                <div className="space-y-3">
                  {groupMembers.map(member => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar src={member.avatar} name={member.name} size="sm" />
                        <span className="ml-2 text-sm font-medium text-slate-700 1">{member.name}</span>
                      </div>
                      <div className="w-32 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-slate-500 dark:text-zinc-400 sm:text-sm">₹</span>
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="pl-7 block w-full rounded-md border-slate-300 1 border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                          placeholder="0.00"
                          value={customSplits[member.id] || ''}
                          onChange={(e) => handleCustomSplitChange(member.id, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  {errors.splitTotal && (
                    <p className="text-sm text-fuchsia-300 mt-2">{errors.splitTotal}</p>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-zinc-700">
              <Button type="button" variant="ghost" onClick={() => navigate(`/groups/${groupId}`)}>
                Cancel
              </Button>
              <Button type="submit">Save Expense</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
