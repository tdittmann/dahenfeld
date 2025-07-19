<script setup lang="ts">
import {
  earthOutline,
  flowerOutline,
  footballOutline,
  newspaperOutline,
} from "ionicons/icons";
import SquareCardComponent from "@/components/SquareCardComponent.vue";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  type ScrollDetail,
} from "@ionic/vue";
import { computed, ref } from "vue";
import type { IonContentCustomEvent } from "@ionic/core/dist/types/components";

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

const toolbarBackgroundColor = computed<string>(() => {
  if (showToolbar.value) {
    return "#003220";
  }
  return "none";
});
</script>

<template>
  <IonHeader class="header" :class="{ 'header-no-shadow': !showToolbar }">
    <IonToolbar>
      <IonTitle class="toolbar-title" v-if="showToolbar">Dahenfeld</IonTitle>
    </IonToolbar>
  </IonHeader>

  <IonContent @ionScroll="handleScroll" :scrollEvents="true">
    <div class="container-top-background">
      <div class="container-top-background__gradient-bottom"></div>

      <div class="container">
        <div class="current-date">
          {{ currentDate }}
        </div>
      </div>
    </div>
    <div class="ion-padding container">
      <div class="grid">
        <SquareCardComponent
          title="Virtueller Rundgang"
          background-color="red-dark"
          :icon="earthOutline"
        />
        <SquareCardComponent
          title="s'Gelwe Blättle"
          background-color="yellow-dark"
          :icon="newspaperOutline"
        />
        <SquareCardComponent
          title="Vereine"
          background-color="blue-dark"
          :icon="footballOutline"
        />
        <SquareCardComponent
          title="Freizeit"
          background-color="green-dark"
          :icon="flowerOutline"
        />
      </div>
    </div>
  </IonContent>
</template>

<style lang="scss" scoped>
.header {
  position: fixed;
}

.header-no-shadow {
  box-shadow: none;
}

ion-toolbar {
  --background: v-bind("toolbarBackgroundColor");
  --color: #fff;
}

.header-no-shadow,
.toolbar-title,
ion-toolbar::part(background) {
  transition: background-color 1s ease;
}

.container-top-background {
  background-image: url("/imgs/background2.jpg");
  background-size: cover;
  background-position: center;
  height: 250px;
  position: relative;

  &__gradient-bottom {
    width: 100%;
    height: 50%;
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(0, 0, 0, 0) 100%
    );
    position: absolute;
    bottom: 0;
  }
}

.current-date {
  color: #fff;
  font-weight: bold;
  bottom: 8px;
  right: 8px;
  position: absolute;
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
