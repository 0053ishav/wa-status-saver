import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

export default function TabsLayout() {
  const adUnitId = __DEV__
    ? TestIds.BANNER
    : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy";

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#000",
            borderTopColor: "#111",
          },
          tabBarActiveTintColor: "#25D366",
          tabBarInactiveTintColor: "#888",
        }}
      >
        <Tabs.Screen
          name="status"
          options={{
            title: "Status",
            tabBarIcon: ({ color }) => (
              <Ionicons name="images-outline" size={22} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="downloads"
          options={{
            title: "Downloads",
            tabBarIcon: ({ color }) => (
              <Ionicons name="download-outline" size={22} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      {/* 🔥 BANNER (GLOBAL) */}
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </>
  );
}
