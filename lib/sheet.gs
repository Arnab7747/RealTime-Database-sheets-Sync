function getEnvironment() {
  var environment = {
    authToken: "<Your Auth Token>",
    apiUrl: "<Your Server Endpoint>"
  };
  return environment;
}

function refresh() {
  const reqHeaders = {
    'ngrok-skip-browser-warning': '69420',
    'Authorization': getEnvironment().authToken
  };
  const apiUrl = `${getEnvironment().apiUrl}/realtime`;
  const options = {
    method: 'GET',
    contentType: 'application/json',
    headers: reqHeaders,
  };

  UrlFetchApp.fetch(apiUrl, options);
}

function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  const range = e.range;
  const newValue = e.value;
  const oldValue = e.oldValue;
  const row = range.getRow();
  const col = range.getColumn();

  const totalRowsBefore = sheet.getMaxRows();
  const totalRowsAfter = (sheet.getLastRow() - 1);

  console.log("Max Row (totalRowsBefore) : ", totalRowsBefore);
  console.log("Last Row (totalRowsAfter) : ", totalRowsAfter);

  console.log("Old Data : ", oldValue);
  console.log("New Data : ", newValue);

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const newRowData = sheet.getRange(row, 1, 1, headers.length).getValues()[0];

  const oldRowData = [];
  for (let i = 0; i < headers.length; i++) {
    if (i + 1 === col) {
      oldRowData.push(e.oldValue);
    } else {
      oldRowData.push(newRowData[i]);
    }
  }

  console.log("Old Row Data: ", oldRowData);
  console.log("New Row Data: ", newRowData);

  const newPayload = {};
  headers.forEach((header, index) => {
    newPayload[header] = newRowData[index];
  });

  const oldPayload = {};
  headers.forEach((header, index) => {
    oldPayload[header] = oldRowData[index];
  });

  const metadataSheet = e.source.getSheetByName("Metadata");
  const metadataValue = metadataSheet.getRange("B1").getValue();
  console.log("Metadata value in B1: ", metadataValue);

  const ids = sheet.getRange(`A2:A${totalRowsAfter + 1}`).getValues().flat().filter(Boolean); // Get non-empty values
  console.log("ID Columns values: ", ids);

  let action;
  if (totalRowsAfter > metadataValue) {
    action = "add";
  } else if (totalRowsAfter < metadataValue) {
    action = "delete";
  } else {
    action = "update";
  }

  console.log("Action: ", action);

  const reqHeaders = {
    'ngrok-skip-browser-warning': '69420',
    'Authorization': getEnvironment().authToken
  };
  const apiUrl = `${getEnvironment().apiUrl}/realtime`;
  const options = {
    method: 'POST',
    contentType: 'application/json',
    headers: reqHeaders,
    payload: JSON.stringify({
      action: action,
      oldData: oldPayload,
      newData: newPayload,
      oldValue: oldValue,
      newValue: newValue,
      row: row,
      ids: (action === "delete") ? ids : [],
      totalRowsAfter: totalRowsAfter,
      totalRowsBefore: totalRowsBefore
    }),
  };

  UrlFetchApp.fetch(apiUrl, options);
}