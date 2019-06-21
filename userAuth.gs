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
  // token不一致
  usersSht.getRange("D1").setValue(getToken()); //tokenリセット
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
  // TODO:tokenを平文で扱っているのを修正すべき
  var token = getToken();
  // pass一致
  if(pass==usersSht.getRange("B1").getValue()){
    usersSht.getRange("D1").setValue(token);
    return token;
  }
  // pass不一致
  usersSht.getRange("D1").setValue(token); //tokenリセット
  return false;
}

// @return token(length:32 consists:random[0-z])
function getToken(){
  return (Math.random().toString(36).slice(-8)+
          Math.random().toString(36).slice(-8)+
          Math.random().toString(36).slice(-8)+
          Math.random().toString(36).slice(-8));
}
