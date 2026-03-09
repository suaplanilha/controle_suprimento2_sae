var Errors = (function () {
  function AppError(code, message, details, status) {
    this.name = 'AppError';
    this.code = code || 'INTERNAL_ERROR';
    this.message = message || 'Erro interno';
    this.details = details || null;
    this.status = status || 400;
  }

  return { AppError: AppError };
})();
