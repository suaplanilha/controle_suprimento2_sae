function runScenarioTests() {
  var gateway = new InMemoryGateway.Gateway({
    insumos: [
      { codigo_ax: '124262', ativo: 'SIM', descricao: 'Reagente A', ponto_ressuprimento: 120 },
      { codigo_ax: '888888', ativo: 'SIM', descricao: 'Reagente B', ponto_ressuprimento: 30 },
      { codigo_ax: '999999', ativo: 'NAO', descricao: 'Item Inativo' },
    ],
    estoque_snapshot: [],
    movimentacao_apurada: [],
    pedidos_ressuprimento: [],
    logs_execucao: [],
    config: [
      { config_id: 'c1', key: 'ponto_ressuprimento_padrao', value: '50', updated_at_iso: '2026-03-01T00:00:00Z' },
    ],
  });

  function mockEvent(body) {
    return { postData: { contents: JSON.stringify(body) } };
  }

  function call(action, payload) {
    return handleHttpPost(mockEvent({ action: action, payload: payload || {} }), gateway);
  }

  // Base snapshots
  var res = call('inventory.snapshot.create', {
    codigo_ax: '124262', quantidade_atual: 500, tipo_contexto: 'FECHAMENTO_DIARIO', data_hora_lancamento_iso: '2026-03-07T08:00:00Z',
  });
  if (!res.ok || res.data.snapshot.status_apuracao !== 'NAO_APURAVEL_INICIAL') throw new Error('Teste snapshot inicial falhou');

  res = call('inventory.snapshot.create', {
    codigo_ax: '124262', quantidade_atual: 400, tipo_contexto: 'FECHAMENTO_DIARIO', data_hora_lancamento_iso: '2026-03-07T16:00:00Z',
  });
  if (!res.ok || res.data.movement.tipo_movimento !== 'SAIDA' || res.data.movement.quantidade_movimento !== 100) throw new Error('Teste saída falhou');

  res = call('inventory.snapshot.create', {
    codigo_ax: '124262', quantidade_atual: 450, tipo_contexto: 'LEITURA_INTERMEDIARIA', data_hora_lancamento_iso: '2026-03-08T16:00:00Z',
  });
  if (!res.ok || res.data.movement.tipo_movimento !== 'ENTRADA') throw new Error('Teste entrada falhou');

  res = call('inventory.snapshot.create', {
    codigo_ax: '124262', quantidade_atual: 420, tipo_contexto: 'INVENTARIO', data_hora_lancamento_iso: '2026-03-09T16:00:00Z',
  });
  if (!res.ok || res.data.movement.tipo_movimento !== 'AJUSTE_INVENTARIO') throw new Error('Teste inventário falhou');

  // Idempotência
  var beforeCount = gateway.tables.estoque_snapshot.length;
  res = call('inventory.snapshot.create', {
    codigo_ax: '124262', quantidade_atual: 420, tipo_contexto: 'INVENTARIO', data_hora_lancamento_iso: '2026-03-09T16:00:00Z',
  });
  if (!res.ok || !res.data.idempotent_replay || gateway.tables.estoque_snapshot.length !== beforeCount) throw new Error('Teste idempotência falhou');

  // Out of order
  res = call('inventory.snapshot.create', {
    codigo_ax: '124262', quantidade_atual: 410, tipo_contexto: 'FECHAMENTO_DIARIO', data_hora_lancamento_iso: '2026-03-08T17:00:00Z',
  });
  if (res.ok || res.error.code !== 'OUT_OF_ORDER_SNAPSHOT') throw new Error('Teste ordenação temporal falhou');

  // Analytics consumption
  res = call('analytics.consumption', { codigo_ax: '124262' });
  if (!res.ok) throw new Error('Teste analytics falhou');
  if (res.data.total_saidas !== 100) throw new Error('Total saídas incorreto');

  // Coverage + alerts
  res = call('analytics.coverage', { codigo_ax: '124262' });
  if (!res.ok || !res.data.status_ressuprimento) throw new Error('Teste cobertura falhou');

  // Supply order CRUD
  res = call('supply.order.create', {
    codigo_ax: '124262',
    quantidade: 300,
    previsao_chegada_iso: '2026-03-20T08:00:00Z',
    observacao: 'Compra mensal',
  });
  if (!res.ok || !res.data.pedido_id) throw new Error('Teste create order falhou');
  var pedidoId = res.data.pedido_id;

  res = call('supply.order.update', { pedido_id: pedidoId, status: 'EM_TRANSITO' });
  if (!res.ok || res.data.status !== 'EM_TRANSITO') throw new Error('Teste update order falhou');

  res = call('supply.order.list', {});
  if (!res.ok || !res.data.length) throw new Error('Teste list order falhou');

  // Dashboard
  res = call('dashboard.summary', {});
  if (!res.ok || !res.data.total_itens_ativos) throw new Error('Teste dashboard falhou');

  // Config
  res = call('config.upsert', { key: 'janela_media_dias', value: '30' });
  if (!res.ok || String(res.data.key) !== 'janela_media_dias') throw new Error('Teste config upsert falhou');

  // Logs
  if (gateway.tables.logs_execucao.length < 4) throw new Error('Teste logs falhou');

  return 'All scenario tests passed (Fases B-F).';
}
