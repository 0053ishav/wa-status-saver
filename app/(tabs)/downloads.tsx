import MediaGrid from "@/components/MediaGrid";
import { MediaItem } from "@/stores/mediaStore";
import { ensureMediaPermission } from "@/utils/permission";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DownloadsScreen() {
  const [data, setData] = useState<MediaItem[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const loadMedia = async () => {
    const albums = await MediaLibrary.getAlbumsAsync();
    const album = albums.find((a) => a.title === "StatusSaver");

    if (!album) return;

    const media = await MediaLibrary.getAssetsAsync({
      album: album.id,
      mediaType: ["photo", "video"],
      first: 100,
    });

    const formatted = media.assets.map((item) => ({
      id: item.id,
      uri: item.uri,
      type: item.mediaType === "video" ? "video" : "image",
      size: item.duration || 0,
    })) as MediaItem[];

    setData(formatted);
  };

  useEffect(() => {
    const init = async () => {
      const ok = await ensureMediaPermission();

      if (!ok) {
        setHasPermission(false);
        return;
      }

      setHasPermission(true);
      await loadMedia();
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
        <MediaGrid data={data} onDelete={loadMedia} />
      )}
    </SafeAreaView>
  );
}
