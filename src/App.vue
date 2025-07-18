<script setup lang="ts">
import { RouterView } from "vue-router";
import {
  IonApp,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
</script>

<template>
  <IonApp>
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dahenfeld</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <RouterView />
      </IonContent>
    </IonPage>
  </IonApp>
</template>

<style scoped></style>
