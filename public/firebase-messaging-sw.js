importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyCJpJIpb-mQRrIWZwBelIW1luJqsJZnH5s",
  authDomain: "youni-frontend.firebaseapp.com",
  projectId: "youni-frontend",
  storageBucket: "youni-frontend.appspot.com",
  messagingSenderId: "827255863310",
  appId: "1:827255863310:web:d8190efb7bf0ea869de45f",
  measurementId: "G-VFSKVZCP7Z",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {

  const notificationTitle = "payload.notification.title";
  const notificationOptions = {
    body: "payload.notification.body",
    icon: "/logo192.png",
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener('notificationclick', (event) => {
  if (event.action) {
    clients.openWindow(event.action)
  } else {
    // Open tv page
    clients.openWindow("http://localhost:3000/dashboard")
  }
  event.notification.close()
})