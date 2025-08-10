<script setup lang="ts">
import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonRow,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import LoadingComponent from "@/components/LoadingComponent.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import {
  type Association,
  AssociationsService,
} from "@/services/AssociationsService.ts";
import { linkOutline, logoFacebook, logoInstagram } from "ionicons/icons";

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

const openLink = (link: string) => {
  window.open(link, "_blank");
};

onMounted(() => {
  loadAssociations();
});
</script>

<template>
  <HeaderComponent title="Vereine" />

  <IonContent>
    <LoadingComponent :loading="loading" />

    <div class="container" v-if="!loading">
      <p style="margin-top: 16px; margin-bottom: 16px">
        Die Dahenfelder Vereine bestechen durch eine familiäre Atmosphäre und
        Freundlichkeit. Bei uns findet jeder seine Passion.
      </p>

      <ion-grid>
        <ion-row>
          <template v-for="association of associations" :key="association.name">
            <ion-col size="12" sizeMd="6" sizeLg="4">
              <ion-card class="card">
                <ion-card-header class="card__header">
                  <ion-avatar v-if="association.logo">
                    <img :alt="association.name" :src="association.logo" />
                  </ion-avatar>

                  <div class="card__header__title">
                    <ion-card-title>{{ association.name }}</ion-card-title>
                    <ion-card-subtitle v-if="association.subTitle">
                      {{ association.subTitle }}
                    </ion-card-subtitle>
                  </div>
                </ion-card-header>

                <ion-card-content>
                  <div
                    class="card__description"
                    v-html="association.description"
                  ></div>

                  <div class="card__footer">
                    <div class="card__footer__left">
                      <ion-button
                        v-if="association.homepage"
                        fill="clear"
                        @click="openLink(association.homepage)"
                      >
                        <ion-icon
                          slot="icon-only"
                          :icon="linkOutline"
                        ></ion-icon>
                      </ion-button>
                    </div>

                    <div class="card__footer__right">
                      <ion-button
                        v-if="association.facebook"
                        fill="clear"
                        @click="openLink(association.facebook)"
                      >
                        <ion-icon :icon="logoFacebook"></ion-icon>
                      </ion-button>

                      <ion-button
                        v-if="association.instagram"
                        fill="clear"
                        @click="openLink(association.instagram)"
                      >
                        <ion-icon :icon="logoInstagram"></ion-icon>
                      </ion-button>
                    </div>
                  </div>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </template>
        </ion-row>
      </ion-grid>
    </div>
  </IonContent>
</template>

<style scoped lang="scss">
ion-grid,
ion-col {
  padding-left: 0;
  padding-right: 0;
}

.card {
  cursor: pointer;

  &__header {
    display: flex;
    flex-direction: row;
    align-items: center;

    &__title {
      margin-left: 16px;
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
</style>
