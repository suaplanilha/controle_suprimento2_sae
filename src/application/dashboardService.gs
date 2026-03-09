var DashboardService = (function () {
  function create(repositories, analyticsService, supplyService) {
    function summary() {
      var items = repositories.insumos.listActive();
      var criticos = [];
      var estoqueAtual = [];

      for (var i = 0; i < items.length; i += 1) {
        var codigoAx = String(items[i].codigo_ax);
        var coverage = supplyService.getCoverage({ codigo_ax: codigoAx });
        estoqueAtual.push({ codigo_ax: codigoAx, estoque_atual: coverage.estoque_atual });
        if (coverage.status_ressuprimento !== 'OK') {
          criticos.push(coverage);
        }
      }

      var pedidosAbertos = repositories.pedidos.list('ABERTO');
      var consumoGlobal = analyticsService.listConsumptions({});
      var recentes = repositories.movimentos.listRecent(20);

      return {
        total_itens_ativos: items.length,
        itens_criticos: criticos,
        pedidos_abertos: pedidosAbertos,
        estoque_atual: estoqueAtual,
        consumo_global: {
          total_saidas: consumoGlobal.total_saidas,
          media_diaria: consumoGlobal.media_diaria,
          media_mensal: consumoGlobal.media_mensal,
        },
        ultimos_movimentos: recentes,
      };
    }

    return { summary: summary };
  }

  return { create: create };
})();
