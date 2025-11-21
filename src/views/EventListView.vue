<script setup lang="ts">
import { onMounted, ref } from "vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
} from "@ionic/vue";
import LoadingComponent from "@/components/LoadingComponent.vue";
import { type Event, EventService } from "@/services/EventsService.ts";
import { locationOutline } from "ionicons/icons";
import { useNavigationStore } from "@/stores/navigation.ts";

const navigationStore = useNavigationStore();

const loading = ref<boolean>(true);
const eventsByMonth = ref<Map<string, Event[]>>(new Map());
const loadEvents = () => {
  loading.value = true;
  eventsByMonth.value.clear();

  EventService.loadEvents()
    .then((events: Event[]) => {
      for (const date of events) {
        const key = formatMonthHeading(date.startDate);
        if (eventsByMonth.value.has(key)) {
          eventsByMonth.value.get(key)?.push(date);
        } else {
          eventsByMonth.value.set(key, [date]);
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

const formatStartDateDay = (date: Date) => {
  return date.toLocaleDateString("de-DE", { day: "2-digit" });
};

const formatStartDateWeekday = (date: Date) => {
  return date.toLocaleDateString("de-DE", { weekday: "short" });
};

const formatEventTime = (event: Event) => {
  // If start time is 00:00, don't show it
  if(event.startDate.getHours() === 0 && event.startDate.getMinutes() === 0) {
    return "";
  }

  const startTime = event.startDate.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (event.endDate) {
    const endTime = event.endDate.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${startTime} - ${endTime}`;
  }
  return `${startTime}`;
};

onMounted(() => {
  loadEvents();
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

        <template v-for="[key, values] of eventsByMonth" :key="key">
          <h2>{{ key }}</h2>

          <ion-list lines="none">
            <ion-item
              v-for="value in values"
              :key="value.id"
              class="event_item"
            >
              <div class="event_start_date" slot="start">
                <div class="event_start_date__day">
                  {{ formatStartDateDay(value.startDate) }}
                </div>
                <div class="event_start_date__weekday">
                  {{ formatStartDateWeekday(value.startDate) }}
                </div>
              </div>
              <ion-label class="waste_type_label">
                {{ value.title }}
                <p v-if="value.organizer">{{ value.organizer }}</p>
                <p v-if="value.location">
                  <ion-icon :icon="locationOutline"></ion-icon>
                  {{ value.location }}
                </p>
              </ion-label>
              <ion-note slot="end" class="event_time">
                {{ formatEventTime(value) }}
              </ion-note>
            </ion-item>
          </ion-list>
        </template>
      </div>
    </IonContent>
  </IonPage>
</template>

<style scoped lang="scss">
.container {
  margin-bottom: 32px;
}

.event_item {
  margin-bottom: 8px;
}

.event_start_date {
  width: 75px;

  &__day {
    width: 50px;
    background: var(--ion-color-primary);
    text-align: center;
    color: #fff;
    font-size: 24px;
    font-weight: bolder;
  }

  &__weekday {
    width: 50px;
    background: var(--ion-color-secondary);
    text-align: center;
    color: #fff;
    font-size: 16px;
  }
}

.event_time {
  font-size: 0.9rem;
  padding-top: 2px;
}
</style>
