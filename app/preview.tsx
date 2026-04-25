import { getCurrentItem } from "@/stores/mediaStore";
import { saveToGallery } from "@/utils/media";
import { ensureMediaPermission } from "@/utils/permission";
import { getCached, setCached } from "@/utils/videoCache";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useState } from "react";
import {
  NativeModules,
  Pressable,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function Preview() {
  const { SafModule } = NativeModules;
  const item = getCurrentItem();
  const insets = useSafeAreaInsets();
  const uri = item?.uri ?? "";
  const type = item?.type ?? "image";
  const [videoUri, setVideoUri] = useState<string | null>(null);

  useEffect(() => {
    if (type !== "video") return;

    const load = async () => {
      const cached = getCached(uri);

      if (cached) {
        setVideoUri(cached);
        return;
      }

      const path = await SafModule.copyToCache(uri, type);
      const fileUri = "file://" + path;

      await setCached(uri, fileUri);
      setVideoUri(fileUri);
    };

    load();
  }, [uri, type]);

  const player = useVideoPlayer(videoUri ?? "", (p) => {
    if (!p) return;

    if (type === "video") {
      p.loop = true;
      p.play();
    } else {
      p.pause();
    }
  });

  if (!item) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <Text style={{ color: "#fff" }}>No media found</Text>
      </View>
    );
  }

  const handleSave = async () => {
    const hasPermission = await ensureMediaPermission();
    if (!hasPermission) {
      console.log("Permission denied");
      return false;
    }
    const res = await saveToGallery(uri, type);
    ToastAndroid.show(res ? "Saved to gallery" : "Failed", ToastAndroid.SHORT);
  };

  const handleShare = async () => {
    try {
      let shareUri = uri;

      // 🔥 If video → use cached file
      if (type === "video") {
        if (videoUri) {
          shareUri = videoUri;
        } else {
          const path = await SafModule.copyToCache(uri, type);
          shareUri = "file://" + path;
        }
      } else {
        // 🔥 IMAGE → convert SAF → file
        const path = await SafModule.copyToCache(uri, type);
        shareUri = "file://" + path;
      }

      await Sharing.shareAsync(shareUri);
    } catch (e) {
      console.log("Share error", e);
      ToastAndroid.show("Sharing failed", ToastAndroid.SHORT);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      {/* HEADER */}
      {/* 🔝 HEADER */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderColor: "#111",
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>

        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
          Preview
        </Text>

        {/* Spacer for balance */}
        <View style={{ width: 22 }} />
      </View>
      {/* MEDIA */}
      {type === "image" ? (
        <Image
          key={uri}
          source={{ uri }}
          style={{ flex: 1 }}
          contentFit="contain"
          cachePolicy="none"
        />
      ) : videoUri ? (
        <VideoView
          player={player}
          style={{ flex: 1 }}
          fullscreenOptions={{ enable: true }}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "#aaa" }}>Loading video...</Text>
        </View>
      )}

      {/* ACTIONS */}
      <View
        style={{
          position: "absolute",
          right: 16,
          bottom: insets.bottom + 100,
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* SHARE */}
        <TouchableOpacity
          onPress={handleShare}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: "#1f1f1f",
            justifyContent: "center",
            alignItems: "center",
            elevation: 4,
          }}
        >
          <Ionicons name="share-social" size={22} color="#fff" />
        </TouchableOpacity>

        {/* SAVE */}
        <TouchableOpacity
          onPress={handleSave}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: "#25D366",
            justifyContent: "center",
            alignItems: "center",
            elevation: 6,
          }}
        >
          <Ionicons name="download" size={26} color="#000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
