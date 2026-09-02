import React, { useMemo, useState } from 'react';
import { Search, UserPlus, X } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { cn } from '../../utils/cn';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function MemberPicker({
  users = [],
  selectedIds = [],
  onChange,
  lockedIds = [],
  excludeIds = [],
  showInviteByEmail = true,
  onInviteByEmail,
  maxHeight = 'max-h-60',
}) {
  const [search, setSearch] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteError, setInviteError] = useState('');

  const availableUsers = useMemo(
    () => users.filter((u) => !excludeIds.includes(u.id)),
    [users, excludeIds]
  );

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return availableUsers;
    return availableUsers.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
    );
  }, [availableUsers, search]);

  const selectedUsers = useMemo(
    () => users.filter((u) => selectedIds.includes(u.id)),
    [users, selectedIds]
  );

  const toggleMember = (userId) => {
    if (lockedIds.includes(userId)) return;
    if (selectedIds.includes(userId)) {
      onChange(selectedIds.filter((id) => id !== userId));
    } else {
      onChange([...selectedIds, userId]);
    }
  };

  const removeSelected = (userId) => {
    if (lockedIds.includes(userId)) return;
    onChange(selectedIds.filter((id) => id !== userId));
  };

  const handleInvite = (e) => {
    e.preventDefault();
    const email = inviteEmail.trim().toLowerCase();
    if (!email) return;
    if (!emailRegex.test(email)) {
      setInviteError('Enter a valid email address');
      return;
    }
    if (availableUsers.some((u) => u.email?.toLowerCase() === email)) {
      const existing = availableUsers.find((u) => u.email?.toLowerCase() === email);
      if (existing && !selectedIds.includes(existing.id)) {
        onChange([...selectedIds, existing.id]);
      }
      setInviteEmail('');
      setInviteError('');
      return;
    }
    const invited = onInviteByEmail?.(email);
    if (invited?.id && !selectedIds.includes(invited.id)) {
      onChange([...selectedIds, invited.id]);
    }
    setInviteEmail('');
    setInviteError('');
  };

  return (
    <div className="space-y-4">
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((user) => {
            const isLocked = lockedIds.includes(user.id);
            return (
              <span
                key={user.id}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
                  isLocked
                    ? 'border-violet-500/40 bg-violet-500/15 text-violet-200'
                    : 'border-white/15 bg-white/5 text-white/80'
                )}
              >
                <Avatar src={user.avatar} name={user.name} size="sm" className="!h-5 !w-5 !text-[10px]" />
                <span className="max-w-[120px] truncate">{user.name}</span>
                {user.isPending && (
                  <span className="text-[10px] text-white/40">(pending)</span>
                )}
                {!isLocked && (
                  <button
                    type="button"
                    onClick={() => removeSelected(user.id)}
                    className="rounded-full p-0.5 text-white/40 hover:bg-white/10 hover:text-white"
                    aria-label={`Remove ${user.name}`}
                  >
                    <X size={12} />
                  </button>
                )}
              </span>
            );
          })}
        </div>
      )}

      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="flex h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] py-2 pl-10 pr-3.5 text-sm text-white placeholder:text-white/35 focus:border-violet-400/50 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
        />
      </div>

      <div className={cn('grid grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2', maxHeight)}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const isSelected = selectedIds.includes(user.id);
            const isLocked = lockedIds.includes(user.id);

            return (
              <button
                key={user.id}
                type="button"
                onClick={() => toggleMember(user.id)}
                disabled={isLocked}
                className={cn(
                  'flex items-center gap-3 rounded-xl border p-3 text-left transition-colors',
                  isSelected
                    ? 'border-violet-500/50 bg-violet-500/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]',
                  isLocked && 'cursor-default opacity-80'
                )}
              >
                <Avatar src={user.avatar} name={user.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {user.name}
                    {isLocked && <span className="ml-1 text-white/40">(You)</span>}
                  </p>
                  <p className="truncate text-xs text-white/45">
                    {user.email}
                    {user.isPending && ' · pending invite'}
                  </p>
                </div>
                <div
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                    isSelected
                      ? 'border-violet-500 bg-violet-500 text-white'
                      : 'border-white/25'
                  )}
                >
                  {isSelected && (
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })
        ) : (
          <p className="col-span-full py-6 text-center text-sm text-white/45">
            {search ? 'No users match your search' : 'No users available yet'}
          </p>
        )}
      </div>

      {showInviteByEmail && onInviteByEmail && (
        <form onSubmit={handleInvite} className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-4">
          <p className="mb-3 flex items-center gap-2 text-sm font-medium text-white/80">
            <UserPlus size={16} className="text-violet-400" />
            Invite by email
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              type="email"
              value={inviteEmail}
              onChange={(e) => {
                setInviteEmail(e.target.value);
                setInviteError('');
              }}
              placeholder="friend@example.com"
              error={inviteError}
              className="flex-1"
            />
            <Button type="submit" variant="secondary" className="shrink-0 sm:w-auto">
              Add
            </Button>
          </div>
          <p className="mt-2 text-xs text-white/35">
            They&apos;ll be added to the group once they join the app.
          </p>
        </form>
      )}

      <p className="text-xs text-white/45">
        {selectedIds.length} member{selectedIds.length !== 1 ? 's' : ''} selected
      </p>
    </div>
  );
}
