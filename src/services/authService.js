import { api } from './api'

/** POST /users — cria o usuário. Sem autenticação. */
export async function register({ nome, matricula, senha }) {
  const { data } = await api.post('/users', { nome, matricula, senha })
  return data
}

/** POST /login — autentica e devolve { token, user }. Sem autenticação. */
export async function login({ matricula, senha }) {
  const { data } = await api.post('/login', { matricula, senha })
  return data
}
