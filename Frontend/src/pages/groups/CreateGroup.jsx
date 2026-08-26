import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';

import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Avatar } from '../../components/common/Avatar';

export default function CreateGroup() {
  const { addGroup, users } = useFinance();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // Always include current user
  const [selectedMembers, setSelectedMembers] = useState([currentUser?.id].filter(Boolean));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMember = (userId) => {
    // Prevent removing current user
    if (userId === currentUser?.id) return;
    
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    try {
      await addGroup({
        name: formData.name,
        description: formData.description,
        members: selectedMembers,
      });
      navigate('/groups');
    } catch { /* toast handled in context */ }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Group</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Group Name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Goa Trip, Apartment"
              />
              
              <div>
                <label className="block text-sm font-medium text-slate-700 1 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  className="flex w-full rounded-md border border-slate-300 1 bg-white 1 px-3 py-2 text-sm placeholder:text-slate-400 1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="What is this group for?"
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Add Members</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                {users.map((user) => {
                  const isSelected = selectedMembers.includes(user.id);
                  const isCurrentUser = user.id === currentUser?.id;
                  
                  return (
                    <div 
                      key={user.id}
                      onClick={() => toggleMember(user.id)}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                        isSelected 
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20 dark:bg-primary-900/20' 
                          : 'border-slate-200 dark:border-zinc-700 hover:border-slate-300 1'
                      } ${isCurrentUser ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <Avatar src={user.avatar} name={user.name} size="sm" />
                      <div className="ml-3 flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">{isCurrentUser ? '(You)' : user.email}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 1'
                      }`}>
                        {isSelected && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400">
                Selected {selectedMembers.length} member(s)
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-zinc-700">
              <Button type="button" variant="ghost" onClick={() => navigate('/groups')}>
                Cancel
              </Button>
              <Button type="submit" disabled={!formData.name.trim()}>
                Create Group
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
