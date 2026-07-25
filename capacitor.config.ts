import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "de.timodittmann.dahenfeld",
  appName: "Dahenfeld",
  webDir: "dist",
  plugins: {
    StatusBar: {
      style: "DARK",
      backgroundColor: "#003220",
    },
    EdgeToEdge: {
      backgroundColor: "#003220",
    },
  },
};

export default config;
