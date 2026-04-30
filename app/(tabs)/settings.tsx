import UpgradeModal from "@/components/UpgradeModal";
import { THEME } from "@/config/theme";
import { isProUser } from "@/utils/pro";
import { purchasePro, restorePurchases } from "@/utils/purchase";
import { getSettings, setAutoSave, setNotification } from "@/utils/settings";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(false);
  const [autoSave, setAutoSaveState] = useState(false);
  const APP_LINK = "https://play.google.com/store/apps/details?id=your.app.id";
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isPro, setIsPro] = useState(false);

  const tips = [
    "Tip: Long press to select multiple items",
    "Tip: Auto-save saves time daily",
    "Tip: Share directly without downloading",
  ];

  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const i = Math.floor(Math.random() * tips.length);
    setTipIndex(i);
  }, []);

  useEffect(() => {
    const load = async () => {
      const s = await getSettings();
      setNotifications(s.notifications);
      setAutoSaveState(s.autoSave);

      const pro = await isProUser();
      setIsPro(pro);
    };

    load();
  }, []);

  const handleRate = () => {
    Linking.openURL(APP_LINK);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this awesome Status Saver app 🚀\n${APP_LINK}`,
      });
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  const openURL = (url: string) => {
    Linking.openURL(url);
  };

  const handleUpgrade = async () => {
    const success = await purchasePro();

    if (success) {
      setIsPro(true);
      setShowUpgrade(false);
      ToastAndroid.show("Pro unlocked 🚀", ToastAndroid.SHORT);
    } else {
      ToastAndroid.show("Purchase cancelled or failed", ToastAndroid.SHORT);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* 🔝 HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={22}
            color={THEME.COLORS.TEXT_PRIMARY}
          />
        </Pressable>

        <Text style={styles.headerTitle}>Settings</Text>

        {/* Spacer for balance */}
        <View style={{ width: 22 }} />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {/* 🔓 REMOVE ADS CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions ⚡</Text>

          <Text style={styles.cardDesc}>Speed up your workflow</Text>

          {/* 🔥 ACTION BUTTONS */}
          <View style={{ flexDirection: "row", marginTop: 16, gap: 10 }}>
            {/* OPEN DOWNLOADS */}
            <Pressable
              style={styles.quickBtn}
              onPress={() => router.push("/downloads")}
            >
              <Ionicons
                name="download-outline"
                size={18}
                color={THEME.COLORS.TEXT_PRIMARY}
              />
              <Text style={styles.quickText}>Downloads</Text>
            </Pressable>

            {/* RECYCLE BIN */}
            <Pressable
              style={styles.quickBtn}
              onPress={() => router.push("/recycle-bin")}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color={THEME.COLORS.TEXT_PRIMARY}
              />
              <Text style={styles.quickText}>Recycle</Text>
            </Pressable>
          </View>

          {/* 🔥 PRO HOOK (dynamic, not fake) */}
          {!isPro && (
            <Pressable
              onPress={() => setShowUpgrade(true)}
              style={{
                marginVertical: 18,
                padding: 12,
                borderRadius: 10,
                backgroundColor: THEME.COLORS.BORDER,
                borderWidth: 1,
                borderColor: THEME.COLORS.SUCCESS,
              }}
            >
              <Text style={{ color: THEME.COLORS.SUCCESS, fontSize: 13 }}>
                🔒 Unlock Auto Save & Alerts
              </Text>
              <Text
                style={{
                  color: THEME.COLORS.TEXT_MUTED,
                  fontSize: 11,
                  marginTop: 4,
                }}
              >
                Save time automatically
              </Text>
            </Pressable>
          )}

          {/* CTA */}
          <Pressable
            style={[styles.proButton, isPro && { backgroundColor: "#444" }]}
            disabled={isPro}
            onPress={() => {
              if (!isPro) setShowUpgrade(true);
            }}
          >
            <Text style={styles.proButtonText}>
              {isPro ? "Pro Activated ✅" : "Upgrade to Pro"}
            </Text>
          </Pressable>
          <Text
            style={{
              color: THEME.COLORS.TEXT_MUTED,
              marginTop: 12,
              fontSize: 12,
            }}
          >
            💡 {tips[tipIndex]}
          </Text>
        </View>

        {/* 🔔 NOTIFICATIONS */}
        <Text style={styles.section}>Notifications</Text>
        <Pressable
          style={styles.row}
          onPress={() => {
            if (!isPro) {
              setShowUpgrade(true);
              return;
            }
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.label}>New Status Alerts</Text>
            {!isPro && <ProBadge />}
          </View>
          <Switch
            value={notifications}
            disabled={!isPro}
            onValueChange={(v) => {
              setNotifications(v);
              setNotification(v);
            }}
          />
        </Pressable>

        {/* ⚙️ FEATURES */}
        <Text style={styles.section}>Features</Text>
        <Pressable
          style={styles.row}
          onPress={() => {
            if (!isPro) {
              setShowUpgrade(true);
              return;
            }
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.label}>Auto Save Status</Text>
            {!isPro && <ProBadge />}
          </View>

          <Switch
            value={autoSave}
            disabled={!isPro}
            thumbColor={!isPro ? "#555" : undefined}
            trackColor={{
              false: "#333",
              true: isPro ? THEME.COLORS.PRIMARY : "#333", // 🔥 key
            }}
            onValueChange={(v) => {
              setAutoSaveState(v);
              setAutoSave(v);
            }}
          />
        </Pressable>
        <View style={styles.row}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.label}>Recycle Bin</Text>
            {!isPro && <ProBadge />}
          </View>

          <TouchableOpacity
            onPress={() => {
              router.push("/recycle-bin");
            }}
            style={{
              padding: 8,
              backgroundColor: THEME.COLORS.BORDER,
              borderRadius: 8,
            }}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color={THEME.COLORS.TEXT_PRIMARY}
            />
          </TouchableOpacity>
        </View>
        {/* 📈 GROWTH */}
        <Text style={styles.section}>Support Us</Text>

        <Pressable style={styles.item} onPress={handleRate}>
          <Text style={styles.itemText}>⭐ Rate Us</Text>
        </Pressable>

        <Pressable style={styles.item} onPress={handleShare}>
          <Text style={styles.itemText}>📤 Share App</Text>
        </Pressable>

        <Pressable
          style={styles.item}
          onPress={() => {
            if (!isPro) setShowUpgrade(true);
          }}
        >
          <Text style={styles.itemText}>🔄 Restore Purchase</Text>
        </Pressable>

        {/* 📄 LEGAL */}
        <Text style={styles.section}>Legal</Text>

        <Pressable
          style={styles.item}
          onPress={() =>
            openURL(
              "https://sites.google.com/view/wa-status-saver-2026/terms-of-use",
            )
          }
        >
          <Text style={styles.itemText}>Terms of Use</Text>
        </Pressable>

        <Pressable
          style={styles.item}
          onPress={() =>
            openURL(
              "https://sites.google.com/view/wa-status-saver-2026/privacy-policy",
            )
          }
        >
          <Text style={styles.itemText}>Privacy Policy</Text>
        </Pressable>

        {/* ℹ️ INFO */}
        <Text style={styles.section}>App Info</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Version</Text>
          <Text>1.0.0</Text>
        </View>
      </ScrollView>
      <UpgradeModal
        visible={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        onUpgrade={handleUpgrade}
        onRestore={async () => {
          const restored = await restorePurchases();

          if (restored) {
            setIsPro(true);
            setShowUpgrade(false);
            ToastAndroid.show("Pro restored ✅", ToastAndroid.SHORT);
          } else {
            ToastAndroid.show("No purchases found", ToastAndroid.SHORT);
          }
        }}
      />
    </SafeAreaView>
  );
}

const ProBadge = () => (
  <View
    style={{
      backgroundColor: THEME.COLORS.SUCCESS,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      marginLeft: 8,
    }}
  >
    <Text style={{ fontSize: 10, color: "#000", fontWeight: "bold" }}>PRO</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: THEME.COLORS.BACKGROUND,
  },

  container: {
    padding: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: THEME.COLORS.BORDER,
  },

  headerTitle: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: "600",
  },

  section: {
    color: "#888",
    marginTop: 24,
    marginBottom: 8,
    fontSize: 14,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: THEME.COLORS.SURFACE,
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  label: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: 16,
  },

  item: {
    backgroundColor: THEME.COLORS.SURFACE,
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  itemText: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: 16,
  },

  card: {
    backgroundColor: THEME.COLORS.CARD,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },

  cardTitle: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: 18,
    fontWeight: "bold",
  },

  cardDesc: {
    color: THEME.COLORS.TEXT_SECONDARY,
    marginTop: 4,
    marginBottom: 12,
  },

  quickBtn: {
    flex: 1,
    backgroundColor: THEME.COLORS.SURFACE,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  quickText: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: 12,
    marginTop: 6,
  },

  features: {
    marginTop: 20,
  },

  feature: {
    color: THEME.COLORS.TEXT_SECONDARY,
    marginBottom: 12,
    fontSize: 15,
  },

  proButton: {
    backgroundColor: THEME.COLORS.SUCCESS,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  proButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
});
