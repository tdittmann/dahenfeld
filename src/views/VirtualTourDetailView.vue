<script setup lang="ts">
import HeaderComponent from "@/components/HeaderComponent.vue";
import { useRoute } from "vue-router";
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import type { IonContentCustomEvent } from "@ionic/core/dist/types/components";
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  type ScrollDetail,
  useIonRouter,
} from "@ionic/vue";
import {
  VirtualTourService,
  type VirtualTourStation,
} from "@/services/VirtualTourService.ts";
import LoadingComponent from "@/components/LoadingComponent.vue";
import {
  chevronBackOutline,
  chevronForwardOutline,
  locationOutline,
  navigateCircleOutline,
  pauseCircleOutline,
  playCircleOutline,
  volumeHighOutline,
} from "ionicons/icons";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper/modules";
import lightGallery from "lightgallery";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import lgZoom from "lightgallery/plugins/zoom";

const route = useRoute();
const router = useIonRouter();

const loading = ref<boolean>(true);
const virtualTourStation = ref<VirtualTourStation | undefined>(undefined);
const maxIdOfVirtualStation = ref<number>(0);
const loadVirtualTourStation = (id: number) => {
  loading.value = true;
  virtualTourStation.value = undefined;

  VirtualTourService.loadStations().then((value) => {
    maxIdOfVirtualStation.value = value.length;
  });

  VirtualTourService.loadStationById(id)
    .then((data: VirtualTourStation | undefined) => {
      if (data) {
        virtualTourStation.value = data;
      } else {
        router.push("/virtual-tour");
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

const openGoogleMapsLink = (latitude: number, longitude: number) => {
  window.open(
    `https://www.google.com/maps/place/${latitude},${longitude}`,
    "_blank",
  );
};

let gallery: any;
let galleryItems: any[] = [];

watch(virtualTourStation, async (val) => {
  if (val?.images?.length) {
    await nextTick();

    // Build the gallery items
    galleryItems = val.images.map((img) => ({
      src: img.image,
      thumb: img.image,
      subHtml: img.copyright ? `Foto: ${img.copyright}` : "",
    }));

    // Destroy previous gallery if exists
    if (gallery) {
      gallery.destroy();
    }

    // Initialize gallery with all items
    gallery = lightGallery(document.createElement("div"), {
      dynamic: true,
      dynamicEl: galleryItems,
      controls: true,
      counter: false,
      loop: false,
      download: false,
      plugins: [lgZoom],
      speed: 300,
    });
  }
});

// Open at clicked index
const openGalleryAtIndex = (index: number) => {
  gallery.openGallery(index); // now arrows will appear
};

// ==========================================
// AUDIO LOGIK
// ==========================================
const isPlaying = ref(false);
let audioElement: HTMLAudioElement | null = null;

const toggleAudio = () => {
  if (virtualTourStation.value?.audio) {
    if (!audioElement) {
      audioElement = new Audio(virtualTourStation.value.audio);
      audioElement.onended = () => {
        isPlaying.value = false;
      };
    }
    if (isPlaying.value) {
      audioElement.pause();
      isPlaying.value = false;
    } else {
      audioElement.play();
      isPlaying.value = true;
    }
    return;
  }
};

const navigateTo = (id: number | undefined) => {
  if (id) {
    if (audioElement) {
      audioElement.pause();
    }
    isPlaying.value = false;
    router.navigate(`/virtual-tour/${id}`, "forward", "replace");
  }
};

onMounted(() => {
  const parsedId = parseInt(<string>route.params.id, 10);
  if (!parsedId) {
    router.push("/virtual-tour");
  }
  loadVirtualTourStation(parsedId);
});

onUnmounted(() => {
  if (audioElement) {
    audioElement.pause();
  }
});
</script>

<template>
  <IonPage>
    <HeaderComponent
      class="header"
      :title="opacityToolbar ? virtualTourStation?.title : ''"
      :transparentBackground="!opacityToolbar"
    />

    <IonContent @ionScroll="handleScroll" :scrollEvents="true">
      <LoadingComponent :loading="loading" />

      <template v-if="virtualTourStation">
        <div id="lightgallery">
          <swiper
            :modules="[Pagination, Navigation]"
            :pagination="{ clickable: true }"
            :navigation="true"
            :slides-per-view="1"
          >
            <swiper-slide
              v-for="(image, index) in virtualTourStation.images"
              :key="image.image"
            >
              <a @click.prevent="openGalleryAtIndex(index)">
                <div
                  class="swiper-container"
                  :style="{ backgroundImage: `url(${image.image})` }"
                >
                  <div class="container slide-container">
                    <div v-if="image?.copyright" class="image-copyright">
                      Foto: {{ image.copyright }}
                    </div>
                  </div>
                </div>
              </a>
            </swiper-slide>
          </swiper>
        </div>

        <div class="container">
          <div class="header-section">
            <div
              class="category-id"
              :class="[`station-category__${virtualTourStation.category}`]"
            >
              {{ virtualTourStation.id }}
            </div>

            <h1>{{ virtualTourStation.title }}</h1>
            <p class="address-text">
              <ion-icon :icon="locationOutline"></ion-icon>
              {{ virtualTourStation.subTitle }}
            </p>
          </div>

          <ion-card class="audio-card" v-if="virtualTourStation.audio">
            <ion-card-content class="audio-container">
              <div class="audio-info">
                <ion-icon
                  :icon="volumeHighOutline"
                  class="audio-icon"
                ></ion-icon>
                <div>
                  <strong>Audio-Guide</strong>
                  <p class="audio-subtitle">
                    {{
                      isPlaying
                        ? "Spielt ab..."
                        : "Beschreibung vorlesen lassen"
                    }}
                  </p>
                </div>
              </div>
              <ion-button fill="clear" size="large" @click="toggleAudio">
                <ion-icon
                  :icon="isPlaying ? pauseCircleOutline : playCircleOutline"
                  color="primary"
                ></ion-icon>
              </ion-button>
            </ion-card-content>
          </ion-card>
        </div>

        <div class="historic-background">
          <div class="container">
            <div
              class="virtual-tour-station__description"
              v-html="virtualTourStation.description"
            />
            <div
              v-if="virtualTourStation.author"
              class="virtual-tour-station__author"
            >
              {{ virtualTourStation.author }}
            </div>
          </div>
        </div>

        <div class="container text-container">
          <div class="virtual-tour-station__links">
            <ion-list mode="ios">
              <ion-list-header>
                <ion-label>Links</ion-label>
              </ion-list-header>

              <ion-item
                class="virtual-tour-station__links__item"
                :button="true"
                v-if="virtualTourStation.longitude"
                @click="
                  openGoogleMapsLink(
                    virtualTourStation.latitude,
                    virtualTourStation.longitude,
                  )
                "
              >
                <ion-icon :icon="navigateCircleOutline" slot="start"></ion-icon>
                <ion-label>In Google Maps anzeigen</ion-label>
              </ion-item>
            </ion-list>
          </div>
        </div>
      </template>
    </IonContent>

    <ion-footer v-if="virtualTourStation">
      <ion-toolbar class="station-navigation">
        <ion-buttons slot="start" v-if="!loading && virtualTourStation.id > 1">
          <ion-button
            @click="navigateTo(Number(virtualTourStation.id) - 1)"
            class="text"
          >
            <ion-icon
              class="text"
              slot="start"
              :icon="chevronBackOutline"
            ></ion-icon>
            Vorherige Station
          </ion-button>
        </ion-buttons>
        <ion-buttons
          slot="end"
          v-if="
            !loading && Number(virtualTourStation.id) !== maxIdOfVirtualStation
          "
        >
          <ion-button
            class="text"
            @click="navigateTo(Number(virtualTourStation.id) + 1)"
          >
            Nächste Station
            <ion-icon
              class="text"
              slot="end"
              :icon="chevronForwardOutline"
            ></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  </IonPage>
</template>

<style scoped lang="scss">
.swiper {
  height: 325px;
  cursor: pointer;
}

.swiper-container {
  background-size: cover;
  background-position: center;
  height: 100%;
}

.historic-background {
  background: url("/imgs/virtual-tour/Dorfbuch.png") no-repeat center;
  background-size: cover;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.text-container {
  margin-bottom: 32px;
}

.header {
  position: absolute;
}

.container {
  z-index: 2;
}

.slide-container {
  position: relative;
  height: 100%;
}

.image-copyright {
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  min-width: 100px;
  position: absolute;
  bottom: 0;
  right: 0;
  color: #fff;
  text-align: left;
  background: rgba(0, 0, 0, 0.65);
  padding: 3px 8px;
  border-radius: 4px;
  max-width: 35%;
}

.header-section {
  margin: 16px 4px;
  position: relative;

  h1 {
    font-weight: bold;
    width: 95%;
  }

  .address-text {
    color: var(--ion-color-medium);
    display: flex;
    align-items: center;
    gap: 4px;
    margin: 0;
    font-size: 1rem;
  }

  .category-id {
    position: absolute;
    top: 0;
    right: 0;
    width: 35px;
    height: 35px;
    border-radius: 20px;
    text-align: center;
    font-size: 18px;
    font-weight: bolder;
    padding-top: 2px;
  }
}

.virtual-tour-station {
  &__description {
    padding-top: 12px;
    padding-bottom: 12px;
  }

  &__author {
    font-size: 0.8em;
    padding-bottom: 12px;
    text-align: right;
  }

  &__links {
    margin-top: 16px;

    &__item {
      --inner-padding-start: 8px;
    }
  }
}

.audio-card {
  margin: 16px 0;
  border-left: 4px solid var(--ion-color-primary);
}

.audio-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
}

.audio-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.audio-icon {
  font-size: 1.8rem;
  color: var(--ion-color-primary);
}

.audio-subtitle {
  margin: 2px 0 0 0;
  font-size: 0.85rem;
  color: var(--ion-color-medium);
}

.station-navigation {
  --background: var(--ion-color-primary);

  .text {
    color: #fff;
    --color: #fff;
  }
}
</style>
