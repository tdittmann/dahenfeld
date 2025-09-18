export interface NotificationJson {
  os: string;
  registration_id: string;
  push_gelwe_blaettle: boolean;
  push_waste_residual: boolean;
  push_waste_organic: boolean;
  push_waste_paper: boolean;
  push_waste_pollutants: boolean;
  push_events: boolean;
}

export interface Notification {
  os: string;
  registration_id: string;
  push_gelwe_blaettle: boolean;
  push_waste_residual: boolean;
  push_waste_organic: boolean;
  push_waste_paper: boolean;
  push_waste_pollutants: boolean;
  push_events: boolean;
}

export interface CreateNotification {
  os: string;
  registration_id: string;
}

const toNotification = (json: NotificationJson): Notification => {
  return {
    os: json.os,
    registration_id: json.registration_id,
    push_gelwe_blaettle: json.push_gelwe_blaettle,
    push_waste_residual: json.push_waste_residual,
    push_waste_organic: json.push_waste_organic,
    push_waste_paper: json.push_waste_paper,
    push_waste_pollutants: json.push_waste_pollutants,
    push_events: json.push_events,
  };
};

const fromNotification = (notification: Notification): NotificationJson => {
  return {
    os: notification.os,
    registration_id: notification.registration_id,
    push_gelwe_blaettle: notification.push_gelwe_blaettle,
    push_waste_residual: notification.push_waste_residual,
    push_waste_organic: notification.push_waste_organic,
    push_waste_paper: notification.push_waste_paper,
    push_waste_pollutants: notification.push_waste_pollutants,
    push_events: notification.push_events,
  };
};

const createNotificationSettings = (
  createNotificationRequest: CreateNotification,
): Promise<Response> => {
  return fetch(`${import.meta.env.VITE_BACKEND_URL}/notifications`, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization:
        "Basic " +
        btoa(
          `${import.meta.env.VITE_BACKEND_AUTH_USER}:${import.meta.env.VITE_BACKEND_AUTH_PASSWORD}`,
        ),
    }),
    body: JSON.stringify(createNotificationRequest),
  });
};

const updateNotificationSettings = (
  notification: Notification,
): Promise<Response> => {
  return fetch(`${import.meta.env.VITE_BACKEND_URL}/notifications`, {
    method: "PUT",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization:
        "Basic " +
        btoa(
          `${import.meta.env.VITE_BACKEND_AUTH_USER}:${import.meta.env.VITE_BACKEND_AUTH_PASSWORD}`,
        ),
    }),
    body: JSON.stringify(fromNotification(notification)),
  });
};

const loadNotificationSettings = (
  registrationId: string,
): Promise<Notification | undefined> => {
  return fetch(
    `${import.meta.env.VITE_BACKEND_URL}/notifications?registration_id=${registrationId}`,
    {
      headers: new Headers({
        Authorization:
          "Basic " +
          btoa(
            `${import.meta.env.VITE_BACKEND_AUTH_USER}:${import.meta.env.VITE_BACKEND_AUTH_PASSWORD}`,
          ),
      }),
    },
  )
    .then((response) => response.json())
    .then((value) => {
      if (value) {
        return toNotification(value);
      }
      return value;
    });
};

export const NotificationService = {
  createNotificationSettings,
  updateNotificationSettings,
  loadNotificationSettings,
};
