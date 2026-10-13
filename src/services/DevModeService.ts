import { BackendClient } from "@/plugins/BackendClient.ts";

export interface DevModeJson {
  devModeEnabled: boolean;
}

const isDevModeEnabled = () => {
  return BackendClient.fetchData<DevModeJson>("/dev-mode.php").then((value) => {
    return value.devModeEnabled;
  });
};

const authenticateDevMode = (passphrase: string) => {
  return BackendClient.fetchData<DevModeJson>(
    "/dev-mode-verification.php",
    "POST",
    { password: passphrase },
  );
};

export const DevModeService = {
  isDevModeEnabled,
  authenticateDevMode,
};
