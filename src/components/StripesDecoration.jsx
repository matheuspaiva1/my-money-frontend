// Faixas diagonais laranja/verde no rodapé das telas de autenticação,
// reproduzindo o elemento decorativo presente no protótipo Figma.
export default function StripesDecoration() {
  return (
    <svg
      viewBox="0 0 1200 160"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full sm:h-28 lg:h-32"
    >
      <polygon points="0,160 0,40 760,160" fill="var(--color-accent)" />
      <polygon points="0,160 0,75 560,160" fill="var(--color-primary)" />
    </svg>
  );
}
