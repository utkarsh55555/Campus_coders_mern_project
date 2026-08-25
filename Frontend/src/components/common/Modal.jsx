import React, { useEffect } from 'react';
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';
import { Button } from './Button';

export function Modal({ isOpen, onClose, title, children, className }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div 
        className={cn(
          "relative z-50 w-full max-w-lg transform overflow-hidden rounded-xl bg-white p-6 text-left shadow-xl transition-all m-4 max-h-[90vh] flex flex-col",
          className
        )}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold leading-6 text-slate-900">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-500"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}
