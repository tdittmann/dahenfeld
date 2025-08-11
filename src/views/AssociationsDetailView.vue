<script setup lang="ts">
import {
  IonAvatar,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  type ScrollDetail,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import LoadingComponent from "@/components/LoadingComponent.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import {
  type Association,
  AssociationsService,
} from "@/services/AssociationsService.ts";
import {
  linkOutline,
  logoFacebook,
  logoInstagram,
  logoWhatsapp,
} from "ionicons/icons";
import { useRoute, useRouter } from "vue-router";
import HeaderBannerComponent from "@/components/HeaderBannerComponent.vue";
import type { IonContentCustomEvent } from "@ionic/core/dist/types/components";

const route = useRoute();
const router = useRouter();

const loading = ref<boolean>(true);
const association = ref<Association | undefined>(undefined);
const loadAssociation = (id: number) => {
  loading.value = true;
  association.value = undefined;

  AssociationsService.loadAssociationById(id)
    .then((data: Association | undefined) => {
      if (data) {
        association.value = data;
      } else {
        router.push("/vereine");
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const opacityToolbar = ref<boolean>(false);
const handleScroll = (evt: IonContentCustomEvent<ScrollDetail>) => {
  const scrollTop = evt.detail.scrollTop;
  opacityToolbar.value = scrollTop > 194;
};

const openLink = (link: string) => {
  window.open(link, "_blank");
};

onMounted(() => {
  const parsedId = parseInt(<string>route.params.id, 10);
  if (!parsedId) {
    router.push("/vereine");
  }
  loadAssociation(parsedId);
});
</script>

<template>
  <HeaderComponent
    class="header"
    :title="opacityToolbar ? association?.name : ''"
    :transparentBackground="!opacityToolbar"
  />

  <IonContent @ionScroll="handleScroll" :scrollEvents="true">
    <LoadingComponent :loading="loading" />

    <template v-if="association">
      <HeaderBannerComponent
        :backgroundImageUrl="association.image"
        style="display: flex; align-items: end"
      >
        <div class="container">
          <div class="association-info">
            <ion-avatar v-if="association.logo">
              <img :alt="association.name" :src="association.logo" />
            </ion-avatar>
            <div class="association-info__name">
              <h1>{{ association.name }}</h1>
              <h2>{{ association.subTitle }}</h2>
            </div>
          </div>
        </div>
      </HeaderBannerComponent>

      <div class="container">
        <div class="association-description" v-html="association.description" />

        <div class="association-links">
          <ion-list mode="ios">
            <ion-list-header>
              <ion-label>Links</ion-label>
            </ion-list-header>

            <ion-item
              class="association-links__item"
              :button="true"
              v-if="association.homepage"
              @click="openLink(association.homepage)"
            >
              <ion-icon :icon="linkOutline" slot="start"></ion-icon>
              <ion-label>Homepage</ion-label>
            </ion-item>

            <ion-item
              class="association-links__item"
              :button="true"
              v-if="association.whatsapp"
              @click="openLink(association.whatsapp)"
            >
              <ion-icon :icon="logoWhatsapp" slot="start"></ion-icon>
              <ion-label>WhatsApp</ion-label>
            </ion-item>

            <ion-item
              class="association-links__item"
              :button="true"
              v-if="association.facebook"
              @click="openLink(association.facebook)"
            >
              <ion-icon :icon="logoFacebook" slot="start"></ion-icon>
              <ion-label>Facebook</ion-label>
            </ion-item>

            <ion-item
              class="association-links__item"
              :button="true"
              v-if="association.instagram"
              @click="openLink(association.instagram)"
            >
              <ion-icon :icon="logoInstagram" slot="start"></ion-icon>
              <ion-label>Instagram</ion-label>
            </ion-item>
          </ion-list>
        </div>
      </div>
    </template>
  </IonContent>
</template>

<style scoped lang="scss">
.header {
  position: absolute;
}

.container {
  z-index: 2;
}

.association-info {
  display: flex;
  align-items: center;
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
}

.association-description {
  margin-top: 8px;
  margin-bottom: 8px;
}

.association-links {
  margin-bottom: 32px;

  &__item {
    --inner-padding-start: 8px;
  }
}
</style>
