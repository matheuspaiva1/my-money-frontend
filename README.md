# Controle de Horas de Estágio — Front-end

Front-end em **React 19 + Vite + JavaScript** do Sistema de Controle de Horas de Estágio. Consome a API
REST do projeto backend `my-money` (Node/Express + MongoDB) — não há mocks nem persistência local de
dados de negócio, apenas o token de sessão fica em `localStorage`.

## Rotas

| Rota | Descrição |
|---|---|
| `/cadastro` | Criação de conta do aluno |
| `/login` | Autenticação |
| `/cadastro-empresa` | Dados da empresa do estágio (protegida) |
| `/home` | Calendário, horas e valor acumulado (protegida) |

## Como rodar

1. Suba o backend `my-money` em paralelo (ele precisa estar acessível antes de logar/cadastrar):
   ```bash
   cd ../my-money
   npm install
   npm run dev
   ```
2. Neste projeto, copie `.env.example` para `.env` e ajuste `VITE_API_URL` se o backend não estiver em
   `http://localhost:3333`.
3. Instale as dependências e rode o front:
   ```bash
   npm install
   npm run dev
   ```

Em desenvolvimento, as chamadas à API passam por um **proxy configurado em `vite.config.js`**
(`/users`, `/login`, `/company`, `/schedule`, `/earnings` → `VITE_API_URL`), então não há problema de
CORS mesmo o backend não tendo esse middleware habilitado. Em produção (`npm run build` / `npm run
preview`), as chamadas vão direto para `VITE_API_URL` — nesse caso o backend precisa ter CORS habilitado
para a origem do front, ou é preciso colocar um proxy reverso na frente dos dois.

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção (`dist/`)
- `npm run preview` — serve o build de produção localmente
- `npm run lint` — ESLint
- `npm test` — testes com Vitest (`src/utils/*.test.js`)

## Constantes de negócio que a API não expõe

Em `src/utils/config.js`:
- `TOTAL_HORAS_ESTAGIO` — carga horária total do estágio, usada para "Falta X horas para o fim do
  estágio". Hoje fixada em 300h; ajuste conforme o estágio real.
- `HOURLY_RATE` / `TRANSPORT_ALLOWANCE` — espelham as constantes do backend
  (`src/domain/entities/earnings-rates.ts` em `my-money`), usadas **só** para calcular o valor do mês
  selecionado no calendário, já que `GET /earnings` devolve apenas o total geral. O total geral exibido
  na aplicação sempre vem pronto da API, nunca é recalculado no front.

## Limitações conhecidas (herdadas da API atual)

- Não há endpoint para editar ou excluir um registro de horas (`schedule`) já criado — um dia já
  registrado é exibido em modo leitura no modal "Cadastrar Horas".
- O login só autentica por matrícula (`POST /login` não aceita nome), embora o rótulo do campo no
  protótipo diga "Nome ou Matrícula".
- Não há endpoint de "esqueci minha senha" nem de exclusão de conta.

## Estrutura

```
src/
  components/   Button, Input, Modal, Card, calendário, ilustrações, layout de autenticação
  contexts/     AuthContext (sessão do aluno)
  hooks/        useAuth, useCompany, useSchedule, useEarnings
  pages/        Cadastro, Login, CadastroEmpresa, Home
  routes/       AppRoutes, PrivateRoute
  services/     api.js (axios + interceptors) e um arquivo por recurso da API
  utils/        config, formatters, dateHelpers, validators (zod)
```
