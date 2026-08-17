import { api } from './api'

/** POST /schedule (autenticado) — registra as horas trabalhadas em um dia. */
export async function createSchedule({ dia_cadastrado, horas_cadastradas_dia }) {
  const { data } = await api.post('/schedule', { dia_cadastrado, horas_cadastradas_dia })
  return data
}

/** GET /schedule (autenticado) — lista todos os registros de horas do aluno logado. */
export async function listSchedule() {
  const { data } = await api.get('/schedule')
  return data
}
