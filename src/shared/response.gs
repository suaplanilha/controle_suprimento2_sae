var Response = (function () {
  function ok(message, data, meta) {
    return {
      ok: true,
      message: message || 'OK',
      data: data || {},
      meta: meta || null,
    };
  }

  function fail(error) {
    return {
      ok: false,
      message: error && error.message ? error.message : 'Erro interno',
      error: {
        code: error && error.code ? error.code : 'INTERNAL_ERROR',
        details: error && error.details ? error.details : null,
      },
    };
  }

  function toWebAppJson(payload) {
    var text = JSON.stringify(payload);
    if (typeof ContentService !== 'undefined') {
      return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.JSON);
    }
    return text;
  }

  return { ok: ok, fail: fail, toWebAppJson: toWebAppJson };
})();
