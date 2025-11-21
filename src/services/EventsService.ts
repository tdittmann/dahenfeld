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
    endDate: json.end_date ? new Date(json.end_date) : undefined,
    organizer: json.organizer,
    location: json.location,
  };
};

const loadEvents = (): Promise<Event[]> => {
  return BackendClient.fetchData<EventJson[]>("/events.php").then((value) => {
    const events = value.map(toEvent);

    // Expands multi-day events into one event per calendar day.
    const expandedEvents: Event[] = [];

    for (const event of events) {
      const start = new Date(event.startDate);
      if (event.endDate) {
        // It can be a multi-day event
        const end = event.endDate
          ? new Date(event.endDate)
          : new Date(event.startDate);
        const current = new Date(start);

        while (current <= end) {
          expandedEvents.push({
            ...event,
            startDate: new Date(current),
            endDate: new Date(current),
          });

          // Move to next day
          current.setDate(current.getDate() + 1);
        }
      } else {
        expandedEvents.push(event);
      }
    }

    return expandedEvents;
  });
};

export const EventService = {
  loadEvents,
};
