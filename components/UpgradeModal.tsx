import { THEME } from "@/config/theme";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  onRestore?: () => void;
};

export default function UpgradeModal({
  visible,
  onClose,
  onUpgrade,
  onRestore,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* 🔥 BADGE */}
          <Text style={styles.badge}>🔥 LIMITED OFFER</Text>

          {/* 🔥 TITLE */}
          <Text style={styles.title}>Unlock Pro</Text>

          {/* 💰 PRICE */}
          <Text style={styles.price}>₹99 • Lifetime</Text>

          {/* ⚡ VALUE */}
          <Text style={styles.sub}>One-time payment. No subscriptions.</Text>

          {/* ⭐ FEATURES */}
          <View style={styles.features}>
            <Feature text="🚫 No Ads – clean experience" />
            <Feature text="⚡ Unlimited downloads" />
            <Feature text="🔔 Instant status alerts" />
            <Feature text="🤖 Auto save statuses" />
            <Feature text="🗑️ Recycle Bin (restore deleted)" />
          </View>

          {/* 🔥 CTA */}
          <Pressable style={styles.button} onPress={onUpgrade}>
            <Text style={styles.buttonText}>Unlock All Features</Text>
          </Pressable>

          {/* 🔒 TRUST */}
          <Text style={styles.trust}>🔒 Safe & secure payment</Text>

          {/* 🔄 RESTORE */}
          {onRestore && (
            <Pressable onPress={onRestore}>
              <Text style={styles.restore}>Restore Purchase</Text>
            </Pressable>
          )}

          {/* ❌ CLOSE */}
          <Pressable onPress={onClose}>
            <Text style={styles.cancel}>Not now</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function Feature({ text }: { text: string }) {
  return <Text style={styles.feature}>{text}</Text>;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    padding: 20,
  },

  container: {
    backgroundColor: THEME.COLORS.BORDER,
    borderRadius: 22,
    padding: 24,
  },

  title: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },

  price: {
    color: THEME.COLORS.SUCCESS,
    fontSize: 18,
    textAlign: "center",
    marginTop: 8,
    fontWeight: "700",
  },

  sub: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },

  features: {
    marginTop: 20,
  },

  feature: {
    color: THEME.COLORS.TEXT_SECONDARY,
    marginBottom: 12,
    fontSize: 15,
  },

  button: {
    backgroundColor: THEME.COLORS.SUCCESS,
    padding: 16,
    borderRadius: 14,
    marginTop: 24,
    alignItems: "center",
  },

  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },

  restore: {
    color: THEME.COLORS.SUCCESS,
    textAlign: "center",
    marginTop: 16,
    fontSize: 13,
  },

  cancel: {
    color: "#777",
    textAlign: "center",
    marginTop: 12,
    fontSize: 13,
  },

  badge: {
    alignSelf: "center",
    backgroundColor: THEME.COLORS.SUCCESS,
    color: "#000",
    fontSize: 10,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },

  trust: {
    color: "#666",
    textAlign: "center",
    fontSize: 11,
    marginTop: 10,
  },
});
