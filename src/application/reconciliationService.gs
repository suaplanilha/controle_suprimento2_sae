var ReconciliationService = (function () {
  function classifyByContext(delta, tipoContexto) {
    if (tipoContexto === 'INVENTARIO') {
      return { tipo_movimento: 'AJUSTE_INVENTARIO', quantidade_movimento: Math.abs(delta), entra_no_consumo: 'NAO' };
    }

    if (tipoContexto === 'AJUSTE') {
      return { tipo_movimento: 'AJUSTE_MANUAL', quantidade_movimento: Math.abs(delta), entra_no_consumo: 'NAO' };
    }

    if (delta > 0) {
      return { tipo_movimento: 'SAIDA', quantidade_movimento: delta, entra_no_consumo: 'SIM' };
    }

    if (delta < 0) {
      return { tipo_movimento: 'ENTRADA', quantidade_movimento: Math.abs(delta), entra_no_consumo: 'NAO' };
    }

    return { tipo_movimento: 'SEM_VARIACAO', quantidade_movimento: 0, entra_no_consumo: 'NAO' };
  }

  function reconcile(previousSnapshot, currentSnapshot) {
    var delta = Number(previousSnapshot.quantidade_atual) - Number(currentSnapshot.quantidade_atual);
    var movement = classifyByContext(delta, currentSnapshot.tipo_contexto);
    return {
      delta: delta,
      tipo_movimento: movement.tipo_movimento,
      quantidade_movimento: movement.quantidade_movimento,
      entra_no_consumo: movement.entra_no_consumo,
    };
  }

  return { classifyByContext: classifyByContext, reconcile: reconcile };
})();
