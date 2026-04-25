import { MediaItem, setCurrentItem } from "@/stores/mediaStore";
import { ensureMediaPermission } from "@/utils/permission";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  data: MediaItem[];
  onDelete: () => void;
};

function formatSize(bytes?: number) {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  return mb < 1 ? `${(bytes / 1024).toFixed(0)} KB` : `${mb.toFixed(1)} MB`;
}

export default function MediaGrid({ data, onDelete }: Props) {
  const handleDelete = async (id: string) => {
    try {
      const ok = await ensureMediaPermission();
      if (!ok) return;
      await MediaLibrary.deleteAssetsAsync([id]);
      onDelete();
    } catch (e) {
      console.log("Delete error", e);
    }
  };

  return (
    <FlatList
      data={data}
      numColumns={3}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 6 }}
      columnWrapperStyle={{ gap: 6 }}
      renderItem={({ item }) => (
        <View style={{ margin: 1 }}>
          <Pressable
            android_ripple={{ color: "#333" }}
            onPress={() => {
              setCurrentItem(item);
              router.push("/preview");
            }}
            style={{ margin: 1 }}
          >
            <Image
              source={{ uri: item.uri }}
              style={{ width: 120, height: 120 }}
            />
          </Pressable>
          {/* OVERLAY */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: 6,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            {/* SIZE */}
            <Text style={{ color: "#ccc", fontSize: 10 }}>
              {formatSize(item.size)}
            </Text>

            {/* ACTIONS */}
            <View style={{ flexDirection: "row", gap: 8 }}>
              {/* SHARE */}
              <TouchableOpacity onPress={() => Sharing.shareAsync(item.uri)}>
                <Ionicons name="share-social" size={14} color="#fff" />
              </TouchableOpacity>

              {/* DELETE */}
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash" size={14} color="#ff4d4d" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    />
  );
}
