<script setup lang="ts">
import { IonCard, IonCardTitle, IonIcon } from "@ionic/vue";
import { computed } from "vue";

type Props = {
  title: string;
  icon?: string;
  backgroundColor: string | undefined;
  image: string | undefined;
};
const props = defineProps<Props>();

const squareBackgroundColor = computed<string>(() => {
  if (!props.image && props.backgroundColor) {
    return `square__background-${props.backgroundColor}`;
  }
  return "";
});

const imageStyles = computed(() => {
  if(!props.image) {
    return {};
  }

  return {
   backgroundImage: `url(${props.image})`,
  };
})
</script>

<template>
  <IonCard class="square" :class="squareBackgroundColor" :style="imageStyles">
    <div class="square__shadow"></div>
    <div v-if="props.icon" class="square__icon">
      <IonIcon style="font-size: 64px" :icon="props.icon"></IonIcon>
    </div>

    <IonCardTitle v-if="props.title" class="square__title">
      {{ props.title }}
    </IonCardTitle>
  </IonCard>
</template>

<style scoped lang="scss">
.square {
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1 / 1;
  border-radius: 16px;
  cursor: pointer;
  background-size: cover;
  background-position: center;
  color: #fff;

  &__background-red-dark {
    background-color: rgba(140, 1, 1);
  }

  &__background-red-light {
    background-color: rgb(243, 74, 74);
  }

  &__background-blue-dark {
    background-color: rgb(1, 33, 140);
  }

  &__background-blue-light {
    background-color: rgb(57, 97, 223);
  }

  &__background-green-dark {
    background-color: rgb(12, 78, 30);
  }

  &__background-green-light {
    background-color: rgb(66, 145, 91);
  }

  &__background-yellow-dark {
    background-color: rgb(186, 178, 0);
  }

  &__background-yellow-light {
    background-color: rgb(250, 242, 107);
  }

  &__shadow {
    background: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.5) 0%,
        rgba(255, 255, 255, 0) 100%
    );
    width: 100%;
    height: 100%;
    position: absolute;
  }

  &__title {
    position: absolute;
    bottom: 10px;
    left: 10px;
    font-size: 1rem;
    line-height: normal;
    color: #fff;
  }

  &__icon {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
