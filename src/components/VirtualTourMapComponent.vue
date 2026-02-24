<script setup lang="ts">
import { ref } from "vue";
import { Layers, Map, MapControls, Sources } from "vue3-openlayers";
import { Projection } from "ol/proj";
import { type VirtualTourStation } from "@/services/VirtualTourService.ts";
import { IonButton, IonIcon, useIonRouter } from "@ionic/vue";
import { closeOutline } from "ionicons/icons";

type Props = {
  virtualTourStations: VirtualTourStation[];
};
const props = defineProps<Props>();

const router = useIonRouter();

const zoom = ref<number>(2.5);
const maxZoom = ref<number>(6);
const size = ref<number[]>([6384, 3696]);
const center = ref<number[]>([
  <number>size.value[0] / 2,
  <number>size.value[1] / 2,
]);
const extent = ref<number[]>([0, 0, ...size.value]);
const projection = new Projection({
  code: "xkcd-image",
  units: "pixels",
  extent: extent.value,
});
const imgUrl = ref<string>("/imgs/virtual-tour/LuftaufnahmeDahenfeld.jpg");

const selectedStation = ref<VirtualTourStation | undefined>(undefined);
const openDialog = (station: VirtualTourStation) => {
  selectedStation.value = station;
};
const closeDialog = () => {
  selectedStation.value = undefined;
};

const openStationDetail = (id: number) => {
  router.push(`/virtual-tour/${id}`);
};
</script>

<template>
  <Map.OlMap
    :loadTilesWhileAnimating="true"
    :loadTilesWhileInteracting="true"
    style="height: 100%; width: 100%"
  >
    <Map.OlView
      :center="center"
      :zoom="zoom"
      :minZoom="zoom"
      :max-zoom="maxZoom"
      :projection="projection"
      :extent="extent"
    />

    <MapControls.OlZoomControl />

    <Layers.OlImageLayer id="xkcd">
      <Sources.OlSourceImageStatic
        :url="imgUrl"
        :imageSize="size"
        :imageExtent="extent"
      ></Sources.OlSourceImageStatic>
    </Layers.OlImageLayer>

    <template v-for="station of props.virtualTourStations" :key="station.id">
      <Map.OlOverlay :position="[station.positionX, station.positionY]">
        <div
          class="overlay-content"
          :class="[`station-category__${station.category}`]"
          @click="openDialog(station)"
        >
          {{ station.id }}
        </div>
      </Map.OlOverlay>
    </template>
  </Map.OlMap>

  <template v-if="selectedStation">
    <div class="speech-bubble">
      <div class="speech-bubble__content">
        <h2>{{ selectedStation.title }}</h2>
        <h3>{{ selectedStation.subTitle }}</h3>

        <p
          v-html="
            selectedStation.description.split(' ').slice(0, 35).join(' ') +
            '...'
          "
        ></p>

        <div class="speech-bubble__read-more">
          <ion-button @click="openStationDetail(selectedStation.id)">
            Weiterlesen
          </ion-button>
        </div>
      </div>

      <div class="speech-bubble__station-id">
        <div
          class="overlay-content"
          :class="[`station-category__${selectedStation.category}`]"
        >
          {{ selectedStation.id }}
        </div>
      </div>
      <div class="speech-bubble__close">
        <IonIcon :icon="closeOutline" @click="closeDialog"></IonIcon>
      </div>
      <div class="speech-bubble__arrow"></div>
    </div>

    <div class="remichele">
      <img src="/imgs/virtual-tour/remichele.png" alt="Remichele" />
    </div>
  </template>
</template>

<style scoped lang="scss">
.overlay-content {
  height: 30px;
  width: 30px;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.speech-bubble {
  position: absolute;
  bottom: 210px;
  left: 50px;
  right: 50px;
  max-width: 750px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;

  &__content {
    position: relative;
    z-index: 2;
    margin-top: 32px;

    h2 {
      font-size: 1.25rem;
      font-weight: bold;
      margin: 0;
    }

    h3 {
      margin: 0;
      font-weight: normal;
      font-size: 1rem;
    }
  }

  &__read-more {
    margin-top: 32px;
    text-align: right;
  }

  &__arrow {
    position: absolute;
    bottom: -19px;
    left: 42px;
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 20px solid white;
    z-index: 1;
    filter: drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.1));
  }

  &__station-id {
    position: absolute;
    top: 16px;
    left: 16px;
  }

  &__close {
    position: absolute;
    top: 16px;
    right: 16px;
    font-size: 24px;
    cursor: pointer;
  }
}

.remichele {
  position: fixed;
  bottom: 50px;
  left: 50px;
  z-index: 3;
}

.remichele img {
  background: #fff;
  width: auto;
  height: 125px;
  border-radius: 50%;
  border: 2px solid #ccc;
}
</style>
