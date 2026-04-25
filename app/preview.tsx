import { getCurrentItem } from "@/stores/mediaStore";
import { saveToGallery } from "@/utils/media";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import { useVideoPlayer, VideoView } from "expo-video";
import { Button, Text, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function Preview() {
  const item = getCurrentItem();
  const insets = useSafeAreaInsets();
  const uri = item?.uri ?? "";
  const type = item?.type ?? "image";

  const player = useVideoPlayer(uri, (p) => {
    if (!p) return;

    if (type === "video") {
      // p.loop = true;
    } else {
      p.pause();
    }
  });

  if (!item) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <Text style={{ color: "#fff" }}>No media found</Text>
      </View>
    );
  }

  const handleSave = async () => {
    const { status } = await MediaLibrary.getPermissionsAsync();

    let finalStatus = status;

    if (status !== "granted") {
      const req = await MediaLibrary.requestPermissionsAsync();
      finalStatus = req.status;
    }

    if (finalStatus !== "granted") {
      alert("Permission required");
      return;
    }

    const res = await saveToGallery(uri);
    alert(res ? "Saved to gallery" : "Failed");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 18,
          borderBottomWidth: 1,
          borderColor: "#111",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            marginLeft: 10,
            fontWeight: "600",
          }}
        >
          Preview
        </Text>
      </View>

      {/* MEDIA */}
      {type === "image" ? (
        <Image
          key={uri}
          source={{ uri }}
          style={{ flex: 1 }}
          contentFit="contain"
          cachePolicy="none"
        />
      ) : (
        <VideoView player={player} style={{ flex: 1 }} allowsFullscreen />
      )}

      {/* ACTIONS */}
      <View
        style={{
          padding: 12,
          paddingBottom: insets.bottom + 10,
          gap: 8,
        }}
      >
        <Button title="Save" onPress={handleSave} />
        <Button title="Share" onPress={() => Sharing.shareAsync(uri)} />
      </View>
    </SafeAreaView>
  );
}
