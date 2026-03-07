# SAE — Sistema Apollo Enterprise

Sistema web para controle de insumos industriais com foco em **snapshot de estoque**, **apuração automática de movimentação** e **alerta de ressuprimento**.

## Stack
- **Banco**: Google Sheets
- **Backend**: Google Apps Script
- **Frontend**: Vue 3

---

## Problema que o sistema resolve
O processo antigo dependia de planilhas com:
- colagens manuais
- PROCV
- fórmulas herdadas
- mistura de saldo, consumo e ajuste
- baixa auditabilidade

Isso tornava frágil:
- cálculo de consumo real
- leitura de entrada e saída
- decisão de ressuprimento

O SAE resolve isso mudando o modelo mental do estoque.

---

## Modelo central
O usuário não informa movimentação.

O usuário informa apenas o **estoque atual observado**.

O sistema compara o valor atual com o snapshot anterior e calcula automaticamente:

```text
delta = estoque_anterior - estoque_atual
```

### Interpretação
- `delta > 0` → saída
- `delta < 0` → entrada
- `delta = 0` → sem variação

---

## Arquitetura
```text
Frontend Vue 3
      │
      ▼
WebApp API - GAS
      │
      ▼
Motor de Estoque
(snapshot -> reconciliação -> movimentação)
      │
      ▼
Google Sheets
```

---

## Estrutura do banco
Planilha-base: `db_sumprimentos_v2`

### Abas principais
- `config`
- `insumos`
- `historico_posicao_estoque_mensal`
- `estoque_snapshot`
- `movimentacao_apurada`
- `pedidos_ressuprimento`
- `usuarios`
- `logs_execucao`

---

## Papel das tabelas

### `insumos`
Cadastro mestre dos itens controlados.

### `historico_posicao_estoque_mensal`
Legado migrado da planilha antiga.
Serve para referência histórica.
Não é verdade operacional do motor novo.

### `estoque_snapshot`
Fonte de verdade operacional do novo sistema.

### `movimentacao_apurada`
Movimentação derivada automaticamente pelo backend.

### `pedidos_ressuprimento`
Pedidos de compra/reposição e previsão de chegada.

---

## Decisões arquiteturais já validadas

### 1. Novo app, não refatoração do antigo
O app antigo carregava uma semântica errada para o novo objetivo.

### 2. Snapshot como dado primário
O sistema é orientado a estado, não a movimentação manual.

### 3. Backend como cérebro da aplicação
A lógica fica centralizada no GAS.

### 4. Frontend em Vue 3
A interface consome a API e não carrega regra crítica.

### 5. Legado tratado como referência
A planilha antiga não é fonte confiável de saída operacional real.

### 6. Saldo inicial do go-live deve ser validado
Não herdar saldo automaticamente do legado.

---

## Regra operacional do motor

### Entrada do usuário
O usuário informa:
- `codigo_ax`
- `quantidade_atual`
- `tipo_contexto`
- `data_hora_lancamento_iso`
- `observacao` opcional

### Contextos previstos
- `FECHAMENTO_DIARIO`
- `LEITURA_INTERMEDIARIA`
- `INVENTARIO`
- `AJUSTE`

### Comportamento
- `FECHAMENTO_DIARIO`: pode gerar saída operacional
- `LEITURA_INTERMEDIARIA`: permite múltiplos lançamentos no mesmo dia
- `INVENTARIO`: gera ajuste, não consumo
- `AJUSTE`: corrige base sem contaminar média operacional

---

## Exemplo
Ontem:
```text
codigo_ax: 124262
quantidade: 500
```

Hoje:
```text
codigo_ax: 124262
quantidade: 400
```

Cálculo:
```text
500 - 400 = 100
```

Resultado:
```text
SAIDA = 100
```

Se amanhã o usuário registrar 1000:

```text
400 - 1000 = -600
```

Resultado:
```text
ENTRADA = 600
```

---

## Objetivos da v1
- cadastro de insumos
- lançamento de snapshots
- apuração automática de movimentação
- cálculo de consumo real a partir do novo sistema
- ponto de ressuprimento
- alerta de estoque crítico
- registro de pedidos de reposição

---

## Itens fora do escopo inicial
- integração direta com ERP
- módulo de fornecedores
- financeiro
- compra automática

---

## Roadmap técnico

### Fase 1 — Banco
- consolidar schema em Sheets
- validar migração
- estabilizar base

### Fase 2 — Backend base
- router API
- response pattern
- repositories
- validators

### Fase 3 — Motor de estoque
- criar snapshot
- buscar snapshot anterior
- calcular delta
- gravar movimentação apurada

### Fase 4 — Analytics
- consumo diário
- consumo mensal
- cobertura de estoque

### Fase 5 — Ressuprimento
- pedido
- status
- previsão de chegada

### Fase 6 — Frontend Vue 3
- dashboard
- cadastro
- snapshot
- pedidos
- analytics

---

## Organização sugerida do backend GAS
```text
/src
  /api
  /application
  /domain
  /repositories
  /shared
```

## Organização sugerida do frontend Vue 3
```text
/src
  /api
  /components
  /views
  /stores
  /composables
  /router
  /utils
```

---

## Padrões obrigatórios

### Datas
Usar formato ISO.

#### Timestamp operacional
```text
yyyy-MM-ddTHH:mm:ss
```

Exemplo:
```text
2026-03-07T16:00:00
```

#### Competência mensal legada
```text
yyyy-MM-01
```

Exemplo:
```text
2026-01-01
```

### Chaves
- chave técnica: `uuid`
- chave de negócio: `codigo_ax`

---

## Status atual do projeto
Já foi definido e validado:
- TAP / Charter
- Documento de Visão e Escopo
- SAD
- WBS técnica
- backlog por módulo
- desenho conceitual do banco novo
- migração legada como referência
- direção do produto com foco no backend/motor

---

## Próximos passos naturais
- detalhar contrato da API
- abrir backlog em tarefas executáveis
- definir critérios de aceite por módulo
- começar implementação do backend GAS
