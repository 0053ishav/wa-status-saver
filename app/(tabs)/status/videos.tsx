import EmptyState from "@/components/EmptyState";
import StatusMediaGrid from "@/components/StatusMediaGrid";
import UpgradeModal from "@/components/UpgradeModal";
import { getCurrentItem, MediaItem } from "@/stores/mediaStore";
import { loadSavedUri, readStatuses } from "@/utils/fileSystem";
import { saveToGallery } from "@/utils/media";
import { ensureMediaPermission } from "@/utils/permission";
import { isProUser, setProUser } from "@/utils/pro";
import { getCached, setCached } from "@/utils/videoCache";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useFocusEffect } from "expo-router";
import * as Sharing from "expo-sharing";
import { useCallback, useEffect, useState } from "react";
import {
  Animated,
  NativeModules,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VideosScreen() {
  const { SafModule } = NativeModules;

  const [data, setData] = useState<MediaItem[]>([]);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];
  const item = getCurrentItem();
  const uri = item?.uri ?? "";

  const type = item?.type ?? "image";
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

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
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const saved = await loadSavedUri();
        if (!saved) return;

        const res = await readStatuses();

        const mapped: MediaItem[] = res
          .filter((i) => i.type === "video") // ✅ FIXED
          .map((item) => ({
            id: item.uri,
            uri: item.uri,
            type: item.type,
          }));

        setData(mapped);
      };

      load();
    }, []),
  );

  const toggleSelect = (id: string) => {
    Haptics.selectionAsync();

    const newSet = new Set(selected);

    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }

    setSelected(newSet);
  };

  const handleLongPress = (id: string) => {
    if (!selectionMode) {
      setSelectionMode(true);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    toggleSelect(id);
  };

  useEffect(() => {
    if (selected.size === 0) {
      setSelectionMode(false);
    }
  }, [selected]);

  const handleBulkSave = async () => {
    const pro = await isProUser();

    if (!pro && selected.size > 1) {
      setShowUpgrade(true);

      return;
    }

    const hasPermission = await ensureMediaPermission();
    if (!hasPermission) return;

    for (const id of selected) {
      const item = data.find((i) => i.id === id);
      if (item) {
        const res = await saveToGallery(item.uri, item.type);
        ToastAndroid.show(
          res ? "Saved to gallery" : "Failed",
          ToastAndroid.SHORT,
        );
      }
    }

    setSelected(new Set());
    setSelectionMode(false);
  };

  const handleSelectAll = () => {
    if (selected.size === data.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(data.map((item) => item.id)));
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleShareSelected = async () => {
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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      console.log("Share error", e);
      ToastAndroid.show("Sharing failed", ToastAndroid.SHORT);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      {/* 🔥 TOP ACTION BAR */}
      {selectionMode && (
        <View
          style={{
            padding: 12,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#111",
            borderBottomWidth: 1,
            borderColor: "#222",
          }}
        >
          {/* 🔥 Animated Counter */}
          <Animated.Text
            style={{
              color: "#fff",
              fontWeight: "600",
              transform: [{ scale: scaleAnim }],
            }}
          >
            {selected.size} selected
          </Animated.Text>

          <View style={{ flexDirection: "row", gap: 20 }}>
            {/* SELECT ALL */}
            <TouchableOpacity onPress={handleSelectAll}>
              <Ionicons name="checkbox-outline" size={20} color="#fff" />
            </TouchableOpacity>

            {/* SHARE */}
            <TouchableOpacity onPress={handleShareSelected}>
              <Ionicons name="share-social" size={20} color="#fff" />
            </TouchableOpacity>

            {/* SAVE */}
            <TouchableOpacity onPress={handleBulkSave}>
              <Ionicons name="download" size={20} color="#25D366" />
            </TouchableOpacity>

            {/* CANCEL */}
            <TouchableOpacity
              onPress={() => {
                setSelected(new Set());
                setSelectionMode(false);
              }}
            >
              <Ionicons name="close" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 🔥 GRID / EMPTY */}
      {data.length === 0 ? (
        <EmptyState type="video" />
      ) : (
        <StatusMediaGrid
          data={data}
          selectionMode={selectionMode}
          selected={selected}
          onLongPress={handleLongPress}
          onToggle={toggleSelect}
        />
      )}
      <UpgradeModal
        visible={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        onUpgrade={async () => {
          await setProUser(true); // temp unlock
          setShowUpgrade(false);
        }}
      />
    </SafeAreaView>
  );
}
