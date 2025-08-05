<script setup lang="ts">
import { IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar } from "@ionic/vue";

type Props = {
  title: string;
};
const props = defineProps<Props>();
</script>

<template>
  <IonHeader>
    <IonToolbar>
      <IonButtons slot="start">
        <IonBackButton defaultHref="/"></IonBackButton>
      </IonButtons>
      <IonTitle>{{ props.title}}</IonTitle>
    </IonToolbar>
  </IonHeader>
</template>

<style scoped lang="scss">
ion-toolbar {
  --background: #003220;
  --color: #fff;
}
</style>