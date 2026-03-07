var SupplyService = (function () {
  function create(repositories, analyticsService) {
    function getConfigNumber(key, fallback) {
      var all = repositories.config.list();
      var row = all.filter(function (r) { return String(r.key) === String(key); })[0];
      if (!row) return fallback;
      var n = Number(row.value);
      return isNaN(n) ? fallback : n;
    }

    function deriveStatus(estoqueAtual, pontoRessuprimento) {
      if (estoqueAtual <= pontoRessuprimento) return 'RESSUPRIR';
      if (estoqueAtual <= pontoRessuprimento * 1.2) return 'ATENCAO';
      return 'OK';
    }

    function getCoverage(payload) {
      Validators.validateCoveragePayload(payload || {});
      var codigoAx = String(payload.codigo_ax);
      var item = repositories.insumos.findByCodigoAx(codigoAx);
      if (!item) {
        throw new Errors.AppError('ITEM_INVALIDO', 'Insumo não encontrado', { codigo_ax: codigoAx }, 404);
      }

      var latestSnapshot = repositories.snapshots.findLatestByCodigoAx(codigoAx);
      var estoqueAtual = payload.estoque_atual !== undefined
        ? Number(payload.estoque_atual)
        : Number(latestSnapshot ? latestSnapshot.quantidade_atual : 0);

      var pontoRessuprimento = Number(item.ponto_ressuprimento || getConfigNumber('ponto_ressuprimento_padrao', 0));
      var consumo = analyticsService.listConsumptions({ codigo_ax: codigoAx });
      var consumoMedioDiario = Number(consumo.media_diaria || 0);
      var coberturaDias = consumoMedioDiario > 0 ? (estoqueAtual / consumoMedioDiario) : null;
      var status = deriveStatus(estoqueAtual, pontoRessuprimento);

      return {
        codigo_ax: codigoAx,
        estoque_atual: estoqueAtual,
        consumo_medio_diario: consumoMedioDiario,
        cobertura_dias: coberturaDias,
        ponto_ressuprimento: pontoRessuprimento,
        status_ressuprimento: status,
      };
    }

    function createOrder(payload) {
      Validators.validateSupplyOrderCreatePayload(payload || {});
      var codigoAx = String(payload.codigo_ax);
      var item = repositories.insumos.findByCodigoAx(codigoAx);
      if (!item) {
        throw new Errors.AppError('ITEM_INVALIDO', 'Insumo não encontrado', { codigo_ax: codigoAx }, 404);
      }

      var now = new Date().toISOString();
      var pedido = repositories.pedidos.insert({
        pedido_id: IdUtils.generateId(),
        codigo_ax: codigoAx,
        quantidade: Number(payload.quantidade),
        previsao_chegada_iso: payload.previsao_chegada_iso ? DateUtils.toIsoString(payload.previsao_chegada_iso) : '',
        status: payload.status || 'ABERTO',
        observacao: payload.observacao || '',
        created_at_iso: now,
        updated_at_iso: now,
      });
      return pedido;
    }

    function updateOrder(payload) {
      Validators.validateSupplyOrderUpdatePayload(payload || {});
      var existing = repositories.pedidos.findById(payload.pedido_id);
      if (!existing) {
        throw new Errors.AppError('ORDER_NOT_FOUND', 'Pedido não encontrado', { pedido_id: payload.pedido_id }, 404);
      }
      var patch = {
        updated_at_iso: new Date().toISOString(),
      };
      if (payload.status) patch.status = payload.status;
      if (payload.quantidade !== undefined) patch.quantidade = Number(payload.quantidade);
      if (payload.previsao_chegada_iso) patch.previsao_chegada_iso = DateUtils.toIsoString(payload.previsao_chegada_iso);
      if (payload.observacao !== undefined) patch.observacao = payload.observacao;

      repositories.pedidos.updateById(payload.pedido_id, patch);
      return repositories.pedidos.findById(payload.pedido_id);
    }

    function listOrders(payload) {
      payload = payload || {};
      return repositories.pedidos.list(payload.status);
    }

    return {
      getCoverage: getCoverage,
      createOrder: createOrder,
      updateOrder: updateOrder,
      listOrders: listOrders,
    };
  }

  return { create: create };
})();
