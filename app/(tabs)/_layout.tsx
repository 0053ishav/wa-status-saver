import { ENV } from "@/config/env";
import { THEME } from "@/config/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Dimensions, View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

export default function TabsLayout() {
  const adUnitId = __DEV__ ? TestIds.BANNER : ENV.ADS.BANNER_ID;

  const { width } = Dimensions.get("window");

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#000",
            borderTopColor: "#111",
          },
          tabBarActiveTintColor: THEME.COLORS.PRIMARY,
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

      <View
        style={{
          width: width,
          alignItems: "center",
          backgroundColor: "#000",
          paddingVertical: 4,
        }}
      >
        {/* 🔥 BANNER (GLOBAL) */}
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
    </View>
  );
}
