import { PageFrame } from './PageFrame'
import { DecorativeFooter } from './DecorativeFooter'

/** Layout compartilhado pelas telas de Cadastro, Login e Cad_Empresa. */
export function AuthLayout({ title, titleAlign = 'left', illustration, children }) {
  return (
    <PageFrame className="pb-16">
      <div className="grid grid-cols-1 items-center gap-8 p-10 sm:p-14 md:grid-cols-2">
        <div className={`w-full max-w-sm ${titleAlign === 'center' ? 'mx-auto text-center' : ''}`}>
          <h1 className="mb-7 text-2xl font-bold text-secondary-500">{title}</h1>
          {children}
        </div>
        <div className="mx-auto hidden h-64 w-64 md:block">{illustration}</div>
      </div>
      <DecorativeFooter />
    </PageFrame>
  )
}
