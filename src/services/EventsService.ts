import { environment } from "@/environment/environment.ts";

export interface EventJson {
  id: number;
  title: string;
  description: string | undefined;
  start_date: string;
  end_date: string | undefined;
  organizer: string | undefined;
  location: string | undefined;
}

export interface Event {
  id: number;
  title: string;
  description: string | undefined;
  startDate: Date;
  endDate: Date | undefined;
  organizer: string | undefined;
  location: string | undefined;
}

const toEvent = (json: EventJson): Event => {
  return {
    id: json.id,
    title: json.title,
    description: json.description,
    startDate: new Date(json.start_date),
    endDate: json.end_date === undefined ? undefined : new Date(json.end_date),
    organizer: json.organizer,
    location: json.location,
  };
};

const loadEvents = (): Promise<Event[]> => {
  return fetch(`${environment.backendUrl}/events`, {
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
        return value.map(toEvent);
      }
      return value;
    });
};

export const EventService = {
  loadEvents,
};
