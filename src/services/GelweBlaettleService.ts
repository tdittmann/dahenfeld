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
  return fetch(`${import.meta.env.VITE_BACKEND_URL}/gelwe-blaettle`, {
    headers: new Headers({
      Authorization:
        "Basic " +
        btoa(
          `${import.meta.env.VITE_BACKEND_AUTH_USER}:${import.meta.env.VITE_BACKEND_AUTH_PASSWORD}`,
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
