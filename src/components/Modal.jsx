import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, title, onClose, children }) {
  useEffect(() => {
    if (!open) return undefined;
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl border-2 border-ink bg-white p-6 shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 text-ink transition-colors hover:text-accent"
        >
          <X className="size-5" />
        </button>
        {title && (
          <h2 className="mb-5 text-center font-heading text-lg font-bold text-ink">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}
