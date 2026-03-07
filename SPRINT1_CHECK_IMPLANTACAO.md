# Check de Implantação — Backlog Sprint 1

Data de verificação: 2026-03-07

## Resultado geral

- **S1.1** ✅ Implantado
- **S1.2** ✅ Implantado
- **S1.3** ✅ Implantado
- **S1.4** ✅ Implantado
- **S1.5** ✅ Implantado

---

## S1.1 Levantamento GAP real do repositório (2–4h)

**Status:** ✅ Implantado

**Evidências:**
- Documento de baseline com inventário e matriz GAP existe e detalha diagnóstico do estado do repositório.
- Contém matriz por blocos Banco/Backend/Frontend e critérios de DoD.

Arquivos:
- `FASE_A_BASELINE_TECNICO.md`

---

## S1.2 Router + response padrão + validação payload (BE1-BE3)

**Status:** ✅ Implantado

**Evidências técnicas:**
- Router/entrypoint WebApp via `doPost` com parse de request e dispatch por action.
- Contrato de resposta unificado via helpers `Response.ok` e `Response.fail`.
- Validação de envelope e payloads com validações obrigatórias e erro padronizado.

Arquivos:
- `src/api/webapp.gs`
- `src/shared/response.gs`
- `src/shared/validators.gs`
- `src/shared/dateUtils.gs`

---

## S1.3 Repositório de snapshots + criação de snapshot (BE5-BE6)

**Status:** ✅ Implantado

**Evidências técnicas:**
- Repositórios para `estoque_snapshot` e lookup por item/timestamp.
- Serviço de criação de snapshot implementado com persistência, idempotência e status de apuração.

Arquivos:
- `src/repositories/repositories.gs`
- `src/application/snapshotService.gs`

---

## S1.4 Reconciliação delta + gravação em movimentação (BE7)

**Status:** ✅ Implantado

**Evidências técnicas:**
- Reconciliação com cálculo `delta = anterior - atual`.
- Classificação de movimento por contexto e delta.
- Persistência em `movimentacao_apurada` durante o fluxo de snapshot.

Arquivos:
- `src/application/reconciliationService.gs`
- `src/application/snapshotService.gs`

---

## S1.5 Logs de execução e cenários críticos de teste (BE10)

**Status:** ✅ Implantado

**Evidências técnicas:**
- Escrita de logs em `logs_execucao` em eventos críticos do fluxo.
- Suíte de cenários cobrindo snapshot inicial, saída/entrada, idempotência, ordenação temporal, analytics, cobertura, CRUD de pedidos e dashboard.

Arquivos:
- `src/application/snapshotService.gs`
- `tests/run.gs`

---

## Observações

- O Sprint 1 está implementado no backend GAS com cobertura de cenários críticos no ambiente em memória.
- Recomendação imediata: executar `runScenarioTests()` também no projeto GAS conectado à planilha real para validar diferenças de schema/headers em produção.
