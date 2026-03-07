var InMemoryGateway = (function () {
  function Gateway(seed) {
    this.tables = seed || {};
  }

  Gateway.prototype.ensure = function (name) {
    if (!this.tables[name]) this.tables[name] = [];
    return this.tables[name];
  };

  Gateway.prototype.insert = function (name, row) {
    this.ensure(name).push(JSON.parse(JSON.stringify(row)));
    return JSON.parse(JSON.stringify(row));
  };

  Gateway.prototype.update = function (name, predicate, updater) {
    var table = this.ensure(name);
    var count = 0;
    for (var i = 0; i < table.length; i += 1) {
      if (predicate(table[i])) {
        var patch = updater(table[i]);
        for (var key in patch) {
          if (Object.prototype.hasOwnProperty.call(patch, key)) {
            table[i][key] = patch[key];
          }
        }
        count += 1;
      }
    }
    return count;
  };

  Gateway.prototype.findOne = function (name, predicate) {
    var rows = this.ensure(name);
    for (var i = 0; i < rows.length; i += 1) {
      if (predicate(rows[i])) return rows[i];
    }
    return null;
  };

  Gateway.prototype.findMany = function (name, predicate) {
    var rows = this.ensure(name);
    var out = [];
    for (var i = 0; i < rows.length; i += 1) {
      if (predicate(rows[i])) out.push(rows[i]);
    }
    return out;
  };

  return { Gateway: Gateway };
})();
