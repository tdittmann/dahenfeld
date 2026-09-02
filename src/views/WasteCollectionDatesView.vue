<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  type WasteCollectionDate,
  WasteCollectionDateService,
  type WasteCollectionType,
} from "@/services/WasteCollectionDateService.ts";
import HeaderComponent from "@/components/HeaderComponent.vue";
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
} from "@ionic/vue";
import {
  cubeOutline,
  documentTextOutline,
  leafOutline,
  trashOutline,
  warningOutline,
} from "ionicons/icons";
import LoadingComponent from "@/components/LoadingComponent.vue";
import { useNavigationStore } from "@/stores/navigation.ts";

const navigationStore = useNavigationStore();

const loading = ref<boolean>(true);
const wasteCollectionDates = ref<WasteCollectionDate[]>([]);
const loadWasteCollectionDates = () => {
  loading.value = true;

  WasteCollectionDateService.loadWasteCollectionDates()
    .then((dates: WasteCollectionDate[]) => {
      wasteCollectionDates.value = dates;
    })
    .finally(() => {
      loading.value = false;
    });
};

const upcomingCollectionDates = computed<WasteCollectionDate[]>(() => {
  const firstOccurrenceByType = new Map<
    WasteCollectionType,
    WasteCollectionDate
  >();

  for (const collectionDate of wasteCollectionDates.value) {
    if (!firstOccurrenceByType.has(collectionDate.type)) {
      firstOccurrenceByType.set(collectionDate.type, collectionDate);
    }
  }

  return Array.from(firstOccurrenceByType.values());
});

const calculateDaysUntilDate = (collectionDate: Date) => {
  const diff = Math.abs(new Date().getTime() - collectionDate.getTime());
  return Math.ceil(diff / (1000 * 3600 * 24));
};

const getTypeClass = (type: string) => {
  switch (type) {
    case "Restabfall":
      return "residual";
    case "Bioabfall":
      return "organic";
    case "Papiertonne":
      return "paper";
    case "Schadstoffe":
      return "pollutants";
    case "Gelbe Tonne":
    case "Gelbe Tonne (ab 01.01.2026)":
      return "plastic";
    default:
      return "";
  }
};

const getWasteIcon = (type: string) => {
  switch (type) {
    case "Restabfall":
      return trashOutline;
    case "Bioabfall":
      return leafOutline;
    case "Papiertonne":
      return documentTextOutline;
    case "Schadstoffe":
      return warningOutline;
    case "Gelbe Tonne":
    case "Gelbe Tonne (ab 01.01.2026)":
      return cubeOutline;
    default:
      return "";
  }
};

const formatCollectionDate = (date: Date) => {
  return date.toLocaleDateString("de-DE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

const formatDaysUntilDate = (collectionDate: Date) => {
  const daysUntilDate = calculateDaysUntilDate(collectionDate);
  switch (daysUntilDate) {
    case 0:
      return "heute";
    case 1:
      return "morgen";
    default:
      return `in ${daysUntilDate} Tagen`;
  }
};

const getTimeRangeAndLocation = (date: WasteCollectionDate) => {
  const location = date.location;
  if (date.startTime) {
    const startTime = date.startTime.split(":").slice(0, 2).join(":");

    if (date.endTime) {
      const endTime = date.endTime.split(":").slice(0, 2).join(":");
      return `${startTime} - ${endTime} Uhr, ${location}`;
    }

    return `${startTime} Uhr, ${location}`;
  }
  return location;
};

const selectedFilter = ref("Alle");
const filters = computed<string[]>(() => {
  return [
    "Alle",
    ...new Set(wasteCollectionDates.value.map((value) => value.type)).values(),
  ];
});
const filteredWasteCollectionDates = computed<WasteCollectionDate[]>(() => {
  if (selectedFilter.value === "Alle") {
    return wasteCollectionDates.value;
  }

  return wasteCollectionDates.value.filter(
    (value) => value.type === selectedFilter.value,
  );
});

onMounted(() => {
  loadWasteCollectionDates();
});
</script>

<template>
  <IonPage>
    <HeaderComponent :title="navigationStore.currentItem?.title" />

    <IonContent>
      <LoadingComponent :loading="loading" />

      <div class="container" v-if="!loading">
        <template v-if="upcomingCollectionDates.length > 0">
          <h3>Nächste Abholung</h3>
          <div class="horizontal-scroll">
            <div
              v-for="item in upcomingCollectionDates"
              :key="item.id"
              class="waste-card"
              :class="getTypeClass(item.type)"
            >
              <ion-icon class="icon" :icon="getWasteIcon(item.type)"></ion-icon>
              <span class="date">
                {{ formatCollectionDate(item.collectionDate) }}
              </span>
              <h4>{{ item.type }}</h4>
              <span class="badge">
                {{ formatDaysUntilDate(item.collectionDate) }}
              </span>
            </div>
          </div>
        </template>

        <template v-if="wasteCollectionDates.length > 0">
          <h3>Kommende Termine</h3>
          <ion-list>
            <ion-item
              v-for="item in filteredWasteCollectionDates"
              :key="item.id"
              class="list-item"
            >
              <div
                class="icon-avatar"
                :class="getTypeClass(item.type)"
                slot="start"
              >
                <ion-icon
                  class="icon"
                  :icon="getWasteIcon(item.type)"
                ></ion-icon>
              </div>
              <ion-label>
                <h2>{{ item.type }}</h2>
                <p v-if="!item.location">
                  {{ formatCollectionDate(item.collectionDate) }}
                </p>
                <p v-if="item.location">{{ getTimeRangeAndLocation(item) }}</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </template>
      </div>
    </IonContent>

    <ion-footer class="ion-no-border">
      <div class="filter-bar">
        <span
          v-for="filter in filters"
          :key="filter"
          class="chip"
          :class="{ active: selectedFilter === filter }"
          @click="selectedFilter = filter"
        >
          {{ filter }}
        </span>
      </div>
    </ion-footer>
  </IonPage>
</template>

<style scoped lang="scss">
.container {
  margin-bottom: 32px;
}

$color-residual: #222222;
$color-organic: #4caf50;
$color-paper: #4285f4;
$color-plastic: #ffca28;
$color-pollutants: #e53935;

.horizontal-scroll {
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding-bottom: 8px;
  text-align: center;
  &::-webkit-scrollbar {
    display: none;
  }

  .waste-card {
    min-width: 110px;
    height: 125px;
    border-radius: 16px;
    padding: 8px;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .icon {
      font-size: 32px;
      margin: auto;
    }

    .date {
      font-size: 0.75rem;
      opacity: 0.9;
    }

    h4 {
      margin: 2px 0;
      font-size: 0.95rem;
      font-weight: 600;
    }

    .badge {
      font-size: 0.7rem;
      opacity: 0.85;
    }

    &.residual {
      background-color: $color-residual;
    }
    &.organic {
      background-color: $color-organic;
    }
    &.paper {
      background-color: $color-paper;
    }
    &.plastic {
      background-color: $color-plastic;
      color: #222;
    }
    &.pollutants {
      background-color: $color-pollutants;
    }
  }
}

ion-list {
  .list-item {
    margin-bottom: 10px;

    .icon-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      margin-right: 24px;

      .icon {
        font-size: 22px;
      }

      &.residual {
        background-color: $color-residual;
      }
      &.organic {
        background-color: $color-organic;
      }
      &.paper {
        background-color: $color-paper;
      }
      &.plastic {
        background-color: $color-plastic;
        color: #222;
      }
      &.pollutants {
        background-color: $color-pollutants;
      }
    }

    h2 {
      font-weight: 600;
      font-size: 1rem;
    }

    p {
      color: #666;
    }
  }
}

.filter-bar {
  display: flex;
  overflow-x: auto;
  padding: 10px 16px;
  background: #fff;
  gap: 8px;
  border-top: 1px solid #eee;
  &::-webkit-scrollbar {
    display: none;
  }

  .chip {
    padding: 6px 14px;
    border-radius: 20px;
    background: #f0f0f0;
    font-size: 0.8rem;
    white-space: nowrap;
    color: #444;
    cursor: pointer;

    &.active {
      background: #222;
      color: #fff;
    }
  }
}
</style>
