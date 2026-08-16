# Uso de IA no desenvolvimento do sistema

Este documento descreve, de forma transparente, como ferramentas de Inteligência Artificial
foram usadas na construção do `my-money-frontend`, desde a análise dos requisitos até a
depuração de problemas em produção local. O objetivo é deixar claro o que foi gerado/assistido
por IA e o que foi decisão humana.

## Resumo do processo

| Etapa | O que foi feito | Ferramenta de IA | Saída |
|---|---|---|---|
| 1. Análise dos requisitos | Leitura do documento "Histórias de Usuário — Controle de Horas de Estágio" (PDF) e extração das 5 histórias (US01–US05), critérios de aceite e regras de negócio | Claude (Cowork) | Entendimento estruturado do escopo, sem arquivo próprio |
| 2. Geração do prompt de desenvolvimento | A partir das histórias de usuário e do link do Figma do protótipo, geração de um prompt estruturado para orientar a construção do sistema, com sugestão de bibliotecas | Claude (Cowork) | [`PROMPT_DESENVOLVIMENTO.md`](../PROMPT_DESENVOLVIMENTO.md) (v1) |
| 3. Integração com a API real | Leitura do `docs/API.md` e `docs/SPEC.md` do backend `my-money` (já implementado) e reescrita do prompt para consumir a API real (contrato de endpoints, autenticação JWT, tratamento de erros, cálculo de ganhos mensal no cliente, alerta de CORS) em vez de dados mockados | Claude (Cowork) | `PROMPT_DESENVOLVIMENTO.md` (v2, versão final) |
| 4. Geração do código do frontend | O prompt gerado na etapa 3 foi utilizado em uma ferramenta de codificação com IA para implementar o projeto completo: componentes, páginas por história de usuário, serviços de acesso à API, hooks de dados, rotas protegidas, validações e estilização conforme o protótipo do Figma | Ferramenta de codificação com IA (assistente de código a partir do prompt) | Todo o conteúdo de `src/`, `README.md` inicial, `.env.example` |
| 5. Diagnóstico e correção de bug de conectividade | Investigação do erro "Não foi possível conectar ao servidor": leitura do código do front (`http.js`, `errorMessage.js`), do backend (ausência de middleware `cors`) e da configuração de proxy já existente no `vite.config.js`; criação do `.env` do front apontando para o proxy (`VITE_API_URL=/api`) | Claude (Cowork) | Arquivo `.env` criado/corrigido |
| 6. Documentação final | Reescrita do `README.md` com explicação completa do frontend (telas, arquitetura, integração com API, regras de negócio, decisões técnicas) e criação deste documento | Claude (Cowork) | `README.md` (versão completa) e este arquivo |

## Detalhamento por etapa

### 1–2. Da especificação ao prompt de desenvolvimento

O ponto de partida foi um PDF de histórias de usuário (ator único: Aluno), já com status
"concluído" e RFs mapeados. A IA leu o documento, identificou as 5 histórias (cadastro,
login, cadastro da empresa, registro de horas, visualização do valor ganho) e o link do
Figma do protótipo, e produziu um prompt único e autocontido — pensado para ser colado em
qualquer ferramenta de codificação com IA — cobrindo: contexto do projeto, regras de negócio
por tela, estrutura de pastas sugerida, entregáveis esperados e uma tabela de bibliotecas
recomendadas (roteamento, formulários, estado, estilização, calendário, testes), compatíveis
com o scaffold Vite + React 19 já existente no repositório.

A tentativa de abrir o link do Figma diretamente (via navegador) não foi bem-sucedida nesta
sessão (extensão de navegador não conectada), o que foi registrado explicitamente no prompt
como uma limitação, para que a etapa seguinte de implementação abrisse o link por conta
própria ou trabalhasse a partir de capturas de tela fornecidas.

### 3. Ajuste do prompt para a API real

Numa segunda rodada, o usuário indicou que já existia um backend pronto (`my-money`, projeto
separado). A IA leu a documentação de API (`docs/API.md`) e a especificação técnica
(`docs/SPEC.md`) desse backend — incluindo modelos de dados, regras de cálculo de ganhos
(`HOURLY_RATE = 5.33`, `TRANSPORT_ALLOWANCE = 10.80`), formato de erros e o fato de o
endpoint `GET /earnings` não ter filtro por mês — e reescreveu o prompt para eliminar
qualquer menção a dados mockados, substituindo por um contrato de API completo e preciso
(nomes de campo exatos, como `matricula`/`senha` sem acento, `dia_cadastrado`,
`horas_cadastradas_dia`), instruções de integração (cliente HTTP único, interceptors,
tratamento de `401`) e um alerta específico sobre a ausência de CORS no backend.

### 4. Geração do código

O prompt final foi usado — fora desta conversa, pelo usuário — em uma ferramenta de
codificação com IA para gerar a implementação completa do frontend. É possível confirmar,
pelos comentários deixados no próprio código (por exemplo, em `src/utils/validation.js`:
*"Espelham as regras de negócio do backend my-money (ver PROMPT_DESENVOLVIMENTO.md)"*, e em
`README.md`/`Calendar.jsx`, referências explícitas às limitações de acesso ao Figma) que a
implementação seguiu de perto as instruções e o raciocínio registrados no prompt gerado na
etapa 3, inclusive documentando no próprio README os pontos em que o resultado final desviou
do protótipo original (ilustrações recriadas, card de "total geral" com dados reais no lugar
de um valor fixo do protótipo).

### 5. Depuração assistida por IA

Após a implementação, o front apresentou o erro "Não foi possível conectar ao servidor" ao
chamar qualquer rota do backend. A IA investigou o código-fonte de ambos os projetos (não
apenas a mensagem de erro) e identificou duas causas prováveis, já antecipadas no próprio
prompt gerado na etapa 3: (a) o backend não tem middleware de CORS configurado, e (b) o
arquivo `.env` do front — necessário para o `VITE_API_URL` correto — não existia no projeto
(só o `.env.example`). A correção aplicada foi criar o `.env` apontando `VITE_API_URL=/api`,
usando o proxy de desenvolvimento já configurado no `vite.config.js`, evitando qualquer
alteração no backend.

### 6. Documentação

Por fim, a IA reescreveu o `README.md` cobrindo o projeto por completo (fluxo de cada tela,
arquitetura de pastas arquivo a arquivo, contrato de integração com a API, regras de negócio
implementadas no cliente, decisões técnicas e limitações conhecidas) e produziu este documento
de uso de IA.

## O que foi decisão humana

- A escolha de usar React + Vite (o scaffold do projeto já existia antes de qualquer prompt
  ser gerado).
- O fornecimento do PDF de histórias de usuário e do link do Figma como fontes de verdade.
- A indicação de qual backend consumir e o compartilhamento da pasta do projeto `my-money`.
- A aprovação final de cada arquivo gerado/editado (README, prompt, `.env`) e o reporte do
  erro de conectividade que disparou a etapa de depuração.

## Limitações e transparência

- Este documento foi escrito com base nas evidências disponíveis nesta conversa e no
  código-fonte (comentários, estrutura de arquivos, mensagens de commit). A geração do código
  em `src/` (etapa 4) ocorreu fora desta sessão de conversa, então os detalhes exatos de
  prompts intermediários ou iterações feitas durante essa etapa não são conhecidos por quem
  escreveu este documento — apenas o resultado final e sua consistência com o prompt fonte.
- Nenhum dado real de aluno foi usado para treinar ou ajustar modelos; a IA não teve acesso a
  nenhum banco de dados de produção, apenas ao código-fonte e à documentação dos dois
  projetos.
