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
          {/* 🔥 TITLE */}
          <Text style={styles.title}>Go Pro 🚀</Text>

          {/* 💰 PRICE */}
          <Text style={styles.price}>₹99 • Lifetime Access</Text>

          {/* ⚡ URGENCY */}
          <Text style={styles.sub}>Limited time offer</Text>

          {/* ⭐ FEATURES */}
          <View style={styles.features}>
            <Text style={styles.feature}>🚫 No Ads – clean experience</Text>
            <Text style={styles.feature}>⚡ Unlimited downloads</Text>
            <Text style={styles.feature}>🔔 Instant status alerts</Text>
            <Text style={styles.feature}>🤖 Auto save statuses</Text>
          </View>

          {/* 🔥 CTA */}
          <Pressable style={styles.button} onPress={onUpgrade}>
            <Text style={styles.buttonText}>Unlock Pro Now</Text>
          </Pressable>

          {/* 🔄 RESTORE */}
          {onRestore && (
            <Pressable onPress={onRestore}>
              <Text style={styles.restore}>Restore Purchase</Text>
            </Pressable>
          )}

          {/* ❌ CLOSE */}
          <Pressable onPress={onClose}>
            <Text style={styles.cancel}>Maybe later</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    padding: 20,
  },

  container: {
    backgroundColor: "#111",
    borderRadius: 22,
    padding: 24,
  },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },

  price: {
    color: "#22c55e",
    fontSize: 18,
    textAlign: "center",
    marginTop: 8,
    fontWeight: "700",
  },

  sub: {
    color: "#888",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },

  features: {
    marginTop: 20,
  },

  feature: {
    color: "#ccc",
    marginBottom: 12,
    fontSize: 15,
  },

  button: {
    backgroundColor: "#22c55e",
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
    color: "#25D366",
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
});
