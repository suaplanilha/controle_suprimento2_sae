# Fase A — Baseline técnico (desbloqueadora)

## 1) Inventário real do repositório

### 1.1 Arquivos encontrados

- `README.md`
- `WBS.md`
- `tap.md`
- `sad.md`
- `DIAGRAMA_MOTOR_ESTOQUE.md`

### 1.2 Diagnóstico objetivo

**Estado atual no repositório:**

- Não há código-fonte GAS (`.gs`, `.js` com `doPost`, serviços, repositórios, utilitários).
- Não há frontend Vue (`package.json`, `src/`, componentes, stores, router).
- Não há automação de testes, lint, build ou CI.
- O conteúdo disponível é **100% documental** (visão, arquitetura, WBS e planejamento).

### 1.3 Conclusão do inventário

O projeto possui boa base de arquitetura e backlog, porém a implementação executável ainda não está presente neste repositório. Portanto, o baseline técnico de código é **inicial (0%)** e o baseline documental é **alto**.

---

## 2) Matriz GAP — WBS x Implementação

### Legenda
- **Doc**: existe descrição/planejamento no material.
- **Código no repo**: existe implementação verificável no repositório atual.
- **% pronto**: percentual de implementação **no repositório atual**.

### 2.1 Banco (B1..B6)

| ID | Item | Doc | Código no repo | % pronto | GAP principal |
|---|---|---|---|---:|---|
| B1 | Criar planilha `db_sumprimentos_v2` | Sim | Não verificável por código local | 0% | Não há script/infra no repo |
| B2 | Criar abas base | Sim | Não | 0% | Ausência de bootstrap implementado |
| B3 | Definir cabeçalhos padrão | Sim | Não | 0% | Falta estrutura de schema versionado |
| B4 | Migrar cadastro de insumos | Sim | Não | 0% | Sem script de migração no repo |
| B5 | Migrar histórico legado | Sim | Não | 0% | Sem pipeline wide→long implementado |
| B6 | Validar integridade dos dados | Sim | Não | 0% | Sem rotinas de validação/auditoria |

### 2.2 Backend (BE1..BE10)

| ID | Item | Doc | Código no repo | % pronto | GAP principal |
|---|---|---|---|---:|---|
| BE1 | Router API | Sim | Não | 0% | `doPost()` inexistente |
| BE2 | Resposta JSON padrão | Sim | Não | 0% | Falta camada shared/response |
| BE3 | Utilidades de data | Sim | Não | 0% | Falta util de ISO/timezone |
| BE4 | Utilidades de ID | Sim | Não | 0% | Falta geração UUID/IDs |
| BE5 | Repositórios Sheets | Sim | Não | 0% | Falta acesso abstrato por aba |
| BE6 | Serviço Snapshot | Sim | Não | 0% | Falta caso de uso principal |
| BE7 | Motor de reconciliação | Sim | Não | 0% | Falta cálculo delta/classificação |
| BE8 | Serviço Analytics | Sim | Não | 0% | Falta agregação de consumo/cobertura |
| BE9 | Serviço Ressuprimento | Sim | Não | 0% | Falta regra de alerta/pedido |
| BE10 | Logs | Sim | Não | 0% | Falta trilha de auditoria executável |

### 2.3 Frontend (FE1..FE7)

| ID | Item | Doc | Código no repo | % pronto | GAP principal |
|---|---|---|---|---:|---|
| FE1 | Setup Vue3 | Sim | Não | 0% | Sem projeto frontend |
| FE2 | Layout base | Sim | Não | 0% | Sem app shell |
| FE3 | Store global | Sim | Não | 0% | Sem Pinia/store |
| FE4 | Cliente API | Sim | Não | 0% | Sem camada HTTP |
| FE5 | Tela cadastro insumos | Sim | Não | 0% | Sem views/componentes |
| FE6 | Tela snapshot estoque | Sim | Não | 0% | Sem fluxo de lançamento |
| FE7 | Tela dashboard | Sim | Não | 0% | Sem visualização operacional |

### 2.4 Resumo executivo do GAP

- **Cobertura documental:** alta (arquitetura, backlog e objetivos definidos).
- **Cobertura de implementação local:** nula (0% em Banco/Backend/Frontend neste repositório).
- **Risco imediato:** desalinhamento entre planejamento detalhado e ausência de artefatos executáveis.

---

## 3) Definition of Done (DoD) por módulo

## 3.1 DoD — Backend (API + infraestrutura GAS)

Um item de backend só é considerado pronto quando:

1. Endpoint/ação está implementado e roteado via `doPost()`.
2. Payload validado com erros padronizados (códigos e mensagens consistentes).
3. Resposta segue contrato único `{ ok, message, data, meta? }`.
4. Repositório de dados desacoplado da regra de negócio.
5. Logs de execução e erro gravados em `logs_execucao`.
6. Testes funcionais mínimos (happy path + inválido + erro de persistência).
7. Documento de contrato da ação atualizado (request/response/exemplos).

### Critério objetivo de aceite

- 100% dos cenários críticos passando em checklist de teste manual/automatizado.
- Sem erro de execução em rota crítica por 3 rodadas consecutivas de teste.

## 3.2 DoD — Motor de Estoque (snapshot + reconciliação)

Um item do motor só é considerado pronto quando:

1. Snapshot é persistido com campos obrigatórios (`codigo_ax`, `quantidade_atual`, contexto e timestamp ISO).
2. Snapshot anterior válido é recuperado corretamente por item e ordenação temporal.
3. `delta = anterior - atual` é calculado de forma determinística.
4. Classificação de movimento está correta (`ENTRADA`, `SAIDA`, `SEM_VARIACAO`, `AJUSTE`) conforme contexto.
5. Movimentação apurada é gravada com rastreabilidade ao snapshot origem.
6. Casos de borda cobertos (primeiro snapshot, delta zero, entrada inesperada, inventário/ajuste).
7. Reprocessamento não duplica movimentos (idempotência por chave lógica).

### Critério objetivo de aceite

- 0 divergências em bateria de cenários de reconciliação previamente definida.
- 100% dos snapshots de teste gerando resultado esperado e auditável.

## 3.3 DoD — Frontend (Vue 3)

Um item de frontend só é considerado pronto quando:

1. Fluxo completo funciona ponta a ponta com backend de homologação.
2. Estados de UI cobertos: carregando, sucesso, vazio, erro e retry.
3. Validação de formulário alinhada com contrato da API.
4. Navegação e layout responsivo mínimo operacional.
5. Mensagens de erro/sucesso compreensíveis para usuário operacional.
6. Componentes reutilizáveis com organização por domínio.
7. Registro de versão e changelog de tela atualizados.

### Critério objetivo de aceite

- Execução de roteiro E2E manual sem bloqueios nos fluxos prioritários:
  - cadastro de insumos,
  - lançamento de snapshot,
  - consulta de dashboard.

---

## 4) Próximos passos imediatos (para iniciar execução)

1. Criar estrutura mínima de código GAS (`/src/api`, `/src/application`, `/src/domain`, `/src/repositories`, `/src/shared`).
2. Implementar BE1 e BE2 primeiro (roteador + resposta padrão).
3. Em seguida BE5 + BE6 + BE7 (repositório snapshot + reconciliação).
4. Preparar frontend somente após contrato mínimo da API estabilizado.
