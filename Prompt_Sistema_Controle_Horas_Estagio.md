# Prompt para desenvolvimento — Sistema de Controle de Horas de Estágio

Este documento contém (1) um prompt pronto para colar em uma IA de código (Claude, Cursor, etc.) e (2) as
sugestões de bibliotecas/decisões técnicas que já estão refletidas nesse prompt, explicadas para você.

O projeto `my-money-frontend` já está inicializado com **React 19 + Vite 8 (JavaScript)**, então o prompt
abaixo assume esse ponto de partida. Ele foi atualizado para consumir a API real do backend `my-money`
(Node/Express/TypeScript/MongoDB, documentada em `docs/API.md` desse projeto) em vez de simular dados no
navegador — os endpoints, campos e regras abaixo refletem exatamente o que essa API espera e devolve.

---

## Como usar

Copie todo o bloco da seção **"PROMPT"** abaixo e cole em uma nova conversa com a IA que vai gerar o
código (pode ser aqui mesmo, no Cursor, no Claude Code, etc.), dentro da pasta do projeto. Ajuste o que
achar necessário antes de enviar — em especial a paleta de cores, que extraí visualmente do Figma (o
Dev Mode do arquivo está bloqueado por ser de uma equipe com plano restrito, então os tons exatos devem
ser conferidos lá).

---

## PROMPT

```
Você vai desenvolver o front-end de um Sistema de Controle de Horas de Estágio em React 19 + JavaScript
(sem TypeScript), usando Vite. O projeto já existe na pasta atual (package.json com react, react-dom,
vite, eslint configurados) — construa em cima dele.

CONTEXTO DO SISTEMA
Sistema onde o ator "Aluno" se cadastra, faz login, cadastra os dados da empresa em que estagia e registra
diariamente as horas trabalhadas. A Home mostra um calendário, o total de horas, o valor já acumulado
(horas x valor da hora, que é fixo e definido pelo backend, sem edição pelo aluno) e quanto falta para
o fim do estágio. Este front-end consome uma API REST já pronta (projeto separado `my-money`,
Node/Express + MongoDB) — não crie nenhum backend, mock de API ou persistência local para os dados de
negócio; todos os dados vêm e voltam pela API descrita abaixo.

REFERÊNCIA VISUAL
Protótipo no Figma: https://www.figma.com/design/C9CstLh1pYyIxNoHjaas3q/Untitled?node-id=0-1
Ele contém as telas: Cadastro, Cad_Empresa, Login, Home e o modal "Cadastrar Horas". Siga a descrição
visual detalhada abaixo (extraída do protótipo); confira cores exatas no Figma antes de finalizar.

API BACKEND (my-money)
Base URL: `http://localhost:<PORT>` — sem prefixo `/api`. Configure em uma variável de ambiente do Vite,
`VITE_API_URL`, e use-a como `baseURL` de uma instância axios única (não hardcode a URL nos componentes).
Todo body é `application/json`.

Autenticação: rotas protegidas exigem header `Authorization: Bearer <token>`. O token é devolvido por
`POST /login` e deve ser guardado (ex.: localStorage) só para persistir a sessão entre reloads — isso não
é "mock de dados", é armazenamento do token de uma API real. Um interceptor do axios deve anexar esse
header automaticamente em toda chamada autenticada, e tratar `401` deslogando o usuário e redirecionando
para /login.

Formato de erro da API: `{ "message": "descrição do erro" }` — use essa mensagem diretamente na UI
(toast ou campo, conforme o caso) em vez de reescrevê-la.

Endpoints:
| Método | Rota | Auth | Body | Sucesso | Erros |
|---|---|---|---|---|---|
| POST | /users | não | `{ nome, matricula, senha }` | `201 { id, nome, matricula, created_at }` | `400` campo faltando, `409` matrícula já cadastrada |
| POST | /login | não | `{ matricula, senha }` | `200 { token, user: { id, nome, matricula } }` | `400` campo faltando, `401` matrícula/senha incorretos |
| POST | /company | sim | `{ nome_empresa, observacoes?, transporte? }` | `201 { id, user_id, nome_empresa, observacoes, transporte, created_at }` | `400` falta nome_empresa, `401`, `409` usuário já tem empresa |
| GET | /company | sim | — | `200 { id, user_id, nome_empresa, observacoes, transporte, created_at }` | `401`, `404` empresa não encontrada |
| POST | /schedule | sim | `{ dia_cadastrado: "YYYY-MM-DD", horas_cadastradas_dia: number }` | `201 { id, user_id, dia_cadastrado, horas_cadastradas_dia }` | `400` data inválida ou horas fora de `0 < h <= 24`, `401`, `409` já existe registro nesse dia |
| GET | /schedule | sim | — | `200` array de `{ id, user_id, dia_cadastrado, horas_cadastradas_dia }` | `401` |
| GET | /earnings | sim | — | `200 { total_horas, total_dias, transporte, valor_horas, valor_transporte, total }` | `401` |

Importante sobre `/earnings`: o valor da hora (`HOURLY_RATE = 5.33`) e o adicional de transporte
(`TRANSPORT_ALLOWANCE = 10.8`/dia, só se a empresa tiver `transporte: true`) são calculados no backend —
não recalcule nem deixe o valor da hora editável no front. Porém esse endpoint retorna apenas o total
geral, sem filtrar por mês. Para o card "No Mês X você faturou" (US05, critério 4), busque `GET /schedule`
(lista completa), filtre os registros do mês exibido no calendário e calcule o valor mensal no front com
a mesma fórmula (`horas do mês * 5.33`, mantendo essas constantes centralizadas em um único arquivo de
config para facilitar ajuste caso a API mude). Use `GET /earnings` para o total geral/acumulado.

Não há endpoint para a carga horária total do estágio (usada na faixa "Falta X horas para o fim do
estágio") — trate isso como uma constante de configuração no front (ver seção final do prompt).

CORS: o backend atual não tem middleware de CORS habilitado. Se ao integrar o navegador bloquear as
chamadas por CORS, configure um proxy de desenvolvimento em `vite.config.js` (`server.proxy` apontando
`/` ou um prefixo para a `VITE_API_URL`) ou peça para habilitar `cors` no backend — não contorne isso
desabilitando segurança do navegador.

TELAS E LAYOUT

1) Cadastro (rota /cadastro) — tela "Crie seu usuário"
   - Título "Crie seu usuário" em laranja.
   - Campos: Nome, Matrícula, Senha (inputs empilhados, largura ~60% à esquerda).
   - Botão "Cadastrar" (verde, sólido, cantos arredondados).
   - Divisor "ou".
   - Botão "Login" (laranja) que leva para /login.
   - Ilustração de um estudante com notebook do lado direito.
   - Faixa decorativa diagonal verde/laranja no rodapé da tela.

2) Cad_Empresa (rota /cadastro-empresa) — tela "Fale um pouco sobre sua empresa"
   - Título "Fale um pouco sobre sua empresa" em laranja.
   - Campos: "Nome da empresa" (input) e "Fale um pouco sobre o que você faz" (textarea).
   - Pergunta "A empresa oferece vale-transporte?" com radio buttons Sim/Não.
   - Botão "Enviar" (verde).
   - Ilustração de quebra-cabeça/ícones do lado direito.
   - Mesma faixa decorativa diagonal no rodapé.

3) Login (rota /login)
   - Título "Login" em laranja.
   - Campos: "Nome ou Matrícula" e "Senha".
   - Botão "Login" (verde).
   - Divisor "ou".
   - Botão "Cadastrar" (laranja) levando para /cadastro.
   - Ilustração de grupo de pessoas comemorando do lado direito.
   - Mesma faixa decorativa diagonal no rodapé.

4) Home (rota /home, protegida — exige autenticação)
   - Saudação no topo: "Bem vindo, {nome do aluno} de {nome da empresa}."
   - Calendário mensal à esquerda: navegação por mês/ano (setas + seletor), grid de dias da semana,
     dia selecionado destacado com fundo escuro/preenchido. Ao clicar num dia, abre o modal "Cadastrar
     Horas" para aquela data.
   - Card à direita (borda verde arredondada): ícone de moeda, texto "No Mês {mês} você faturou" e o
     valor em destaque, ex. "R$ 650,09". Esse valor é referente apenas ao mês visualizado no calendário.
   - Faixa horizontal com borda verde abaixo do calendário: "Falta {X} horas para o fim do estágio"
     (X = horas restantes até a carga horária total do estágio).
   - Botão "Sair" (laranja) abaixo do card de valor, faz logout e volta para /login.

5) Modal "Cadastrar Horas" (aberto a partir da Home)
   - Título "Cadastrar Horas" e botão de fechar (x) no canto.
   - Campo numérico único para a quantidade de horas do dia selecionado.
   - Botão "Concluir" (laranja) que salva o registro e fecha o modal.

PALETA (aproximada — confirmar no Figma)
- Verde principal (botões primários, bordas de destaque): ~#1B7A5D
- Laranja (botões secundários/CTA, títulos): ~#F2871A
- Verde-menta claro (fundos de ilustração): ~#D6F5E3
- Fundo geral: branco
- Texto padrão: cinza-escuro/quase preto

HISTÓRIAS DE USUÁRIO, CRITÉRIOS DE ACEITE E REGRAS DE NEGÓCIO

US01 — Cadastro do aluno (RF01, RF02, RF03)
Como aluno, devo poder me cadastrar informando nome, matrícula e senha.
- Envie `POST /users` com `{ nome, matricula, senha }`. Sucesso (`201`) cria a conta e permite login em
  seguida.
- Campo obrigatório vazio: valide no front antes de enviar (impede o envio e sinaliza o(s) campo(s)
  pendente(s)); a API também responde `400` se algo passar sem validação local.
- Matrícula já existente: a API responde `409` — exiba a mensagem recebida (ex.: "matrícula já está em
  uso") sem reescrevê-la.
- Cadastro concluído: direciona para o cadastro da empresa.
- Regra: matrícula é única (garantida pela API — `409`).
- Regra: a senha nunca é tratada como texto puro no front (não logue, não guarde em estado global além
  do necessário para o submit); o hashing é feito pelo backend (bcrypt), não implemente hashing no front.

US02 — Login do aluno (RF05, RF06)
Como aluno, devo poder logar com matrícula e senha.
- Envie `POST /login` com `{ matricula, senha }`. Sucesso (`200`) retorna `{ token, user }` — guarde o
  token (ex.: localStorage) e os dados de `user` no AuthContext, e redirecione para Home.
- Credenciais incorretas: API responde `401` — mostre a mensagem recebida, permanece no login.
- Autenticado, a Home busca e mostra somente os dados do próprio aluno (o `user_id` vem do token no
  backend, então `GET /company`, `GET /schedule` e `GET /earnings` já retornam só os dados dele).
- Não autenticado tentando acessar qualquer rota além de /cadastro e /login: redireciona para /login
  (implemente rota protegida / PrivateRoute checando se há token válido no AuthContext); qualquer chamada
  à API que responda `401` também deve disparar esse logout/redirect.

US03 — Cadastro dos dados da empresa (RF04, RF29)
Como aluno, devo poder cadastrar os dados da empresa onde estagio.
- Envie `POST /company` (autenticado) com `{ nome_empresa, observacoes?, transporte? }` — mapeie o campo
  "Nome da empresa" para `nome_empresa`, "Fale um pouco sobre o que você faz" para `observacoes`, e o
  radio Sim/Não de vale-transporte para o boolean `transporte`.
- Campo obrigatório vazio (`nome_empresa`): valide no front; a API responde `400` se faltar.
- Ao entrar na tela (ou no fluxo pós-cadastro), chame `GET /company`: se vier `200`, preencha o formulário
  com os dados existentes (modo consulta/edição); se vier `404`, mantenha o formulário vazio para
  cadastro inicial.
- Usuário que tentar cadastrar empresa de novo enquanto já tem uma recebe `409` da API — trate como
  "você já tem uma empresa cadastrada" e direcione para a visualização/edição em vez de duplicar.
- Regra: dados da empresa pertencem exclusivamente ao aluno autenticado (garantido pelo backend via token).

US04 — Registro de horas trabalhadas no dia (RF09, RF10, RF11, RF12, RF18)
Como aluno, devo poder registrar as horas trabalhadas em um dia específico.
- Selecionar uma data no calendário abre o modal "Cadastrar Horas"; ao confirmar, envie `POST /schedule`
  com `{ dia_cadastrado: "YYYY-MM-DD", horas_cadastradas_dia: number }`.
- Horas vazias, negativas ou fora do intervalo permitido pela API (`0 < horas <= 24`): valide isso no
  front antes de enviar E trate o `400` da API como rede de segurança, exibindo o motivo.
- A API não permite dois registros no mesmo dia para o mesmo aluno (`409`) — não existe endpoint de
  edição/PUT no backend atual. Portanto: carregue `GET /schedule` ao entrar na Home, marque no calendário
  os dias que já têm registro, e ao clicar num dia já registrado mostre a hora já lançada em modo
  leitura (ou um aviso "já registrado") em vez de deixar tentar salvar de novo e estourar `409`.
- Após salvar com sucesso (`201`), recarregue `GET /schedule` e `GET /earnings` (ou atualize o estado
  local com o novo registro) para refletir automaticamente o novo total de horas, horas restantes e
  valor acumulado, sem precisar recarregar a página.
- Regra: nenhum registro inválido é persistido (a API rejeita antes de gravar).

US05 — Visualização do valor total já ganho (RF14, RF15, RF16, RF17, RF30)
Como aluno, devo poder ver quanto já ganhei.
- Valor acumulado total: `GET /earnings` já retorna `total` pronto (horas x `HOURLY_RATE` + transporte,
  se aplicável) — exiba direto, sem recalcular o total geral no front.
- Sem nenhum registro de horas: `total_horas` e `total` vêm zerados da API — exiba R$ 0,00.
- Novo registro confirmado: refaça a chamada a `GET /earnings` (e `GET /schedule`) para atualizar o
  valor acumulado automaticamente na Home.
- Ao navegar para um mês específico no calendário, calcule o valor daquele mês no front (ver seção "API
  BACKEND" acima sobre a limitação do `/earnings` não ser filtrável por mês) a partir dos registros de
  `GET /schedule` daquele mês, usando a mesma taxa de R$ 5,33/hora.
- Regra: o valor da hora não é editável pelo aluno em nenhuma tela — é uma constante do backend.

STACK E DECISÕES TÉCNICAS (siga estas escolhas)
- React 19 + Vite (JavaScript puro, sem TypeScript).
- Roteamento: react-router-dom (rotas /cadastro, /cadastro-empresa, /login, /home; PrivateRoute para
  /home e /cadastro-empresa).
- Formulários e validação: react-hook-form + zod (via @hookform/resolvers) para os 3 formulários
  (Cadastro, Login, Cadastro de Empresa) e para o modal de horas.
- Estado global de autenticação/estágio: Context API (AuthContext) + useReducer — dispensa Redux para
  esse escopo.
- Estilização: Tailwind CSS, com uma paleta customizada (`tailwind.config.js`) mapeando as cores
  verde/laranja acima como `primary`/`secondary`.
- HTTP: axios, com uma única instância configurada em `services/api.js` (`baseURL: import.meta.env.VITE_API_URL`)
  e um interceptor de request que injeta `Authorization: Bearer <token>` quando houver sessão, e um
  interceptor de response que trata `401` global (logout + redirect para /login). Nenhuma URL da API deve
  ser hardcoded fora desse arquivo.
- Camada de dados: crie uma camada `services/` com funções assíncronas por recurso da API
  (`authService.js`, `companyService.js`, `scheduleService.js`, `earningsService.js`), cada uma só
  chamando os endpoints do backend `my-money` descritos na seção "API BACKEND". Os componentes nunca
  chamam axios diretamente, só essas funções.
- Sessão: guarde o token de `/login` em localStorage só para persistir a sessão entre reloads (chave
  única, ex. `@controle-horas:token`), lido/escrito por um único módulo (`services/authStorage.js`), e
  restaure o AuthContext a partir dele no boot da aplicação.
- Datas: date-fns para cálculos de mês/soma de horas por período (o campo `dia_cadastrado` da API é uma
  string `YYYY-MM-DD` — normalize com date-fns/`Date` ao comparar com o calendário, cuidado com fuso
  horário já que a API normaliza para início do dia em UTC).
- Calendário: implemente um componente de calendário customizado (grid de dias por mês, navegação de
  mês/ano, destaque do dia selecionado) usando date-fns para gerar os dias — não é necessário uma lib
  de calendário completa, dado o design simples do protótipo.
- Ícones: lucide-react.
- Feedback de erros de formulário: inline, abaixo de cada campo (conforme os critérios de aceite que
  pedem "indicar o(s) campo(s) pendente(s)"); use react-hot-toast para as mensagens de erro que vêm da
  API e não são de campo específico (ex.: "matrícula já está em uso", "dados de acesso inválidos"),
  reaproveitando o `message` retornado por ela.
- Formatação de moeda: Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }) — sem lib extra.
- Testes: Vitest + React Testing Library (cobrir pelo menos os cálculos de horas/valor e as validações
  de formulário).

ESTRUTURA DE PASTAS ESPERADA
src/
  assets/            -> ilustrações/ícones exportados do Figma
  components/
    common/          -> Button, Input, TextArea, RadioGroup, Modal, Card
    layout/          -> DecorativeFooter (faixa diagonal), AuthLayout (estrutura das telas de auth)
    calendar/        -> CalendarView, CalendarDay
  contexts/          -> AuthContext.jsx
  hooks/             -> useAuth.js, useSchedule.js, useCompany.js, useEarnings.js
  pages/
    Cadastro/
    Login/
    CadastroEmpresa/
    Home/
  routes/            -> AppRoutes.jsx, PrivateRoute.jsx
  services/          -> api.js, authService.js, companyService.js, scheduleService.js,
                         earningsService.js, authStorage.js
  utils/             -> validators.js (schemas zod), formatters.js, dateHelpers.js, config.js
  App.jsx
  main.jsx

O QUE ENTREGAR
1. Configuração do Tailwind no projeto Vite existente, e um `.env.example` com `VITE_API_URL`.
2. Todas as rotas e páginas listadas, com os formulários validados conforme os critérios de aceite de
   cada história (mensagens de erro específicas para cada regra descrita), integradas de ponta a ponta
   com a API `my-money` (sem mocks, sem dados fixos além dos de UI/loading state).
3. AuthContext com login/logout/cadastro consumindo `authService`, restaurando sessão do token salvo, e
   proteção de rotas (PrivateRoute) que também reage a respostas `401` de qualquer chamada.
4. Calendário funcional na Home com seleção de dia, abertura do modal de horas, marcação visual dos dias
   já registrados (via `GET /schedule`), e recálculo automático de total de horas, horas restantes e
   valor acumulado (total via `GET /earnings`, mensal calculado no front) após cada novo registro.
5. Tratamento explícito de todos os status de erro documentados por endpoint (400/401/404/409), sempre
   reaproveitando a mensagem vinda da API quando ela existir.
6. Componentização fiel ao layout descrito (cores, botões arredondados, faixa decorativa diagonal nas
   telas de autenticação, cards com borda verde na Home).
7. Um README curto explicando como rodar o projeto (incluindo subir o backend `my-money` em paralelo,
   configurar `VITE_API_URL` e, se necessário, o proxy de CORS).

Comece perguntando se eu já tenho o backend `my-money` rodando localmente e em qual porta, para você
preencher o `VITE_API_URL` correto, e qual carga horária total do estágio devo usar como constante para
o cálculo de "horas restantes" (a API não expõe esse valor); se eu não informar, use 300 horas como
padrão, deixando fácil de alterar em `utils/config.js`.
```

---

## Sugestões de bibliotecas (resumo e por quê)

**Roteamento — react-router-dom.** Padrão de mercado para SPAs em React, compatível com React 19,
necessário para as rotas de cadastro/login/home e para proteger a Home de acesso não autenticado (US02,
critério 4).

**Formulários — react-hook-form + zod.** Os cinco critérios de aceite mais recorrentes no seu documento
são validações de campo obrigatório, formato e regras de negócio (matrícula única, horas negativas,
limite diário etc.). react-hook-form evita re-renders desnecessários e zod permite declarar essas regras
como schemas reutilizáveis e testáveis.

**Estado global — Context API + useReducer.** O escopo é pequeno (usuário logado, dados da empresa,
registros de horas). Redux ou Zustand seriam over-engineering aqui; Context já resolve.

**Estilização — Tailwind CSS.** O layout do Figma é simples e orientado a utilitários (botões sólidos,
cards com borda, espaçamento consistente) — Tailwind é rápido de mapear 1:1 com esse tipo de design e
já é comum em projetos Vite + React.

**HTTP — axios com instância única + interceptors.** Agora que o backend `my-money` existe de verdade,
todo dado (usuário, empresa, horas, ganhos) vem da API — axios com uma instância central em `services/api.js`
evita repetir `baseURL`/headers em cada chamada, e o interceptor de `401` centraliza o "desloga se o
token expirou/for inválido" em um único lugar. O localStorage entra só para guardar o token entre reloads,
não para simular dados de negócio.

**Datas — date-fns.** Necessário para os cálculos "horas do mês selecionado" (US05, critério 4) e
navegação de mês no calendário.

**Ícones — lucide-react.** Combina com o estilo de linha simples usado no ícone de moeda do card de
valor.

**Notificações — react-hot-toast.** Só para mensagens que não pertencem a um campo específico (ex.:
"matrícula já está em uso"); erros de campo devem aparecer inline, como os critérios de aceite pedem.

**Testes — Vitest + React Testing Library.** Já vem alinhado ao Vite; vale cobrir pelo menos o cálculo de
valor acumulado/mensal e as validações de horas, que são as regras mais sensíveis a bugs.

---

## Observação sobre o Figma

O arquivo está em uma equipe com Dev Mode bloqueado (plano restrito), então não consegui extrair tokens
de cor exatos, apenas a aparência visual das 5 telas (Cadastro, Cad_Empresa, Login, Home, modal Cadastrar
Horas). As cores no prompt são aproximações visuais — vale abrir o arquivo e conferir os hex exatos antes
de fechar a paleta final.
