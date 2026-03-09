# Opção B — Frontend embutido no GAS (Checklist de Deploy)

## Objetivo
Servir o frontend diretamente no Web App do Google Apps Script, sem dependência de `.vue` em runtime.

## Arquitetura final
- `doGet()` entrega `Index.html` via `HtmlService`.
- `doPost()` continua como API JSON.
- `Index.html` inclui `AppCss.html` e `AppBundle.html`.
- `AppBundle.html` contém JavaScript puro (SPA leve) consumindo actions do backend GAS.

---

## Pré-requisitos
- Projeto GAS configurado com `DB_SPREADSHEET_ID`.
- Arquivos publicados no Apps Script:
  - `Index.html`
  - `AppCss.html`
  - `AppBundle.html`

---

## Checklist operacional

### 1) Backend WebApp pronto para UI
- [ ] Confirmar existência de `doGet()` em `src/api/webapp.gs`
- [ ] Confirmar função `include(filename)` em `src/api/webapp.gs`
- [ ] Confirmar `Index.html` referenciando `AppCss` e `AppBundle`

### 2) Publicação
- [ ] Deploy nova versão do Web App no GAS
- [ ] Abrir URL do Web App no navegador
- [ ] Validar renderização da SPA e navegação (Dashboard, Insumos, Snapshot, Movimentação, Analytics)

### 3) Validação funcional
- [ ] Testar dashboard (`dashboard.summary`)
- [ ] Testar snapshot (`inventory.snapshot.create`)
- [ ] Testar movimentação (`inventory.movement.list`)
- [ ] Testar analytics (`analytics.consumption`)

### 4) Pós-deploy
- [ ] Monitorar `logs_execucao` por erros
- [ ] Validar latência de `doPost` em horários de pico
- [ ] Definir rollback: reimplantar versão anterior do Web App

---

## Observações importantes
- GAS **não interpreta `.vue` diretamente**.
- Na UI embutida, as ações são chamadas via `google.script.run.runAction(...)` para evitar CORS/preflight.
- O fallback HTTP usa `window.__SAE_API_URL__` apenas fora do contexto HtmlService.
