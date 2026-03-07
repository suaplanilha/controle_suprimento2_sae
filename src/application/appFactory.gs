var AppFactory = (function () {
  function create(gateway) {
    var repositories = Repositories.create(gateway);
    var snapshotService = SnapshotService.create(repositories);
    var analyticsService = AnalyticsService.create(repositories);
    var supplyService = SupplyService.create(repositories, analyticsService);
    var itemService = ItemService.create(repositories);
    var dashboardService = DashboardService.create(repositories, analyticsService, supplyService);
    var goLiveService = GoLiveService.create(repositories, snapshotService);

    var handlers = {
      'inventory.snapshot.create': function (payload) {
        return snapshotService.createSnapshot(payload);
      },
      'analytics.consumption': function (payload) {
        return analyticsService.listConsumptions(payload || {});
      },
      'analytics.coverage': function (payload) {
        return supplyService.getCoverage(payload || {});
      },
      'supply.order.create': function (payload) {
        return supplyService.createOrder(payload || {});
      },
      'supply.order.update': function (payload) {
        return supplyService.updateOrder(payload || {});
      },
      'supply.order.list': function (payload) {
        return supplyService.listOrders(payload || {});
      },
      'item.list': function (payload) {
        return itemService.list(payload || {});
      },
      'inventory.movement.list': function (payload) {
        payload = payload || {};
        return repositories.movimentos.listByCodigoAxAndPeriod(payload.codigo_ax, payload.inicio_iso, payload.fim_iso);
      },
      'dashboard.summary': function () {
        return dashboardService.summary();
      },
      'config.upsert': function (payload) {
        if (!payload || !payload.key) throw new Errors.AppError('VALIDATION_ERROR', 'key é obrigatório', null, 400);
        return repositories.config.upsert(payload.key, payload.value);
      },
      'config.list': function () {
        return repositories.config.list();
      },

      'golive.seed.initial': function (payload) {
        return goLiveService.seedInitialBalances(payload || {});
      },
      'golive.checklist': function () {
        return goLiveService.deploymentChecklist();
      },
    };

    return { handlers: handlers };
  }

  return { create: create };
})();
