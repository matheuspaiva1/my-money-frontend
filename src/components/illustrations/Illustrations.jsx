/**
 * Ilustrações decorativas simples e abstratas, inspiradas nas telas do
 * protótipo Figma (estudante com notebook, quebra-cabeça, grupo de pessoas).
 * Não são reproduções literais dos assets do Figma — o arquivo tem Dev Mode
 * bloqueado para exportação; ajuste depois se quiser trocar por PNG/SVG reais.
 */

export function StudentIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <circle cx="100" cy="100" r="90" fill="var(--color-mint-100)" />
      {/* balão de fala */}
      <rect x="30" y="55" width="46" height="30" rx="10" fill="white" stroke="var(--color-primary-500)" strokeWidth="3" />
      <circle cx="43" cy="70" r="3" fill="var(--color-primary-500)" />
      <circle cx="53" cy="70" r="3" fill="var(--color-primary-500)" />
      <circle cx="63" cy="70" r="3" fill="var(--color-primary-500)" />
      {/* notebook */}
      <rect x="55" y="120" width="90" height="14" rx="4" fill="var(--color-primary-500)" />
      <rect x="65" y="90" width="70" height="34" rx="6" fill="#2f3542" />
      {/* cabeça/capuz */}
      <circle cx="100" cy="58" r="24" fill="#2f3542" />
      <circle cx="100" cy="62" r="17" fill="#f3d9c2" />
      <rect x="72" y="82" width="56" height="34" rx="14" fill="var(--color-primary-600)" />
    </svg>
  )
}

export function PuzzleIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <circle cx="100" cy="100" r="90" fill="var(--color-mint-100)" />
      <rect x="50" y="50" width="45" height="45" rx="8" fill="var(--color-primary-500)" />
      <circle cx="72" cy="66" r="7" fill="white" />
      <rect x="66" y="76" width="12" height="10" rx="2" fill="white" />

      <rect x="105" y="50" width="45" height="45" rx="8" fill="var(--color-secondary-500)" />
      <circle cx="127" cy="72" r="9" fill="white" />
      <rect x="123" y="60" width="8" height="10" fill="white" />

      <rect x="50" y="105" width="45" height="45" rx="8" fill="var(--color-secondary-500)" />
      <rect x="62" y="128" width="6" height="12" fill="white" />
      <rect x="70" y="122" width="6" height="18" fill="white" />
      <rect x="78" y="132" width="6" height="8" fill="white" />

      <rect x="105" y="105" width="45" height="45" rx="8" fill="var(--color-primary-500)" />
      <circle cx="127" cy="127" r="10" fill="white" />
      <text x="127" y="132" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--color-primary-600)">
        $
      </text>
    </svg>
  )
}

export function GroupIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <circle cx="100" cy="100" r="90" fill="var(--color-mint-100)" />
      {/* globo erguido */}
      <circle cx="118" cy="38" r="16" fill="none" stroke="var(--color-secondary-500)" strokeWidth="3" />
      <ellipse cx="118" cy="38" rx="16" ry="7" fill="none" stroke="var(--color-secondary-500)" strokeWidth="2" />
      <line x1="118" y1="22" x2="118" y2="54" stroke="var(--color-secondary-500)" strokeWidth="2" />

      <circle cx="70" cy="90" r="22" fill="var(--color-secondary-500)" />
      <circle cx="130" cy="90" r="22" fill="var(--color-primary-500)" />
      <circle cx="100" cy="70" r="26" fill="var(--color-primary-600)" />
      <rect x="55" y="115" width="90" height="55" rx="16" fill="#2f3542" />
    </svg>
  )
}
