# HTTP Request Viewer

Este é um visualizador de requisições HTTP desenvolvido com Next.js, React e Tailwind CSS. A aplicação permite que você faça requisições HTTP para qualquer endpoint e visualize os detalhes da resposta.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [pnpm](https://pnpm.io/) (gerenciador de pacotes)

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd http-request-viewer
```

2. Instale as dependências:
```bash
npm install --legacy-peer-deps
```

## Executando a Aplicação

1. Para iniciar o servidor de desenvolvimento:
```bash
npm run dev
```

2. Abra seu navegador e acesse:
```
http://localhost:3000
```

## Como Usar

1. Na interface da aplicação, você verá:
   - Um campo para inserir a URL do endpoint
   - Um seletor para escolher o método HTTP (GET, POST, PUT, DELETE, etc.)
   - Uma aba para configurar os cabeçalhos da requisição
   - Uma aba para inserir o corpo da requisição (quando necessário)

2. Para fazer uma requisição:
   - Insira a URL desejada
   - Selecione o método HTTP apropriado
   - Configure os cabeçalhos necessários (como Content-Type)
   - Se necessário, adicione um corpo à requisição
   - Clique no botão "Enviar"

3. A resposta será exibida abaixo, mostrando:
   - Status code e mensagem
   - Tempo de resposta
   - Tamanho da resposta
   - Cabeçalhos da resposta
   - Corpo da resposta formatado

## Tecnologias Utilizadas

- Next.js 15
- React 19
- Tailwind CSS
- Radix UI Components
- TypeScript

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a versão de produção
- `npm run start` - Inicia a versão de produção
- `npm run lint` - Executa a verificação de código

## Suporte

Se você encontrar algum problema ou tiver dúvidas, por favor, abra uma issue no repositório do projeto.
