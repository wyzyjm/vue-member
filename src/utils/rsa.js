import { JSEncrypt } from 'encryptlong'
//加密
export const setRSApass = (password) => {
  let jse = new JSEncrypt();
  //公钥
  let publicString = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCl5ssTcsgXvYjKUE4XGYuI4jYBOxB8qE3LUHDaQ9kez6hz5jLdTmLCFJIB3YzpZ7YiIvcUda9g72qTWir24mN/fO9nCBKwnpUDrZQdUDh72HC+Skaa4BHeasihwCPqOiy1DeWYWXkpDxzjq5pi4ACyAnij83Md+E1SZN0/TNIthwIDAQABrsa'
  jse.setPublicKey(publicString);
  // 加密内容
  let encrypted = jse.encryptLong(password);
  return encrypted
};
//解密
export const getRSApass = (password) => {
  let jse = new JSEncrypt();
  //公钥
  let privateKey = ''
  jse.setPrivateKey(privateKey);
  // 加密内容
  let decrypt = jse.decryptLong(password);
  return decrypt
};