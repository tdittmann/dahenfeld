import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { environment } from "../environment/environment.js";

// Firebase Config aus der Firebase Console
const firebaseConfig = {
  apiKey: environment.firebase.apiKey,
  authDomain: environment.firebase.authDomain,
  projectId: environment.firebase.projectId,
  storageBucket: environment.firebase.storageBucket,
  messagingSenderId: environment.firebase.messagingSenderId,
  appId: environment.firebase.appId,
  measurementId: environment.firebase.measurementId,
};

// Firebase App initialisieren
const app = initializeApp(firebaseConfig);

// Messaging Service exportieren
export const messaging = getMessaging(app);
