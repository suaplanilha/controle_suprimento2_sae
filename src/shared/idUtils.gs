var IdUtils = (function () {
  function generateId() {
    if (typeof Utilities !== 'undefined' && Utilities.getUuid) {
      return Utilities.getUuid();
    }
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'id_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
  }

  return { generateId: generateId };
})();
