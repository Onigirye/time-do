import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'time-do',
  webDir: 'www',
  server: {
    // androidScheme: 'https',
    url: "http://localhost:3000",
    cleartext: true,
    allowNavigation: ["*"]
  }
};

export default config;
