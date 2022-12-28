import { initializeApp } from "firebase/app";
import "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfigDataBase = {
  apiKey: "AIzaSyCJpJIpb-mQRrIWZwBelIW1luJqsJZnH5s",
  authDomain: "youni-frontend.firebaseapp.com",
  databaseURL: "gs://youni-frontend.appspot.com",
  projectId: "youni-frontend",
  storageBucket: "youni-frontend.appspot.com",
  messagingSenderId: "827255863310",
  appId: "1:827255863310:web:d8190efb7bf0ea869de45f",
  measurementId: "G-VFSKVZCP7Z",
};

const app = initializeApp(firebaseConfigDataBase);

const storage = app.storage();

export { storage as default };
