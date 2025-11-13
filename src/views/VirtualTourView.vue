<script setup lang="ts">
import { onMounted, ref } from "vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import {
  VirtualTourService,
  type VirtualTourStation,
} from "@/services/VirtualTourService.ts";
import { IonButton, IonContent, IonIcon, IonPage } from "@ionic/vue";
import { earthOutline, gridOutline } from "ionicons/icons";
import { useNavigationStore } from "@/stores/navigation.ts";
import VirtualTourMapComponent from "@/components/VirtualTourMapComponent.vue";
import VirtualTourListComponent from "@/components/VirtualTourListComponent.vue";
import { type ITourStep, VTour } from "@globalhive/vuejs-tour";

const navigationStore = useNavigationStore();

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

const virtualTourStorageKey = "virtualTourViewMode";
enum VirtualTourViewMode {
  Map = "map",
  List = "list",
}
const viewMode = ref<VirtualTourViewMode>(VirtualTourViewMode.Map);

const updateViewMode = (newViewMode: VirtualTourViewMode) => {
  viewMode.value = newViewMode;
  localStorage.setItem(virtualTourStorageKey, newViewMode);
};

const tourSteps: ITourStep[] = [
  {
    target: ".virtual-tour__step-1",
    content:
      "<h4>Virtueller Rundgang</h4>Erfahre mehr über Dahenfeld auf unserem virtuellen Rundgang. Jede Station ist mit einem Punkt versehen, bei einem Klick darauf erfährst Du mehr.",
    backdrop: true,
  },
  {
    target: ".virtual-tour__step-2",
    content:
      "<h4>Karte vergrößern / verkleinern</h4>Nutze die Buttons um die Karte zu vergrößern oder zu verkleinern.",
    backdrop: true,
  },
  {
    target: ".virtual-tour__step-3",
    content:
      "<h4>Ansicht ändern</h4><p>Lieber eine Liste statt Karte? Dann kannst Du hier auf eine Listenansicht umschalten.</p><p>Jetzt bist Du gerüstet und kannst dich virtuell durch Dahenfeld navigieren.</p>",
    backdrop: true,
  },
];

onMounted(() => {
  loadVirtualTourStations();
  viewMode.value =
    <VirtualTourViewMode>localStorage.getItem(virtualTourStorageKey) ??
    VirtualTourViewMode.Map;
});
</script>

<template>
  <IonPage>
    <VTour
      :steps="tourSteps"
      autoStart
      saveToLocalStorage="end"
      :buttonLabels="{
        back: 'Zurück',
        skip: 'Überspringen',
        done: 'Fertig',
        next: 'Weiter',
      }"
    />

    <HeaderComponent :title="navigationStore.currentItem?.title">
      <template #buttons>
        <IonButton
          class="virtual-tour__step-3"
          v-if="viewMode === VirtualTourViewMode.Map"
          @click="updateViewMode(VirtualTourViewMode.List)"
        >
          <ion-icon slot="icon-only" :icon="gridOutline"></ion-icon>
        </IonButton>
        <IonButton
          v-if="viewMode === VirtualTourViewMode.List"
          @click="updateViewMode(VirtualTourViewMode.Map)"
        >
          <ion-icon slot="icon-only" :icon="earthOutline"></ion-icon>
        </IonButton>
      </template>
    </HeaderComponent>

    <IonContent>
      <div class="virtual-tour__step-1"></div>
      <div class="virtual-tour__step-2"></div>

      <VirtualTourMapComponent
        v-if="viewMode === VirtualTourViewMode.Map"
        :virtualTourStations="virtualTourStations"
      />
      <VirtualTourListComponent
        v-if="viewMode === VirtualTourViewMode.List"
        :virtualTourStations="virtualTourStations"
      />
    </IonContent>
  </IonPage>
</template>

<style lang="scss" scoped>
.virtual-tour__step-1 {
  position: absolute;
  top: 45%;
  left: 50%;
}

.virtual-tour__step-2 {
  position: absolute;
  top: 40px;
  left: 50px;
}
</style>
