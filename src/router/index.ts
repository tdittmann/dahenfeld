import { createRouter, createWebHistory } from "@ionic/vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory("/"),
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
      path: "/google-virtual-tour",
      name: "google-virtual-tour",
      component: () => import("../views/VirtualTourGoogleMapsView.vue"),
    },
    {
      path: "/virtual-tour/:id",
      name: "virtual-tour-detail",
      component: () => import("../views/VirtualTourDetailView.vue"),
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
    {
      path: "/muelltermine",
      name: "muelltermine",
      component: () => import("../views/WasteCollectionDatesView.vue"),
    },
    {
      path: "/veranstaltungen",
      name: "veranstaltungen",
      component: () => import("../views/EventListView.vue"),
    },
    {
      path: "/einstellungen",
      name: "einstellungen",
      component: () => import("../views/SettingsView.vue"),
    },
    {
      path: "/beitrag/:id",
      name: "beitrag-detail",
      component: () => import("../views/ContentView.vue"),
    },
  ],
});

export default router;
