# Implementação Fases B e C (Backend GAS + Confiabilidade)

## Entregas

- **BE1 + BE2**: Router de API (`doPost`) com padrão unificado de resposta JSON.
- **BE5**: Repositórios para `insumos`, `estoque_snapshot`, `movimentacao_apurada`, `pedidos_ressuprimento` e `logs_execucao`.
- **BE6 + BE7**: Serviço de snapshot e reconciliação com cálculo de delta e classificação de movimento.
- **BE10**: Auditoria em `logs_execucao` nas operações críticas.
- **Fase C**: regras de contexto, idempotência, ordenação temporal e validações robustas.

## Ação implementada

- `inventory.snapshot.create`

## Regras aplicadas

- `delta = snapshot_anterior - snapshot_atual`
- Contextos operacionais:
  - `FECHAMENTO_DIARIO`
  - `LEITURA_INTERMEDIARIA`
- Contextos de ajuste:
  - `INVENTARIO` -> `AJUSTE_INVENTARIO`
  - `AJUSTE` -> `AJUSTE_MANUAL`

## Confiabilidade

- **Idempotência** por `codigo_ax + data_hora_lancamento_iso`.
- **Ordenação temporal**: bloqueia snapshot retroativo (fora de ordem) para o mesmo item.
- **Hardening**: valida campos obrigatórios, tipos e data ISO.

## Como testar localmente

```bash
# Google Apps Script
# Execute no editor do GAS: runScenarioTests() em tests/run.gs
```
