import EmptyState from "@/components/EmptyState";
import PermissionModal from "@/components/PermissionModal";
import SaveFeedbackModal from "@/components/SaveFeedbackModal";
import StatusMediaGrid from "@/components/StatusMediaGrid";
import UpgradeModal from "@/components/UpgradeModal";
import { MediaItem } from "@/stores/mediaStore";
import { tryShowInterstitial } from "@/utils/ads";
import { autoSaveStatuses } from "@/utils/autoSave";
import {
  loadSavedUri,
  readStatuses,
  requestFolderPermission,
} from "@/utils/fileSystem";
import { saveToGallery } from "@/utils/media";
import { sendStatusNotification } from "@/utils/notifications";
import { ensureMediaPermission } from "@/utils/permission";
import { isProUser } from "@/utils/pro";
import { purchasePro } from "@/utils/purchase";
import { getSettings } from "@/utils/settings";
import { shouldShowPaywall, trackAction } from "@/utils/trigger";
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

export default function ImagesScreen() {
  const { SafModule } = NativeModules;

  const [data, setData] = useState<MediaItem[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];

  const [showUpgrade, setShowUpgrade] = useState(false);
  const [saveState, setSaveState] = useState<
    "loading" | "success" | "error" | null
  >(null);

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        const saved = await loadSavedUri();

        if (!saved) {
          setShowModal(true);
          return;
        }

        const res = await readStatuses();

        const mapped: MediaItem[] = res
          .filter((i) => i.type === "image")
          .map((item) => ({
            id: item.uri,
            uri: item.uri,
            type: item.type,
          }));

        setData(mapped);

        const s = await getSettings();

        if (s.autoSave) {
          const { savedCount, newCount, limitReached } =
            await autoSaveStatuses();
          if (savedCount > 0) {
            ToastAndroid.show(
              `Auto saved ${savedCount} items`,
              ToastAndroid.SHORT,
            );
          }

          if (s.notifications && newCount > 0) {
            await sendStatusNotification(newCount);
          }

          if (limitReached && shouldShowPaywall()) {
            setShowUpgrade(true);
          }
        }
      };

      init();
    }, []),
  );

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [selected.size]);

  const handleGrant = async () => {
    const uri = await requestFolderPermission();

    if (uri) {
      setShowModal(false);

      const res = await readStatuses();

      const mapped: MediaItem[] = res
        .filter((i) => i.type === "image")
        .map((item) => ({
          id: item.uri,
          uri: item.uri,
          type: item.type,
        }));

      setData(mapped);
    }
  };

  const toggleSelect = (id: string) => {
    Haptics.selectionAsync();
    const newSet = new Set(selected);

    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }

    setSelected(newSet);
    if (newSet.size >= 2) {
      trackAction(1);
    }
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

    if (!pro && selected.size >= 2) {
      setShowUpgrade(true);
      return;
    }

    const hasPermission = await ensureMediaPermission();
    if (!hasPermission) return;

    setSaveState("loading");
    let successCount = 0;

    for (const id of selected) {
      const item = data.find((i) => i.id === id);
      if (!item) continue;

      const res = await saveToGallery(item.uri, item.type);

      if (res) successCount++;

      await new Promise((r) => setTimeout(r, 200));
    }

    setSelected(new Set());
    setSelectionMode(false);

    if (successCount > 0) {
      setSaveState("success");

      tryShowInterstitial();

      trackAction(2);

      if (shouldShowPaywall()) {
        setShowUpgrade(true);
      }
    } else {
      setSaveState("error");
    }
    setTimeout(() => setSaveState(null), 1200);
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
    if (selected.size === 0) return;

    setSaveState("loading");
    try {
      for (const id of selected) {
        const item = data.find((i) => i.id === id);
        if (!item) continue;

        let shareUri = item.uri;

        const path = await SafModule.copyToCache(item.uri, item.type);
        shareUri = "file://" + path;

        await Sharing.shareAsync(shareUri);
      }

      tryShowInterstitial();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      trackAction(2);

      if (shouldShowPaywall()) {
        setShowUpgrade(true);
      }
      setSaveState("success");
      setTimeout(() => setSaveState(null), 1200);
    } catch {
      setSaveState("error");
      setTimeout(() => setSaveState(null), 1200);
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
            {selected.size === data.length
              ? "All selected"
              : selected.size === 1
                ? "1 selected"
                : `${selected.size} / ${data.length} selected`}
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
        <EmptyState type="image" />
      ) : (
        <StatusMediaGrid
          data={data}
          selectionMode={selectionMode}
          selected={selected}
          onLongPress={handleLongPress}
          onToggle={toggleSelect}
        />
      )}

      {/* 🔥 PERMISSION MODAL */}
      <PermissionModal visible={showModal} onGrant={handleGrant} />
      <UpgradeModal
        visible={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        onUpgrade={async () => {
          const success = await purchasePro();

          if (success) {
            setShowUpgrade(false);
            ToastAndroid.show("Pro unlocked 🚀", ToastAndroid.SHORT);
          } else {
            ToastAndroid.show("Purchase failed", ToastAndroid.SHORT);
          }
        }}
      />
      <SaveFeedbackModal
        visible={saveState !== null}
        state={saveState ?? "loading"}
      />
    </SafeAreaView>
  );
}
