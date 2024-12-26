import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBemBduoYVvC5LsBq3bzsON1R1VHTntq2A",
  authDomain: "palm-drivers-app.firebaseapp.com",
  projectId: "palm-drivers-app",
  storageBucket: "palm-drivers-app.firebasestorage.app",
  messagingSenderId: "907749560672",
  appId: "1:907749560672:web:4427f0a9d1da7562e7ce05",
  measurementId: "G-6YJP48125Q"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  console.log('Requesting notification permission...');
  
  try {
    // First check if notification API is supported
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      throw new Error('This browser does not support notifications');
    }

    // Check current permission state
    let permission = Notification.permission;
    console.log('Current permission state:', permission);

    // If permission is not granted and not denied, request it
    if (permission !== 'granted') {
      permission = await Notification.requestPermission();
      console.log('Permission request result:', permission);
    }

    // Only proceed if permission is granted
    if (permission === 'granted') {
      console.log('Getting FCM token...');
      const token = await getToken(messaging, {
        vapidKey: 'BLqLc2VJJ2MIP5tvptX0OYUq_Aa82AscjfbpD22W8AR3MKd_ccS4dEHeLOJMw5LPhelsGw2-ATStgn4oeqfGZTU'
      });
      
      if (token) {
        console.log('FCM Token obtained:', token);
        return token;
      } else {
        throw new Error('No registration token available');
      }
    } else if (permission === 'denied') {
      throw new Error('Notification permission was denied');
    } else {
      throw new Error('Notification permission was not granted');
    }
  } catch (error) {
    console.error('Notification permission error:', error);
    throw error;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      resolve(payload);
    });
  });