import CryptoJS from "crypto-js";

const sk = "Y@uN!@#!^*^&**((UUIWSW1215488925498754)))****";

export const encryptId = (id) => {
  const temp = id.toString();

  var encrypted = CryptoJS.AES.encrypt(temp, sk).toString();
  return encrypted;
};

export const decryptId = (id) => {
  const mainID = id.replace(/\s/g, "+");
  var bytes = CryptoJS.AES.decrypt(mainID, sk);

  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};
