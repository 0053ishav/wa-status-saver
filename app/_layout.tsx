import { ensureMediaPermission } from "@/utils/permission";
import { Stack } from "expo-router";
import { useEffect } from "react";
import mobileAds from "react-native-google-mobile-ads";

export default function RootLayout() {
  useEffect(() => {
    ensureMediaPermission();
    mobileAds()
      .initialize()
      .then(() => {
        console.log("AdMob initialized");
      });
  }, []);
  return <Stack screenOptions={{ headerShown: false }} />;
}
