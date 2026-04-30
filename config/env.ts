export const ENV = {
  APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || "App",

  ADS: {
    ENABLED: process.env.EXPO_PUBLIC_SHOW_ADS === "true",
    INTERSTITIAL_ID: process.env.EXPO_PUBLIC_INTERSTITIAL_ID || "",
    BANNER_ID: process.env.EXPO_PUBLIC_BANNER_ID || "",
    APP_OPEN_ID: process.env.EXPO_PUBLIC_APP_OPEN_ID || "",
    FREQUENCY: Number(process.env.EXPO_PUBLIC_INTERSTITIAL_FREQUENCY || 3),
  },

  UI: {
    PRIMARY_COLOR: process.env.EXPO_PUBLIC_PRIMARY_COLOR!,
  },

  // KEYS: {
  //   REVENUECAT: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || "",
  // },
};