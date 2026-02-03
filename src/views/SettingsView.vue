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
  IonPage,
  IonToggle,
  type ToggleChangeEventDetail,
  type ToggleCustomEvent,
  useIonRouter,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import {
  type Notification,
  NotificationService,
} from "@/services/NotificationService.ts";
import { Capacitor } from "@capacitor/core";
import { messaging } from "@/plugins/Firebase";
import { getToken } from "firebase/messaging";
import { PushNotifications, type Token } from "@capacitor/push-notifications";

const router = useIonRouter();

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
  push_waste_plastic: true,
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
    notificationSettings.value.push_waste_plastic = true;
    notificationSettings.value.push_waste_pollutants = true;
  } else {
    notificationSettings.value.push_waste_residual = false;
    notificationSettings.value.push_waste_organic = false;
    notificationSettings.value.push_waste_paper = false;
    notificationSettings.value.push_waste_plastic = false;
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

const openContent = (id: number) => {
  router.push(`/beitrag/${id}`);
};

const enum NotificationState {
  DEFAULT = "default",
  GRANTED = "granted",
  DENIED = "denied",
}
const notificationState = ref<NotificationState>(NotificationState.DEFAULT);

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
  switch (Capacitor.getPlatform()) {
    case "web":
      await askForWebNotificationPermission();
      break;
    case "ios":
      break;
    case "android":
      await askForAndroidNotificationPermission();
      break;
  }
};

onMounted(() => {
  switch (Capacitor.getPlatform()) {
    case "web":
      handleWebNotifications();
      notificationSettings.value.os = "web";
      break;
    case "ios":
      notificationSettings.value.os = "ios";
      break;
    case "android":
      handleAndroidNotifications();
      notificationSettings.value.os = "android";
      break;
  }
});

/***********************************/
/* ANDROID Notifications           */
/***********************************/
const handleAndroidNotifications = async () => {
  if (Capacitor.isPluginAvailable("PushNotifications")) {
    const permStatus = await PushNotifications.checkPermissions();

    switch (permStatus.receive) {
      case "granted":
        // Notifications are already enabled
        notificationState.value = NotificationState.GRANTED;
        await loadAndroidNotificationToken();
        await loadSettings();
        break;
      case "denied":
        notificationState.value = NotificationState.DENIED;
        break;
      case "prompt":
        // No decision made by the user
        notificationState.value = NotificationState.DEFAULT;
        break;
    }
  }
};

const askForAndroidNotificationPermission = async () => {
  if (Capacitor.isPluginAvailable("PushNotifications")) {
    const status = await PushNotifications.requestPermissions();

    if (status.receive === "granted") {
      await PushNotifications.register();

      PushNotifications.addListener("registration", (token: Token) => {
        localStorage.setItem("notificationToken", token.value);
        notificationState.value = NotificationState.GRANTED;
        createNotificationSettings();
      });
    } else {
      notificationState.value = NotificationState.DENIED;
    }
  }
};

const loadAndroidNotificationToken = async () => {
  const token = localStorage.getItem("notificationToken");
  if (token) {
    notificationSettings.value.registration_id = token;
  } else {
    notificationState.value = NotificationState.DENIED;
  }
};

/***********************************/
/* WEB Notifications               */
/***********************************/
const loadWebNotificationToken = async () => {
  try {
    notificationSettings.value.registration_id = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });
  } catch (err) {
    console.error("Could not fetch web notification token:", err);
  }
};

const askForWebNotificationPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    notificationState.value = NotificationState.GRANTED;
    await loadWebNotificationToken();

    if (
      notificationSettings.value.os &&
      notificationSettings.value.registration_id
    ) {
      createNotificationSettings();
    }
  } else if (permission === "denied") {
    notificationState.value = NotificationState.DENIED;
  }
};

const handleWebNotifications = async () => {
  switch (Notification.permission) {
    case "granted":
      // Notifications are already enabled
      notificationState.value = NotificationState.GRANTED;
      await loadWebNotificationToken();
      await loadSettings();
      break;
    case "denied":
      notificationState.value = NotificationState.DENIED;
      break;
    case "default":
      // No decision made by the user
      notificationState.value = NotificationState.DEFAULT;
      break;
  }
};
</script>

<template>
  <IonPage>
    <HeaderComponent title="Einstellungen" />

    <IonContent>
      <IonItemGroup mode="ios">
        <IonItemDivider class="item-divider-padding">
          <IonLabel>Allgemein</IonLabel>
        </IonItemDivider>
        <IonList>
          <IonItem :button="true" @click="openContent(1)"
            ><IonLabel>Datenschutz</IonLabel>
          </IonItem>
          <IonItem :button="true" @click="openContent(2)"
            ><IonLabel>Impressum</IonLabel>
          </IonItem>
        </IonList>
      </IonItemGroup>

      <IonItemGroup mode="ios" style="margin-top: 16px">
        <IonItemDivider class="item-divider-padding">
          <IonLabel>Benachrichtigungen</IonLabel>
        </IonItemDivider>

        <IonList v-if="notificationState === NotificationState.DEFAULT">
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

        <IonList v-if="notificationState === NotificationState.DENIED">
          <IonItem>
            <ion-label>
              <strong style="display: block">
                Benachrichtigungen sind nicht erlaubt
              </strong>
              <ion-note color="medium">
                Um Benachrichtigungen zu erlauben, bitte in den Einstellungen
                ändern
              </ion-note>
            </ion-label>
          </IonItem>
        </IonList>

        <IonList v-if="notificationState === NotificationState.GRANTED">
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
              <ion-label>Abfalltermine</ion-label>
              <ion-note>Benachrichtigung kommt einen Tag vorher</ion-note>
            </ion-toggle>
          </IonItem>
          <IonItem v-if="notificationWaste">
            <ion-toggle
              :checked="notificationSettings.push_waste_residual"
              @ionChange="
                (evt) => handleNotificationToggle('push_waste_residual', evt)
              "
            >
              <ion-label class="second-layer">Restabfall</ion-label>
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
              :checked="notificationSettings.push_waste_plastic"
              @ionChange="
                (evt) => handleNotificationToggle('push_waste_plastic', evt)
              "
            >
              <ion-label class="second-layer">Gelbe Tonne</ion-label>
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
              <ion-note>Benachrichtigung kommt 7 Tage vorher</ion-note>
            </ion-toggle>
          </IonItem>
        </IonList>
      </IonItemGroup>
    </IonContent>
  </IonPage>
</template>

<style scoped lang="scss">
.second-layer {
  padding-left: 32px;
}
</style>
