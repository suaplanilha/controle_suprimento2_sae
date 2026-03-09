var Validators = (function () {
  var CONTEXTS = ['FECHAMENTO_DIARIO', 'LEITURA_INTERMEDIARIA', 'INVENTARIO', 'AJUSTE'];
  var ORDER_STATUS = ['ABERTO', 'EM_TRANSITO', 'RECEBIDO', 'CANCELADO'];

  function requireField(obj, field) {
    if (!obj || obj[field] === undefined || obj[field] === null || obj[field] === '') {
      throw new Errors.AppError('VALIDATION_ERROR', 'Campo obrigatório ausente: ' + field, { field: field }, 400);
    }
  }

  function validateEnvelope(body) {
    requireField(body, 'action');
    requireField(body, 'payload');
  }

  function validateSnapshotPayload(payload) {
    requireField(payload, 'codigo_ax');
    requireField(payload, 'quantidade_atual');
    requireField(payload, 'tipo_contexto');
    requireField(payload, 'data_hora_lancamento_iso');

    if (typeof payload.codigo_ax !== 'string' && typeof payload.codigo_ax !== 'number') {
      throw new Errors.AppError('VALIDATION_ERROR', 'codigo_ax deve ser string ou número', { field: 'codigo_ax' }, 400);
    }

    var quantity = Number(payload.quantidade_atual);
    if (isNaN(quantity) || quantity < 0) {
      throw new Errors.AppError('VALIDATION_ERROR', 'quantidade_atual deve ser número >= 0', { field: 'quantidade_atual' }, 400);
    }

    if (CONTEXTS.indexOf(payload.tipo_contexto) === -1) {
      throw new Errors.AppError('VALIDATION_ERROR', 'tipo_contexto inválido', { allowed: CONTEXTS }, 400);
    }

    DateUtils.parseIso(payload.data_hora_lancamento_iso);
  }

  function validateAnalyticsPayload(payload) {
    if (payload.inicio_iso) DateUtils.parseIso(payload.inicio_iso);
    if (payload.fim_iso) DateUtils.parseIso(payload.fim_iso);
  }

  function validateCoveragePayload(payload) {
    requireField(payload, 'codigo_ax');
    if (payload.estoque_atual !== undefined) {
      var estoque = Number(payload.estoque_atual);
      if (isNaN(estoque) || estoque < 0) {
        throw new Errors.AppError('VALIDATION_ERROR', 'estoque_atual inválido', { field: 'estoque_atual' }, 400);
      }
    }
  }

  function validateSupplyOrderCreatePayload(payload) {
    requireField(payload, 'codigo_ax');
    requireField(payload, 'quantidade');
    var q = Number(payload.quantidade);
    if (isNaN(q) || q <= 0) {
      throw new Errors.AppError('VALIDATION_ERROR', 'quantidade deve ser > 0', { field: 'quantidade' }, 400);
    }
    if (payload.previsao_chegada_iso) DateUtils.parseIso(payload.previsao_chegada_iso);
  }

  function validateSupplyOrderUpdatePayload(payload) {
    requireField(payload, 'pedido_id');
    if (payload.status && ORDER_STATUS.indexOf(payload.status) === -1) {
      throw new Errors.AppError('VALIDATION_ERROR', 'status inválido', { allowed: ORDER_STATUS }, 400);
    }
    if (payload.previsao_chegada_iso) DateUtils.parseIso(payload.previsao_chegada_iso);
  }

  return {
    CONTEXTS: CONTEXTS,
    ORDER_STATUS: ORDER_STATUS,
    validateEnvelope: validateEnvelope,
    validateSnapshotPayload: validateSnapshotPayload,
    validateAnalyticsPayload: validateAnalyticsPayload,
    validateCoveragePayload: validateCoveragePayload,
    validateSupplyOrderCreatePayload: validateSupplyOrderCreatePayload,
    validateSupplyOrderUpdatePayload: validateSupplyOrderUpdatePayload,
  };
})();
