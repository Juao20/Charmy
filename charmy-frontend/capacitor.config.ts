import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.charmy.app',
  appName: 'Charmy',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // En prod pointe vers ton API Railway
    // En dev commente cette ligne
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#eb2f82',
      showSpinner: false,
    },
  },
};

export default config;