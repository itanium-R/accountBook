// @return yyyy/MM/dd形式で今日の日付
function getToday(){
  var now = new Date();
  now = Utilities.formatDate(now,'JST','yyyy/MM/dd');
  return now;
}

// @return yyyy/MM/dd HH:mm:ss形式で現在日付・時刻
function getNow(){
  var now = new Date();
  now = Utilities.formatDate(now,'JST','yyyy/MM/dd HH:mm:ss');
  return now;
}
//------------------------------------------------------------

//アクティブスプレッドシートのnameシートを開く函数
// @param  name {str} シート名
// @return {sheetObject}
function openShtByName(name){
  try{
    const ss = SpreadsheetApp.getActiveSpreadsheet(); //アクティブスプレッドシートを開く->ss
    const sss = ss.getSheetByName(name);              //nameという名前のシートを開く->sss
    return sss;
  }catch(e){                                          //エラー発生時は表示
    Browser.msgBox("シートを開けませんでした");
    return -1;
  }
}
//------------------------------------------------------------
// @param  shtName {str} シート名
// @return シートが存在:true　ない:false
function isShtExist(shtName){
  const ss =SpreadsheetApp.getActiveSpreadsheet();
  const sheetCnt = ss.getNumSheets();
  var sheet;
  for(var i=0;i<sheetCnt;i++){
    sheet = ss.getSheets()[i];
    if(ss.getSheets()[i].getName()==shtName){
      return true;
    }
  }
  return false;
}

function createUsersShtFromTmpl(tmplName,userName){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tmplSht  = nameOpen(tmplName);
  const usersSht = tmplSht.copyTo(ss);
  usersSht.setName(userName);
  return usersSht;
}

function test10(){
  Logger.log();
}