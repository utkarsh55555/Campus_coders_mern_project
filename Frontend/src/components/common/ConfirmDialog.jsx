import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDestructive = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-sm">
      <div className="mt-2">
        <p className="text-sm text-slate-500">{message}</p>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <Button variant="ghost" onClick={onClose}>
          {cancelText}
        </Button>
        <Button variant={isDestructive ? 'danger' : 'primary'} onClick={() => {
          onConfirm();
          onClose();
        }}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
