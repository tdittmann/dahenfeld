<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Layers, Map, MapControls, Sources } from "vue3-openlayers";
import { Projection } from "ol/proj";
import HeaderComponent from "@/components/HeaderComponent.vue";
import {
  VirtualTourService,
  type VirtualTourStation,
} from "@/services/VirtualTourService.ts";
import { IonButton, IonIcon } from "@ionic/vue";
import { closeOutline } from "ionicons/icons";
import { useRouter } from "vue-router";

const router = useRouter();

const zoom = ref<number>(2.5);
const maxZoom = ref<number>(5);
const size = ref<number[]>([2599, 2124]);
const center = ref<number[]>([size.value[0] / 2, size.value[1] / 2]);
const extent = ref<number[]>([0, 0, ...size.value]);
const projection = new Projection({
  code: "xkcd-image",
  units: "pixels",
  extent: extent.value,
});
const imgUrl = ref<string>("/imgs/virtual-tour/LuftaufnahmeDahenfeld.png");

const selectedStation = ref<VirtualTourStation | undefined>(undefined);
const openDialog = (station: VirtualTourStation) => {
  selectedStation.value = station;
};
const closeDialog = () => {
  selectedStation.value = undefined;
};

const loading = ref<boolean>(true);
const virtualTourStations = ref<VirtualTourStation[]>([]);
const loadVirtualTourStations = () => {
  loading.value = true;
  virtualTourStations.value = [];

  VirtualTourService.loadStations()
    .then((stations: VirtualTourStation[]) => {
      virtualTourStations.value = stations;
    })
    .finally(() => {
      loading.value = false;
    });
};

const openStationDetail = (id: number) => {
  router.push(`/virtual-tour/${id}`);
};

onMounted(() => {
  loadVirtualTourStations();
});
</script>

<template>
  <HeaderComponent title="Virtueller Rundgang" />

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

    <template v-for="station of virtualTourStations" :key="station.id">
      <Map.OlOverlay :position="[station.positionX, station.positionY]">
        <div
          class="overlay-content"
          :class="[`overlay-content__${station.category}`]"
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

        <div class="speech-bubble__read-more">
          <ion-button @click="openStationDetail(selectedStation.id)"
            >Mehr erfahren</ion-button
          >
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

  &__historic {
    background: #874618;
    color: #fff;
    border: 1px solid #6a340d;
  }

  &__virtual {
    background: #871885;
    color: #fff;
    border: 1px solid #6a0d69;
  }
}

.speech-bubble {
  position: absolute;
  bottom: 210px;
  left: 50px;
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
    left: 50px;
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 20px solid white;
    z-index: 1;
    filter: drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.1));
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
  bottom: 60px;
  left: 20px;
  z-index: 3;
}

.remichele img {
  background: #fff;
  width: 200px;
  height: auto;
  border-radius: 50%;
  border: 2px solid #ccc;
}
</style>
