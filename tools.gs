// @param  {数値}??????
// @return {str}￥???,???-
function parseYenStr(num){
  var numInt = parseInt(num,10);
  if(isNaN(numInt))return "￥0-";
  var numStr = String(numInt);
  var yenStr = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return ("￥" +  yenStr + "-");
}

//------------------------------------------------------------
// @return {DATE} year年month月の月はじめ
function getDateOfFirstDayOfMonth(year,month){
  var firstDate = new Date(year,month-1,1);
  return firstDate;
}

// @return {DATE} year年month月の月末
function getDateOfLastDayOfMonth(year,month){
  var lastDate = new Date(year,month,0);
  return lastDate;
}

// @param  {DATE}
// @return {str} yyyy-MM-dd形式で引数の日付
function parseDateStr(date){
  date = new Date(date);
  return Utilities.formatDate(date,'JST','yyyy-MM-dd');
}

// @return {str} yyyy-MM-dd形式で今日の日付
function getTodayStr(){
  var now = new Date();
  now = Utilities.formatDate(now,'JST','yyyy-MM-dd');
  return now;
}

// @return {str} yyyy/MM/dd HH:mm:ss形式で現在日付・時刻
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

// @param  userName {str} ユーザ名=シート名
// @return 成功:0 入力漏れ:-10 使用できないシート名:-11
function createUsersShtFromTmpl(userName,pass){
  if((!userName)||(!pass))return -10;
  if(isShtExist(userName))return -11;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tmplSht  = openShtByName("tmpl");
  const usersSht = tmplSht.copyTo(ss);
  usersSht.setName(userName);
  usersSht.getRange("B1").setValue(pass);
  usersSht.getRange("D1").setValue(getToken());
  return 0;
}

function test10(){
  Logger.log(createUsersShtFromTmpl("abc","pass"));
}