var AnalyticsService = (function () {
  function create(repositories) {
    function groupByDay(saidas) {
      var map = {};
      for (var i = 0; i < saidas.length; i += 1) {
        var day = String(saidas[i].data_hora_lancamento_iso).slice(0, 10);
        var value = Number(saidas[i].quantidade_movimento || 0);
        map[day] = (map[day] || 0) + value;
      }
      return map;
    }

    function groupByMonth(saidas) {
      var map = {};
      for (var i = 0; i < saidas.length; i += 1) {
        var month = String(saidas[i].data_hora_lancamento_iso).slice(0, 7);
        var value = Number(saidas[i].quantidade_movimento || 0);
        map[month] = (map[month] || 0) + value;
      }
      return map;
    }

    function listConsumptions(payload) {
      Validators.validateAnalyticsPayload(payload || {});
      var codigoAx = payload && payload.codigo_ax ? payload.codigo_ax : null;
      var inicioIso = payload && payload.inicio_iso ? payload.inicio_iso : null;
      var fimIso = payload && payload.fim_iso ? payload.fim_iso : null;

      var rows = repositories.movimentos.listByCodigoAxAndPeriod(codigoAx, inicioIso, fimIso);
      var saidas = rows.filter(function (r) {
        return String(r.tipo_movimento) === 'SAIDA' && String(r.entra_no_consumo) === 'SIM';
      });

      var totalSaidas = saidas.reduce(function (acc, row) {
        return acc + Number(row.quantidade_movimento || 0);
      }, 0);

      var dailyMap = groupByDay(saidas);
      var dailyKeys = Object.keys(dailyMap).sort();
      var daily = dailyKeys.map(function (k) {
        return { dia: k, quantidade: dailyMap[k] };
      });

      var monthlyMap = groupByMonth(saidas);
      var monthlyKeys = Object.keys(monthlyMap).sort();
      var monthly = monthlyKeys.map(function (k) {
        return { competencia: k, quantidade: monthlyMap[k] };
      });

      var mediaDiaria = daily.length ? totalSaidas / daily.length : 0;
      var mediaMensal = monthly.length ? totalSaidas / monthly.length : 0;

      return {
        filtro: {
          codigo_ax: codigoAx,
          inicio_iso: inicioIso,
          fim_iso: fimIso,
        },
        total_saidas: totalSaidas,
        media_diaria: mediaDiaria,
        media_mensal: mediaMensal,
        consumo_diario: daily,
        consumo_mensal: monthly,
      };
    }

    return {
      listConsumptions: listConsumptions,
    };
  }

  return { create: create };
})();
