import { BackendClient } from "@/plugins/BackendClient.ts";

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
  audio: string | undefined;
  author: string;
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
  audio: string | undefined;
  author: string;
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
    audio: json.audio,
    author: json.author,
  };
};

const loadStations = (): Promise<VirtualTourStation[]> => {
  return BackendClient.fetchData<VirtualTourStationJson[]>(
    "/virtual-tour.php",
  ).then((value) => {
    return value.map(toVirtualTourStation);
  });
};

const loadStationById = (
  id: number,
): Promise<VirtualTourStation | undefined> => {
  return BackendClient.fetchData<VirtualTourStationJson>(
    `/virtual-tour.php?id=${id}`,
  ).then((value) => {
    return toVirtualTourStation(value);
  });
};

export const VirtualTourService = {
  loadStations,
  loadStationById,
};
