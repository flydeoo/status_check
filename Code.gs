// Create custom menu when spreadsheet opens.
function onOpen() {

  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  var menuOptions = [{
    name: 'Check Status',
    functionName: 'checkStatus'
  }];

  spreadsheet.addMenu('Manage', menuOptions);
}

// Check status of each website in Websites sheet.
function checkStatus() {

  var domainSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Domains');
  var statusSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Status');
  var rows = domainSheet.getDataRange().getValues();
  var issues = 0;

  // Remove column headings row.
  rows.shift();

  // Clear Status and Last Check columns.
  domainSheet.getRange('C2:D').clear();

  // Loop through rows in sheet and make a request to website url.
  for (var i = 0; i < rows.length; i++) {

    var row = rows[i];
    var name = row[0];
    var url = row[1];
    var status = 'OK';
    var color = '#bfb';
    var timestamp = Utilities.formatDate(new Date(), 'Asia/Tehran', 'Y-M-d H:m:s');

    if (url) {

      try {
        var response = UrlFetchApp.fetch(url, {muteHttpExceptions: true});
        responseCode = response.getResponseCode();
      } catch (e) {
        var responseCode = 500;
      }

      // There's an issue if the response code is greater than 200.
      if (responseCode >= 400) {
        status = 'ISSUE';
        color = '#faa';
        issues++;

        statusSheet.appendRow([url, timestamp, responseCode, response.getContentText]);
      }

      // Update Status and Last Check columns with results.
      domainSheet.getRange(i + 2, 3, 1, 3).setValues([[status, timestamp, responseCode]]).setBackground(color);

      // There are rate limits when using UrlFetch so it's recommended to add a delay in between each request.
      Utilities.sleep(1000);

    }
  }

  // Notify me if there are issues.
  if (issues > 0) {
    //notify();
  }
}
