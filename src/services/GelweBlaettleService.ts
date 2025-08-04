import { environment } from "@/environment/environment.ts";

export interface GelweBlaettleJson {
  name: string;
  publish_date: string;
  link: string;
}

export interface GelweBlaettle {
  name: string;
  publish_date: Date;
  link: string;
}

const toGelweBlaettle = (json: GelweBlaettleJson): GelweBlaettle => {
  return {
    name: json.name,
    publish_date: new Date(json.publish_date),
    link: json.link,
  };
};

const loadGelweBlaettle = (): Promise<GelweBlaettle[]> => {
  return fetch(`${environment.backendUrl}/gelwe-blaettle`, {
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
        return value.map(toGelweBlaettle);
      }
      return value;
    });
};

export const GelweBlaettleService = {
  loadGelweBlaettle,
};
