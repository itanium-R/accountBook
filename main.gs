// ユーザ認証
// @param id   {str} ID
// @param pass {str} password 
// @return     認証成功:true　失敗:false
function userAuth(id,pass){
  // 存在するユーザか＝ユーザ用シートがあるか確認
  if(!isShtExist(id))return false;
  var usersSht  = openShtByName(id);
  
  // pass一致
  if(pass==usersSht.getRange("B1").getValue())return true;
  // pass不一致
  return false;
}

function test01(){
  Logger.log(userAuth("ita","qwe"));
}