<script setup lang="ts">
import SquareCardComponent from "@/components/SquareCardComponent.vue";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonPage,
  type ScrollCustomEvent,
  useIonRouter,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import HeaderBannerComponent from "@/components/HeaderBannerComponent.vue";
import { useNavigationStore } from "@/stores/navigation.ts";
import {
  calendarOutline,
  earthOutline,
  footballOutline,
  newspaperOutline,
  settingsOutline,
  trashBinOutline,
} from "ionicons/icons";
import { DevModeService } from "@/services/DevModeService.ts";
import LoadingComponent from "@/components/LoadingComponent.vue";

const router = useIonRouter();
const navigationStore = useNavigationStore();

const currentDate = new Date().toLocaleDateString("de-DE", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  weekday: "long",
});

const showToolbar = ref<boolean>(false);
const handleScroll = (evt: ScrollCustomEvent) => {
  const scrollTop = evt.detail.scrollTop;
  showToolbar.value = scrollTop > 25;
};

const openPage = (url: string) => {
  router.push(url);
};

const iconMapping: Record<string, any> = {
  earthOutline,
  newspaperOutline,
  footballOutline,
  trashBinOutline,
  calendarOutline,
};

const loading = ref<boolean>(false);
const devModeEnabled = ref<boolean>(false);
const passphrase = ref<string>("");

const login = () => {
  DevModeService.authenticateDevMode(passphrase.value)
    .then(() => {
      devModeEnabled.value = false;
    })
    .catch(() => {});
};

onMounted(async () => {
  try {
    loading.value = true;
    devModeEnabled.value = await DevModeService.isDevModeEnabled();
    loading.value = false;
  } catch (e) {
    loading.value = false;
    console.error(e);
  }
});
</script>

<template>
  <IonPage>
    <LoadingComponent :loading="loading" />

    <template v-if="devModeEnabled">
      <IonContent>
        <h1>Seite im Aufbau...</h1>
        <IonInput label="Passwort" v-model="passphrase" />
        <IonButton @click="login">Anmelden</IonButton>
      </IonContent>
    </template>

    <template v-if="!devModeEnabled">
      <HeaderComponent
        class="header"
        title="Dahenfeld"
        :hidden="!showToolbar"
        :hideBackButton="true"
      />

      <IonIcon
        :icon="settingsOutline"
        class="settings"
        :class="{ settings__white: showToolbar }"
        @click="openPage('/einstellungen')"
      />

      <IonContent @ionScroll="handleScroll" :scrollEvents="true">
        <HeaderBannerComponent backgroundImageUrl="/imgs/background8.jpg">
          <div class="container info-container">
            <div class="info-container__title">
              <h1>Dahenfeld</h1>
              <h2>Eine starke Dorfgemeinschaft</h2>
            </div>
            <div class="info-container__current-date">
              {{ currentDate }}
            </div>
          </div>
        </HeaderBannerComponent>

        <div class="ion-padding container">
          <div class="grid">
            <SquareCardComponent
              v-for="item of navigationStore.navigationItems"
              :key="item.path"
              :title="item.title"
              :backgroundColor="item.backgroundColor"
              :image="item.image"
              :icon="iconMapping[item.icon]"
              @click="openPage(item.path)"
            />
          </div>
        </div>
      </IonContent>
    </template>
  </IonPage>
</template>

<style lang="scss" scoped>
.header {
  position: fixed;
}

.settings {
  font-size: 32px;
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 999;
  color: #000;
  padding-top: env(safe-area-inset-top);

  &__white {
    color: #fff;
  }
}

.info-container {
  z-index: 2;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  padding-top: env(safe-area-inset-top);

  &__title {
    h1 {
      margin: 0;
      font-size: 16px;
      font-weight: bold;
      padding-top: 16px;
    }

    h2 {
      margin: 0;
      font-size: 12px;
    }
  }

  &__current-date {
    color: #fff;
    text-align: right;
    padding-bottom: 8px;
    font-size: 12px;
  }
}

.grid {
  display: grid;
  gap: 16px;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  max-width: calc((500px * 4) + (16px * 3));
  margin: 0 auto;
}
</style>
