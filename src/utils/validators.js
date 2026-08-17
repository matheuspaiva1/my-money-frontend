import { z } from 'zod'

export const cadastroSchema = z.object({
  nome: z.string().trim().min(1, 'Informe seu nome.'),
  matricula: z.string().trim().min(1, 'Informe sua matrícula.'),
  senha: z.string().min(1, 'Informe uma senha.'),
})

export const loginSchema = z.object({
  matricula: z.string().trim().min(1, 'Informe sua matrícula.'),
  senha: z.string().min(1, 'Informe sua senha.'),
})

export const empresaSchema = z.object({
  nome_empresa: z.string().trim().min(1, 'Informe o nome da empresa.'),
  observacoes: z.string().trim().optional().or(z.literal('')),
  transporte: z.enum(['sim', 'nao'], {
    errorMap: () => ({ message: 'Selecione se a empresa oferece vale-transporte.' }),
  }),
})

export const horasSchema = z.object({
  horas: z
    .coerce.number({ invalid_type_error: 'Informe uma quantidade de horas válida.' })
    .gt(0, 'As horas devem ser maiores que zero.')
    .lte(24, 'As horas não podem ultrapassar 24 no mesmo dia.'),
})
