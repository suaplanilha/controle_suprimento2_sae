var DateUtils = (function () {
  function parseIso(iso) {
    var date = new Date(iso);
    if (isNaN(date.getTime())) {
      throw new Errors.AppError('INVALID_DATE', 'data_hora_lancamento_iso inválida', { value: iso }, 400);
    }
    return date;
  }

  function toIsoString(isoOrDate) {
    var date = isoOrDate instanceof Date ? isoOrDate : parseIso(isoOrDate);
    return date.toISOString();
  }

  return {
    parseIso: parseIso,
    toIsoString: toIsoString,
  };
})();
