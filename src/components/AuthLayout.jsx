import StripesDecoration from './StripesDecoration';

// Layout dividido em duas colunas (formulário + ilustração) usado nas telas
// de Cadastro, Login e Cadastro da Empresa, com as faixas diagonais no rodapé.
export default function AuthLayout({ title, children, illustration }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-white lg:flex-row">
      <div className="flex w-full flex-1 items-center justify-center px-6 py-16 lg:w-1/2 lg:justify-end lg:pr-16">
        <div className="w-full max-w-sm">
          <h1 className="mb-8 font-heading text-3xl font-bold text-accent">{title}</h1>
          {children}
        </div>
      </div>
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden lg:flex">
        {illustration}
      </div>
      <StripesDecoration />
    </div>
  );
}
