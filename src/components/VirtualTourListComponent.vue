<script setup lang="ts">
import type { VirtualTourStation } from "@/services/VirtualTourService.ts";
import { IonCol, IonGrid, IonRow, useIonRouter } from "@ionic/vue";
import HeaderBannerComponent from "@/components/HeaderBannerComponent.vue";

type Props = {
  virtualTourStations: VirtualTourStation[];
};
const props = defineProps<Props>();

const router = useIonRouter();

const openStationDetail = (id: number) => {
  router.push(`/virtual-tour/${id}`);
};
</script>

<template>
  <div class="container">
    <ion-grid>
      <ion-row>
        <template
          v-for="station of props.virtualTourStations"
          :key="station.id"
        >
          <ion-col size="12">
            <HeaderBannerComponent
              :backgroundImageUrl="station.images[0]?.image ?? ''"
              class="virtual-tour-station"
              @click="openStationDetail(station.id)"
            >
              <div
                class="virtual-tour-station__id-container"
                :class="[`station-category__${station.category}`]"
              >
                {{ station.id }}
              </div>
              <div class="container">
                <div class="virtual-tour-station__info">
                  <div class="virtual-tour-station__info__name">
                    <h1>{{ station.title }}</h1>
                    <h2>{{ station.subTitle }}</h2>
                  </div>
                  <div
                    v-if="station.images[0]?.copyright"
                    class="virtual-tour-station__info__image-copyright"
                  >
                    Foto: {{ station.images[0].copyright }}
                  </div>
                </div>
              </div>
            </HeaderBannerComponent>
          </ion-col>
        </template>
      </ion-row>
    </ion-grid>
  </div>
</template>

<style scoped lang="scss">
.card-image {
  background-size: cover;
  background-position: center;
  height: 200px;
  position: relative;
}

.container {
  z-index: 2;
}

.virtual-tour-station {
  display: flex;
  align-items: end;
  cursor: pointer;

  &__id-container {
    position: absolute;
    top: calc(var(--bs-gutter-x) * 0.5);
    left: calc(var(--bs-gutter-x) * 0.5);
    width: 35px;
    height: 35px;
    border-radius: 20px;
    text-align: center;
    font-size: 18px;
    font-weight: bolder;
    padding-top: 2px;
  }

  &__info {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
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

    &__image-copyright {
      font-size: 0.7rem;
      min-width: 100px;
      text-align: right;
    }
  }
}
</style>
