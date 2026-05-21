const SPREADSHEET_ID = '1_xOjYXh_PQzXERVyp-k_lyge9jAxiWTPAedS6lOdl0c';
const SHEET_NAME = 'Responses';

function doGet(e) {
  var action = e && e.parameter ? e.parameter.action : '';
  if (action === 'submissions') {
    return jsonOutput({
      success: true,
      submissions: getSubmissionSummaries()
    });
  }

  return jsonOutput({
    success: true,
    app: 'Peer Grade Allocator',
    message: 'GAS Web App endpoint is live.'
  });
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var result = submitData(payload);
    return jsonOutput(result);
  } catch (error) {
    return jsonOutput({
      success: false,
      error: error && error.message ? error.message : 'Unable to submit response.'
    });
  }
}

function doOptions(e) {
  return jsonOutput({
    success: true
  });
}

// Deploy the Web App with "Anyone" access so GitHub Pages can submit without Google login.
function submitData(payload) {
  validatePayload(payload);

  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw new Error('Responses sheet was not found.');
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  if (!headers.length || headers.every(function(header) { return !header; })) {
    throw new Error('Responses sheet must already have row 1 headers.');
  }

  var submittedAt = new Date();
  var row = headers.map(function(header) {
    return valueForHeader(header, payload, submittedAt);
  });

  sheet.appendRow(row);
  return { success: true };
}

function validatePayload(payload) {
  if (!payload) {
    throw new Error('Missing submission payload.');
  }

  if (!payload.submitterName || !payload.period || !payload.country) {
    throw new Error('Submission is missing required class or student information.');
  }

  if (!payload.peers || payload.peers.length !== 4) {
    throw new Error('Submission must include four peer allocations.');
  }

  var total = payload.peers.reduce(function(sum, peer) {
    return sum + Number(peer.percent || 0);
  }, 0);

  if (total !== 100) {
    throw new Error('Percentages must total exactly 100%.');
  }
}

function valueForHeader(header, payload, submittedAt) {
  var normalized = normalizeHeader(header);
  var directValues = {
    timestamp: submittedAt,
    submittedat: submittedAt,
    date: submittedAt,
    submittername: payload.submitterName,
    name: payload.submitterName,
    period: payload.period,
    classperiod: payload.period,
    country: payload.country
  };

  if (Object.prototype.hasOwnProperty.call(directValues, normalized)) {
    return directValues[normalized];
  }

  var peerMatch = normalized.match(/^(?:peer|student|member)([1-4])(name|percent|percentage|justification|reason|rationale)$/);
  if (peerMatch) {
    var peer = payload.peers[Number(peerMatch[1]) - 1];
    var field = peerMatch[2];
    if (field === 'name') {
      return peer.name;
    }
    if (field === 'percent' || field === 'percentage') {
      return peer.percent;
    }
    return peer.justification;
  }

  return '';
}

function normalizeHeader(header) {
  return String(header || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function getSubmissionSummaries() {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet) {
    return [];
  }

  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();
  if (lastRow < 2 || lastColumn < 1) {
    return [];
  }

  var headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  var rows = sheet.getRange(2, 1, lastRow - 1, lastColumn).getValues();
  var headerMap = buildHeaderMap(headers);

  return rows
    .map(function(row) {
      return {
        submitterName: readValue(row, headerMap, ['submittername', 'name']),
        period: readValue(row, headerMap, ['period', 'classperiod']),
        country: readValue(row, headerMap, ['country']),
        timestamp: serializeTimestamp(readValue(row, headerMap, ['timestamp', 'submittedat', 'date']))
      };
    })
    .filter(function(entry) {
      return entry.submitterName || entry.period || entry.country || entry.timestamp;
    })
    .sort(function(a, b) {
      return toSortableTime(b.timestamp) - toSortableTime(a.timestamp);
    });
}

function buildHeaderMap(headers) {
  return headers.reduce(function(map, header, index) {
    var normalized = normalizeHeader(header);
    if (normalized && typeof map[normalized] === 'undefined') {
      map[normalized] = index;
    }
    return map;
  }, {});
}

function readValue(row, headerMap, keys) {
  for (var i = 0; i < keys.length; i += 1) {
    var index = headerMap[keys[i]];
    if (typeof index !== 'undefined') {
      return row[index];
    }
  }
  return '';
}

function serializeTimestamp(value) {
  if (!value) {
    return '';
  }
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) {
    return value.toISOString();
  }
  return String(value);
}

function toSortableTime(value) {
  if (!value) {
    return 0;
  }
  var time = new Date(value).getTime();
  return isNaN(time) ? 0 : time;
}

function jsonOutput(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
