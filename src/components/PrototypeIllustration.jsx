// Ilustrações reais exportadas do protótipo Figma (public/img_login.svg,
// img_cad.svg, img_emp.svg), renderizadas direto sobre o fundo branco da tela.
export default function PrototypeIllustration({ src, alt, className = '' }) {
  return <img src={src} alt={alt} className={`h-auto w-[28rem] xl:w-[38rem] ${className}`} />;
}
