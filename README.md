# My Dragons

Catálogo de dragões com login, listagem, cadastro, edição e remoção. Feito para
o desafio técnico.

**https://my-dragons.pages.dev**

## Como Rodar

Para rodar esse projeto você precisa do Node.js 20+

```bash
npm install
npm run dev
```

A aplicação sobe por padrão em: `http://localhost:5173`.

## Visão Geral

## Como Acessar

Ao acessar a aplicação, use a aba "Criar conta" e cadastre-se com
qualquer usuário. Após efetuar o cadastro a sessão será inicializada automáticamente.

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

### Estrutura de pastas

```
src/
├── app/         composição da aplicação: rotas, guardas, providers, layout
├── features/    auth e dragons, cada uma dona do seu domínio
├── shared/      o que mais de uma feature usa
├── styles/      tokens, breakpoints e mixins
└── test/        utilidades de teste
```
Cada tela vive na pasta do seu domínio, junto com seus pares.

### Scripts utéis

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

### Padrões de projeto utilizados

| Padrão | Onde está |
| --- | --- |
| Repository | `shared/repositories/DragonRepository.ts` |
| Adapter | `shared/adapters/dragon.adapter.ts` |
| Factory | `shared/services/httpClient.ts` |
| Provider | `app/providers/RepositoriesProvider.tsx` |
| Custom Hook | `features/dragons/useDragonCatalog.ts` |
| Strategy | `features/dragons/sorting.ts` |
| Route Guard | `app/routes/ProtectedRoute.tsx` |
| Error Boundary | `app/ErrorBoundary/index.tsx` |


### Endpoints API

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

## Extras

### Deploy Cloudflare

O repositório está configurado a um Cloudflare pages e a cada push, com
`main` em produção o build ocorre automático e publica no endereço `https://my-dragons.pages.dev`, cada branch a parte gera um ambiente de preview próprio.

### Resiliência

A API do desafio é um mock público e pode sair do ar em algum momento, pensando nisso  foi adicionado ao projeto uma camada de resiliencia usando persistencia dos dados no browser, dessa forma permitindo que quem está acessando consiga obter as informações mesmo que a API esteja indisponivel no momento.




