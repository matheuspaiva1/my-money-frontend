import http from './http';

export function getCompany() {
  return http.get('/company').then((response) => response.data);
}

export function createCompany({ nome_empresa, observacoes, transporte }) {
  return http.post('/company', { nome_empresa, observacoes, transporte }).then((response) => response.data);
}
