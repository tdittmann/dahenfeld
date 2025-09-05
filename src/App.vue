<script setup lang="ts">
import { RouterView } from "vue-router";
import { IonApp, IonPage } from "@ionic/vue";

import { NavigationService } from "@/services/NavigationService.ts";
import { onMounted } from "vue";

onMounted(() => {
  NavigationService.loadNavigation();
});
</script>

<template>
  <IonApp>
    <IonPage>
      <RouterView />
    </IonPage>
  </IonApp>
</template>
