<script setup lang="ts">
import HeaderComponent from "@/components/HeaderComponent.vue";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import type { IonContentCustomEvent } from "@ionic/core/dist/types/components";
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  type ScrollDetail,
} from "@ionic/vue";
import {
  VirtualTourService,
  type VirtualTourStation,
} from "@/services/VirtualTourService.ts";
import LoadingComponent from "@/components/LoadingComponent.vue";
import HeaderBannerComponent from "@/components/HeaderBannerComponent.vue";
import { navigateCircleOutline } from "ionicons/icons";

const route = useRoute();
const router = useRouter();

const loading = ref<boolean>(true);
const virtualTourStation = ref<VirtualTourStation | undefined>(undefined);
const loadVirtualTourStation = (id: number) => {
  loading.value = true;
  virtualTourStation.value = undefined;

  VirtualTourService.loadStationById(id)
    .then((data: VirtualTourStation | undefined) => {
      if (data) {
        virtualTourStation.value = data;
      } else {
        router.push("/virtual-tour");
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const opacityToolbar = ref<boolean>(false);
const handleScroll = (evt: IonContentCustomEvent<ScrollDetail>) => {
  const scrollTop = evt.detail.scrollTop;
  opacityToolbar.value = scrollTop > 194;
};

const openGoogleMapsLink = (latitude: number, longitude: number) => {
  window.open(
    `https://www.google.com/maps/place/${latitude},${longitude}`,
    "_blank",
  );
};

onMounted(() => {
  const parsedId = parseInt(<string>route.params.id, 10);
  if (!parsedId) {
    router.push("/virtual-tour");
  }
  loadVirtualTourStation(parsedId);
});
</script>

<template>
  <HeaderComponent
    class="header"
    :title="opacityToolbar ? virtualTourStation?.title : ''"
    :transparentBackground="!opacityToolbar"
  />

  <IonContent @ionScroll="handleScroll" :scrollEvents="true">
    <LoadingComponent :loading="loading" />

    <template v-if="virtualTourStation">
      <HeaderBannerComponent
        :backgroundImageUrl="virtualTourStation.image"
        style="display: flex; align-items: end"
      >
        <div class="container">
          <div class="virtual-tour-station__info">
            <div class="virtual-tour-station__info__name">
              <h1>{{ virtualTourStation.title }}</h1>
              <h2>{{ virtualTourStation.subTitle }}</h2>
            </div>
          </div>
        </div>
      </HeaderBannerComponent>

      <div class="container text-container">
        <div
          class="virtual-tour-station__description"
          v-html="virtualTourStation.description"
        />
        <div
          v-if="virtualTourStation.author"
          class="virtual-tour-station__author"
        >
          {{ virtualTourStation.author }}
        </div>

        <audio v-if="virtualTourStation.audio" class="virtual-tour-station__audio" :src="virtualTourStation.audio" controls></audio>

        <div class="virtual-tour-station__links">
          <ion-list mode="ios">
            <ion-list-header>
              <ion-label>Links</ion-label>
            </ion-list-header>

            <ion-item
              class="virtual-tour-station__links__item"
              :button="true"
              v-if="virtualTourStation.longitude"
              @click="
                openGoogleMapsLink(
                  virtualTourStation.latitude,
                  virtualTourStation.longitude,
                )
              "
            >
              <ion-icon :icon="navigateCircleOutline" slot="start"></ion-icon>
              <ion-label>In Google Maps anzeigen</ion-label>
            </ion-item>
          </ion-list>
        </div>
      </div>
    </template>
  </IonContent>
</template>

<style scoped lang="scss">
.text-container {
  margin-bottom: 32px;
}

.header {
  position: absolute;
}

.container {
  z-index: 2;
}

.virtual-tour-station {
  &__info {
    display: flex;
    align-items: center;
    color: #fff;
    font-weight: bold;
    font-size: 1.25rem;
    gap: 16px;
    margin-left: 8px;
    margin-bottom: 8px;

    &__name {
      h1 {
        font-size: 1.25rem;
        font-weight: bold;
        margin: 0;
      }

      h2 {
        margin: 0;
        font-weight: normal;
        font-size: 1rem;
      }
    }
  }

  &__description {
    margin-top: 8px;
  }

  &__author {
    font-size: 0.8em;
    text-align: right;
  }

  &__audio {
    width: 100%;
    margin-top: 24px;
  }

  &__links {
    margin-top: 16px;

    &__item {
      --inner-padding-start: 8px;
    }
  }
}
</style>
