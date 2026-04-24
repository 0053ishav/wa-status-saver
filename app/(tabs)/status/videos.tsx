import EmptyState from "@/components/EmptyState";
import MediaGrid from "@/components/MediaGrid";
import { loadSavedUri, readStatuses, StatusItem } from "@/utils/fileSystem";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";

export default function VideosScreen() {
  const [data, setData] = useState<StatusItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const saved = await loadSavedUri();
        if (!saved) return;

        const res = await readStatuses();
        setData(res.filter((i) => i.type === "video"));
      };

      load();
    }, []),
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {data.length === 0 ? (
        <EmptyState type="video" />
      ) : (
        <MediaGrid data={data} />
      )}
    </View>
  );
}
