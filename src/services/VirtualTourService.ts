import { environment } from "@/environment/environment.ts";

export interface VirtualTourStationJson {
  id: number;
  position_x: number;
  position_y: number;
  title: string;
  subTitle: string;
  description: string;
  image: string;
}

export interface VirtualTourStation {
  id: number;
  positionX: number;
  positionY: number;
  title: string;
  subTitle: string;
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
    title: json.title,
    subTitle: json.subTitle,
    description: json.description,
    image: json.image,
  };
};

const loadStations = (): Promise<VirtualTourStation[]> => {
  return fetch(`${environment.backendUrl}/virtual-tour`, {
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
        return value.map(toVirtualTourStation);
      }
      return value;
    });
};

const loadStationById = (
  id: number,
): Promise<VirtualTourStation | undefined> => {
  return fetch(`${environment.backendUrl}/virtual-tour?id=${id}`, {
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
        return toVirtualTourStation(value);
      }
      return value;
    });
};

export const VirtualTourService = {
  loadStations,
  loadStationById,
};
