import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getStorage } from "firebase/storage";
import { getMessaging, getToken } from "firebase/messaging";
import { useDispatch } from "react-redux";
import { pushNotification } from "../redux/actions/notify";
// import 'firebase/messaging'
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCJpJIpb-mQRrIWZwBelIW1luJqsJZnH5s",
  authDomain: "youni-frontend.firebaseapp.com",
  projectId: "youni-frontend",
  storageBucket: "youni-frontend.appspot.com",
  messagingSenderId: "827255863310",
  appId: "1:827255863310:web:d8190efb7bf0ea869de45f",
  measurementId: "G-VFSKVZCP7Z",
});

const publicKey = "BNpZBTiSH2n-Kabl0cV_DRaLCNwXMde40qfWf0sehnJcLHrPz--xMiFXNCLuVf0009ogBXxUATMlNf5B0uoKt0c";

export const requestForToken = async (dispatch,userid) => {
  try {
    const messaging = getMessaging();
    // const registration = await navigator.serviceWorker.register('./firebase-message-sw.js')
    const currentToken = await getToken(messaging, { vapidKey: publicKey});
    if (currentToken) {
      const sendData = {
        lstBrowserIds: currentToken,
        userId: userid,
      }
      dispatch(pushNotification(sendData))
    } else {
      // Show permission request UI
      console.log('No registration token available. Request permission to generate one.');
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
  }
};

const payload = {
  notification: {
    title:"commented on your Post.",
    body: "commentData.comment.text",
},
token: "cD3MR1wqkYByRLCz_cK3ox:APA91bFiBUOj4K-cgCxDulPpnHPZCWYiZ6viSEWB9rKhcxNjFlymuAEbG2NI49kognnsEWzjhtjM7tn9OgFUxl40hGvrvxUxwFAfilubNA6yvGqJv244pshLJXysV_EwN557uG5i4ArQ"
}
const data = JSON?.stringify(payload)

export const onMessageListener = () =>
  new Promise((resolve) => {
    const messaging = getMessaging();
    messaging.onMessage((payload) => {
      payload(data);
      resolve(payload);
    });
  });

const db = firebaseApp.firestore()
const auth = firebase.auth()
export const storage = getStorage(firebaseApp);

export { db, auth }