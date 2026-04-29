import MediaGrid from "@/components/MediaGrid";
import UpgradeModal from "@/components/UpgradeModal";
import { MediaItem } from "@/stores/mediaStore";
import { ensureMediaPermission } from "@/utils/permission";
import { isProUser } from "@/utils/pro";
import { purchasePro } from "@/utils/purchase";
import { getDeletedItems } from "@/utils/recycleBin";
import { shouldShowPaywall, trackAction } from "@/utils/trigger";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DownloadsScreen() {
  const [data, setData] = useState<MediaItem[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isPro, setIsPro] = useState(false);

  const loadMedia = async () => {
    const album = await MediaLibrary.getAlbumAsync("WA Status Saver");

    if (!album) {
      setData([]);
      return;
    }

    const media = await MediaLibrary.getAssetsAsync({
      album: album,
      mediaType: ["photo", "video"],
      sortBy: [[MediaLibrary.SortBy.creationTime, false]],
      first: 100,
    });

    const deleted = await getDeletedItems();
    const deletedIds = new Set(deleted.map((d) => d.id));

    const formatted = media.assets
      .filter((item) => !deletedIds.has(item.id))
      .map((item) => ({
        id: item.id,
        uri: item.uri,
        type: item.mediaType === "video" ? "video" : "image",
      })) as MediaItem[];

    setData(formatted);
  };

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        const pro = await isProUser();
        setIsPro(pro);

        const ok = await ensureMediaPermission();

        if (!ok) {
          setHasPermission(false);
          return;
        }

        setHasPermission(true);
        await loadMedia();
        trackAction(1);

        if (shouldShowPaywall()) {
          setShowUpgrade(true);
        }
      };

      init();
    }, []),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Top Location Bar */}
      <View
        style={{
          padding: 12,
          borderBottomWidth: 1,
          borderColor: "#111",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text style={{ color: "#888", fontSize: 12 }}>Saving to:</Text>
          <Text style={{ color: "#25D366", fontSize: 13 }}>
            WA Status Saver Album
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            router.push("/recycle-bin");
          }}
          style={{
            padding: 8,
            backgroundColor: "#111",
            borderRadius: 8,
          }}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
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
        <MediaGrid
          data={data}
          onDelete={() => {
            loadMedia();

            trackAction(1);

            if (shouldShowPaywall()) {
              setShowUpgrade(true);
            }
          }}
        />
      )}
      <UpgradeModal
        visible={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        onUpgrade={async () => {
          const success = await purchasePro();

          if (success) {
            setShowUpgrade(false);
          }
        }}
      />
    </SafeAreaView>
  );
}
