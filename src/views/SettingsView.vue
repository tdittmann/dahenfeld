<script setup lang="ts">
import HeaderComponent from "@/components/HeaderComponent.vue";
import {
  IonContent,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonNote,
  IonToggle,
  type ToggleChangeEventDetail,
  type ToggleCustomEvent,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import {
  type Notification,
  NotificationService,
} from "@/services/NotificationService.ts";
import { Capacitor } from "@capacitor/core";
import { messaging } from "@/plugins/Firebase";
import { getToken } from "firebase/messaging";

/***********************************/
/* General logic                   */
/***********************************/

const loading = ref<boolean>(false);
const notificationWaste = ref<boolean>(true);
const notificationSettings = ref<Notification>({
  os: "",
  registration_id: "",
  push_gelwe_blaettle: true,
  push_waste_residual: true,
  push_waste_organic: true,
  push_waste_paper: true,
  push_waste_pollutants: true,
  push_events: true,
});

const handleNotificationWasteToggle = (
  event: ToggleCustomEvent<ToggleChangeEventDetail>,
) => {
  const notificationWasteEnabled = event.detail.checked;
  notificationWaste.value = notificationWasteEnabled;
  if (notificationWasteEnabled) {
    notificationSettings.value.push_waste_residual = true;
    notificationSettings.value.push_waste_organic = true;
    notificationSettings.value.push_waste_paper = true;
    notificationSettings.value.push_waste_pollutants = true;
  } else {
    notificationSettings.value.push_waste_residual = false;
    notificationSettings.value.push_waste_organic = false;
    notificationSettings.value.push_waste_paper = false;
    notificationSettings.value.push_waste_pollutants = false;
  }
  updateNotificationSettings();
};

const handleNotificationToggle = <K extends keyof Notification>(
  notificationType: K,
  event: ToggleCustomEvent<ToggleChangeEventDetail>,
) => {
  notificationSettings.value[notificationType] = event.target
    .checked as Notification[K];
  updateNotificationSettings();
};

const createNotificationSettings = () => {
  NotificationService.createNotificationSettings(notificationSettings.value)
    .then(() => {
      console.log("Successfully created notification setting");
    })
    .catch((error) => {
      console.error("Could not create notification settings: ", error);
    });
};

const updateNotificationSettings = () => {
  NotificationService.updateNotificationSettings(notificationSettings.value);
};

onMounted(() => {
  switch (Capacitor.getPlatform()) {
    case "web":
      handleWebNotifications();
      notificationSettings.value.os = "web";
      break;
    case "ios":
      notificationSettings.value.os = "ios";
      console.log("Not implemented yet!");
      break;
    case "android":
      notificationSettings.value.os = "android";
      console.log("Not implemented yet!");
      break;
  }
});

/***********************************/
/* WEB Notifications               */
/***********************************/
const enum WebNotificationState {
  DEFAULT = "default",
  GRANTED = "granted",
  DENIED = "denied",
}
const webNotificationState = ref<WebNotificationState>(
  WebNotificationState.DEFAULT,
);

const loadSettings = async () => {
  if (!notificationSettings.value.registration_id) {
    return;
  }

  try {
    loading.value = true;
    const setting = await NotificationService.loadNotificationSettings(
      notificationSettings.value.registration_id,
    );
    if (setting) {
      notificationSettings.value = setting;
    }
  } catch (error) {
    console.error("Could not load settings: ", error);
    createNotificationSettings();
  } finally {
    loading.value = false;
  }
};

const askToggleStatus = ref<boolean>(false);
const askForNotificationPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    webNotificationState.value = WebNotificationState.GRANTED;
    await loadWebNotificationToken();

    if (
      notificationSettings.value.os &&
      notificationSettings.value.registration_id
    ) {
      createNotificationSettings();
    }
  } else if (permission === "denied") {
    webNotificationState.value = WebNotificationState.DENIED;
  }
};

const loadWebNotificationToken = async () => {
  try {
    notificationSettings.value.registration_id = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });
  } catch (err) {
    console.error("Could not fetch web notification token:", err);
  }
};

const handleWebNotifications = async () => {
  switch (Notification.permission) {
    case "granted":
      // Notifications are already enabled
      webNotificationState.value = WebNotificationState.GRANTED;
      await loadWebNotificationToken();
      await loadSettings();
      break;
    case "denied":
      webNotificationState.value = WebNotificationState.DENIED;
      break;
    case "default":
      // No decision made by the user
      webNotificationState.value = WebNotificationState.DEFAULT;
      break;
  }
};
</script>

<template>
  <HeaderComponent title="Einstellungen" />

  <IonContent>
    <IonItemGroup mode="ios">
      <IonItemDivider class="item-divider-padding">
        <IonLabel>Allgemein</IonLabel>
      </IonItemDivider>
      <IonList>
        <IonItem :button="true"><IonLabel>Datenschutz</IonLabel> </IonItem>
        <IonItem :button="true"><IonLabel>Impressum</IonLabel> </IonItem>
      </IonList>
    </IonItemGroup>

    <IonItemGroup mode="ios" style="margin-top: 16px">
      <IonItemDivider class="item-divider-padding">
        <IonLabel>Benachrichtigungen</IonLabel>
      </IonItemDivider>

      <IonList v-if="webNotificationState === WebNotificationState.DEFAULT">
        <IonItem>
          <ion-toggle
            :checked="askToggleStatus"
            @ionChange="askForNotificationPermission"
          >
            <ion-label>Benachrichtigungen erlauben</ion-label>
            <ion-note color="medium">Abmeldung jederzeit möglich</ion-note>
          </ion-toggle>
        </IonItem>
      </IonList>

      <IonList v-if="webNotificationState === WebNotificationState.DENIED">
        <IonItem>
          <ion-label>
            <strong style="display: block">
              Benachrichtigungen sind nicht erlaubt
            </strong>
            <ion-note color="medium">
              Um Benachrichtigungen zu erlauben, bitte in den
              Browser-Einstellungen ändern
            </ion-note>
          </ion-label>
        </IonItem>
      </IonList>

      <IonList v-if="webNotificationState === WebNotificationState.GRANTED">
        <IonItem>
          <ion-toggle
            :checked="notificationSettings.push_gelwe_blaettle"
            @ionChange="
              (evt) => handleNotificationToggle('push_gelwe_blaettle', evt)
            "
          >
            <ion-label>'s Gelwe Blättle</ion-label>
          </ion-toggle>
        </IonItem>
        <IonItem>
          <ion-toggle
            :checked="notificationWaste"
            @ionChange="handleNotificationWasteToggle"
          >
            <ion-label>Mülltermine</ion-label>
          </ion-toggle>
        </IonItem>
        <IonItem v-if="notificationWaste">
          <ion-toggle
            :checked="notificationSettings.push_waste_residual"
            @ionChange="
              (evt) => handleNotificationToggle('push_waste_residual', evt)
            "
          >
            <ion-label class="second-layer">Restmüll</ion-label>
          </ion-toggle>
        </IonItem>
        <IonItem v-if="notificationWaste">
          <ion-toggle
            :checked="notificationSettings.push_waste_organic"
            @ionChange="
              (evt) => handleNotificationToggle('push_waste_organic', evt)
            "
          >
            <ion-label class="second-layer">Bioabfall</ion-label>
          </ion-toggle>
        </IonItem>
        <IonItem v-if="notificationWaste">
          <ion-toggle
            :checked="notificationSettings.push_waste_paper"
            @ionChange="
              (evt) => handleNotificationToggle('push_waste_paper', evt)
            "
          >
            <ion-label class="second-layer">Papiertonne</ion-label>
          </ion-toggle>
        </IonItem>
        <IonItem v-if="notificationWaste">
          <ion-toggle
            :checked="notificationSettings.push_waste_pollutants"
            @ionChange="
              (evt) => handleNotificationToggle('push_waste_pollutants', evt)
            "
          >
            <ion-label class="second-layer">Schadstoffe</ion-label>
          </ion-toggle>
        </IonItem>
        <IonItem>
          <ion-toggle
            :checked="notificationSettings.push_events"
            @ionChange="(evt) => handleNotificationToggle('push_events', evt)"
          >
            <ion-label>Veranstaltungen</ion-label>
          </ion-toggle>
        </IonItem>
      </IonList>
    </IonItemGroup>
  </IonContent>
</template>

<style scoped lang="scss">
.second-layer {
  padding-left: 32px;
}
</style>
