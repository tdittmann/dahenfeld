import { BackendClient } from "@/plugins/BackendClient.ts";

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
  return BackendClient.fetchData<EventJson[]>("/events.php").then((value) => {
    return value.map(toEvent);
  });
};

export const EventService = {
  loadEvents,
};
