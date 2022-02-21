function onOpen() {
Logger.log('HW');
var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("main");
myFunction(sheet);
}


function req(name,url){
  start = Date.now();
  var response = UrlFetchApp.fetch(url);
  stat_code = response.getResponseCode();
  stop = Date.now();
  res = stop - start;
  //res = Math.floor(res / 1000);
  Logger.log(name + ' => ' + res+' ms');
  
  var timestamp = Utilities.formatDate(new Date(), 'Asia/Tehran', 'Y-M-d H:m:s');
  return [stat_code,res,timestamp];
}
 


function myFunction(sheet) { 

  rows = sheet.getDataRange(); 
  len = rows.getValues().length;
for(var i = 1; i < len; i++){
  name = rows.getValues()[i][0];
  url = rows.getValues()[i][1];
  result = req(name,url);
  if (result[0] != 200){
    status = 'Error;'
  }else{
    status = 'ok';
  }
  sheet.getRange(i+1,3,1,4).setValues([[status,result[2],result[0],result[1]+' ms']]);
}

  

}
