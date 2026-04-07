import { useEffect } from 'react';
import { messaging, getToken, onMessage,getOrRegisterServiceWorker } from '../config/firebase';
import api from '../api/axios'; 

const useFcmToken = (user) => {
  useEffect(() => {
    
    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        
        
        if (permission === 'granted') {
            
            const serviceWorkerRegistration = await getOrRegisterServiceWorker();
            
          const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: serviceWorkerRegistration
          });

          if (token) {
            
            
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
      
      
      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: '/favicon.ico'
      });
    });

    return () => unsubscribe();
  }, [user]);
};

export default useFcmToken;

