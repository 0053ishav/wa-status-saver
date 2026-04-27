import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

type Props = {
  visible: boolean;
  state: "loading" | "success" | "error";
};

export default function SaveFeedbackModal({ visible, state }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {state === "loading" && (
            <>
              <ActivityIndicator size="large" color="#25D366" />
              <Text style={styles.text}>Saving...</Text>
            </>
          )}

          {state === "success" && (
            <>
              <Text style={styles.icon}>✅</Text>
              <Text style={styles.text}>Saved successfully</Text>
            </>
          )}

          {state === "error" && (
            <>
              <Text style={styles.icon}>❌</Text>
              <Text style={styles.text}>Failed to save</Text>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#111",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    minWidth: 160,
  },
  text: {
    color: "#fff",
    marginTop: 12,
    fontSize: 14,
    textAlign: "center",
  },
  icon: {
    fontSize: 32,
  },
});
