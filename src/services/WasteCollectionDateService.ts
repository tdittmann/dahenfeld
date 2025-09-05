import { environment } from "@/environment/environment.ts";

export interface WasteCollectionDateJson {
  id: number;
  type: "Restmüll" | "Bioabfall" | "Papiertonne" | "Schadstoffe";
  collection_date: string;
  start_time: string | undefined;
  end_time: string | undefined;
  location: string | undefined;
}

export interface WasteCollectionDate {
  id: number;
  type: "Restmüll" | "Bioabfall" | "Papiertonne" | "Schadstoffe";
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
  return fetch(`${environment.backendUrl}/waste-collection-dates`, {
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
        return value.map(toWasteCollectionDate);
      }
      return value;
    });
};

export const WasteCollectionDateService = {
  loadWasteCollectionDates,
};
