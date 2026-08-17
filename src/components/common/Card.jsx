export function Card({ className = '', children }) {
  return (
    <div className={`rounded-2xl border-primary-500 p-4 ${className}`}>{children}</div>
  )
}
