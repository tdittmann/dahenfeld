<script setup lang="ts">
import { IonContent, IonPage, useIonRouter } from "@ionic/vue";
import { onMounted, ref } from "vue";
import LoadingComponent from "@/components/LoadingComponent.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import { useRoute } from "vue-router";
import { type Content, ContentService } from "@/services/ContentService.ts";

const route = useRoute();
const router = useIonRouter();

const loading = ref<boolean>(true);
const content = ref<Content | undefined>(undefined);
const loadContent = (id: number) => {
  loading.value = true;
  content.value = undefined;

  ContentService.loadContentById(id)
    .then((data: Content | undefined) => {
      if (data) {
        content.value = data;
      } else {
        router.push("/");
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  const parsedId = parseInt(<string>route.params.id, 10);
  if (!parsedId) {
    router.push("/");
  }
  loadContent(parsedId);
});
</script>

<template>
  <IonPage>
    <HeaderComponent class="header" :title="content?.title" />

    <IonContent>
      <LoadingComponent :loading="loading" />

      <template v-if="content">
        <div class="container">
          <div class="content-text" v-html="content.text" />
        </div>
      </template>
    </IonContent>
  </IonPage>
</template>

<style scoped lang="scss">
.content-text {
  margin-top: 8px;
  margin-bottom: 8px;
}
</style>
