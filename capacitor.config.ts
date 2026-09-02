import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "de.timodittmann.dahenfeld",
  appName: "Dahenfeld",
  webDir: "dist",
  plugins: {
    StatusBar: {
      style: "DARK",
      backgroundColor: "#111c45",
    },
    EdgeToEdge: {
      backgroundColor: "#111c45",
    },
  },
};

export default config;
