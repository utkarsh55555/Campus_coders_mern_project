import React, { useMemo, useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { MemberPicker } from './MemberPicker';

export function AddMembersModal({
  isOpen,
  onClose,
  groupName,
  existingMemberIds = [],
  allUsers = [],
  lockedIds = [],
  onInviteByEmail,
  onAddMembers,
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const newMemberIds = useMemo(
    () => selectedIds.filter((id) => !existingMemberIds.includes(id)),
    [selectedIds, existingMemberIds]
  );

  const handleClose = () => {
    setSelectedIds([]);
    onClose();
  };

  const handleSubmit = async () => {
    if (newMemberIds.length === 0) return;
    setSubmitting(true);
    try {
      await onAddMembers(newMemberIds);
      setSelectedIds([]);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Add members to ${groupName}`}
      className="max-w-xl"
    >
      <MemberPicker
        users={allUsers}
        selectedIds={selectedIds}
        onChange={setSelectedIds}
        lockedIds={lockedIds}
        excludeIds={existingMemberIds}
        onInviteByEmail={onInviteByEmail}
        maxHeight="max-h-48"
      />

      <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
        <Button type="button" variant="ghost" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={newMemberIds.length === 0}
          isLoading={submitting}
        >
          Add {newMemberIds.length > 0 ? `${newMemberIds.length} ` : ''}Member
          {newMemberIds.length !== 1 ? 's' : ''}
        </Button>
      </div>
    </Modal>
  );
}
