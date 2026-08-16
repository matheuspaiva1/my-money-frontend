import { Loader2 } from 'lucide-react';

const VARIANT_CLASSES = {
  // Verde: ação principal (Cadastrar, Login, Enviar) — cor primária do protótipo.
  primary: 'bg-primary hover:bg-primary-dark text-white',
  // Laranja: ação secundária (trocar para Login/Cadastrar, Sair, Concluir do modal).
  accent: 'bg-accent hover:bg-accent-dark text-white',
};

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  loading = false,
  disabled = false,
  fullWidth = true,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 font-heading text-sm font-semibold tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        fullWidth ? 'w-full' : ''
      } ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
