import { z } from 'zod';

// Espelham as regras de negócio do backend my-money (ver PROMPT_DESENVOLVIMENTO.md).
// `matricula` e `senha` não têm acento nos nomes de campo: é assim que a API espera.

export const cadastroSchema = z.object({
  nome: z.string().trim().min(1, 'Informe o nome.'),
  matricula: z.string().trim().min(1, 'Informe a matrícula.'),
  senha: z.string().min(1, 'Informe a senha.'),
});

export const loginSchema = z.object({
  matricula: z.string().trim().min(1, 'Informe a matrícula.'),
  senha: z.string().min(1, 'Informe a senha.'),
});

export const companySchema = z.object({
  nome_empresa: z.string().trim().min(1, 'Informe o nome da empresa.'),
  observacoes: z.string().trim().optional(),
  transporte: z.boolean().default(false),
});

// 0 < horas <= 24, igual à validação do backend em POST /schedule.
export const horasSchema = z.object({
  horas: z.coerce
    .number()
    .refine((value) => Number.isFinite(value) && value > 0 && value <= 24, {
      message: 'Informe um número de horas maior que 0 e no máximo 24.',
    }),
});
