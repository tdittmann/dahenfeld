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
      path: "/historischer-rundgang",
      name: "historischer-rundgang",
      component: () => import("../views/VirtualTourView.vue"),
    },
    {
      path: "/google-historischer-rundgang",
      name: "google-historischer-rundgang",
      component: () => import("../views/VirtualTourGoogleMapsView.vue"),
    },
    {
      path: "/historischer-rundgang/:id",
      name: "historischer-rundgang-detail",
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
      path: "/abfalltermine",
      name: "abfalltermine",
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
