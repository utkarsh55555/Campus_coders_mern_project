import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatters';

import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/common/Card';
import { Avatar } from '../../components/common/Avatar';

export default function Profile() {
  const { currentUser, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    avatar: currentUser?.avatar || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;
    
    // Auto-generate avatar if left blank or name changed
    let avatarUrl = formData.avatar;
    if (!avatarUrl || avatarUrl === currentUser?.avatar) {
      avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=0D8ABC&color=fff`;
    }
    
    updateProfile({
      name: formData.name,
      email: formData.email,
      avatar: avatarUrl
    });
    
    setIsEditing(false);
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Profile</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
          Manage your account settings and preferences.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Personal Information</CardTitle>
          {!isEditing && (
            <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </CardHeader>
        
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                label="Avatar URL (Optional)"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
              />
            </CardContent>
            <CardFooter className="justify-end gap-3 bg-slate-50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50 dark:bg-zinc-800/50">
              <Button type="button" variant="ghost" onClick={() => {
                setIsEditing(false);
                setFormData({
                  name: currentUser.name,
                  email: currentUser.email,
                  avatar: currentUser.avatar
                });
              }}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </CardFooter>
          </form>
        ) : (
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
              <div className="flex-shrink-0">
                <Avatar src={currentUser.avatar} name={currentUser.name} className="h-24 w-24 text-2xl" />
              </div>
              <div className="flex-1 space-y-4 text-center sm:text-left">
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white">{currentUser.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">{currentUser.email}</p>
                </div>
                
                <div className="pt-4 border-t border-slate-200 dark:border-zinc-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Account Created</p>
                    <p className="mt-1 text-sm text-slate-900 dark:text-white">
                      {currentUser.createdAt ? formatDate(currentUser.createdAt) : 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Status</p>
                    <p className="mt-1 text-sm text-cyan-300 font-medium">Active</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <Card className="border-red-100">
        <CardHeader>
          <CardTitle className="text-fuchsia-300">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mb-4">
            Logging out will end your current session. You will need to sign in again to access your account.
          </p>
          <Button variant="danger" onClick={logout}>
            Log Out Securely
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
