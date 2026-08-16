import { forwardRef } from 'react';

const TextArea = forwardRef(function TextArea(
  { label, error, className = '', id, rows = 5, ...props },
  ref,
) {
  const textareaId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-semibold text-ink">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        ref={ref}
        rows={rows}
        className={`w-full resize-none rounded-md border bg-white px-3 py-2 text-sm text-ink shadow-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
          error ? 'border-danger' : 'border-border'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
});

export default TextArea;
