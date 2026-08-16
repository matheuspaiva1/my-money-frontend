import http from './http';

export function register({ nome, matricula, senha }) {
  return http.post('/users', { nome, matricula, senha }).then((response) => response.data);
}

export function login({ matricula, senha }) {
  return http.post('/login', { matricula, senha }).then((response) => response.data);
}
