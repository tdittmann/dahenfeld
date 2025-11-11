import { defineStore } from "pinia";
import { type Navigation } from "@/services/NavigationService.ts";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

export const useNavigationStore = defineStore("navigation", () => {
  const navigationItems = ref<Navigation[]>([]);

  const setNavigationItems = (newItems: Navigation[]) => {
    navigationItems.value = newItems;
  };

  const route = useRoute();
  const currentItem = computed(() => {
    return navigationItems.value.find((item) => route.path === item.path);
  });

  return {
    navigationItems,
    setNavigationItems,
    currentItem,
  };
});
