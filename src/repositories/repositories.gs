var Repositories = (function () {
  var TABLES = {
    INSUMOS: 'insumos',
    SNAPSHOT: 'estoque_snapshot',
    MOVIMENTO: 'movimentacao_apurada',
    PEDIDOS: 'pedidos_ressuprimento',
    LOGS: 'logs_execucao',
    CONFIG: 'config',
  };

  function sortByIsoAsc(arr, field) {
    arr.sort(function (a, b) {
      return String(a[field]).localeCompare(String(b[field]));
    });
    return arr;
  }

  function create(gateway) {
    return {
      insumos: {
        findByCodigoAx: function (codigoAx) {
          return gateway.findOne(TABLES.INSUMOS, function (r) {
            return String(r.codigo_ax) === String(codigoAx);
          });
        },
        listActive: function () {
          return gateway.findMany(TABLES.INSUMOS, function (r) {
            return String(r.ativo || 'SIM') === 'SIM';
          });
        },
      },

      snapshots: {
        insert: function (snapshot) { return gateway.insert(TABLES.SNAPSHOT, snapshot); },
        updateById: function (id, patch) {
          return gateway.update(TABLES.SNAPSHOT, function (r) { return r.snapshot_id === id; }, function () { return patch; });
        },
        findByIdempotencyKey: function (key) {
          return gateway.findOne(TABLES.SNAPSHOT, function (r) { return r.idempotency_key === key; });
        },
        findPrevious: function (codigoAx, iso) {
          var all = gateway.findMany(TABLES.SNAPSHOT, function (r) {
            return String(r.codigo_ax) === String(codigoAx) && String(r.data_hora_lancamento_iso) < String(iso);
          });
          all.sort(function (a, b) {
            return String(b.data_hora_lancamento_iso).localeCompare(String(a.data_hora_lancamento_iso));
          });
          return all[0] || null;
        },
        findNext: function (codigoAx, iso) {
          var all = gateway.findMany(TABLES.SNAPSHOT, function (r) {
            return String(r.codigo_ax) === String(codigoAx) && String(r.data_hora_lancamento_iso) > String(iso);
          });
          all.sort(function (a, b) {
            return String(a.data_hora_lancamento_iso).localeCompare(String(b.data_hora_lancamento_iso));
          });
          return all[0] || null;
        },
        findLatestByCodigoAx: function (codigoAx) {
          var all = gateway.findMany(TABLES.SNAPSHOT, function (r) {
            return String(r.codigo_ax) === String(codigoAx);
          });
          all.sort(function (a, b) {
            return String(b.data_hora_lancamento_iso).localeCompare(String(a.data_hora_lancamento_iso));
          });
          return all[0] || null;
        },
      },

      movimentos: {
        insert: function (mov) { return gateway.insert(TABLES.MOVIMENTO, mov); },
        listByCodigoAxAndPeriod: function (codigoAx, inicioIso, fimIso) {
          return gateway.findMany(TABLES.MOVIMENTO, function (r) {
            var sameItem = codigoAx ? String(r.codigo_ax) === String(codigoAx) : true;
            var geStart = inicioIso ? String(r.data_hora_lancamento_iso) >= String(inicioIso) : true;
            var leEnd = fimIso ? String(r.data_hora_lancamento_iso) <= String(fimIso) : true;
            return sameItem && geStart && leEnd;
          });
        },
        listRecent: function (limit) {
          var all = gateway.findMany(TABLES.MOVIMENTO, function () { return true; });
          all.sort(function (a, b) {
            return String(b.data_hora_lancamento_iso).localeCompare(String(a.data_hora_lancamento_iso));
          });
          return all.slice(0, limit || 20);
        },
      },

      pedidos: {
        insert: function (pedido) { return gateway.insert(TABLES.PEDIDOS, pedido); },
        updateById: function (pedidoId, patch) {
          return gateway.update(TABLES.PEDIDOS, function (r) { return r.pedido_id === pedidoId; }, function () { return patch; });
        },
        findById: function (pedidoId) {
          return gateway.findOne(TABLES.PEDIDOS, function (r) { return r.pedido_id === pedidoId; });
        },
        list: function (status) {
          var rows = gateway.findMany(TABLES.PEDIDOS, function (r) {
            return status ? String(r.status) === String(status) : true;
          });
          return sortByIsoAsc(rows, 'created_at_iso');
        },
      },

      config: {
        list: function () {
          return gateway.findMany(TABLES.CONFIG, function () { return true; });
        },
        upsert: function (key, value) {
          var existing = gateway.findOne(TABLES.CONFIG, function (r) { return String(r.key) === String(key); });
          if (existing) {
            gateway.update(TABLES.CONFIG, function (r) { return String(r.key) === String(key); }, function () {
              return { value: value, updated_at_iso: new Date().toISOString() };
            });
            return gateway.findOne(TABLES.CONFIG, function (r) { return String(r.key) === String(key); });
          }
          return gateway.insert(TABLES.CONFIG, {
            config_id: IdUtils.generateId(),
            key: key,
            value: value,
            updated_at_iso: new Date().toISOString(),
          });
        },
      },

      logs: {
        insert: function (log) { return gateway.insert(TABLES.LOGS, log); },
      },
    };
  }

  return { TABLES: TABLES, create: create };
})();
