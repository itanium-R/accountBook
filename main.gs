// ユーザ認証byToken
// @param id   {str} ID
// @param token {str} token
// @return     認証成功:true　失敗:false
function userAuthByToken(id,token){
  // 存在するユーザか＝ユーザ用シートがあるか確認
  if(!isShtExist(id))return false;
  var usersSht  = openShtByName(id);
  
  // pass一致
  if(token==usersSht.getRange("D1").getValue()){
    return true;
  }
  // pass不一致
  usersSht.getRange("D1").setValue(""); //tokenリセット
  return false;
}

// ユーザ認証byPassword
// @param id   {str} ID
// @param pass {str} password 
// @return     認証成功:token(length:32)　失敗:false
function userAuthByPass(id,pass){
  // 存在するユーザか＝ユーザ用シートがあるか確認
  if(!isShtExist(id))return false;
  var usersSht  = openShtByName(id);
  
  // TODO:passに塩振り＆ハッシュ化すべき
  // pass一致
  if(pass==usersSht.getRange("B1").getValue()){
    var token = getToken();
    usersSht.getRange("D1").setValue(token);
    return token;
  }
  // pass不一致
  usersSht.getRange("D1").setValue(""); //tokenリセット
  return false;
}

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