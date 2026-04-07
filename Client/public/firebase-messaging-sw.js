self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force the waiting service worker to become the active one
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim()); // Take control of all open tabs immediately
});
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
const firebaseConfig = {
  apiKey: "AIzaSyA7BHVTsp4Jv7bbprjBtNXX237qP1IB1fY",
  authDomain: "smart-campus-dffbc.firebaseapp.com",
  projectId: "smart-campus-dffbc",
  storageBucket: "smart-campus-dffbc.firebasestorage.app",
  messagingSenderId: "924493554691",
  appId: "1:924493554691:web:a3ec304a1baea2bf2d1a36"
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// This handles the notification when the app is in the background or closed.
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico', // Make sure this icon exists in your public folder!
    data: payload.data,   // This allows you to pass extra data like eventId
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Optional: Handle notification clicks (e.g., open the app when the user clicks the notification)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/') // This opens your SmartCampus home page
  );
});

