<script setup lang="ts">
import {
  IonAccordion,
  IonAccordionGroup,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import {
  type GelweBlaettle,
  GelweBlaettleService,
} from "@/services/GelweBlaettleService.ts";
import LoadingComponent from "@/components/LoadingComponent.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import { useNavigationStore } from "@/stores/navigation.ts";

const navigationStore = useNavigationStore();

const loading = ref<boolean>(true);
const selectedAccordion = ref<string>();
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
      const firstKey = gelweBlaettleMap.value.keys().next().value;
      if (firstKey !== undefined) {
        selectedAccordion.value = firstKey.toString(10);
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
  <IonPage>
    <HeaderComponent :title="navigationStore.currentItem?.title" />

    <IonContent>
      <LoadingComponent :loading="loading" />

      <div class="container" v-if="!loading">
        <p
          v-if="navigationStore.currentItem?.description"
          style="margin-top: 16px; margin-bottom: 16px"
        >
          {{ navigationStore.currentItem?.description }}
        </p>

        <IonAccordionGroup :value="selectedAccordion">
          <IonAccordion
            v-for="[key, values] of gelweBlaettleMap"
            :key="key"
            :value="key.toString(10)"
          >
            <IonItem slot="header" color="light">
              <IonLabel>{{ key }}</IonLabel>
            </IonItem>
            <div slot="content">
              <IonList>
                <template v-for="blaettle of values" :key="blaettle.name">
                  <IonItem
                    :button="true"
                    :detail="true"
                    @click="openBlaettle(blaettle.link)"
                  >
                    <IonLabel>
                      <strong>{{ blaettle.name }}</strong>
                    </IonLabel>
                  </IonItem>
                </template>
              </IonList>
            </div>
          </IonAccordion>
        </IonAccordionGroup>
      </div>
    </IonContent>
  </IonPage>
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

.container {
  margin-bottom: 32px;
}
</style>
