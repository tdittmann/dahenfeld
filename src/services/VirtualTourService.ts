export interface VirtualTourStationJson {
  id: number;
  position_x: number;
  position_y: number;
  latitude: string;
  longitude: string;
  title: string;
  subTitle: string;
  category: string;
  description: string;
  image: string;
}

export interface VirtualTourStation {
  id: number;
  positionX: number;
  positionY: number;
  latitude: number;
  longitude: number;
  title: string;
  subTitle: string;
  category: string;
  description: string;
  image: string;
}

const toVirtualTourStation = (
  json: VirtualTourStationJson,
): VirtualTourStation => {
  return {
    id: json.id,
    positionX: json.position_x,
    positionY: json.position_y,
    latitude: Number(json.latitude),
    longitude: Number(json.longitude),
    title: json.title,
    subTitle: json.subTitle,
    category: json.category,
    description: json.description,
    image: json.image,
  };
};

const loadStations = (): Promise<VirtualTourStation[]> => {
  return fetch(`${import.meta.env.VITE_BACKEND_URL}/virtual-tour`, {
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
        return value.map(toVirtualTourStation);
      }
      return value;
    });
};

const loadStationById = (
  id: number,
): Promise<VirtualTourStation | undefined> => {
  return fetch(`${import.meta.env.VITE_BACKEND_URL}/virtual-tour?id=${id}`, {
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
        return toVirtualTourStation(value);
      }
      return value;
    });
};

export const VirtualTourService = {
  loadStations,
  loadStationById,
};
