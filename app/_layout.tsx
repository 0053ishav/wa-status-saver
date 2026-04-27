import { loadInterstitial } from "@/utils/ads";
import { initNotifications } from "@/utils/notifications";
import { ensureMediaPermission } from "@/utils/permission";
import { initRevenueCat } from "@/utils/revenuecat";
import { Stack } from "expo-router";
import { useEffect } from "react";
import mobileAds from "react-native-google-mobile-ads";

export default function RootLayout() {
  useEffect(() => {
    console.log("🔥 RootLayout mounted here");

    ensureMediaPermission();

    mobileAds()
      .initialize()
      .then(() => {
        console.log("🔥 AdMob initialized here");
        loadInterstitial();
      });

    initRevenueCat();
    initNotifications();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
