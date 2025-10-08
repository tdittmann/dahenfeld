import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { IonicVue } from "@ionic/vue";

function detectPWA(): boolean {
  const urlFlag = new URLSearchParams(window.location.search).get('source') === 'pwa';
  const displayMode = window.matchMedia('(display-mode: standalone)').matches;
  const iosStandalone = (window.navigator as any).standalone === true;

  // Heuristik: kleines Browser-UI (approx.)
  const noToolbar = Math.abs(window.outerHeight - window.innerHeight) < 80 &&
    Math.abs(window.outerWidth  - window.innerWidth)  < 160;

  const installedFlag = localStorage.getItem('pwa_installed') === 'true';

  return displayMode || iosStandalone || urlFlag || (installedFlag && noToolbar);
}

// Installations-Events festhalten
window.addEventListener('appinstalled', () => localStorage.setItem('pwa_installed', 'true'));

const app = createApp(App).use(createPinia()).use(router).use(IonicVue);

router.isReady().then(() => {
  app.mount("#app");

  if ("serviceWorker" in navigator) {
    const isPWA = detectPWA();
    console.log("main.ts: ", isPWA);
    const swPath = isPWA ? '/pwa-firebase-messaging-sw.js' : '/firebase-messaging-sw.js';
    navigator.serviceWorker.register(swPath);
  }
});
