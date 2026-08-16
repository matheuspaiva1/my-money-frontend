export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-xl border-2 border-primary bg-white p-5 ${className}`}>{children}</div>
  );
}
