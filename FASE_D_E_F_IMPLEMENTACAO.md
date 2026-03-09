# Implementação — Fases D, E e F

## Fase D — Analytics e Ressuprimento

### Entregas BE8
- `analytics.consumption`
  - filtra apenas `tipo_movimento = SAIDA` e `entra_no_consumo = SIM`.
  - calcula:
    - `total_saidas`
    - `media_diaria`
    - `media_mensal`
    - séries `consumo_diario` e `consumo_mensal`.

### Entregas BE9
- `analytics.coverage`
  - calcula cobertura (`cobertura_dias = estoque_atual / consumo_medio_diario`).
  - aplica regra de ressuprimento:
    - `RESSUPRIR` quando `estoque_atual <= ponto_ressuprimento`
    - `ATENCAO` em zona de aproximação (até 20% acima)
    - `OK` caso contrário.

### Pedidos de reposição (CRUD operacional)
- `supply.order.create`
- `supply.order.update`
- `supply.order.list`

## Fase E — Frontend Vue 3

### Setup base
- Projeto Vue 3 com Vite.
- Pinia store global (`src/stores/appStore.js`).
- Cliente API (`src/api/client.js`) para chamadas `action/payload` ao WebApp GAS.

### Telas prioritárias implementadas
- Dashboard (`/`)
- Cadastro de Insumos (`/insumos`)
- Snapshot (`/snapshot`)
- Movimentação (`/movimentacao`)
- Analytics (`/analytics`)

## Fase F — Go-live controlado

### Rotina de carga inicial
- `golive.seed.initial`
  - recebe lista de itens com `codigo_ax` e `quantidade_atual`.
  - cria snapshots iniciais com contexto `INVENTARIO`.

### Checklist de implantação
- `golive.checklist`
  - validação de configuração
  - validação de abas
  - carga inicial
  - monitoramento de logs
  - latência
  - rollback

### Ajuste fino de parâmetros
- `config.upsert` / `config.list` para ajuste de parâmetros operacionais.
