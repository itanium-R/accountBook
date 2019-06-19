// @return expenseItemsをselectタグで格納したhtml
function loadExpenseItem(){  
  var outHtmlSelect;
  const sht = openShtByName("ita");
  const num = sht.getRange("B4").getValue();
  var expenseItemList= sht.getRange(6,2,num,1).getValues();
  
  outHtmlSelect ='<select id="expenseItem">';
  for(var i=0;i<num;i++){
    outHtmlSelect += '<option value="'+expenseItemList[i][0] + '">'
                  +  expenseItemList[i][0] + '</option>';
  }
  outHtmlSelect+='</select>';
  //Logger.log(outHtmlSelect);
  return outHtmlSelect;//
}

// @return token(length:32 consists:random[0-z])
function getToken(){
  return (Math.random().toString(36).slice(-8)+
          Math.random().toString(36).slice(-8)+
          Math.random().toString(36).slice(-8)+
          Math.random().toString(36).slice(-8));
}

function test01(){
  //Logger.log(userAuth("ita","qwe"));
  Logger.log(Utilities.computeDigest(　Utilities.DigestAlgorithm.MD5, "aaa",　Utilities.Charset.UTF_8));
}