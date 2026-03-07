var SnapshotService = (function () {
  function create(repositories) {
    function log(level, action, message, details) {
      repositories.logs.insert({
        log_id: IdUtils.generateId(),
        created_at_iso: new Date().toISOString(),
        level: level,
        action: action,
        message: message,
        details_json: JSON.stringify(details || {}),
      });
    }

    function createSnapshot(rawPayload) {
      Validators.validateSnapshotPayload(rawPayload);

      var payload = {
        codigo_ax: String(rawPayload.codigo_ax),
        quantidade_atual: Number(rawPayload.quantidade_atual),
        tipo_contexto: rawPayload.tipo_contexto,
        data_hora_lancamento_iso: DateUtils.toIsoString(rawPayload.data_hora_lancamento_iso),
        observacao: rawPayload.observacao || '',
      };

      var item = repositories.insumos.findByCodigoAx(payload.codigo_ax);
      if (!item || String(item.ativo || 'SIM') !== 'SIM') {
        log('WARN', 'inventory.snapshot.create', 'Item inexistente ou inativo', { codigo_ax: payload.codigo_ax });
        throw new Errors.AppError('ITEM_INVALIDO', 'Insumo não encontrado ou inativo', { codigo_ax: payload.codigo_ax }, 404);
      }

      var idempotencyKey = payload.codigo_ax + '#' + payload.data_hora_lancamento_iso;
      var existing = repositories.snapshots.findByIdempotencyKey(idempotencyKey);
      if (existing) {
        log('INFO', 'inventory.snapshot.create', 'Snapshot idempotente detectado', { snapshot_id: existing.snapshot_id });
        return {
          snapshot: existing,
          previous_snapshot: repositories.snapshots.findPrevious(payload.codigo_ax, payload.data_hora_lancamento_iso),
          movement: null,
          idempotent_replay: true,
        };
      }

      var nextSnapshot = repositories.snapshots.findNext(payload.codigo_ax, payload.data_hora_lancamento_iso);
      if (nextSnapshot) {
        log('WARN', 'inventory.snapshot.create', 'Snapshot fora de ordem temporal', {
          codigo_ax: payload.codigo_ax,
          current_iso: payload.data_hora_lancamento_iso,
          next_iso: nextSnapshot.data_hora_lancamento_iso,
        });
        throw new Errors.AppError('OUT_OF_ORDER_SNAPSHOT', 'Snapshot fora de ordem temporal para o item', {
          codigo_ax: payload.codigo_ax,
          next_snapshot_iso: nextSnapshot.data_hora_lancamento_iso,
        }, 409);
      }

      var snapshot = repositories.snapshots.insert({
        snapshot_id: IdUtils.generateId(),
        codigo_ax: payload.codigo_ax,
        quantidade_atual: payload.quantidade_atual,
        tipo_contexto: payload.tipo_contexto,
        data_hora_lancamento_iso: payload.data_hora_lancamento_iso,
        observacao: payload.observacao,
        status_apuracao: 'PENDENTE',
        idempotency_key: idempotencyKey,
        created_at_iso: new Date().toISOString(),
      });

      log('INFO', 'inventory.snapshot.create', 'Snapshot gravado', { snapshot_id: snapshot.snapshot_id });

      var previous = repositories.snapshots.findPrevious(payload.codigo_ax, payload.data_hora_lancamento_iso);
      if (!previous) {
        repositories.snapshots.updateById(snapshot.snapshot_id, { status_apuracao: 'NAO_APURAVEL_INICIAL' });
        log('INFO', 'inventory.snapshot.create', 'Primeiro snapshot do item', { snapshot_id: snapshot.snapshot_id });
        snapshot.status_apuracao = 'NAO_APURAVEL_INICIAL';
        return {
          snapshot: snapshot,
          previous_snapshot: null,
          movement: null,
          idempotent_replay: false,
        };
      }

      var result = ReconciliationService.reconcile(previous, snapshot);
      var movement = repositories.movimentos.insert({
        movimento_id: IdUtils.generateId(),
        snapshot_id_origem: snapshot.snapshot_id,
        codigo_ax: payload.codigo_ax,
        data_hora_lancamento_iso: payload.data_hora_lancamento_iso,
        tipo_contexto: payload.tipo_contexto,
        tipo_movimento: result.tipo_movimento,
        quantidade_movimento: result.quantidade_movimento,
        delta_calculado: result.delta,
        entra_no_consumo: result.entra_no_consumo,
        created_at_iso: new Date().toISOString(),
      });

      repositories.snapshots.updateById(snapshot.snapshot_id, { status_apuracao: 'APURADO' });
      snapshot.status_apuracao = 'APURADO';

      log('INFO', 'inventory.snapshot.create', 'Movimentação apurada com sucesso', {
        snapshot_id: snapshot.snapshot_id,
        movimento_id: movement.movimento_id,
        tipo_movimento: movement.tipo_movimento,
      });

      return {
        snapshot: snapshot,
        previous_snapshot: previous,
        movement: movement,
        idempotent_replay: false,
      };
    }

    return { createSnapshot: createSnapshot };
  }

  return { create: create };
})();
