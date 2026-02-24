/**
 * This script exists to inject Firebase configuration values from environment variables
 * into the service worker file (firebase-messaging-sw.js) before the build process.
 *
 * By using this script, sensitive Firebase keys are not hardcoded in the source code,
 * and the same script can be used both locally (via .env) and in CI/CD pipelines (via secrets).
 */

import fs from "fs";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: ".env" });

// Path to the service worker file
const filePath = "public/firebase-messaging-sw.js";

// Read the content of the file
let content = fs.readFileSync(filePath, "utf-8");

// Replace placeholders with actual environment variable values
content = content.replaceAll(/VITE_FIREBASE_API_KEY/g, process.env.VITE_FIREBASE_API_KEY);
content = content.replaceAll(/VITE_FIREBASE_AUTH_DOMAIN/g, process.env.VITE_FIREBASE_AUTH_DOMAIN);
content = content.replaceAll(/VITE_FIREBASE_PROJECT_ID/g, process.env.VITE_FIREBASE_PROJECT_ID);
content = content.replaceAll(/VITE_FIREBASE_STORAGE_BUCKET/g, process.env.VITE_FIREBASE_STORAGE_BUCKET);
content = content.replaceAll(/VITE_FIREBASE_MESSAGING_SENDER_ID/g, process.env.VITE_FIREBASE_MESSAGING_SENDER_ID);
content = content.replaceAll(/VITE_FIREBASE_APP_ID/g, process.env.VITE_FIREBASE_APP_ID);
content = content.replaceAll(/VITE_FIREBASE_MEASUREMENT_ID/g, process.env.VITE_FIREBASE_MEASUREMENT_ID);

// Write the updated content back to the file
fs.writeFileSync(filePath, content, "utf-8");

console.log("Firebase service worker file successfully updated!");
