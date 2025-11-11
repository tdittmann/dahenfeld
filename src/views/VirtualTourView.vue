<script setup lang="ts">
import { onMounted, ref } from "vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import {
  VirtualTourService,
  type VirtualTourStation,
} from "@/services/VirtualTourService.ts";
import { IonButton, IonIcon, IonPage, IonContent } from "@ionic/vue";
import { earthOutline, gridOutline } from "ionicons/icons";
import { useNavigationStore } from "@/stores/navigation.ts";
import VirtualTourMapComponent from "@/components/VirtualTourMapComponent.vue";
import VirtualTourListComponent from "@/components/VirtualTourListComponent.vue";

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

onMounted(() => {
  loadVirtualTourStations();
  viewMode.value =
    <VirtualTourViewMode>localStorage.getItem(virtualTourStorageKey) ??
    VirtualTourViewMode.Map;
});
</script>

<template>
  <IonPage>
    <HeaderComponent :title="navigationStore.currentItem?.title">
      <template #buttons>
        <IonButton
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
