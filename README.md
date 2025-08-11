# Relatório Clear Sale API

API simples em NestJS para gerar relatórios HTML baseados em consultas ao Clear Sale Credit Pro.

## Funcionalidades

- ✅ Recebe lista de CPFs (com ou sem pontuação)
- ✅ Consulta dados no Clear Sale Credit Pro
- ✅ Gera relatório HTML interativo
- ✅ Salva relatório na pasta `reports/`
- ✅ Retorna HTML como resposta da API
- ✅ Documentação Swagger automática

## Instalação

```bash
npm install
```

## Configuração

Configure as variáveis no arquivo `.env`:

```
PORT=3000
URL_CREDIT_PRO=https://productsapi.clearsale.com.br/v1
CREDIT_PRO_USER=seu-usuario
CREDIT_PRO_PASS=sua-senha
CREDIT_PRO_CRITERION=15
```

## Execução

### Desenvolvimento
```bash
npm run start:dev
```

### Produção
```bash
npm run build
npm start
```

## API Endpoints

### POST /reports/generate

Gera um novo relatório HTML para a lista de CPFs fornecida.

**Body:**
```json
{
  "cpfs": [
    "11111111111",
    "222.222.222-22",
    "33333333333"
  ]
}
```

**Response:**
```json
{
  "html": "<html>...</html>",
  "filename": "relatorio-credit-pro-2024-01-15T10-30-45-123Z.html",
  "cpfsProcessed": 3,
  "cpfsWithData": 2
}
```

## Swagger

A documentação interativa está disponível em: `http://localhost:3000/api`

## Estrutura do Projeto

```
src/
├── dto/                 # Data Transfer Objects
├── interfaces/          # Interfaces TypeScript
├── modules/            
│   └── report/         # Módulo de relatórios
├── services/           # Serviços (Clear Sale, Relatório)
├── app.module.ts
└── main.ts

reports/                # Arquivos HTML gerados
```

## Como Usar

1. Inicie a API
2. Acesse o Swagger em `http://localhost:3000/api`
3. Use o endpoint `/reports/generate` com uma lista de CPFs
4. O HTML será retornado na resposta e salvo na pasta `reports/`