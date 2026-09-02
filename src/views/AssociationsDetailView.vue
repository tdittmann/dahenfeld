<script setup lang="ts">
import {
  IonContent,
  IonIcon,
  IonPage,
  type ScrollDetail,
  useIonRouter,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
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
import { useRoute } from "vue-router";
import type { IonContentCustomEvent } from "@ionic/core/dist/types/components";
import HeaderComponent from "@/components/HeaderComponent.vue";
import LoadingComponent from "@/components/LoadingComponent.vue";

const route = useRoute();
const router = useIonRouter();

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
  <IonPage>
    <HeaderComponent
      class="header"
      :title="opacityToolbar ? association?.name : ''"
      :transparentBackground="!opacityToolbar"
    />

    <ion-content @ionScroll="handleScroll" :scrollEvents="true">
      <LoadingComponent :loading="loading" />
      <template v-if="association">
        <div class="club-hero">
          <img
            v-if="association.image"
            class="club-background"
            :src="association.image"
            alt=""
          />
          <div
            v-if="!association.image"
            class="club-background club-background-color"
          ></div>

          <div class="club-logo" v-if="association.logo">
            <img :src="association.logo" :alt="association.name" />
          </div>
        </div>

        <div class="container">
          <div class="club-header">
            <h1>{{ association.name }}</h1>

            <p class="slogan" v-if="association.subTitle">
              {{ association.subTitle }}
            </p>

            <div class="club-links">
              <ion-button
                fill="clear"
                v-if="association.homepage"
                @click="openLink(association.homepage)"
              >
                <ion-icon slot="icon-only" :icon="linkOutline" />
              </ion-button>

              <ion-button
                fill="clear"
                v-if="association.facebook"
                @click="openLink(association.facebook)"
              >
                <ion-icon slot="icon-only" :icon="logoFacebook" />
              </ion-button>

              <ion-button
                fill="clear"
                v-if="association.instagram"
                @click="openLink(association.instagram)"
              >
                <ion-icon slot="icon-only" :icon="logoInstagram" />
              </ion-button>

              <ion-button
                fill="clear"
                v-if="association.whatsapp"
                @click="openLink(association.whatsapp)"
              >
                <ion-icon slot="icon-only" :icon="logoWhatsapp" />
              </ion-button>
            </div>
          </div>

          <div class="club-description" v-html="association.description"></div>
        </div>
      </template>
    </ion-content>
  </IonPage>
</template>

<style scoped lang="scss">
.header {
  position: absolute;
}

.club-hero {
  position: relative;
  height: 190px;
}

.club-background {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.club-background-color {
  background: var(--ion-color-primary);
}

.club-logo {
  position: absolute;
  left: 50%;
  bottom: -48px;
  transform: translateX(-50%);

  width: 96px;
  height: 96px;

  padding: 8px;
  border-radius: 20px;

  background: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);

  display: flex;
  align-items: center;
  justify-content: center;
}

.club-logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.club-header {
  padding: 64px 20px 20px;
  text-align: center;
}

.club-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.slogan {
  margin: 8px 0 16px;
  color: var(--ion-color-medium);
  font-size: 16px;
}

.club-links {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.club-links ion-button {
  --border-radius: 50%;
  --padding-start: 10px;
  --padding-end: 10px;
}

.club-description {
  margin-bottom: 16px;
}
</style>
