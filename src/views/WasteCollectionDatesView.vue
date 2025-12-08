<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  type WasteCollectionDate,
  WasteCollectionDateService,
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
import { trashBin, trashSharp } from "ionicons/icons";
import LoadingComponent from "@/components/LoadingComponent.vue";
import { useNavigationStore } from "@/stores/navigation.ts";

const navigationStore = useNavigationStore();

const loading = ref<boolean>(true);
const wasteCollectionDatesByMonth = ref<Map<string, WasteCollectionDate[]>>(
  new Map(),
);
const loadWasteCollectionDates = () => {
  loading.value = true;
  wasteCollectionDatesByMonth.value.clear();

  WasteCollectionDateService.loadWasteCollectionDates()
    .then((dates: WasteCollectionDate[]) => {
      for (const date of dates) {
        const key = formatMonthHeading(date.collectionDate);
        if (wasteCollectionDatesByMonth.value.has(key)) {
          wasteCollectionDatesByMonth.value.get(key)?.push(date);
        } else {
          wasteCollectionDatesByMonth.value.set(key, [date]);
        }
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const formatMonthHeading = (date: Date) => {
  if (date.getMonth() === 0 || date.getMonth() === 11) {
    return date.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
  }
  return date.toLocaleDateString("de-DE", { month: "long" });
};

const formatCollectionDate = (date: Date) => {
  return date.toLocaleDateString("de-DE", {
    weekday: "short",
    day: "numeric",
  });
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

const getWasteIcon = (date: WasteCollectionDate) => {
  if (date.type === "Schadstoffe") {
    return trashBin;
  }
  return trashSharp;
};

const getWasteIconColor = (date: WasteCollectionDate) => {
  switch (date.type) {
    case "Restmüll":
      return "waste_type_icon_residual";
    case "Bioabfall":
      return "waste_type_icon_organic";
    case "Papiertonne":
      return "waste_type_icon_paper";
    case "Schadstoffe":
      return "waste_type_icon_pollutants";
    case "Gelbe Tonne":
    case "Gelbe Tonne (ab 01.01.2026)":
      return "waste_type_icon_plastic";
    default:
      return "";
  }
};

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
        <p
          v-if="navigationStore.currentItem?.description"
          style="margin-top: 16px; margin-bottom: 16px"
        >
          {{ navigationStore.currentItem?.description }}
        </p>

        <template
          v-for="[key, values] of wasteCollectionDatesByMonth"
          :key="key"
        >
          <h2>{{ key }}</h2>

          <ion-list>
            <ion-item v-for="value in values" :key="value.id">
              <div style="display: flex" slot="start">
                <ion-icon
                  class="waste_type_icon"
                  :class="getWasteIconColor(value)"
                  :icon="getWasteIcon(value)"
                ></ion-icon>
                <div class="waste_type_date">
                  {{ formatCollectionDate(value.collectionDate) }}
                </div>
              </div>
              <ion-label class="waste_type_label">
                {{ value.type }}
                <p v-if="value.location">
                  {{ getTimeRangeAndLocation(value) }}
                </p>
              </ion-label>
            </ion-item>
          </ion-list>
        </template>
      </div>
    </IonContent>
  </IonPage>
</template>

<style scoped lang="scss">
.waste_type_icon {
  font-size: 24px;
}

.waste_type_date {
  width: 70px;
  margin-left: 16px;
}

.waste_type_icon_residual {
  color: #627e8c;
}

.waste_type_icon_organic {
  color: #8a4522;
}

.waste_type_icon_paper {
  color: #00469a;
}

.waste_type_icon_pollutants {
  color: #f59103;
}

.waste_type_icon_plastic {
  color: #ffdc00;
}

.container {
  margin-bottom: 32px;
}
</style>
