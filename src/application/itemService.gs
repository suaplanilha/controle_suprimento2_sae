var ItemService = (function () {
  function create(repositories) {
    function list(payload) {
      payload = payload || {};
      var activeOnly = payload.active_only !== false;
      var rows = activeOnly ? repositories.insumos.listActive() : repositories.insumos.listActive();
      return rows.map(function (r) {
        return {
          codigo_ax: r.codigo_ax,
          descricao: r.descricao || '',
          unidade: r.unidade || '',
          ponto_ressuprimento: Number(r.ponto_ressuprimento || 0),
          ativo: String(r.ativo || 'SIM'),
        };
      });
    }
    return { list: list };
  }

  return { create: create };
})();
