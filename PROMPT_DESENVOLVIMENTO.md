# Prompt para desenvolvimento — Sistema de Controle de Horas de Estágio

> Cole este prompt inteiro em uma ferramenta de codificação com IA (Claude Code, Cursor, etc.) na raiz do projeto `my-money-frontend` para gerar o sistema.

## Contexto do projeto

Construa um sistema web em **React + JavaScript** (sem TypeScript) para um aluno de estágio controlar as horas trabalhadas e acompanhar o valor acumulado a receber. O projeto já está inicializado com **Vite + React 19** nesta pasta — use essa estrutura existente em vez de recriar o projeto do zero.

Este frontend consome uma **API real já implementada**, o backend `my-money` (Node.js + Express + TypeScript + MongoDB), que roda localmente em `http://localhost:3333` por padrão. **Não crie mocks nem dados fake** — todas as telas devem funcionar contra essa API desde o início.

O design de referência está no Figma:
`https://www.figma.com/design/C9CstLh1pYyIxNoHjaas3q/Untitled?node-id=0-1`

Abra o link e replique fielmente cores, tipografia, espaçamentos e componentes das telas: **Cadastro**, **Cad_Empresa**, **Login**, **Home** e **Cadastrar Horas** (modal). Se algum estado (erro, vazio, loading) não estiver no protótipo, mantenha consistência visual com o restante do design.

## Ator e fluxo

Único ator: **Aluno**. Fluxo: Cadastro → Login → Cadastro da empresa (se ainda não tiver) → Home (calendário + indicadores) → Cadastrar Horas (modal).

---

## Contrato da API (backend `my-money`)

Base URL configurável via variável de ambiente do Vite: `VITE_API_URL` (default `http://localhost:3333`). Nunca hardcode a URL nos componentes — centralize em um cliente HTTP único (ver seção "Integração com a API").

Todo corpo de requisição/resposta é `application/json`. Rotas marcadas com 🔒 exigem header `Authorization: Bearer <token>`, obtido em `POST /login`.

Formato de erro padrão em qualquer rota: `{ "message": "descrição do erro" }` (400/401/404/409), ou `{ "status": "error", "message": "..." }` em erro `500` não tratado. Trate erros lendo sempre `error.response.data.message` (com fallback genérico se ausente).

| Método | Rota | Auth | Body | Sucesso | Erros |
|---|---|---|---|---|---|
| POST | `/users` | não | `{ nome, matricula, senha }` | `201 { id, nome, matricula, created_at }` | `400` campo faltando · `409` matrícula já cadastrada |
| POST | `/login` | não | `{ matricula, senha }` | `200 { token, user: { id, nome, matricula } }` | `400` campo faltando · `401` matrícula/senha incorretos |
| POST | `/company` | 🔒 | `{ nome_empresa, observacoes?, transporte? }` | `201 { id, user_id, nome_empresa, observacoes, transporte, created_at }` | `400` sem `nome_empresa` · `401` sem token · `409` aluno já tem empresa |
| GET | `/company` | 🔒 | — | `200 { id, user_id, nome_empresa, observacoes, transporte, created_at }` | `401` sem token · `404` sem empresa cadastrada |
| POST | `/schedule` | 🔒 | `{ dia_cadastrado, horas_cadastradas_dia }` | `201 { id, user_id, dia_cadastrado, horas_cadastradas_dia }` | `400` data ausente/inválida ou horas fora de `0 < h <= 24` · `401` sem token · `409` já existe lançamento nesse dia |
| GET | `/schedule` | 🔒 | — | `200` array de `{ id, user_id, dia_cadastrado, horas_cadastradas_dia }`, ordenado por data decrescente | `401` sem token |
| GET | `/earnings` | 🔒 | — | `200 { total_horas, total_dias, transporte, valor_horas, valor_transporte, total }` | `401` sem token |

Observações importantes sobre o contrato:
- `matricula` e `senha` **não têm acento** nos nomes de campo (é exatamente assim que o backend espera).
- `dia_cadastrado` é uma string de data, ex. `"2026-08-11"` (formato `YYYY-MM-DD`).
- `horas_cadastradas_dia` deve ser **maior que 0** (não aceita `0`) e **no máximo 24**.
- Um aluno não pode ter dois lançamentos no mesmo dia — a API responde `409`; a UI deve tratar esse caso com uma mensagem amigável (ex.: "Você já registrou horas nesse dia") e, se possível, desabilitar no calendário datas já lançadas (usando o resultado de `GET /schedule`).
- `GET /earnings` retorna **apenas o total acumulado geral** (`HOURLY_RATE = 5.33` por hora, `TRANSPORT_ALLOWANCE = 10.80` por dia lançado se a empresa tiver `transporte: true`). **Não existe endpoint de ganhos por mês** — isso está fora de escopo do backend atual.
- Não existem endpoints de recuperação de senha, edição/remoção de lançamentos, nem edição de empresa. Não construa telas para essas ações.
- A senha nunca volta em nenhuma resposta da API — não tente exibi-la em lugar nenhum.
- O token JWT expira em `1d`. Ao receber `401` em qualquer chamada autenticada, faça logout automático (limpe o token salvo) e redirecione para `/login`.
- **CORS:** o backend, no estado atual, **não tem middleware de CORS configurado** (`app.use(cors())` ausente em `main/config/app.ts`). Se o front rodar em outra origem (ex. `http://localhost:5173`) e as chamadas falharem por CORS, configure um proxy de desenvolvimento no `vite.config.js` (`server.proxy: { '/api': 'http://localhost:3333' }`) apontando para o backend, ou avise para adicionarem `cors` no backend. Não tente contornar CORS no lado do cliente.

---

## Telas e regras de negócio

### 1. Cadastro (US01) — `POST /users`
Campos: nome, matrícula, senha.
- Todos os campos obrigatórios; bloquear envio e sinalizar campo(s) pendente(s) se algum estiver vazio (validação client-side antes de chamar a API).
- Em `409`, exibir "matrícula já cadastrada" (usar a mensagem vinda da API).
- A senha é enviada em texto plano pelo body (HTTPS/local) — o hashing (bcrypt) acontece no backend; o front nunca deve tentar hashear ou persistir a senha em `localStorage`/estado global além do necessário para o envio do formulário.
- Ao concluir com sucesso (`201`), redirecionar para o login (a API não retorna token no cadastro — é preciso logar em seguida) ou, se preferir uma UX mais fluida, logar automaticamente chamando `POST /login` com as mesmas credenciais e seguir para o cadastro da empresa.

### 2. Login (US02) — `POST /login`
Campos: matrícula e senha.
- Sucesso (`200`): salvar `token` e `user` (id, nome, matricula) e redirecionar para a Home (ou para o cadastro da empresa, se `GET /company` retornar `404`).
- `401`: exibir mensagem genérica de credenciais inválidas (não distinguir se foi matrícula ou senha), permanece na tela.
- Proteger rotas: usuário sem token válido que tentar acessar qualquer tela além de cadastro/login deve ser redirecionado para login.
- Cada aluno só vê seus próprios dados — isso já é garantido pelo backend via `user_id` extraído do token; o front não precisa (nem deve) filtrar por usuário manualmente.

### 3. Cadastro da empresa (US03) — `POST /company` e `GET /company`
Campos: nome da empresa (`nome_empresa`), observações/descrição das atividades (`observacoes`), vale-transporte (`transporte`, boolean).
- Ao entrar na tela, chamar `GET /company`: se `200`, mostrar os dados existentes (modo consulta — a API não expõe edição, então não ofereça um botão de salvar alterações); se `404`, mostrar o formulário de cadastro vazio.
- `nome_empresa` obrigatório; `observacoes` e `transporte` opcionais (`transporte` default `false` se não enviado).
- Em `409` ("aluno já tem empresa"), redirecionar para a visualização (chamando `GET /company`) em vez de mostrar erro cru.

### 4. Home
- Calendário mensal navegável, usando os dados de `GET /schedule` (lista completa) para marcar dias já lançados.
- Cards com: total de horas do mês corrente, valor acumulado do mês corrente, e (opcional) total geral vindo direto de `GET /earnings`.
- **Total geral**: usar diretamente `GET /earnings` (`total_horas`, `total`, etc.) — não recalcular esses valores manualmente.
- **Total do mês selecionado**: como a API não tem filtro por mês, calcular no cliente a partir de `GET /schedule` + a flag `transporte` de `GET /company`:
  ```js
  // ganho_do_dia = horas_cadastradas_dia * 5.33 + (transporte ? 10.80 : 0)
  const HOURLY_RATE = 5.33;
  const TRANSPORT_ALLOWANCE = 10.8;
  ```
  Filtrar os schedules cujo `dia_cadastrado` caia no mês/ano exibidos no calendário, somar horas e aplicar a fórmula acima por dia (arredondando o total em 2 casas decimais, igual ao backend).
- Atualização automática dos cards após novo registro de horas (refazer as chamadas de `GET /schedule` e `GET /earnings`, sem exigir reload manual da página).

### 5. Cadastrar Horas (modal, US04) — `POST /schedule`
Aberto ao selecionar uma data no calendário.
- Campo de horas obrigatório; validar no cliente `0 < horas <= 24` antes de chamar a API (espelhando a regra do backend), com mensagem clara se fora do intervalo.
- Se a data selecionada já tiver lançamento (visível via `GET /schedule`), desabilitar o campo/CTA ou avisar antes de tentar enviar; se mesmo assim vier `409` do backend, mostrar a mensagem de forma amigável.
- Registro salvo associado ao aluno logado (o backend infere `user_id` do token — não envie esse campo).
- Após salvar com sucesso, fechar modal e atualizar Home imediatamente (refetch de `/schedule` e `/earnings`).

## Integração com a API

- Centralize toda comunicação HTTP em uma única instância (ex.: `src/services/http.js` com `axios.create({ baseURL: import.meta.env.VITE_API_URL })`).
- Interceptor de request: anexar `Authorization: Bearer <token>` em toda chamada, exceto `POST /users` e `POST /login`.
- Interceptor de response: em `401`, limpar sessão salva e redirecionar para `/login`.
- Guarde `token` e dados do `user` de forma centralizada (Context de autenticação), com leitura/escrita em `localStorage` para persistir a sessão entre reloads (o JWT expira em 1 dia; não é necessário refresh token).
- Um serviço por recurso: `authService` (`register`, `login`), `companyService` (`getCompany`, `createCompany`), `scheduleService` (`listSchedules`, `createSchedule`), `earningsService` (`getEarnings`). Os componentes de tela nunca chamam `axios`/`fetch` diretamente.
- Antes de rodar o front, garanta que o backend `my-money` esteja de pé (`npm run dev` na pasta do backend, escutando na porta configurada em `.env`, default `3333`).

## Requisitos não funcionais
- Formulários com validação client-side clara (mensagens por campo) e feedback de loading/erro em toda chamada assíncrona.
- Layout responsivo (mobile e desktop).
- Sessão do aluno persistida (token em `localStorage`) com logout explícito na UI.
- Tratamento consistente de erros de rede (backend fora do ar) com mensagem amigável, distinta dos erros de negócio (`400`/`401`/`404`/`409`).

## Estrutura de pastas sugerida

```
src/
  assets/
  components/       # componentes reutilizáveis (Button, Input, Modal, Card...)
  features/
    auth/            # Login, Cadastro, contexto de autenticação
    company/         # Cad_Empresa
    hours/           # Home, calendário, modal Cadastrar Horas
  hooks/
  services/
    http.js          # instância axios + interceptors
    authService.js
    companyService.js
    scheduleService.js
    earningsService.js
  routes/            # definição de rotas e proteção de rotas privadas
  utils/             # formatação de moeda/data, validações, cálculo de ganho por dia
```

## Entregáveis esperados
1. Projeto rodando com `npm run dev` sem erros de lint, consumindo o backend real via `VITE_API_URL`.
2. Rotas: `/cadastro`, `/cadastro-empresa`, `/login`, `/` (Home, protegida).
3. Validações e mensagens de erro (client-side + erros vindos da API) descritas em cada critério de aceite acima.
4. `.env.example` com `VITE_API_URL=http://localhost:3333`.
5. README atualizado com: como subir o backend, como configurar o `.env` do front, e decisões técnicas tomadas.

---

## Sugestões de bibliotecas

O `package.json` atual já traz `react@19`, `react-dom@19`, `vite@8` e ESLint configurado — as sugestões abaixo são compatíveis com essa base.

| Necessidade | Sugestão | Por quê |
|---|---|---|
| Roteamento | `react-router-dom` | Padrão de mercado para rotas e proteção de rotas privadas |
| Formulários | `react-hook-form` | Performance boa, menos re-render, fácil integração com validação |
| Validação de schema | `zod` (+ `@hookform/resolvers`) | Schemas tipados em JS puro, mensagens de erro por campo, alinhável às regras da API (`0 < horas <= 24`, campos obrigatórios) |
| Estado global (sessão do aluno) | Context API do React | Escopo pequeno (token + user) não justifica Redux/Zustand |
| Cache/consumo de API | `@tanstack/react-query` | Cuida de loading/erro/refetch automático ao consumir `/schedule`, `/company`, `/earnings` |
| HTTP client | `axios` | Interceptors nativos para anexar token e tratar `401` globalmente |
| Estilização | `Tailwind CSS` | Rápido para replicar Figma com utilitários, fácil manter design system |
| Calendário | `react-day-picker` | Leve, customizável via Tailwind, ideal para marcar dias já lançados |
| Datas | `date-fns` | Manipular `dia_cadastrado`, filtrar por mês, formatar `YYYY-MM-DD` |
| Formatação de moeda | `Intl.NumberFormat` (nativo) | Formata os valores retornados pela API (`total`, `valor_horas`, `valor_transporte`) |
| Sessão/token | `jwt-decode` | Ler `exp` do JWT no cliente para saber quando expira e antecipar o logout |
| Ícones | `lucide-react` | Conjunto amplo, leve, combina bem com Tailwind |
| Notificações/toast | `sonner` ou `react-hot-toast` | Feedback de sucesso/erro (ex.: mensagens `409`/`401` vindas da API) |
| Testes unitários | `vitest` + `@testing-library/react` | Já integrado ao Vite; mockar `authService`/`scheduleService` nos testes de componente |
| Testes E2E | `Playwright` | Cobre o fluxo real: cadastro → login → cadastro de empresa → registro de horas, contra o backend rodando |
| Formatação de código | `Prettier` | Complementa o ESLint já configurado |

### Sobre CORS/proxy
Como o backend ainda não tem `cors` configurado, prefira usar o proxy de desenvolvimento do Vite (`vite.config.js` → `server.proxy`) apontando `/api` para `http://localhost:3333`, e configure `VITE_API_URL=/api` em desenvolvimento. Isso evita mexer no backend só para rodar o front localmente; em produção, o backend precisará de CORS liberado para o domínio do front.

### Sobre o Figma
Não consegui abrir o link do Figma diretamente (a extensão do Chrome não está conectada nesta sessão), então o prompt acima instrui a ferramenta de codificação a abrir o link e extrair cores/tipografia/componentes por conta própria. Se preferir, você pode exportar os tokens de design (cores, fontes, espaçamentos) do Figma e me enviar, ou conectar a extensão Claude in Chrome para eu inspecionar o protótipo diretamente.
