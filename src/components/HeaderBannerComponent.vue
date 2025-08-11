<script setup lang="ts">
type Props = {
  backgroundImageUrl: string;
};
const props = defineProps<Props>();
</script>

<template>
  <div
    class="header-banner"
    :style="{ backgroundImage: `url(${props.backgroundImageUrl})` }"
  >
    <div class="header-banner__gradient-bottom"></div>
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.header-banner {
  background-size: cover;
  background-position: center;
  height: 250px;
  position: relative;

  &__gradient-bottom {
    width: 100%;
    height: 50%;
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(0, 0, 0, 0) 100%
    );
    position: absolute;
    bottom: 0;
    z-index: 1;
  }
}
</style>
