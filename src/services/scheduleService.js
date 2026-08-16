import http from './http';

export function listSchedules() {
  return http.get('/schedule').then((response) => response.data);
}

export function createSchedule({ dia_cadastrado, horas_cadastradas_dia }) {
  return http
    .post('/schedule', { dia_cadastrado, horas_cadastradas_dia })
    .then((response) => response.data);
}
