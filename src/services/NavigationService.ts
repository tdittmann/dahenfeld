import { environment } from "@/environment/environment.ts";
import { useNavigationStore } from "@/stores/navigation.ts";

export interface NavigationJson {
  title: string;
  devMode: boolean;
  description: string;
  background_color: string;
  icon: string;
  path: string;
}

export interface Navigation {
  title: string;
  devMode: boolean;
  description: string;
  backgroundColor: string;
  icon: string;
  path: string;
}

const toNavigation = (json: NavigationJson): Navigation => {
  return {
    title: json.title,
    devMode: json.devMode,
    description: json.description,
    backgroundColor: json.background_color,
    icon: json.icon,
    path: json.path,
  };
};

const loadNavigation = (): Promise<Navigation[]> => {
  const navigationStore = useNavigationStore();

  return fetch(`${environment.backendUrl}/navigation`, {
    headers: new Headers({
      Authorization:
        "Basic " +
        btoa(
          `${environment.backendAuthUser}:${environment.backendAuthPassword}`,
        ),
    }),
  })
    .then((response) => response.json())
    .then((value) => {
      if (value) {
        const items = value.map(toNavigation);
        navigationStore.setNavigationItems(items);
        return items;
      }
      return value;
    });
};

export const NavigationService = {
  loadNavigation,
};
