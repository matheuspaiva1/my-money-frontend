import { api } from './api'

/** POST /company (autenticado) — cria a empresa do aluno logado. */
export async function createCompany({ nome_empresa, observacoes, transporte }) {
  const { data } = await api.post('/company', { nome_empresa, observacoes, transporte })
  return data
}

/**
 * GET /company (autenticado) — busca a empresa do aluno logado.
 * Devolve `null` quando a API responde 404 (ainda não cadastrada), em vez de lançar.
 */
export async function getCompany() {
  try {
    const { data } = await api.get('/company')
    return data
  } catch (error) {
    if (error.response?.status === 404) return null
    throw error
  }
}
