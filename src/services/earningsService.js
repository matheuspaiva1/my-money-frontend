import http from './http';

export function getEarnings() {
  return http.get('/earnings').then((response) => response.data);
}
