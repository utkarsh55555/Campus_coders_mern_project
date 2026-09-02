import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';

import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { MemberPicker } from '../../components/groups/MemberPicker';

export default function CreateGroup() {
  const { addGroup, allUsers, inviteUserByEmail } = useFinance();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [selectedMembers, setSelectedMembers] = useState([currentUser?.id].filter(Boolean));
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    try {
      const created = await addGroup({
        name: formData.name,
        description: formData.description,
        members: selectedMembers,
      });
      navigate(created?.id ? `/groups/${created.id}` : '/groups');
    } catch {
      /* toast handled in context */
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
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
                <label className="mb-1.5 block text-sm font-medium text-white/70">
                  Description (optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  className="flex w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-white placeholder:text-white/35 focus:border-violet-400/50 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                  placeholder="What is this group for?"
                />
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <h4 className="mb-4 flex items-center gap-2 text-sm font-medium text-white">
                <Users size={16} className="text-violet-400" />
                Add Members
              </h4>
              <MemberPicker
                users={allUsers}
                selectedIds={selectedMembers}
                onChange={setSelectedMembers}
                lockedIds={[currentUser?.id].filter(Boolean)}
                onInviteByEmail={inviteUserByEmail}
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
              <Button type="button" variant="ghost" onClick={() => navigate('/groups')}>
                Cancel
              </Button>
              <Button type="submit" disabled={!formData.name.trim()} isLoading={submitting}>
                Create Group
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
