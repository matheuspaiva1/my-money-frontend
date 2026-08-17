import { api } from './api'

/** GET /earnings (autenticado) — ganhos totais já calculados pelo backend. */
export async function getEarnings() {
  const { data } = await api.get('/earnings')
  return data
}
