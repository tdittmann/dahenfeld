<script setup lang="ts">
import {
  IonApp,
  IonRouterOutlet,
  useBackButton,
  useIonRouter,
} from "@ionic/vue";

import { NavigationService } from "@/services/NavigationService.ts";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { PushNotifications, type Token } from "@capacitor/push-notifications";
import { Device } from "@capacitor/device";
import { NotificationService } from "@/services/NotificationService.ts";

const route = useRoute();
const router = useIonRouter();

useBackButton(10, () => {
  const currentRoute = route.fullPath;
  if (currentRoute === "/") {
    App.exitApp();
  } else {
    router.back();
  }
});

const handlePushNotification = async () => {
  if (Capacitor.isPluginAvailable("PushNotifications")) {
    const permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === "prompt") {
      await PushNotifications.requestPermissions();
    }

    await PushNotifications.register();

    PushNotifications.addListener("registration", async (token: Token) => {
      // Workaround needed because this event can be fired multiple times
      const existingToken = localStorage.getItem("notificationToken");
      if (existingToken === null) {
        localStorage.setItem("notificationToken", token.value);
        const deviceInfo = await Device.getInfo();
        NotificationService.createNotificationSettings({
          registration_id: token.value,
          os: deviceInfo.platform,
        });
      }
    });

    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification) => {
        const data = notification.notification.data;

        // Navigate to a specific page depending on the type
        if (data && data.type) {
          switch (data.type) {
            case "Event":
              router.push("/veranstaltungen");
              break;
            case "WasteResidual":
            case "WasteOrganic":
            case "WastePaper":
            case "WastePollutants":
            case "WastePlastic":
              router.push("/muelltermine");
              break;
            case "GelweBlaettle":
              router.push("/gelwe-blaettle");
          }
        }
      },
    );

    PushNotifications.addListener("registrationError", (error: any) => {
      console.error("Error on registration: " + JSON.stringify(error));
    });
  }
};

onMounted(() => {
  NavigationService.loadNavigation();
  handlePushNotification();
});
</script>

<template>
  <IonApp>
    <IonRouterOutlet />
  </IonApp>
</template>
