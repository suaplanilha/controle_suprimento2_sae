function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function doGet() {
  return HtmlService
    .createTemplateFromFile('Index')
    .evaluate()
    .setTitle('SAE - Controle de Suprimentos')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function parseRequest(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Errors.AppError('INVALID_REQUEST', 'Requisição inválida: corpo ausente', null, 400);
  }

  try {
    return JSON.parse(e.postData.contents);
  } catch (err) {
    throw new Errors.AppError('INVALID_JSON', 'JSON inválido no corpo da requisição', { raw: e.postData.contents }, 400);
  }
}

function resolveGateway() {
  var spreadsheetId = PropertiesService.getScriptProperties().getProperty('DB_SPREADSHEET_ID');
  if (!spreadsheetId) {
    throw new Errors.AppError('CONFIG_ERROR', 'DB_SPREADSHEET_ID não configurado', null, 500);
  }
  return new SheetsGateway.Gateway(spreadsheetId);
}

function executeAction(action, payload, gateway) {
  try {
    if (!action) {
      throw new Errors.AppError('VALIDATION_ERROR', 'action é obrigatória', null, 400);
    }

    var app = AppFactory.create(gateway);
    var handler = app.handlers[action];
    if (!handler) {
      throw new Errors.AppError('ACTION_NOT_FOUND', 'Ação não mapeada', { action: action }, 404);
    }

    var data = handler(payload || {});
    return Response.ok('Operação realizada com sucesso', data);
  } catch (error) {
    return Response.fail(error);
  }
}

function handleHttpPost(e, gateway) {
  try {
    var body = parseRequest(e);
    Validators.validateEnvelope(body);
    return executeAction(body.action, body.payload, gateway);
  } catch (error) {
    return Response.fail(error);
  }
}

function runAction(action, payload) {
  var gateway = resolveGateway();
  return executeAction(action, payload, gateway);
}

function doPost(e) {
  try {
    var gateway = resolveGateway();
    var response = handleHttpPost(e, gateway);
    return Response.toWebAppJson(response);
  } catch (error) {
    return Response.toWebAppJson(Response.fail(error));
  }
}
