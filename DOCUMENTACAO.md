# 📊 API Relatório Clear Sale

Documentação completa para gerar relatórios HTML com dados do Clear Sale Credit Pro.

---

## 🎯 O que esta API faz?

Esta API permite que você:

- **Envie uma lista de CPFs** (com ou sem pontuação)
- **Consulte automaticamente** os dados no Clear Sale
- **Receba um relatório HTML** completo e interativo
- **Salve o arquivo** automaticamente no servidor
- **Visualize scores, personas e potenciais** de consumo

---

## 🚀 Como usar em 3 passos

### 1. Prepare sua lista de CPFs
Organize os CPFs que você quer consultar. Pode ser com ou sem pontuação.

**Exemplos válidos:**
```

"11111111111"       (sem pontuação)
"222.222.222-22"    (com pontuação)
"33333333333"       (misturado)

```

---

### 2. Faça a requisição para a API
Envie uma requisição `POST` para o endpoint principal:

**Endpoint:**
```

POST /reports/generate

````

**Exemplo com curl:**
```bash
curl -X POST http://localhost:3000/reports/generate \
  -H "Content-Type: application/json" \
  -d '{
    "cpfs": [
      "11111111111",
      "222.222.222-22",
      "33333333333"
    ]
  }'
````

---

### 3. Receba o relatório HTML

A API retornará:

* **HTML completo** do relatório
* **Nome do arquivo** salvo no servidor
* **Estatísticas** dos CPFs processados

💡 **Dica:** O HTML já vem pronto para salvar como `.html` e abrir no navegador.

---

## 📋 Detalhes da Requisição

### Endpoint

```
POST /reports/generate
```

### Parâmetros do Body (JSON)

| Campo | Tipo             | Obrigatório | Descrição                                           |
| ----- | ---------------- | ----------- | --------------------------------------------------- |
| cpfs  | Array de strings | Sim         | Lista de CPFs para consultar (com ou sem pontuação) |

**Exemplo:**

```json
{
  "cpfs": [
    "12345678901",
    "987.654.321-00",
    "11111111111"
  ]
}
```

---

## 📤 Resposta da API

### Sucesso (200)

```json
{
  "html": "<!DOCTYPE html>...</html>",
  "filename": "relatorio-credit-pro-2025-08-11T15-30-45.html",
  "jsonFilename": "relatorio-credit-pro-2025-08-11T15-30-45.json",
  "cpfsProcessed": 3,
  "cpfsWithData": 2,
  "processingTime": 45,
  "successRate": 67,
  "timestamp": "2025-08-11T15:30:45.123Z"
}
```

| Campo          | Descrição                                      |
| -------------- | ---------------------------------------------- |
| html           | Código HTML completo do relatório gerado       |
| filename       | Nome do arquivo HTML salvo na pasta `reports/` |
| jsonFilename   | Nome do arquivo JSON com respostas completas   |
| cpfsProcessed  | Total de CPFs enviados                         |
| cpfsWithData   | CPFs que retornaram dados válidos              |
| processingTime | Tempo de processamento em segundos             |
| successRate    | Taxa de sucesso em %                           |
| timestamp      | Data/hora da geração                           |

---

### Possíveis erros

* **400**: Lista de CPFs inválida ou vazia
* **404**: Nenhum dado encontrado
* **502**: Erro na comunicação com Clear Sale
* **500**: Erro interno do servidor


---

## 📊 O que tem no relatório gerado?

**🎨 Interface Visual:**

* Design moderno e responsivo
* Cores destacando scores
* Busca em tempo real
* Download CSV integrado
* Paginação inteligente (10 registros por página)
* Navegação otimizada para grandes volumes

**📋 Dados por CPF:**

* Score v3
* Personas (Bancarizada, Presença Digital)
* Perfil (Banco, Categoria do Cartão)
* VA/VR (Vale Alimentação/Refeição)
* Potencial de consumo em 11 categorias

**📁 Arquivos Gerados:**

* HTML interativo com paginação
* JSON com respostas completas
* Ambos salvos na pasta `reports/`

---
