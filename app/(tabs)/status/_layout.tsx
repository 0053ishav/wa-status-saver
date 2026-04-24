import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import ImagesScreen from "./images";
import VideosScreen from "./videos";

const Tab = createMaterialTopTabNavigator();

export default function StatusLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: "#000" },
          tabBarLabelStyle: {
            color: "#fff",
            fontWeight: "600",
          },
          tabBarIndicatorStyle: {
            backgroundColor: "#25D366",
            height: 3,
          },
        }}
      >
        <Tab.Screen
          name="images"
          component={ImagesScreen}
          options={{ title: "Images" }}
        />
        <Tab.Screen
          name="videos"
          component={VideosScreen}
          options={{ title: "Videos" }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
