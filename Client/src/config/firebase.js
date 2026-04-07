
import { initializeApp } from "firebase/app";
import { getMessaging,onMessage,getToken } from "firebase/messaging";


// our web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
export const getOrRegisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    // .register() ensures that if the worker is missing, it gets installed
    return navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then(() => {
        // This ensures the pushManager is fully loaded before returning
        return navigator.serviceWorker.ready;
      });
  }
  throw new Error('Service Workers not supported');
};
export { getToken, onMessage };






