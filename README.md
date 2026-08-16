# my-money-frontend

Frontend do **Sistema de Controle de Horas de Estágio**: um aluno se cadastra, faz login,
informa em qual empresa estagia e lança as horas trabalhadas por dia para acompanhar quanto
já ganhou. Feito em **React 19 + Vite**, consumindo a API real do backend
[`my-money`](../my-money) (Node.js + Express + TypeScript + MongoDB) — sem mocks, sem dados
fake.

Design de referência: [Figma](https://www.figma.com/design/C9CstLh1pYyIxNoHjaas3q/Untitled?node-id=0-1)
(telas Cadastro, Cad_Empresa, Login, Home e modal Cadastrar Horas).

## Rastreabilidade com as histórias de usuário

| História | Tela / componente principal | Rota | Endpoint da API |
|---|---|---|---|
| US01 — Cadastro do aluno | `CadastroPage` | `/cadastro` | `POST /users` |
| US02 — Login do aluno | `LoginPage` | `/login` | `POST /login` |
| US03 — Cadastro da empresa | `CadastroEmpresaPage` | `/cadastro-empresa` | `POST /company`, `GET /company` |
| US04 — Registro de horas do dia | `CadastrarHorasModal` (dentro da Home) | `/` | `POST /schedule` |
| US05 — Visualização do valor já ganho | `HomePage` (cards + calendário) | `/` | `GET /schedule`, `GET /earnings` |

## Como rodar o projeto

### 1. Backend

O front depende do backend `my-money` rodando localmente:

```bash
# na pasta do backend my-money
npm install
npm run dev
```

Por padrão ele escuta em `http://localhost:3333` e imprime `🚀 Server running on
http://localhost:3333` quando sobe. Confirme a porta no `.env` do backend caso tenha mudado.

> ⚠️ O backend, no estado atual, **não tem middleware de CORS configurado**. Chamadas feitas
> diretamente para `http://localhost:3333` a partir do front (`http://localhost:5173`) são
> bloqueadas pelo navegador. Por isso o front usa o proxy de desenvolvimento descrito abaixo.

### 2. Frontend

```bash
cp .env.example .env
npm install
npm run dev
```

O app sobe em `http://localhost:5173`.

O `.env` já vem configurado com:

```
VITE_API_URL=/api
```

Isso faz as chamadas passarem pelo proxy do Vite (`vite.config.js` →
`server.proxy['/api'] → http://localhost:3333`), que reencaminha para o backend sem passar
pelo bloqueio de CORS do navegador. Se preferir apontar direto para o backend (ex.: backend
com CORS já liberado), troque para `VITE_API_URL=http://localhost:3333` e reinicie o `npm run
dev` (o Vite só lê o `.env` na inicialização).

### 3. Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Sobe o servidor de desenvolvimento (Vite) |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | Roda o ESLint |

## Fluxo completo das telas

### 1. Cadastro — `/cadastro` (`src/features/auth/CadastroPage.jsx`)

Formulário com nome, matrícula e senha, validado com `zod` (`cadastroSchema` em
`src/utils/validation.js`) antes de chamar `POST /users`. Em caso de sucesso, a página loga
automaticamente o aluno (`POST /login` com as mesmas credenciais, já que o cadastro não
retorna token) e segue para `/cadastro-empresa`; se o login automático falhar por algum
motivo, redireciona para `/login`. Matrícula duplicada (`409`) e campos obrigatórios exibem a
mensagem de erro devolvida pela API (via `getErrorMessage`).

### 2. Login — `/login` (`src/features/auth/LoginPage.jsx`)

Formulário com matrícula e senha (`loginSchema`), chamando `POST /login`. Credenciais
inválidas (`401`) mostram mensagem genérica sem sair da tela. No sucesso, o token e os dados
do usuário são salvos (via `AuthProvider`) e a página consulta `GET /company`: se `404`
(aluno ainda sem empresa), vai para `/cadastro-empresa`; caso contrário, para a Home (`/`).

### 3. Cadastro/consulta da empresa — `/cadastro-empresa` (`src/features/company/CadastroEmpresaPage.jsx`)

Rota protegida. Ao entrar, chama `GET /company`:
- **`404`** → mostra o formulário (`nome_empresa`, `observacoes`, `transporte` via
  `RadioGroup` Sim/Não) e, no envio, chama `POST /company`. Sucesso leva para a Home; `409`
  ("aluno já tem empresa") apenas redireciona para a Home em vez de mostrar erro.
- **`200`** → como a API não expõe edição de empresa, a tela mostra os dados salvos em modo
  somente leitura, com um botão para ir à Home.

### 4. Home — `/` (`src/features/hours/HomePage.jsx`)

Rota protegida, ponto central do app depois do onboarding. Busca em paralelo (via React
Query): `GET /company` (flag `transporte`), `GET /schedule` (lista completa de lançamentos) e
`GET /earnings` (total geral acumulado). Renderiza:
- **Calendário** (`Calendar.jsx`) navegável por mês/ano, com os dias já lançados marcados e
  desabilitados (evita tentar lançar duas vezes no mesmo dia, que a API recusaria com `409`).
- **Card do mês selecionado**: horas, dias e valor faturado *apenas no mês exibido*,
  calculados no cliente (`calculateMonthSummary`, em `src/utils/earnings.js`) a partir da
  lista de `GET /schedule` — ver seção "Cálculo de ganhos" abaixo.
- **Card do total geral**: horas, dias e valor de todo o histórico, vindos diretamente de
  `GET /earnings` (sem recomputar nada no cliente).
- Clicar em um dia livre do calendário abre o modal de cadastro de horas.

### 5. Cadastrar Horas (modal) (`src/features/hours/CadastrarHorasModal.jsx`)

Aberto a partir de um dia do calendário. Campo único de horas, validado no cliente com
`0 < horas <= 24` (`horasSchema`), chamando `POST /schedule` com `dia_cadastrado` (formatado
como `YYYY-MM-DD`) e `horas_cadastradas_dia`. Em sucesso, invalida as queries `schedules` e
`earnings` do React Query — a Home atualiza os cards e o calendário sem reload manual. Em
`409` (dia já lançado), mostra o erro no próprio campo em vez de um toast genérico.

## Arquitetura e estrutura de pastas

```
src/
  assets/
  components/        # UI genérica e reutilizável, sem regra de negócio
    AuthLayout.jsx     # layout de duas colunas (formulário + ilustração) usado em Cadastro/Login/Empresa
    Button.jsx         # botão com variantes primary (verde) / accent (laranja) e estado de loading
    Card.jsx           # cartão com borda usado na Home
    PrototypeIllustration.jsx # <img> das ilustrações reais exportadas do Figma (public/img_*.svg)
    Input.jsx / TextArea.jsx # campos de formulário com label e mensagem de erro
    Modal.jsx          # modal genérico (Cadastrar Horas), fecha em Esc/clique fora
    RadioGroup.jsx      # grupo Sim/Não usado no campo `transporte`
    StripesDecoration.jsx # faixas diagonais decorativas do rodapé das telas de auth
  features/
    auth/
      AuthProvider.jsx  # contexto de sessão: guarda token/user, persiste em localStorage,
                         # decodifica o JWT (jwt-decode) e agenda o logout automático no exp
      authContext.js     # objeto de contexto isolado (exigência do Fast Refresh do Vite)
      useAuth.js          # hook de acesso ao AuthContext
      CadastroPage.jsx / LoginPage.jsx
    company/
      CadastroEmpresaPage.jsx
    hours/
      HomePage.jsx
      Calendar.jsx        # calendário custom (não usa lib externa, ver "Decisões técnicas")
      CadastrarHorasModal.jsx
  hooks/
    useCompany.js / useSchedules.js / useEarnings.js  # wrappers finos de useQuery (React Query)
                                                          # por cima dos services
  services/
    http.js             # instância axios única: baseURL = VITE_API_URL, interceptor de
                         # request (anexa Authorization) e de response (401 → logout automático)
    authService.js       # register(), login()
    companyService.js    # getCompany(), createCompany()
    scheduleService.js   # listSchedules(), createSchedule()
    earningsService.js   # getEarnings()
  routes/
    AppRoutes.jsx        # declaração de todas as rotas
    PrivateRoute.jsx      # guarda de rota: sem sessão válida → redireciona para /login
  utils/
    validation.js         # schemas zod espelhando as regras de negócio da API
    date.js                # parseApiDate/toApiDateString — evita bug de fuso horário nas datas
    earnings.js             # cálculo do resumo mensal (HOURLY_RATE, TRANSPORT_ALLOWANCE)
    currency.js              # formatação de moeda (Intl.NumberFormat, pt-BR/BRL)
    errorMessage.js           # extrai mensagem de erro da API ou erro de rede
```

Regra geral: **componentes de tela nunca chamam `axios`/`fetch` diretamente** — sempre passam
pelos arquivos em `services/`, e o estado de servidor (loading/erro/cache) sempre passa pelos
hooks em `hooks/` com React Query.

## Integração com a API

Contrato completo (rotas, campos, respostas e erros) documentado em detalhe no
[`PROMPT_DESENVOLVIMENTO.md`](PROMPT_DESENVOLVIMENTO.md). Resumo:

| Método | Rota | Auth | Usado em |
|---|---|---|---|
| `POST` | `/users` | não | Cadastro |
| `POST` | `/login` | não | Login |
| `POST` | `/company` | 🔒 | Cadastro da empresa |
| `GET` | `/company` | 🔒 | Cadastro/consulta da empresa, Home (flag `transporte`) |
| `POST` | `/schedule` | 🔒 | Modal Cadastrar Horas |
| `GET` | `/schedule` | 🔒 | Home (calendário e card do mês) |
| `GET` | `/earnings` | 🔒 | Home (card do total geral) |

O token JWT (`Authorization: Bearer <token>`) é anexado automaticamente pelo interceptor de
`src/services/http.js` em toda rota exceto `POST /users` e `POST /login`. Um `401` em rota
autenticada limpa a sessão salva e redireciona para `/login` — cada aluno só vê seus próprios
dados porque o backend filtra tudo por `user_id` extraído do token, o front não faz nenhum
filtro manual por usuário.

### Cálculo de ganhos

`GET /earnings` só devolve o total acumulado geral, sem filtro por mês (isso é explicitamente
fora do escopo do backend atual). Por isso, o valor exibido para o **mês selecionado no
calendário** é calculado no cliente (`src/utils/earnings.js`), filtrando `GET /schedule` pelo
mês/ano exibidos e aplicando a mesma fórmula do backend:

```
ganho_do_dia = horas_cadastradas_dia * 5.33 + (transporte ? 10.80 : 0)
```

com `transporte` vindo da empresa cadastrada (`GET /company`) e o total arredondado em 2
casas decimais, igual ao backend.

## Regras de negócio implementadas no front

- Todos os campos obrigatórios (nome, matrícula, senha, nome da empresa) são validados antes
  do envio, com mensagem por campo (`react-hook-form` + `zod`).
- Horas do dia: `0 < horas <= 24`, mesma regra do backend, validada no cliente antes da
  chamada e reforçada pela resposta da API.
- Um mesmo dia não pode ter dois lançamentos: o calendário desabilita dias já lançados, e um
  eventual `409` da API é tratado com mensagem específica no campo.
- Sessão: só usuários autenticados acessam `/cadastro-empresa` e `/` (`PrivateRoute`); token
  expirado ou ausente sempre redireciona para `/login`.
- A empresa é única por aluno; a tela de cadastro vira automaticamente consulta somente
  leitura quando já existe (a API não tem endpoint de edição).

## Decisões técnicas

- **Roteamento**: `react-router-dom`, com `PrivateRoute` (componente com `<Outlet />`)
  protegendo `/cadastro-empresa` e `/`.
- **Formulários e validação**: `react-hook-form` + `zod` (`@hookform/resolvers`), espelhando
  as regras do backend no client antes de chamar a API.
- **Estado do servidor**: `@tanstack/react-query` para `GET /company`, `GET /schedule` e
  `GET /earnings` (loading/erro/refetch automático). Após `POST /schedule`, as queries
  `schedules` e `earnings` são invalidadas para atualizar a Home sem reload manual.
- **Sessão**: Context API (`AuthProvider` + hook `useAuth`) guardando `token`/`user`, com
  persistência em `localStorage`. `jwt-decode` lê o `exp` do token para agendar o logout
  automático no instante da expiração (sem refresh token, já que o JWT expira em 1 dia).
- **HTTP**: instância única do `axios` em `src/services/http.js`, com interceptors de request
  (token) e response (`401` → logout). Um serviço por recurso — as telas nunca chamam
  `axios`/`fetch` diretamente.
- **Erros**: `src/utils/errorMessage.js` centraliza a leitura de `error.response.data.message`
  (com fallback genérico) e distingue erro de negócio (400/401/404/409) de erro de rede
  (backend fora do ar ou bloqueado por CORS).
- **Cálculo do mês selecionado**: ver seção "Cálculo de ganhos" acima.
- **Calendário**: implementado como componente próprio (`Calendar.jsx`) em vez de uma lib de
  calendário, para reproduzir com precisão o layout customizado do protótipo (seletores de
  mês/ano + setas + dias já lançados marcados/desabilitados).
- **Estilização**: Tailwind CSS v4 (`@tailwindcss/vite`), com a paleta e tipografia do Figma
  centralizadas em tokens `@theme` em `src/index.css` (`--color-primary`, `--color-accent`,
  `--color-blob`, fontes `Poppins`/`Inter`).
- **Ícones**: `lucide-react`. **Notificações**: `sonner` (toasts de sucesso/erro).

### Fidelidade ao protótipo Figma e desvios intencionais

O link do Figma é uma SPA que não pôde ser renderizada por ferramentas automáticas de leitura
de página (exige login/JS), então a réplica foi feita a partir de capturas de tela das 5
telas (Cadastro, Cad_Empresa, Login, Home, modal). Cores, tipografia, espaçamentos, textos de
labels/botões e componentes seguem fielmente o que está nas imagens. Dois pontos foram
deliberadamente adaptados, documentados aqui para transparência:

1. **Ilustrações**: inicialmente recriadas de forma abstrata, pois a arte original não pôde
   ser exportada a partir de screenshots estáticos. Depois substituídas pelos arquivos SVG
   reais exportados do Figma (`public/img_login.svg`, `img_cad.svg`, `img_emp.svg`),
   renderizados via `PrototypeIllustration`. O painel de ilustração deixou de ter o fundo
   verde sólido (`bg-blob`) — os próprios SVGs exportados já trazem sua composição de cores
   completa, então o painel agora é branco, igual ao restante da tela.
2. **Card "Falta X horas para o fim do estágio" (Home)**: o protótipo mostra um valor fixo
   sem lastro em nenhum endpoint da API (não existe conceito de meta de horas do estágio no
   backend). Como a especificação proíbe dados fake, esse card foi mantido visualmente (mesma
   posição, borda e estilo) mas com conteúdo real: o total geral vindo de `GET /earnings`. O
   texto do calendário (dias da semana/meses) também foi traduzido para português.

## Limitações conhecidas (herdadas do backend)

- Sem recuperação de senha.
- Sem edição/remoção de lançamentos de horas.
- Sem edição dos dados da empresa depois de cadastrada.
- Sem endpoint de ganhos filtrado por mês (contornado no cliente, ver "Cálculo de ganhos").
- Backend sem CORS configurado nativamente (contornado pelo proxy do Vite em desenvolvimento;
  em produção o backend precisará liberar CORS para o domínio do front).

## Outros documentos

- [`PROMPT_DESENVOLVIMENTO.md`](PROMPT_DESENVOLVIMENTO.md) — prompt original usado para gerar
  este projeto, com o contrato completo da API e as sugestões de bibliotecas.
- [`docs/USO_DE_IA.md`](docs/USO_DE_IA.md) — como a IA foi usada no desenvolvimento deste
  sistema.
