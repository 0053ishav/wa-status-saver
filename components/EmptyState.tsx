import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function EmptyState({ type }: { type: "image" | "video" }) {
  const isImage = type === "image";

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
        backgroundColor: "#000",
      }}
    >
      {/* Icon */}
      <View
        style={{
          backgroundColor: "#111",
          padding: 20,
          borderRadius: 50,
          marginBottom: 20,
        }}
      >
        <Ionicons
          name={isImage ? "image-outline" : "videocam-outline"}
          size={40}
          color="#25D366"
        />
      </View>

      {/* Title */}
      <Text
        style={{
          color: "#fff",
          fontSize: 18,
          fontWeight: "600",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        No {isImage ? "Images" : "Videos"} Found
      </Text>

      {/* Subtitle */}
      <Text
        style={{
          color: "#888",
          textAlign: "center",
          fontSize: 14,
          marginBottom: 20,
        }}
      >
        Watch a WhatsApp status first
      </Text>

      {/* Steps */}
      <View
        style={{
          backgroundColor: "#111",
          padding: 16,
          borderRadius: 12,
          width: "100%",
        }}
      >
        <Text style={{ color: "#ccc", fontSize: 14, marginBottom: 6 }}>
          1. Open WhatsApp
        </Text>
        <Text style={{ color: "#ccc", fontSize: 14, marginBottom: 6 }}>
          2. Watch Status till end
        </Text>
        <Text style={{ color: "#ccc", fontSize: 14 }}>
          3. Come back here to save
        </Text>
      </View>
    </View>
  );
}
