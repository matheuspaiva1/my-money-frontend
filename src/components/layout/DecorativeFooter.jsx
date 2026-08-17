/** Faixa diagonal verde/laranja usada no rodapé das telas de autenticação (Cadastro, Login, Cad_Empresa). */
export function DecorativeFooter() {
  return (
    <svg
      viewBox="0 0 400 44"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-11 w-full"
      aria-hidden="true"
    >
      {/* faixa maior */}
      <polygon points="0,44 0,14 150,44" fill="var(--color-primary-500)" />
      <polygon points="150,44 190,14 400,44" fill="var(--color-secondary-500)" />
      {/* faixa fina sobreposta, ligeiramente deslocada */}
      <polygon points="0,44 0,30 90,44" fill="var(--color-secondary-500)" opacity="0.9" />
      <polygon points="90,44 115,30 260,44" fill="var(--color-primary-600)" opacity="0.9" />
    </svg>
  )
}
