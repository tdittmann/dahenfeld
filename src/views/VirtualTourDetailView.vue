<script setup lang="ts">
import HeaderComponent from "@/components/HeaderComponent.vue";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import type { IonContentCustomEvent } from "@ionic/core/dist/types/components";
import { IonContent, type ScrollDetail } from "@ionic/vue";
import {
  VirtualTourService,
  type VirtualTourStation,
} from "@/services/VirtualTourService.ts";
import LoadingComponent from "@/components/LoadingComponent.vue";
import HeaderBannerComponent from "@/components/HeaderBannerComponent.vue";

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
          <div class="virtual-tour-station-info">
            <div class="virtual-tour-station-info__name">
              <h1>{{ virtualTourStation.title }}</h1>
              <h2>{{ virtualTourStation.subTitle }}</h2>
            </div>
          </div>
        </div>
      </HeaderBannerComponent>

      <div class="container">
        <div
          class="virtual-tour-station-description"
          v-html="virtualTourStation.description"
        />
      </div>
    </template>
  </IonContent>
</template>

<style scoped lang="scss">
.header {
  position: absolute;
}

.container {
  z-index: 2;
}

.virtual-tour-station-info {
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

.virtual-tour-station-description {
  margin-top: 8px;
  margin-bottom: 32px;
}
</style>
