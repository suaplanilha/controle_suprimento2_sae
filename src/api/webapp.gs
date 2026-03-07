
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

function handleHttpPost(e, gateway) {
  try {
    var body = parseRequest(e);
    Validators.validateEnvelope(body);

    var app = AppFactory.create(gateway);
    var handler = app.handlers[body.action];
    if (!handler) {
      throw new Errors.AppError('ACTION_NOT_FOUND', 'Ação não mapeada', { action: body.action }, 404);
    }

    var data = handler(body.payload);
    return Response.ok('Operação realizada com sucesso', data);
  } catch (error) {
    return Response.fail(error);
  }
}

function doPost(e) {
  var spreadsheetId = PropertiesService.getScriptProperties().getProperty('DB_SPREADSHEET_ID');
  if (!spreadsheetId) {
    return Response.toWebAppJson(Response.fail(new Errors.AppError('CONFIG_ERROR', 'DB_SPREADSHEET_ID não configurado', null, 500)));
  }

  var gateway = new SheetsGateway.Gateway(spreadsheetId);
  var response = handleHttpPost(e, gateway);
  return Response.toWebAppJson(response);
}
