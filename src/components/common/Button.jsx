const VARIANTS = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white',
  secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white',
  ghost: 'bg-transparent hover:bg-primary-50 text-primary-600 border border-primary-500',
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  disabled,
  loading,
  children,
  ...props
}) {
  return (
    <button
      className={`rounded-lg py-2.5 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        fullWidth ? 'w-full' : 'px-10'
      } ${VARIANTS[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Enviando...' : children}
    </button>
  )
}
