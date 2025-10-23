<script setup lang="ts">
import SquareCardComponent from "@/components/SquareCardComponent.vue";
import {
  IonContent,
  IonIcon,
  IonPage,
  type ScrollDetail,
  useIonRouter,
} from "@ionic/vue";
import { ref } from "vue";
import type { IonContentCustomEvent } from "@ionic/core/dist/types/components";
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

const router = useIonRouter();
const navigationStore = useNavigationStore();

const currentDate = new Date().toLocaleDateString("de-DE", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  weekday: "long",
});

const showToolbar = ref<boolean>(false);
const handleScroll = (evt: IonContentCustomEvent<ScrollDetail>) => {
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
</script>

<template>
  <IonPage>
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
