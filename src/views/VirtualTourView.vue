<script setup lang="ts">
import { reactive, ref } from "vue";
import { Layers, Map, MapControls, Sources } from "vue3-openlayers";
import { IonHeader, IonTitle, IonToolbar } from "@ionic/vue";

// If we need clustering: https://openlayers.org/en/latest/examples/cluster.html

const zoom = ref(2.5);
const maxZoom = ref(5);
const size = ref([2599, 2124]);
const center = ref([size.value[0] / 2, size.value[1] / 2]);
const extent = ref([0, 0, ...size.value]);
const projection = reactive({
  code: "xkcd-image",
  units: "pixels",
  extent: extent,
});
const imgUrl = ref("/imgs/virtual-tour/LuftaufnahmeDahenfeld.png");

const dialogOpen = ref<boolean>(false);
const openDialog = () => {
  dialogOpen.value = true;
};
const closeDialog = () => {
  dialogOpen.value = false;
};
</script>

<template>
  <IonHeader>
    <IonToolbar>
      <IonTitle class="toolbar-title">Virtuelle Tour</IonTitle>
    </IonToolbar>
  </IonHeader>

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

    <Map.OlOverlay :position="[1100, 1100]">
      <div class="overlay-content" @click="openDialog">Test</div>
    </Map.OlOverlay>

    <Map.OlOverlay :position="[900, 1100]">
      <div class="overlay-content" @click="openDialog">Test</div>
    </Map.OlOverlay>

    <Map.OlOverlay :position="[1100, 1300]">
      <div class="overlay-content" @click="openDialog">Test</div>
    </Map.OlOverlay>

    <Map.OlOverlay :position="[750, 600]">
      <div class="overlay-content" @click="openDialog">SCD</div>
    </Map.OlOverlay>

    <Map.OlOverlay :position="[1700, 2000]">
      <div class="overlay-content" @click="openDialog">Test</div>
    </Map.OlOverlay>
  </Map.OlMap>

  <template v-if="dialogOpen">
    <div class="speech-bubble" @click="closeDialog">
      <div class="speech-bubble__content">
        <h2>Hey! Schön, dich zu sehen!</h2>
        <p>Ich bin hier unten links – klick mich an, um mehr zu erfahren.</p>
      </div>

      <div class="speech-bubble__arrow"></div>
    </div>

    <div class="remichele">
      <img src="/imgs/virtual-tour/remichele.png" alt="Remichele" />
    </div>
  </template>
</template>

<style scoped>
.overlay-content {
  height: 50px;
  width: 50px;
  border-radius: 50px;
  background: red;
  border: 1px solid yellow;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.speech-bubble {
  position: absolute;
  bottom: 170px;
  left: 50px;
  top: 75px;
  width: calc(100% - 100px);
  height: calc(100% - 250px);
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;

  &__content {
    position: relative;
    z-index: 2;
  }
}

.speech-bubble__arrow {
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

.remichele {
  position: fixed;
  bottom: 20px;
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
