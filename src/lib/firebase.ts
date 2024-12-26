import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBemBduoYVvC5LsBq3bzsON1R1VHTntq2A",
  authDomain: "palm-drivers-app.firebaseapp.com",
  projectId: "palm-drivers-app",
  storageBucket: "palm-drivers-app.firebasestorage.app",
  messagingSenderId: "907749560672",
  appId: "1:907749560672:web:4427f0a9d1da7562e7ce05"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'V0LsFCoUj11DkNRXsBlS5_ReNzWtYf3TXjaixZFHWOo'
      });
      return token;
    }
    throw new Error('Notification permission denied');
  } catch (error) {
    console.error('Notification permission error:', error);
    throw error;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });