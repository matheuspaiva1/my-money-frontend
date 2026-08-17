import { forwardRef } from 'react'

export const TextArea = forwardRef(function TextArea(
  { label, error, rows = 4, className = '', ...props },
  ref,
) {
  return (
    <label className="block text-left text-sm text-gray-700">
      {label && <span className="mb-1 block font-medium">{label}</span>}
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={Boolean(error)}
        className={`w-full resize-none rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 ${
          error ? 'border-red-400' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  )
})
