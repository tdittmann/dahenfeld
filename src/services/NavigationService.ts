import { useNavigationStore } from "@/stores/navigation.ts";
import { BackendClient } from "@/plugins/BackendClient.ts";

export interface NavigationJson {
  title: string;
  devMode: boolean;
  description: string;
  background_color: string;
  image: string | undefined;
  icon: string;
  path: string;
}

export interface Navigation {
  title: string;
  devMode: boolean;
  description: string;
  backgroundColor: string;
  image: string | undefined;
  icon: string;
  path: string;
}

const toNavigation = (json: NavigationJson): Navigation => {
  return {
    title: json.title,
    devMode: json.devMode,
    description: json.description,
    backgroundColor: json.background_color,
    image: json.image,
    icon: json.icon,
    path: json.path,
  };
};

const loadNavigation = (): Promise<Navigation[]> => {
  const navigationStore = useNavigationStore();

  return BackendClient.fetchData<NavigationJson[]>("/navigation.php").then(
    (value) => {
      const items = value.map(toNavigation);
      navigationStore.setNavigationItems(items);
      return items;
    },
  );
};

export const NavigationService = {
  loadNavigation,
};
