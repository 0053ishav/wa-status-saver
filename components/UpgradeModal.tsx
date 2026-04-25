import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
};

export default function UpgradeModal({ visible, onClose, onUpgrade }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Go Pro 🚀</Text>

          <Text style={styles.feature}>• Remove all ads</Text>
          <Text style={styles.feature}>• Save multiple statuses</Text>
          <Text style={styles.feature}>• Smooth experience</Text>

          <Pressable style={styles.button} onPress={onUpgrade}>
            <Text style={styles.buttonText}>Upgrade Now</Text>
          </Pressable>

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
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  feature: {
    color: "#ccc",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#22c55e",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
  },
  cancel: {
    color: "#888",
    textAlign: "center",
    marginTop: 12,
  },
});
