import { forwardRef } from 'react';

const Input = forwardRef(function Input({ label, error, className = '', id, ...props }, ref) {
  const inputId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-ink">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-ink shadow-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
          error ? 'border-danger' : 'border-border'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
});

export default Input;
