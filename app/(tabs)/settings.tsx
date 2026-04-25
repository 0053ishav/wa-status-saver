import { setProUser } from "@/utils/pro";
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
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSaveState] = useState(false);
  const APP_LINK = "https://play.google.com/store/apps/details?id=your.app.id";

  useEffect(() => {
    const load = async () => {
      const s = await getSettings();
      setNotifications(s.notifications);
      setAutoSaveState(s.autoSave);
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

  return (
    <SafeAreaView style={styles.safe}>
      {/* 🔝 HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>

        <Text style={styles.headerTitle}>Settings</Text>

        {/* Spacer for balance */}
        <View style={{ width: 22 }} />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {/* 🔓 REMOVE ADS CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Go Pro 🚀</Text>
          <Text style={styles.cardDesc}>
            Remove ads & unlock premium features
          </Text>
          <Pressable style={styles.proButton}>
            <Text style={styles.proButtonText}>Remove Ads</Text>
          </Pressable>
        </View>

        {/* 🔔 NOTIFICATIONS */}
        <Text style={styles.section}>Notifications</Text>
        <View style={styles.row}>
          <Text style={styles.label}>New Status Alerts</Text>
          <Switch
            value={notifications}
            onValueChange={(v) => {
              setNotifications(v);
              setNotification(v);
            }}
          />
        </View>

        {/* ⚙️ FEATURES */}
        <Text style={styles.section}>Features</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Auto Save Status</Text>
          <Switch
            value={autoSave}
            onValueChange={(v) => {
              setAutoSaveState(v);
              setAutoSave(v);
            }}
          />
        </View>

        {/* 📈 GROWTH */}
        <Text style={styles.section}>Support Us</Text>

        <Pressable style={styles.item} onPress={handleRate}>
          <Text style={styles.itemText}>⭐ Rate Us</Text>
        </Pressable>

        <Pressable style={styles.item} onPress={handleShare}>
          <Text style={styles.itemText}>📤 Share App</Text>
        </Pressable>

        {/* 📄 LEGAL */}
        <Text style={styles.section}>Legal</Text>

        <Pressable
          style={styles.item}
          onPress={() => openURL("https://sites.google.com/view/your-terms")}
        >
          <Text style={styles.itemText}>Terms of Use</Text>
        </Pressable>

        <Pressable
          style={styles.item}
          onPress={() => openURL("https://sites.google.com/view/your-privacy")}
        >
          <Text style={styles.itemText}>Privacy Policy</Text>
        </Pressable>
        <Pressable
          style={styles.item}
          onPress={async () => {
            await setProUser(false);
            Alert.alert("Pro Activated (Test)");
          }}
        >
          <Text style={styles.itemText}>Pro</Text>
        </Pressable>

        {/* ℹ️ INFO */}
        <Text style={styles.section}>App Info</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Version</Text>
          <Text>1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0f0f0f",
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
    borderColor: "#111",
  },

  headerTitle: {
    color: "#fff",
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
    backgroundColor: "#1a1a1a",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  label: {
    color: "#fff",
    fontSize: 16,
  },

  item: {
    backgroundColor: "#1a1a1a",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  itemText: {
    color: "#fff",
    fontSize: 16,
  },

  card: {
    backgroundColor: "#1f2937",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  cardDesc: {
    color: "#ccc",
    marginTop: 4,
    marginBottom: 12,
  },

  proButton: {
    backgroundColor: "#22c55e",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  proButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
});
