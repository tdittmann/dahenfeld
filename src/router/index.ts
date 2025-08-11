import { createRouter, createWebHistory } from "@ionic/vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/virtual-tour",
      name: "virtual-tour",
      component: () => import("../views/VirtualTourView.vue"),
    },
    {
      path: "/gelwe-blaettle",
      name: "gelwe-blaettle",
      component: () => import("../views/GelweBlaettleView.vue"),
    },
    {
      path: "/vereine",
      name: "verein-list",
      component: () => import("../views/AssociationsListView.vue"),
    },
    {
      path: "/vereine/:id",
      name: "verein-detail",
      component: () => import("../views/AssociationsDetailView.vue"),
    },
  ],
});

export default router;
