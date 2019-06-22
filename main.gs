// @param  id     {str} user       id = shtName
// @param  token  {str} usersToken 認証用
// @return TOP用html
function loadTop(id,token){  
  if(!userAuthByToken(id,token))return -1;
  
  const sht          = openShtByName(id);
  var   thisMonthCnt = sht.getRange("E4").getValue();
  var   thisMonthSum = sht.getRange("K2").getValue();
  var   outTopHtml   = "";
  
  // 今月総支出額
  outTopHtml += "今月の総支出額<br>";
  outTopHtml += "<font class='bigFont'>" + parseYenStr(thisMonthSum) + "</font>";
  outTopHtml += "<hr>";
  
  // 今月項目別支出額
  if(thisMonthCnt){
    var thisMonthExpItemList = sht.getRange(6,10,thisMonthCnt,2).getValues();
    
    outTopHtml +="今月の費目別支出ランキング";
    outTopHtml +="<table>";
    for(var i=0;i<thisMonthCnt;i++){
      if(thisMonthExpItemList[i][0] == "")break;
      outTopHtml += "<tr><td>" + thisMonthExpItemList[i][0] + "</td>"
                 +      "<td>" + parseYenStr(thisMonthExpItemList[i][1]) + "</td></tr>";
    }
    outTopHtml += "</table>";
  }
  
  return outTopHtml;
}

// @param  id           {str} user       id = shtName
// @param  token        {str} usersToken 認証用
// @param  selectElemId {str} 生成するselectのid
// @return expenseItemsをselectタグで格納したhtml
function loadExpenseItem(id,token,selectElemId){  
  if(!userAuthByToken(id,token))return -1;
  
  const sht        = openShtByName(id);
  const num = sht.getRange("B4").getValue();
  var outHtmlSelect="";
  var expenseItemList= sht.getRange(6,2,num,1).getValues();
  
  outHtmlSelect ='<select id="' + selectElemId + '">';
  for(var i=0;i<num;i++){
    outHtmlSelect += '<option value="'+expenseItemList[i][0] + '">'
                  +  expenseItemList[i][0] + '</option>';
  }
  outHtmlSelect+='</select>';
  //Logger.log(outHtmlSelect);
  return outHtmlSelect;
}

// @param  id     {str} user       id = shtName
// @param  token  {str} usersToken 認証用
// @param  year   {int} 年
// @param  month  {int} 月
// @return 引数の月のレコードをtableに格納したHTML
function loadMonthRecordTable(id,token,year,month){
  if(!userAuthByToken(id,token))return -1;
  
  const sht        = openShtByName(id);
  const noneRecode = year + "年" + month + "月" +"<hr>この月のデータはありません"
  var recordListCnt   = sht.getRange("D4").getValue();
  var allrecordList   = sht.getRange(6,4,recordListCnt,5).getValues();
  var firstDate    = getDateOfFirstDayOfMonth(year,month);
  var lastDate     = getDateOfLastDayOfMonth(year,month);
  var startIndex,endIndex;
  
  // 開始のindexを探索 //TODO:record量が多くなると過去データの探索に時間がかかるのを改善
  for(startIndex = 0;startIndex < recordListCnt;startIndex++){
    if(allrecordList[startIndex][0]<=lastDate)break;
  } 
  if(startIndex==recordListCnt){ // 該当rocordなし
    return noneRecode;
  }
  
  // 終了のindexを探索
  for(endIndex=startIndex;endIndex<recordListCnt;endIndex++){
    if(allrecordList[endIndex][0]<firstDate)break;
  }
  endIndex-=1;
  if(endIndex<startIndex){ // 該当rocordなし
    return noneRecode;
  }
    
  return (loadTable(allrecordList,startIndex,endIndex));
}

// @param  recordList 2次元配列のレコード //2次元配列は参照渡しされていることに注意
// @return outHtmlTable
function loadTable(recordList,startIndex,endIndex){
  var outHtmlTable = "<table>";
  var day ="";
  startIndex = startIndex || 0;
  endIndex   = endIndex   || recordList.length-1;
  
  //outHtmlTable には "<table><tr><td></td><td></td><td></td><td></td></tr></table>"のように格納
  for(var i=startIndex;i<=endIndex;i++){
    var thisDay = parseDateStr(recordList[i][0]);
    if(day != thisDay){
      outHtmlTable += "<tr class='BG-EEE'><td colspan='4'><b>" + thisDay + "</b></td></tr>";
      day           = thisDay;
    }
    var concat = '"' + buildRecordConcat(recordList[i]) + '"';
    outHtmlTable += "<tr class='BG-FFF' onclick='loadAndShowRecord(" + i + "," + concat + ")'>";
    outHtmlTable += "<td>" + recordList[i][1] + "</td>";
    outHtmlTable += "<td>" + recordList[i][2] + "</td>";
    outHtmlTable += "<td>" + parseYenStr(recordList[i][3]) + "</td>";
    outHtmlTable += "<td>";
    if(recordList[i][4])outHtmlTable += "ﾒﾓ";
    outHtmlTable += "</td></tr>";
  }
  outHtmlTable += "</table>";
  
  return outHtmlTable;
}

//---------------------------------------------
// 新しいレコード追加（家計簿記入）
// @param  id          {str} user       id = shtName
// @param  token       {str} usersToken 認証用
// @param  date        {str} 日付を示す yyyy-MM-dd 形式の文字列
// @param  expItem     {str} 費目
// @param  description {str} 概要
// @param  payment     {int} 金額
// @param  memo        {str} メモ
// @return 成功->0　認証失敗->-1　不正な日付入力->-2
function addNewRecord(id,token,date,expItem,description,payment,memo){
  if(!userAuthByToken(id,token))return -1;
  if(date!=parseDateStr(date))  return -2; // 不正な日付->-2を返す
  
  const sht     = openShtByName(id);
  var lastRow   = sht.getLastRow;
  var record    = [[date,expItem,description,payment,memo]];
  var recordCnt = sht.getRange("D4").getValue();
  
  // 書き込み
  if(recordCnt-lastRow<=5)sht.insertRowAfter(lastRow);//行追加
  sht.getRange(6+recordCnt,4,1,5).setValues(record);
  sortRecordRange(sht);
  return 0;
}

// レコード書換
// @param  id             {str} user       id = shtName
// @param  token          {str} usersToken 認証用
// @param  index          {int} 当該レコードの行数
// @param  concatForCheck {str} レコード内容を結合した文字列[レコード一致確認用]
// --------以下書換更新後の値------
// @param  date        {str} 日付を示す yyyy-MM-dd 形式の文字列
// @param  expItem     {str} 費目
// @param  description {str} 概要
// @param  payment     {int} 金額
// @param  memo        {str} メモ
//------------------------------
// @return 成功->0　認証失敗->-1 レコード不一致(失敗)->-3
function rewriteRecord(id,token,index,concatForCheck,date,expItem,description,payment,memo){
  if(!userAuthByToken(id,token))return -1;
  if(date!=parseDateStr(date))  return -2; // 不正な日付->-2を返す

  const sht      = openShtByName(id);
  var record    = [[date,expItem,description,payment,memo]];
  
  // 消そうとしているレコードの内容の一致を確認　不一致エラー->-3を返す
  var curRecord  = sht.getRange(6+index,4,1,5).getValues();
  var curConcat  = buildRecordConcat(curRecord[0]);
  if(concatForCheck!=curConcat)return -3;
  
  // レコード書換
  sht.getRange(6+index,4,1,5).setValues(record);
  sortRecordRange(sht);
  return 0;
}

// レコード削除
// @param  id             {str} user       id = shtName
// @param  token          {str} usersToken 認証用
// @param  index          {int} 当該レコードの行数
// @param  concatForCheck {str} レコード内容を結合した文字列[レコード一致確認用]
// @return 成功->0　認証失敗->-1 レコード不一致(失敗)->-3
function deleteRecord(id,token,index,concatForCheck){
  if(!userAuthByToken(id,token))return -1;

  const sht      = openShtByName(id);
  var nullRecord = [["","","","",""]];
  
  // 消そうとしているレコードの内容の一致を確認　不一致エラー->-3を返す
  var curRecord  = sht.getRange(6+index,4,1,5).getValues();
  var curConcat  = buildRecordConcat(curRecord[0]);
  if(concatForCheck!=curConcat)return -3;
  
  // レコード削除
  sht.getRange(6+index,4,1,5).setValues(nullRecord);
  sortRecordRange(sht);
  return 0;
}

// recordのconcatを作成し返す
// @param  record 1次元配列
// @return recordの内容を連結し文字列にしたもの
function buildRecordConcat(record){
  return ( parseDateStr(record[0]) + record[1] +
           record[2] +  record[3]  + record[4] );
}


// @param  id             {str} user       id = shtName
// @param  token          {str} usersToken 認証用
// @param  index          {int} 当該レコードの行数
// @return record         当該レコード 1次元配列
function loadRecord(id,token,index){
  if(!userAuthByToken(id,token))return -1;
  
  const sht        = openShtByName(id);
  var recordListCnt   = sht.getRange("D4").getValue();
  if(index>=recordListCnt)return -4; //範囲外エラー
  
  var record  = sht.getRange(6+index,4,1,5).getValues();
  record[0][0] = parseDateStr(record[0][0]);
  return record[0];
}

//---------------------------------------------

function testLRCD(){
  var id="ita";
  const sht = openShtByName(id);
  var token = sht.getRange("D1").getValue(); 
  var index=5;
  Logger.log(loadRecord(id,token,index));
}
function testDEL(){
  var id="ita";
  const sht = openShtByName(id);
  var token = sht.getRange("D1").getValue();
  var date="2019-06-21";
  var expItem="日用品費";
  var payment = 600;
  var description="";
  var memo="";
  
  var concat  = date + expItem + description + payment + memo;    
  var index=5;
  Logger.log(deleteRecord(id,token,index,concat));
}
function testADD(){
  var id="ita";
  const sht = openShtByName(id);
  var token = sht.getRange("D1").getValue();
  var date="2019-06-21";
  var expItem="日用品費";
  var payment = 600;
  var description="";
  var memo="";
  Logger.log(addNewRecord(id,token,date,expItem,description,payment,memo));
}
function testTOP(){
  var id="ita";
  const sht = openShtByName(id);
  var token = sht.getRange("D1").getValue();
  Logger.log(loadTop(id,token));
}
function testLEI(){
  var id="ita";
  const sht = openShtByName(id);
  var token = sht.getRange("D1").getValue();
  Logger.log(loadExpenseItem(id,token));
}
function testMR(){
  var id="ita";
  const sht = openShtByName(id);
  var token = sht.getRange("D1").getValue();
  Logger.log(loadMonthRecordTable(id,token,2019,6));
}

function test01(a){
  var a=12345;
  //Logger.log(loadTable([[1,1,1,1,1],[1,1,1,1,],[2,1,1,1,1],[2,1,1,1,],[2,1,1,1,1]]));
  //const sht = openShtByName("ita"); //TODO:引数指定・認証追加
  //Logger.log(sht.getRange(6,4,1,1).getValue());
}

// error list
// -1 : 認証失敗
// -2 : 不正な日付入力
// -3 : 参照不一致
// -4 : 参照範囲外