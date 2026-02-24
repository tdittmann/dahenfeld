importScripts(
  "https://www.gstatic.com/firebasejs/11.0.0/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "VITE_FIREBASE_API_KEY",
  authDomain: "VITE_FIREBASE_AUTH_DOMAIN",
  projectId: "VITE_FIREBASE_PROJECT_ID",
  storageBucket: "VITE_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "VITE_FIREBASE_MESSAGING_SENDER_ID",
  appId: "VITE_FIREBASE_APP_ID",
  measurementId: "VITE_FIREBASE_MEASUREMENT_ID",
});

const messaging = firebase.messaging();

const typeToUrl = new Map([
  ["GelweBlaettle", "/gelwe-blaettle"],
  ["WasteResidual", "/muelltermine"],
  ["WasteOrganic", "/muelltermine"],
  ["WastePaper", "/muelltermine"],
  ["WastePollutants", "/muelltermine"],
  ["Event", "/veranstaltungen"],
]);

// Handle background message
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    data: {
      type: payload.data.type,
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const type = event.notification.data?.type;
  const url = typeToUrl.get(type);

  if (url) {
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientList) => {
          // If a tab with the URL is already open, focus it
          for (const client of clientList) {
            if (client.url === url && "focus" in client) {
              return client.focus();
            }
          }
          // Otherwise, open a new tab
          if (clients.openWindow) {
            return clients.openWindow(url);
          }
        }),
    );
  }
});
