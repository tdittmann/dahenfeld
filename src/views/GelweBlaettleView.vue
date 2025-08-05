<script setup lang="ts">
import {
  IonContent,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import {
  type GelweBlaettle,
  GelweBlaettleService,
} from "@/services/GelweBlaettleService.ts";
import LoadingComponent from "@/components/LoadingComponent.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";

const loading = ref<boolean>(true);
const gelweBlaettleMap = ref<Map<number, GelweBlaettle[]>>(new Map());
const loadGelweBlaettle = () => {
  loading.value = true;
  gelweBlaettleMap.value.clear();

  GelweBlaettleService.loadGelweBlaettle()
    .then((gelweBlaettle: GelweBlaettle[]) => {
      for (const blaettle of gelweBlaettle) {
        const key = blaettle.publish_date.getFullYear();
        if (gelweBlaettleMap.value.has(key)) {
          gelweBlaettleMap.value.get(key)?.push(blaettle);
        } else {
          gelweBlaettleMap.value.set(key, [blaettle]);
        }
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const openBlaettle = (link: string) => {
  window.open(link, "_blank");
};

onMounted(() => {
  loadGelweBlaettle();
});
</script>

<template>
  <HeaderComponent title="'s Gelwe Blättle" />

  <IonContent>
    <LoadingComponent :loading="loading" />

    <div class="container" v-if="!loading">
      <p style="margin-top: 16px; margin-bottom: 16px">
        Hier finden Sie die aktuelle, sowie bereits erschienene Ausgaben des
        Gelwen Blättle.
      </p>

      <template v-for="[key, values] of gelweBlaettleMap" :key="key">
        <IonItemGroup mode="ios" style="margin-top: 32px">
          <IonItemDivider>
            <IonLabel>{{ key }}</IonLabel>
          </IonItemDivider>

          <IonList>
            <template v-for="blaettle of values" :key="blaettle.name">
              <IonItem :button="true" @click="openBlaettle(blaettle.link)">
                <IonLabel>
                  <strong>{{ blaettle.name }}</strong>
                </IonLabel>
              </IonItem>
            </template>
          </IonList>
        </IonItemGroup>
      </template>
    </div>
  </IonContent>
</template>

<style scoped lang="scss">
.metadata-end-wrapper {
  position: absolute;
  top: 10px;
  inset-inline-end: 10px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
}

ion-label strong {
  display: block;
  max-width: calc(100% - 60px);
  overflow: hidden;
  text-overflow: ellipsis;
}

ion-label ion-note {
  font-size: 0.9rem;
}
</style>
