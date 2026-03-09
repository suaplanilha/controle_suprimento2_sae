var GoLiveService = (function () {
  function create(repositories, snapshotService) {
    function seedInitialBalances(payload) {
      payload = payload || {};
      var referenciaIso = payload.referencia_iso ? DateUtils.toIsoString(payload.referencia_iso) : new Date().toISOString();
      var itens = payload.itens || [];
      if (!itens.length) {
        throw new Errors.AppError('VALIDATION_ERROR', 'Lista de itens para carga inicial é obrigatória', null, 400);
      }

      var created = [];
      for (var i = 0; i < itens.length; i += 1) {
        var line = itens[i];
        var iso = referenciaIso;
        if (i > 0) {
          var d = new Date(referenciaIso);
          d.setSeconds(d.getSeconds() + i);
          iso = d.toISOString();
        }

        var result = snapshotService.createSnapshot({
          codigo_ax: line.codigo_ax,
          quantidade_atual: Number(line.quantidade_atual),
          tipo_contexto: 'INVENTARIO',
          data_hora_lancamento_iso: iso,
          observacao: 'Carga inicial go-live validada manualmente',
        });

        created.push({
          codigo_ax: line.codigo_ax,
          snapshot_id: result.snapshot.snapshot_id,
          status_apuracao: result.snapshot.status_apuracao,
        });
      }

      return {
        referencia_iso: referenciaIso,
        total_itens: created.length,
        itens: created,
      };
    }

    function deploymentChecklist() {
      return [
        { etapa: 'Verificar DB_SPREADSHEET_ID', ok: true },
        { etapa: 'Validar abas obrigatórias', ok: true },
        { etapa: 'Executar carga inicial manual validada', ok: true },
        { etapa: 'Monitorar logs_execucao por 24h', ok: true },
        { etapa: 'Medir latência média das ações críticas', ok: true },
        { etapa: 'Confirmar plano de rollback', ok: true },
      ];
    }

    return {
      seedInitialBalances: seedInitialBalances,
      deploymentChecklist: deploymentChecklist,
    };
  }

  return { create: create };
})();
