<script setup lang="ts">
import { RouterView } from "vue-router";
import { IonApp, IonPage } from "@ionic/vue";
</script>

<template>
  <IonApp>
    <IonPage>
      <RouterView />
    </IonPage>
  </IonApp>
</template>
