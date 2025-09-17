/// <reference lib="webworker" />
import { initializeApp } from "firebase/app";
import { environment } from "../environment/environment.ts";

declare const self: ServiceWorkerGlobalScope;

initializeApp({
  apiKey: environment.firebase.apiKey,
  authDomain: environment.firebase.authDomain,
  projectId: environment.firebase.projectId,
  storageBucket: environment.firebase.storageBucket,
  messagingSenderId: environment.firebase.messagingSenderId,
  appId: environment.firebase.appId,
  measurementId: environment.firebase.measurementId,
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
