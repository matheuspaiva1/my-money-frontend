const FALLBACK_MESSAGE = 'Não foi possível completar a operação. Tente novamente.';
const NETWORK_MESSAGE =
  'Não foi possível conectar ao servidor. Verifique se o backend está no ar e tente novamente.';

/**
 * Extrai a mensagem de erro da API seguindo o contrato do backend my-money:
 * { message } em 400/401/404/409, { status, message } em 500 não tratado.
 * Erros de rede (backend fora do ar) recebem uma mensagem amigável distinta.
 */
export function getErrorMessage(error) {
  if (!error?.response) {
    return NETWORK_MESSAGE;
  }
  return error.response.data?.message || FALLBACK_MESSAGE;
}
