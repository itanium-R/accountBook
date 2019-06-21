// @return TOP用html
function loadTop(id,token){  
  if(!userAuthByToken(id,token))return -1;
  
  const sht          = openShtByName(id);
  var   thisMonthCnt = sht.getRange("E4").getValue();
  var   thisMonthSum = sht.getRange("K2").getValue();
  var   outTopHtml   = "";
  
  // 今月利用金額合計
  outTopHtml += "今月の支出額計<br>";
  outTopHtml += "<font class='bigFont'>" + parseYenStr(thisMonthSum) + "</font>";
  outTopHtml += "<hr>";
  
  // 今月項目別利用金額
  if(thisMonthCnt){
    var thisMonthExpItemList = sht.getRange(6,10,thisMonthCnt,2).getValues();
    
    outTopHtml +="項目別";
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

// @return expenseItemsをselectタグで格納したhtml
function loadExpenseItem(id,token){  
  if(!userAuthByToken(id,token))return -1;
  
  const sht        = openShtByName(id);
  const num = sht.getRange("B4").getValue();
  var outHtmlSelect="";
  var expenseItemList= sht.getRange(6,2,num,1).getValues();
  
  outHtmlSelect ='<select id="expenseItem">';
  for(var i=0;i<num;i++){
    outHtmlSelect += '<option value="'+expenseItemList[i][0] + '">'
                  +  expenseItemList[i][0] + '</option>';
  }
  outHtmlSelect+='</select>';
  //Logger.log(outHtmlSelect);
  return outHtmlSelect;
}

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
  //outHtmlTable += "<tr><td></td><td></td><td></td><td></td></tr> "
  for(var i=startIndex;i<=endIndex;i++){
    var thisDay = parseDateStr(recordList[i][0]);
    if(day != thisDay){
      outHtmlTable += "<tr class='BG-EEE'><td colspan='4'>" + thisDay+"</td></tr>";
      day           = thisDay;
    }
    outHtmlTable += "<tr class='BG-FFF'>";
    outHtmlTable += "<td>" + recordList[i][1] + "</td>";
    outHtmlTable += "<td>" + recordList[i][2] + "</td>";
    outHtmlTable += "<td>" + parseYenStr(recordList[i][3]) + "</td>";
    outHtmlTable += "<td>";
    if(recordList[i][4])outHtmlTable += "●";
    outHtmlTable += "</td></tr>";
  }
  outHtmlTable += "</table>";
  return outHtmlTable;
}



//---------------------------------------------

function testTOP(){
  var id="ita";
  const sht        = openShtByName(id);
  var token=sht.getRange("D1").getValue();
  Logger.log(loadTop(id,token));
}
function testLEI(){
  var id="ita";
  const sht        = openShtByName(id);
  var token=sht.getRange("D1").getValue();
  Logger.log(loadExpenseItem(id,token));
}
function testMR(){
  var id="ita";
  const sht        = openShtByName(id);
  var token=sht.getRange("D1").getValue();
  Logger.log(loadMonthRecordTable(id,token,2019,6));
}

function test01(a){
  var a=12345;
  //Logger.log(loadTable([[1,1,1,1,1],[1,1,1,1,],[2,1,1,1,1],[2,1,1,1,],[2,1,1,1,1]]));
  //const sht = openShtByName("ita"); //TODO:引数指定・認証追加
  //Logger.log(sht.getRange(6,4,1,1).getValue());
}