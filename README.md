# My Dragons

**Acesse em [my-dragons.pages.dev](https://my-dragons.pages.dev)**

Esta é a aplicação de cadastro e consulta de dragões, feita para o desafio técnico.

## Rodando o Projeto

Precisa de Node 20 ou superior.

```bash
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

## Scripts

```bash
npm run dev         # servidor de desenvolvimento
npm run build       # verificação de tipos e build de produção
npm run preview     # serve o build local
npm run lint        # eslint
npm run typecheck   # tsc sem emitir
npm test            # suíte completa
npm run test:watch  # testes em modo observador
npm run coverage    # testes com relatório de cobertura
```

## Visão Geral

### Organização por feature

```
src/
├── app/         composição da aplicação: rotas, guardas, providers, layout
├── features/    auth e dragons, cada uma dona do seu domínio
├── shared/      o que mais de uma feature usa
├── styles/      tokens, breakpoints e mixins
└── test/        utilidades de teste
```
Cada tela vive na pasta do seu domínio, junto com seus pares.

### A interface não conhece a API

Nenhum componente chama `fetch`. Todos pedem o repositório ao contexto e usam o
contrato `DragonRepository`.

Nos testes eu troco esse repositório por uma versão em memória, então nenhum
teste precisa de mock de rede. Trocar a API por um backend próprio é escrever
outra implementação do mesmo contrato.

### Erros com nome

Cada falha da API vira `timeout`, `network`, `client`, `server` ou `parse`, com
mensagem própria. Um "algo deu errado" genérico não ajuda a decidir se vale
tentar de novo agora ou depois.

O adapter também não confia na resposta: campo faltando vira string vazia, para
um registro quebrado não derrubar a lista inteira.

### Bibliotecas

O enunciado só proíbe biblioteca de estilo, então a interface é SCSS puro.

No resto usei `react-hook-form` com `zod` e TanStack Query. Validação e cache
são onde código feito à mão erra mais. O schema zod também gera o tipo do
formulário, então regra e tipo não podem divergir.

### Estilo em tokens

Cores, espaçamentos e tipografia são custom properties do CSS. Por isso o tema
escuro é só um bloco que troca os valores, sem mexer em nenhum componente.

Cada componente tem seu `.module.scss` ao lado, nunca estilo dentro do `.tsx`.

### Filtro e ordenação no hook

A query traz o que a API mandou. Um hook da feature filtra e ordena com
`useMemo`. Assim trocar de coluna ou de filtro não dispara requisição nova.

### Autenticação local

Não existe endpoint de usuários, então usuário e senha ficam no `localStorage`
em texto puro.

Cheguei a guardar hash com salt, mas tirei. Sem servidor não protege nada:
qualquer pessoa edita o `localStorage` pelo DevTools e entra do mesmo jeito.

### Rotas sob demanda

Cada rota vira um arquivo separado no build, então quem abre o login não baixa o
código do catálogo.

Se a rede cair no meio da navegação, uma barreira de erro mostra o aviso em vez
de deixar a tela branca.

### Testes

São 114 testes. Funções puras testadas isoladas, telas testadas pela árvore de
rotas real, verificando o que aparece na tela e o que chega ao repositório.

### Deploy com verificação antes de publicar

O Cloudflare Pages está conectado ao repositório e compila a cada push. `main` é
produção e cada branch vira um preview próprio.

O build roda lint, tipos e testes antes de compilar. Se algo falhar, nada é
publicado e a versão anterior continua no ar.

## Como Acessar

Ao acessar a aplicação, use a aba "Criar conta" e cadastre-se com
qualquer usuário. Após efetuar o cadastro a sessão será inicializada automaticamente.

Não existe endpoint de usuários,
então o acesso é resolvido no cliente no `localStorage` sob a chave `dragons:users`.

Com um backend disponível, a troca seria somente mudar para: `authService`.

## Rotas disponíveis

```
/                 pública, redireciona para /login se não houver sessão
/login            pública, redireciona para /dragons se já houver sessão
/dragons          índice
/dragons/new      cadastro
/dragons/:id      detalhe
/dragons/:id/edit edição
/settings         conta e aparência
```

## Endpoints API

```
https://5c4b2a47aa8ee500142b4887.mockapi.io/api/v1
```

| Método | Rota           | O que faz            |
| ------ | -------------- | -------------------- |
| GET    | `/dragon`      | lista os dragões     |
| GET    | `/dragon/:id`  | detalhe de um dragão |
| POST   | `/dragon`      | cria um dragão       |
| PUT    | `/dragon/:id`  | edita um dragão      |
| DELETE | `/dragon/:id`  | remove um dragão     |

## Resiliência

A API do desafio é um mock público e sai do ar de vez em quando.

A aplicação possui resiliência usando cache da camada de persistência dos dados no browser, permitindo que ele consiga obter as informações mesmo que a API esteja indisponível naquele momento.




