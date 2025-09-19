import { BackendClient } from "@/plugins/BackendClient.ts";

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
  return BackendClient.fetchData<GelweBlaettleJson[]>("/gelwe-blaettle.php").then(
    (value) => {
      return value.map(toGelweBlaettle);
    },
  );
};

export const GelweBlaettleService = {
  loadGelweBlaettle,
};
