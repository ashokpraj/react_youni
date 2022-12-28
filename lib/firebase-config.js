// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  TwitterAuthProvider,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import "firebase/compat/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJpJIpb-mQRrIWZwBelIW1luJqsJZnH5s",
  authDomain: "youni-frontend.firebaseapp.com",
  projectId: "youni-frontend",
  storageBucket: "youni-frontend.appspot.com",
  messagingSenderId: "827255863310",
  appId: "1:827255863310:web:d8190efb7bf0ea869de45f",
  measurementId: "G-VFSKVZCP7Z",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
if (typeof window !== "undefined") {
  const analytics = getAnalytics(app);
}

export const auth = getAuth(app);
export const google = new GoogleAuthProvider();
export const facebook = new FacebookAuthProvider();
export const twitter = new TwitterAuthProvider();
export const storage = getStorage(app);
