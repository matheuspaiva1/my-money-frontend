/** Moldura usada em todas as telas, ocupando a tela inteira sem borda e com conteúdo centralizado. */
export function PageFrame({ className = '', children }) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-white">
      <div className={`relative w-full max-w-4xl ${className}`}>{children}</div>
    </div>
  )
}
