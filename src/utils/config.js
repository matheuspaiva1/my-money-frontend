// Constantes de negócio que a API do backend (my-money) não expõe.
// Ajuste aqui caso o valor real do estágio mude.

// Carga horária total do estágio, usada para calcular "Falta X horas para o fim do estágio".
export const TOTAL_HORAS_ESTAGIO = 300

// Espelha src/domain/entities/earnings-rates.ts do backend (my-money), usado
// apenas para calcular o valor "do mês" no front, já que GET /earnings só
// devolve o total geral. O total geral em si sempre vem pronto da API.
export const HOURLY_RATE = 5.33
export const TRANSPORT_ALLOWANCE = 10.8
