import { getPlayableUri } from "@/utils/fileSystem";
import { saveToGallery } from "@/utils/media";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { router, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";
import { Button, Image, Text, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function Preview() {
  const params = useLocalSearchParams();

  const uri = decodeURIComponent(params.uri as string);
  const type = params.type as "image" | "video";
  console.log("decodeURIComponent ", uri, type);
  console.log(getPlayableUri, "@");
  const [localUri, setLocalUri] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const converted = await getPlayableUri(uri);
      setLocalUri(converted);
    };

    load();
  }, [uri]);

  const player = useVideoPlayer(localUri, (player) => {
    player.loop = true;
  });

  const insets = useSafeAreaInsets();

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
      {type === "video" ? (
        <VideoView
          player={player}
          style={{ flex: 1 }}
          fullscreenOptions={{
            enable: true,
          }}
          allowsPictureInPicture
        />
      ) : (
        <Image source={{ uri }} style={{ flex: 1 }} resizeMode="contain" />
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
