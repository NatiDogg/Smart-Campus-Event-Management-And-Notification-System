import { useEffect } from 'react';
import { messaging, getToken, onMessage,getOrRegisterServiceWorker } from '../config/firebase';
import api from '../api/axios'; 

const useFcmToken = (user) => {
  useEffect(() => {
    console.log("1. Requesting permission...");
    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        console.log("2. Permission status:", permission);
        
        if (permission === 'granted') {
            console.log("3. Waiting for Service Worker...");
            const serviceWorkerRegistration = await getOrRegisterServiceWorker();
            console.log("4. Service Worker Ready:", serviceWorkerRegistration);
            console.log("5. Requesting Token from Firebase...");
          const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: serviceWorkerRegistration
          });

          if (token) {
            console.log('6. SUCCESS! FCM Token:', token);
            
            await api.post('/api/user/register-fcm', { token });
            
          }
          else{
            console.warn("6b. No token returned from Firebase.");
          }
        } else {
          console.log('Notification permission denied');
        }
      } catch (error) {
        console.error('Error getting FCM token:', error);
      }
    };

    if (user) {
      requestPermission();
    }

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      
      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: '/favicon.ico'
      });
    });

    return () => unsubscribe();
  }, [user]);
};

export default useFcmToken;

