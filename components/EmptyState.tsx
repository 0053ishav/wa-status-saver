import { THEME } from "@/config/theme";
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
          backgroundColor: THEME.COLORS.BORDER,
          padding: 20,
          borderRadius: 50,
          marginBottom: 20,
        }}
      >
        <Ionicons
          name={isImage ? "image-outline" : "videocam-outline"}
          size={40}
          color={THEME.COLORS.PRIMARY}
        />
      </View>

      {/* Title */}
      <Text
        style={{
          color: THEME.COLORS.TEXT_PRIMARY,
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
          color: THEME.COLORS.TEXT_MUTED,
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
          backgroundColor: THEME.COLORS.BORDER,
          padding: 16,
          borderRadius: 12,
          width: "100%",
        }}
      >
        <Text
          style={{
            color: THEME.COLORS.TEXT_SECONDARY,
            fontSize: 14,
            marginBottom: 6,
          }}
        >
          1. Open WhatsApp
        </Text>
        <Text
          style={{
            color: THEME.COLORS.TEXT_SECONDARY,
            fontSize: 14,
            marginBottom: 6,
          }}
        >
          2. Watch Status till end
        </Text>
        <Text style={{ color: THEME.COLORS.TEXT_SECONDARY, fontSize: 14 }}>
          3. Come back here to save
        </Text>
      </View>
    </View>
  );
}
