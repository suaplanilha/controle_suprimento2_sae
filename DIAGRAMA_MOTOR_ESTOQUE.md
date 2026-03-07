# Diagrama do Motor de Estoque — SAE

## Objetivo
Representar o fluxo central do backend do SAE para o processo de lançamento de estoque por snapshot e apuração automática de movimentação.

## Visão geral
O motor parte de um lançamento de **estoque atual** informado pelo usuário e deriva automaticamente a movimentação comparando o snapshot atual com o snapshot anterior válido do mesmo insumo.

## Diagrama principal

```mermaid
flowchart TD
    A[Usuário lança estoque atual] --> B[Frontend Vue 3 envia payload para API GAS]
    B --> C[API Router recebe action inventory.snapshot.create]
    C --> D[Snapshot App Service valida payload]
    D --> E{codigo_ax existe e item está ativo?}

    E -- Não --> E1[Retorna erro de validação]
    E -- Sim --> F[Normaliza data_hora_lancamento_iso]
    F --> G[Grava snapshot em estoque_snapshot com status PENDENTE]
    G --> H[Busca snapshot anterior válido do mesmo codigo_ax]
    H --> I{Existe snapshot anterior?}

    I -- Não --> J[Marca snapshot como NAO_APURAVEL_INICIAL]
    J --> K[Retorna sucesso com observação: primeiro snapshot do item]

    I -- Sim --> L[Reconciliation Engine compara anterior vs atual]
    L --> M[delta = estoque_anterior - estoque_atual]
    M --> N{tipo_contexto}

    N -- FECHAMENTO_DIARIO --> O[Aplicar regra operacional]
    N -- LEITURA_INTERMEDIARIA --> O
    N -- INVENTARIO --> P[Classificar como AJUSTE_INVENTARIO]
    N -- AJUSTE --> Q[Classificar como AJUSTE_MANUAL]

    O --> R{delta > 0?}
    R -- Sim --> S[Tipo = SAIDA | quantidade = delta | entra_no_consumo = SIM]
    R -- Não --> T{delta < 0?}
    T -- Sim --> U[Tipo = ENTRADA | quantidade = abs delta | entra_no_consumo = NAO]
    T -- Não --> V[Tipo = SEM_VARIACAO | quantidade = 0 | entra_no_consumo = NAO]

    P --> W[Movimento = AJUSTE_INVENTARIO | entra_no_consumo = NAO]
    Q --> X[Movimento = AJUSTE_MANUAL | entra_no_consumo = NAO]

    S --> Y[Grava movimentacao_apurada]
    U --> Y
    V --> Y
    W --> Y
    X --> Y

    Y --> Z[Atualiza status do snapshot para APURADO]
    Z --> AA[Retorna resposta consolidada ao frontend]
```

---

## Regras centrais do motor

### Regra 1 — dado primário
O dado primário sempre é o **snapshot**.

O usuário não informa:
- entrada
- saída
- ajuste de movimentação

O usuário informa apenas:
- item
- quantidade atual
- contexto
- data/hora do lançamento

---

### Regra 2 — encadeamento
O sistema sempre busca o **snapshot anterior válido** do mesmo `codigo_ax`, ordenando por:

- `data_hora_lancamento_iso`

Não usar apenas data simples.

---

### Regra 3 — cálculo base
```text
delta = estoque_anterior - estoque_atual
```

### Interpretação
```text
delta > 0  => SAIDA
delta < 0  => ENTRADA
delta = 0  => SEM_VARIACAO
```

---

### Regra 4 — contexto manda na classificação
Mesmo com delta calculado, o `tipo_contexto` pode alterar a classificação final.

#### FECHAMENTO_DIARIO
Movimento operacional normal.

#### LEITURA_INTERMEDIARIA
Movimento operacional intradia.

#### INVENTARIO
Não deve contaminar consumo operacional.

#### AJUSTE
Não deve ser tratado como saída real.

---

## Fluxo detalhado por etapa

### 1. Entrada do payload
Payload esperado:

```json
{
  "action": "inventory.snapshot.create",
  "payload": {
    "codigo_ax": "124262",
    "quantidade_atual": 400,
    "tipo_contexto": "FECHAMENTO_DIARIO",
    "data_hora_lancamento_iso": "2026-03-07T16:00:00",
    "observacao": "Fechamento do turno"
  }
}
```

### 2. Validação
Validar:
- `codigo_ax` obrigatório
- `quantidade_atual` numérico
- `tipo_contexto` válido
- `data_hora_lancamento_iso` em ISO
- item ativo

### 3. Persistência do snapshot
Gravar primeiro em `estoque_snapshot`.

### 4. Busca do snapshot anterior
Buscar o último snapshot válido do item com data menor que o atual.

### 5. Reconciliação
Executar o cálculo do delta.

### 6. Classificação do movimento
Gerar uma linha em `movimentacao_apurada`.

### 7. Resposta para o frontend
Retornar:
- snapshot gravado
- snapshot anterior usado
- delta calculado
- tipo de movimento
- quantidade derivada

---

## Casos especiais

### Primeiro snapshot do item
Se não existir snapshot anterior:
- não apurar movimento operacional
- marcar snapshot como inicial

### Lançamento fora de ordem
Se entrar snapshot retroativo:
- deve existir rotina futura de rebuild da cadeia do item

### Dois lançamentos no mesmo dia
Permitido.
A ordenação sempre depende do timestamp completo.

Exemplo:
```text
07/03/2026 08:00 -> 400
07/03/2026 16:00 -> 350
delta = 50
resultado = SAIDA 50
```

---

## Saídas consumidas por outros módulos

### Analytics
Usa apenas:
- `tipo_movimento = SAIDA`
- `entra_no_consumo = SIM`

### Ressuprimento
Usa:
- saldo atual mais recente
- consumo médio
- ponto de ressuprimento
- pedidos em aberto

### Dashboard
Usa:
- snapshot mais recente por item
- alertas
- últimos movimentos
- cobertura estimada
