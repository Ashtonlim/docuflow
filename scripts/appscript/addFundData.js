const addData = async () => {
  const START_FROM_ROW = 10;

  // testing sheet
  // const sheetName = 'Pulled Data from FSMONE'

  // real sheet
  const sheetName = "Portfolio Constructor";

  const sheet = getSpecificSheet(sheetName);
  // Logger.log(`Sheet ${sheetName} ${sheet ? 'found' : 'not found'}`)

  if (!sheet) {
    Logger.log(`Sheet ${sheetName} not found`);
    return false;
  }

  funds = [
    "NBB047",
    "ALZ210",
    "370190",
    "ALZ001",
    "DBS013",
    "DBS015",
    "MNG007",
    "ALZ248",
  ];

  for (let [i, fundCode] of funds.entries()) {
    Logger.log(`Getting data for ${fundCode}`);
    await insertFundData(sheet, fundCode, START_FROM_ROW + i);
  }
};

// API reference
// https://secure.fundsupermart.com/fsmone/rest/fund/get-factsheet-data/370190
// https://secure.fundsupermart.com/fsmone/rest/fund/get-factsheet-price-date-data/370190
// https://secure.fundsupermart.com/fsmone/rest/fund/get-factsheet-data/370190
const insertFundData = async (sheet, fundCode, startRow) => {
  const URL_BASE = `https://secure.fundsupermart.com/fsmone/rest/fund/`;
  const MAIN = `get-factsheet-data/${fundCode}/`;
  const PRICE = `get-factsheet-price-date-data/${fundCode}/`;

  var options = { method: "POST", contentType: "application/json" };

  // Logger.log(`get main ${URL_BASE + MAIN}`)
  // Logger.log(`get price ${URL_BASE + PRICE}`)

  var mainRes = await UrlFetchApp.fetch(URL_BASE + MAIN, options); // Make the request to FSM servers
  var priceRes = await UrlFetchApp.fetch(URL_BASE + PRICE, options); // Make the request to FSM servers

  var mainResJson = mainRes.getContentText();
  var priceResJson = priceRes.getContentText();
  // Logger.log(`Api mainRes: ${mainRes}`);

  var mainData = JSON.parse(mainResJson);
  var priceData = JSON.parse(priceResJson);

  const none = "MISSING";

  const yr5Ret = mainData?.sectorPerformanceFcChartData?.[7]?.[1]?.toFixed(2);
  const dy = (mainData?.fundInfoDisplay?.dividendYield * 100)?.toFixed(2);
  const price = priceData?.dailyPrice?.toFixed(2);

  sheet.getRange(`C${startRow}`).setValue(yr5Ret ? `${yr5Ret}%` : none);
  sheet.getRange(`D${startRow}`).setValue(dy ? `${dy}%` : none);
  sheet.getRange(`E${startRow}`).setValue(price ? `SGD ${price}` : none);
};

const getSpecificSheet = (sheetName) => {
  // Get the active spreadsheet (the one the script is bound to)
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  // Get the sheet by its name
  const sheet = spreadsheet.getSheetByName(sheetName);
  return sheet;
};
