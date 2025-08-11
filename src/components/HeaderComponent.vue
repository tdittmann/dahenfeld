<script setup lang="ts">
import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { computed } from "vue";

type Props = {
  hidden?: boolean;
  title?: string;
  hideBackButton?: boolean;
  transparentBackground?: boolean;
};
const props = defineProps<Props>();

const toolbarBackgroundColor = computed<string>(() => {
  if (props.hidden || props.transparentBackground) {
    return "none";
  }
  return "var(--ion-color-primary)";
});
</script>

<template>
  <IonHeader
    :class="{ 'header-no-shadow': props.hidden || props.transparentBackground }"
  >
    <IonToolbar>
      <IonButtons slot="start" v-if="!props.hideBackButton">
        <IonBackButton defaultHref="/"></IonBackButton>
      </IonButtons>

      <IonTitle v-if="props.title && !props.hidden" class="toolbar-title">
        {{ props.title }}
      </IonTitle>
    </IonToolbar>
  </IonHeader>
</template>

<style scoped lang="scss">
ion-toolbar {
  --background: v-bind("toolbarBackgroundColor");
  --color: #fff;
}

.header-no-shadow {
  box-shadow: none;
}

.header-no-shadow,
.toolbar-title,
ion-toolbar::part(background) {
  transition: background-color 1s ease;
}
</style>
