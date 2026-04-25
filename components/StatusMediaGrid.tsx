import { MediaItem, setCurrentItem } from "@/stores/mediaStore";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

type Props = {
  data: MediaItem[];
  selectionMode: boolean;
  selected: Set<string>;
  onLongPress: (id: string) => void;
  onToggle: (id: string) => void;
};

export default function StatusMediaGrid({
  data,
  selectionMode,
  selected,
  onLongPress,
  onToggle,
}: Props) {
  return (
    <FlatList
      data={data}
      numColumns={3}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 6 }}
      columnWrapperStyle={{ gap: 6 }}
      renderItem={({ item }) => {
        const isSelected = selected.has(item.id);

        return (
          <View style={{ margin: 1 }}>
            <Pressable
              android_ripple={{ color: "#333" }}
              onPress={() => {
                if (selectionMode) {
                  onToggle(item.id);
                } else {
                  setCurrentItem(item);
                  router.push("/preview");
                }
              }}
              onLongPress={() => onLongPress(item.id)}
              style={{
                flex: 1,
                aspectRatio: 1,
                borderRadius: 12,
                overflow: "hidden",
                backgroundColor: "#111",
              }}
            >
              {/* IMAGE */}
              <Image
                source={{ uri: item.uri }}
                style={{ width: 120, height: 120 }}
              />
              {/* VIDEO INDICATOR */}
              {item.type === "video" && (
                <View
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    borderRadius: 12,
                    padding: 4,
                  }}
                >
                  <Ionicons name="play" size={12} color="#fff" />
                </View>
              )}
              {/* SELECTION OVERLAY */}
              {selectionMode && (
                <View
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: isSelected
                      ? "rgba(37,211,102,0.4)"
                      : "rgba(0,0,0,0.3)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#25D366"
                    />
                  )}
                </View>
              )}
            </Pressable>
          </View>
        );
      }}
    />
  );
}
