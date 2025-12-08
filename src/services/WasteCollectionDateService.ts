import { BackendClient } from "@/plugins/BackendClient.ts";

export interface WasteCollectionDateJson {
  id: number;
  type:
    | "Restmüll"
    | "Bioabfall"
    | "Papiertonne"
    | "Schadstoffe"
    | "Gelbe Tonne"
    | "Gelbe Tonne (ab 01.01.2026)";
  collection_date: string;
  start_time: string | undefined;
  end_time: string | undefined;
  location: string | undefined;
}

export interface WasteCollectionDate {
  id: number;
  type:
    | "Restmüll"
    | "Bioabfall"
    | "Papiertonne"
    | "Schadstoffe"
    | "Gelbe Tonne"
    | "Gelbe Tonne (ab 01.01.2026)";
  collectionDate: Date;
  startTime: string | undefined;
  endTime: string | undefined;
  location: string | undefined;
}

const toWasteCollectionDate = (
  json: WasteCollectionDateJson,
): WasteCollectionDate => {
  return {
    id: json.id,
    type: json.type,
    collectionDate: new Date(json.collection_date),
    startTime: json.start_time,
    endTime: json.end_time,
    location: json.location,
  };
};

const loadWasteCollectionDates = (): Promise<WasteCollectionDate[]> => {
  return BackendClient.fetchData<WasteCollectionDateJson[]>(
    "/waste-collection-dates.php",
  ).then((value) => {
    return value.map(toWasteCollectionDate);
  });
};

export const WasteCollectionDateService = {
  loadWasteCollectionDates,
};
