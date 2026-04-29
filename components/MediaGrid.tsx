import { MediaItem, setMediaList } from "@/stores/mediaStore";
import { deleteFromGallery } from "@/utils/media";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import {
  FlatList,
  Image,
  Pressable,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  data: MediaItem[];
  onDelete: () => void;
};

export default function MediaGrid({ data, onDelete }: Props) {
  const handleDelete = async (item: MediaItem) => {
    try {
      const res = await deleteFromGallery(item);

      if (res) {
        onDelete();
      } else {
        ToastAndroid.show("Moved to Recycle Bin (7 days)", ToastAndroid.SHORT);
      }
    } catch {}
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
              setMediaList(data);
              router.push({
                pathname: "/preview",
                params: {
                  index: data.findIndex((i) => i.id === item.id),
                },
              });
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
            {/* ACTIONS */}
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              {/* SHARE */}
              <TouchableOpacity onPress={() => Sharing.shareAsync(item.uri)}>
                <Ionicons name="share-social" size={14} color="#fff" />
              </TouchableOpacity>

              {/* DELETE */}
              <TouchableOpacity onPress={() => handleDelete(item)}>
                <Ionicons name="trash" size={14} color="#ff4d4d" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    />
  );
}
