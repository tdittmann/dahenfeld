<script setup lang="ts">
type Props = {
  loading: boolean;
};
const props = defineProps<Props>();
</script>

<template>
  <div v-if="props.loading" class="loading-container">
    Daten werden geladen
    <br />
    <ion-spinner name="dots"></ion-spinner>
  </div>
</template>

<style scoped lang="scss">
.loading-container {
  text-align: center;
  font-size: 1.25em;
  position: absolute;
  top: 50%;
  width: 100%;
  color: var(--ion-text-color);
}
</style>
