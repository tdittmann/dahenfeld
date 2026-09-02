<script setup lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonPage,
  IonRow,
  useIonRouter,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import LoadingComponent from "@/components/LoadingComponent.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import {
  type Association,
  AssociationsService,
} from "@/services/AssociationsService.ts";
import { chevronForwardOutline } from "ionicons/icons";
import { useNavigationStore } from "@/stores/navigation.ts";

const router = useIonRouter();
const navigationStore = useNavigationStore();

const loading = ref<boolean>(true);
const associations = ref<Association[]>([]);
const loadAssociations = () => {
  loading.value = true;
  associations.value = [];

  AssociationsService.loadAssociations()
    .then((data: Association[]) => {
      associations.value = data;
    })
    .finally(() => {
      loading.value = false;
    });
};

const openAssociationDetail = (id: number) => {
  router.push(`/vereine/${id}`);
};

onMounted(() => {
  loadAssociations();
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

        <ion-grid>
          <ion-row>
            <template
              v-for="association of associations"
              :key="association.name"
            >
              <ion-col size="12" sizeMd="6" sizeLg="4">
                <ion-card @click="openAssociationDetail(association.id)">
                  <ion-card-content>
                    <div class="club-card">
                      <div class="club-logo">
                        <img
                          v-if="association.logo"
                          :src="association.logo"
                          :alt="association.name"
                        />
                      </div>

                      <div class="club-info">
                        <div class="club-name">{{ association.name }}</div>
                        <div class="club-type">{{ association.subTitle }}</div>
                      </div>

                      <ion-icon
                        class="chevron"
                        :icon="chevronForwardOutline"
                      ></ion-icon>
                    </div>
                  </ion-card-content>
                </ion-card>
              </ion-col>
            </template>
          </ion-row>
        </ion-grid>
      </div>
    </IonContent>
  </IonPage>
</template>

<style scoped lang="scss">
.card {
  cursor: pointer;

  &__header {
    display: flex;
    flex-direction: row;
    align-items: center;

    &__logo {
      margin-right: 16px;
      width: 50px;
      max-height: 56px;
    }
  }

  &__description {
    display: -webkit-box;
    line-clamp: 7;
    -webkit-line-clamp: 7;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;

    &__left,
    &__right {
      display: flex;
      gap: 0.5rem;
    }
  }
}

.club-card {
  display: flex;
  align-items: center;
  gap: 16px;
}

.club-logo {
  width: 72px;
  height: 72px;
  flex: 0 0 72px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.club-logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.club-info {
  min-width: 0;
  flex: 1;
}

.club-name {
  font-size: 17px;
  font-weight: 600;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.club-type {
  margin-top: 4px;
  color: var(--ion-color-medium);
  font-size: 14px;
}

.club-links {
  display: flex;
  margin-left: -10px;
  margin-top: 4px;
}

.club-links ion-button {
  --padding-start: 6px;
  --padding-end: 6px;
  margin: 0;
}

.chevron {
  flex: 0 0 auto;
  color: var(--ion-color-medium);
  font-size: 20px;
}
</style>
