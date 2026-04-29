import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import UpgradeModal from "@/components/UpgradeModal";
import { MediaItem } from "@/stores/mediaStore";
import { deleteForever } from "@/utils/media";
import { isProUser } from "@/utils/pro";
import {
  getDeletedItems,
  removeFromRecycleBin,
  restoreFromRecycle,
} from "@/utils/recycleBin";

export default function RecycleBinScreen() {
  const [data, setData] = useState<any[]>([]);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [confirmItem, setConfirmItem] = useState<any>(null);

  const load = async () => {
    const items = await getDeletedItems();
    setData(items.reverse());
  };

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        const pro = await isProUser();
        setIsPro(pro);
        load();
      };

      init();
    }, []),
  );

  // 🔥 RESTORE
  const handleRestore = async (item: MediaItem) => {
    if (!(await handleAccess())) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      ToastAndroid.show(
        "Restore this file before it's gone forever",
        ToastAndroid.SHORT,
      );
      return;
    }

    const ok = await restoreFromRecycle(item);

    if (ok) {
      await removeFromRecycleBin(item.id);
      load();
    }
  };

  // 🔥 DELETE FOREVER
  const handleDeleteForever = async (item: any) => {
    await deleteForever(item);
    await removeFromRecycleBin(item.id);
    load();
  };

  // 🔥 PRO CHECK
  const handleAccess = async () => {
    const pro = await isProUser();
    if (!pro) {
      setShowUpgrade(true);
      return false;
    }
    return true;
  };

  const renderItem = ({ item }: any) => {
    const daysLeft = getRemainingDays(item.deletedAt);

    return (
      <View style={{ flex: 1 / 3, margin: 4 }}>
        <Image
          source={{ uri: item.backupUri || item.uri }}
          style={{ height: 120, borderRadius: 8 }}
        />

        {/* 🔥 OVERLAY INFO */}
        <View
          style={{
            position: "absolute",
            top: 6,
            left: 6,
            right: 6,
          }}
        >
          <Text
            style={{
              color: "#ff4444",
              fontSize: 10,
            }}
          >
            ⏳ {daysLeft}d left
          </Text>

          <Text style={{ color: "#888", fontSize: 10 }}>
            Will be deleted permanently
          </Text>
        </View>

        {/* 🔥 ACTIONS */}
        <View
          style={{
            position: "absolute",
            bottom: 6,
            right: 6,
            flexDirection: "row",
            gap: 8,
          }}
        >
          {/* RESTORE */}
          <TouchableOpacity
            onPress={async () => {
              Haptics.selectionAsync();
              handleRestore(item);
            }}
            style={{
              backgroundColor: "#25D366",
              padding: 6,
              borderRadius: 6,
            }}
          >
            <Ionicons name="refresh" size={14} color="#000" />
          </TouchableOpacity>

          {/* DELETE */}
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setConfirmItem(item);
            }}
            style={{
              backgroundColor: "#ff4444",
              padding: 6,
              borderRadius: 6,
            }}
          >
            <Ionicons name="trash" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
        {!isPro && (
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              padding: 4,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#22c55e", fontSize: 10 }}>
              🔒 Restore with Pro
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      {/* HEADER */}
      <View
        style={{
          padding: 14,
          borderBottomWidth: 1,
          borderColor: "#111",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>Recently Deleted</Text>
        <Text style={{ color: "#666", fontSize: 12 }}>
          Items auto-delete in 7 days • Restore anytime
        </Text>
      </View>

      {/* EMPTY */}
      {data.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "#666" }}>Nothing here</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          numColumns={3}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}

      {confirmItem && (
        <Modal transparent animationType="fade">
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.8)",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <View
              style={{
                backgroundColor: "#111",
                borderRadius: 16,
                padding: 20,
              }}
            >
              {/* 🔥 TITLE */}
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
                Delete Forever?
              </Text>

              {/* ⚠️ WARNING */}
              <Text style={{ color: "#888", marginTop: 10 }}>
                This file will be permanently deleted and cannot be recovered.
              </Text>

              {/* 💡 SOFT NUDGE */}
              <Text style={{ color: "#22c55e", marginTop: 10, fontSize: 12 }}>
                You can restore it instead if needed
              </Text>

              {/* ACTIONS */}
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 20,
                  justifyContent: "space-between",
                }}
              >
                {/* CANCEL */}
                <TouchableOpacity
                  onPress={() => {
                    Haptics.selectionAsync();
                    setConfirmItem(null);
                  }}
                  style={{
                    flex: 1,
                    padding: 12,
                    marginRight: 8,
                    backgroundColor: "#222",
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#fff" }}>Cancel</Text>
                </TouchableOpacity>

                {/* DELETE */}
                <TouchableOpacity
                  onPress={async () => {
                    await Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Error,
                    );

                    await handleDeleteForever(confirmItem);
                    setConfirmItem(null);
                  }}
                  style={{
                    flex: 1,
                    padding: 12,
                    backgroundColor: "#ff4444",
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "600" }}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* UPGRADE */}
      <UpgradeModal
        visible={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        onUpgrade={() => setShowUpgrade(false)}
      />
    </SafeAreaView>
  );
}

const getRemainingDays = (deletedAt: number) => {
  const diff = Date.now() - deletedAt;
  const days = 7 - Math.floor(diff / (1000 * 60 * 60 * 24));
  return days <= 0 ? 0 : days;
};
