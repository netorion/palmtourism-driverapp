importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBemBduoYVvC5LsBq3bzsON1R1VHTntq2A",
  authDomain: "palm-drivers-app.firebaseapp.com",
  projectId: "palm-drivers-app",
  storageBucket: "palm-drivers-app.firebasestorage.app",
  messagingSenderId: "907749560672",
  appId: "1:907749560672:web:4427f0a9d1da7562e7ce05"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});