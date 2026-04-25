import EmptyState from "@/components/EmptyState";
import MediaGrid from "@/components/MediaGrid";
import PermissionModal from "@/components/PermissionModal";
import {
  loadSavedUri,
  readStatuses,
  requestFolderPermission,
  StatusItem,
} from "@/utils/fileSystem";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";

export default function ImagesScreen() {
  const [data, setData] = useState<StatusItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        const saved = await loadSavedUri();

        if (!saved) {
          setShowModal(true);
          setLoading(false);
          return;
        }

        const res = await readStatuses();
        setData(res.filter((i) => i.type === "image"));
        setLoading(false);
      };

      init();
    }, []),
  );
  console.log("image data: ", data);

  const handleGrant = async () => {
    const uri = await requestFolderPermission();

    if (uri) {
      setShowModal(false);

      const res = await readStatuses();
      setData(res.filter((i) => i.type === "image"));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {data.length === 0 ? (
        <EmptyState type="image" />
      ) : (
        <MediaGrid data={data} />
      )}

      <PermissionModal visible={showModal} onGrant={handleGrant} />
    </View>
  );
}
