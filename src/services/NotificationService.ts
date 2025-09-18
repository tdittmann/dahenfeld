import { BackendClient } from "@/plugins/BackendClient.ts";

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
  return BackendClient.fetchData(
    "/notifications",
    "POST",
    createNotificationRequest,
  );
};

const updateNotificationSettings = (
  notification: Notification,
): Promise<Response> => {
  return BackendClient.fetchData(
    "/notifications",
    "PUT",
    fromNotification(notification),
  );
};

const loadNotificationSettings = (
  registrationId: string,
): Promise<Notification | undefined> => {
  return BackendClient.fetchData<NotificationJson>(
    `/notifications?registration_id=${registrationId}`,
  ).then((value) => {
    return toNotification(value);
  });
};

export const NotificationService = {
  createNotificationSettings,
  updateNotificationSettings,
  loadNotificationSettings,
};
