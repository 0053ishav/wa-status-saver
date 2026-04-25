import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ImagesScreen from "./images";
import VideosScreen from "./videos";

const Tab = createMaterialTopTabNavigator();

export default function StatusLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ flex: 1, backgroundColor: "#000", paddingTop: insets.top + 10 }}
    >
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "#000",
          },
          tabBarLabelStyle: {
            fontWeight: "600",
            textTransform: "none",
          },
          tabBarIndicatorStyle: {
            backgroundColor: "#25D366",
            height: 3,
          },
          tabBarActiveTintColor: "#25D366",
          tabBarInactiveTintColor: "#888",
          tabBarShowIcon: true,
          tabBarItemStyle: {
            flexDirection: "row",
          },
        }}
      >
        <Tab.Screen
          name="images"
          component={ImagesScreen}
          options={{
            title: "Images",
            tabBarIcon: ({ color }) => (
              <Ionicons name="image-outline" size={18} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="videos"
          component={VideosScreen}
          options={{
            title: "Videos",
            tabBarIcon: ({ color }) => (
              <Ionicons name="videocam-outline" size={18} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}
