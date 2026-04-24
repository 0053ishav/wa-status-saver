import MediaGrid from "@/components/MediaGrid";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Item = {
  uri: string;
  type: "image" | "video";
};

export default function DownloadsScreen() {
  const [data, setData] = useState<Item[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const init = async () => {
      // ✅ Check permission
      const { status } = await MediaLibrary.getPermissionsAsync();

      let finalStatus = status;

      if (status !== "granted") {
        const req = await MediaLibrary.requestPermissionsAsync();
        finalStatus = req.status;
      }

      if (finalStatus !== "granted") {
        setHasPermission(false);
        return;
      }

      setHasPermission(true);

      // ✅ Load saved media
      const albums = await MediaLibrary.getAlbumsAsync();
      const album = albums.find((a) => a.title === "StatusSaver");

      if (!album) return;

      const media = await MediaLibrary.getAssetsAsync({
        album: album.id,
        mediaType: ["photo", "video"],
        first: 100,
      });

      const formatted = media.assets.map((item) => ({
        uri: item.uri,
        type: item.mediaType === "video" ? "video" : "image",
      })) as Item[];

      setData(formatted);
    };

    init();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Top Location Bar */}
      <View
        style={{
          padding: 12,
          borderBottomWidth: 1,
          borderColor: "#111",
        }}
      >
        <Text style={{ color: "#888", fontSize: 12 }}>Saving to:</Text>
        <Text style={{ color: "#25D366", fontSize: 13 }}>
          Pictures/StatusSaver
        </Text>
      </View>

      {/* Permission denied */}
      {hasPermission === false ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "#aaa" }}>
            Permission required to show downloads
          </Text>
        </View>
      ) : data.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "#666" }}>No downloads yet</Text>
        </View>
      ) : (
        <MediaGrid data={data} />
      )}
    </SafeAreaView>
  );
}
