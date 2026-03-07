var SheetsGateway = (function () {
  function Gateway(spreadsheetId) {
    this.spreadsheetId = spreadsheetId;
  }

  Gateway.prototype.getSheet = function (name) {
    var ss = SpreadsheetApp.openById(this.spreadsheetId);
    var sheet = ss.getSheetByName(name);
    if (!sheet) throw new Error('Aba não encontrada: ' + name);
    return sheet;
  };

  Gateway.prototype.getHeaders = function (sheet) {
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    return headers.map(function (h) { return String(h); });
  };

  Gateway.prototype.rowToObject = function (headers, row) {
    var out = {};
    for (var i = 0; i < headers.length; i += 1) {
      out[headers[i]] = row[i];
    }
    return out;
  };

  Gateway.prototype.objectToRow = function (headers, rowObj) {
    return headers.map(function (h) {
      return rowObj[h] !== undefined ? rowObj[h] : '';
    });
  };

  Gateway.prototype.insert = function (name, rowObj) {
    var sheet = this.getSheet(name);
    var headers = this.getHeaders(sheet);
    var row = this.objectToRow(headers, rowObj);
    sheet.appendRow(row);
    return rowObj;
  };

  Gateway.prototype.findMany = function (name, predicate) {
    var sheet = this.getSheet(name);
    var values = sheet.getDataRange().getValues();
    if (values.length < 2) return [];
    var headers = values[0].map(function (h) { return String(h); });
    var data = values.slice(1).map(function (r) {
      return this.rowToObject(headers, r);
    }, this);
    return data.filter(predicate);
  };

  Gateway.prototype.findOne = function (name, predicate) {
    var items = this.findMany(name, predicate);
    return items.length ? items[0] : null;
  };

  Gateway.prototype.update = function (name, predicate, updater) {
    var sheet = this.getSheet(name);
    var values = sheet.getDataRange().getValues();
    if (values.length < 2) return 0;
    var headers = values[0].map(function (h) { return String(h); });
    var count = 0;

    for (var r = 1; r < values.length; r += 1) {
      var rowObj = this.rowToObject(headers, values[r]);
      if (predicate(rowObj)) {
        var patch = updater(rowObj);
        for (var key in patch) {
          if (Object.prototype.hasOwnProperty.call(patch, key)) rowObj[key] = patch[key];
        }
        var nextRow = this.objectToRow(headers, rowObj);
        sheet.getRange(r + 1, 1, 1, headers.length).setValues([nextRow]);
        count += 1;
      }
    }
    return count;
  };

  return { Gateway: Gateway };
})();
