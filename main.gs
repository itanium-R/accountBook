// @return expenseItemsをselectタグで格納したhtml
function loadExpenseItem(){  
  const sht = openShtByName("ita"); //TODO:引数指定・認証追加
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

function loadMainRecordTable(){
  const sht   = openShtByName("ita");//TODO:引数指定・認証追加
  var records = sht.getRange(6,4,8,5).getValues();
  Logger.log(loadTable(records));
}


// @param  records 
// @return outHtmlTable
function loadTable(records){
  var outHtmlTable     = "<table>";
  var day ="";
  //outHtmlTable += "<tr><td></td><td></td><td></td><td></td></tr> "
  for(var i=0;i<records.length;i++){
    records[i][0]=parseDate(records[i][0]);
    if(day!=records[i][0]){
      outHtmlTable += "<tr><td colspan='4'>" + records[i][0]+"</td></tr>";
      day=records[i][0];
    }
    outHtmlTable += "<tr><td>";
    outHtmlTable += records[i][1];
    outHtmlTable += "</td><td>";
    outHtmlTable += records[i][2];
    outHtmlTable += "</td><td>";
    outHtmlTable += records[i][3];
    outHtmlTable += "</td><td>";
    if(records[i][4])outHtmlTable += "●";
    outHtmlTable += "</td></tr>";
  }
  outHtmlTable += "</table>";
  return outHtmlTable;
}


function test01(){
  //Logger.log(userAuth("ita","qwe"));
  Logger.log(loadTable([[1,1,1,1,1],[1,1,1,1,],[2,1,1,1,1],[2,1,1,1,],[2,1,1,1,1]]));
}