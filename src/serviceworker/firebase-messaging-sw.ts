/// <reference lib="webworker" />
import { initializeApp } from "firebase/app";

declare const self: ServiceWorkerGlobalScope;

initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
});

self.addEventListener("push", (event: PushEvent) => {
  const payload = event.data?.json();
  const title = payload?.notification?.title ?? "Neue Benachrichtigung";
  const options = {
    body: payload?.notification?.body ?? "",
    icon: "/icon.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
