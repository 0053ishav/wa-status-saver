import { THEME } from "@/config/theme";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  state: "loading" | "success" | "error";
};

export default function SaveFeedbackModal({ visible, state }: Props) {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scale.setValue(0.8);
      opacity.setValue(0);
    }
  }, [visible]);

  const getContent = () => {
    switch (state) {
      case "loading":
        return (
          <>
            <ActivityIndicator size="large" color={THEME.COLORS.PRIMARY} />
            <Text style={styles.text}>Saving...</Text>
          </>
        );
      case "success":
        return (
          <>
            <Text style={[styles.icon, { color: "#22c55e" }]}>✔</Text>
            <Text style={styles.text}>Saved</Text>
          </>
        );
      case "error":
        return (
          <>
            <Text style={[styles.icon, { color: "#ef4444" }]}>✕</Text>
            <Text style={styles.text}>Failed</Text>
          </>
        );
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          {getContent()}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#121212",
    paddingVertical: 26,
    paddingHorizontal: 28,
    borderRadius: 20,
    alignItems: "center",
    minWidth: 170,
    elevation: 8,
  },
  text: {
    color: THEME.COLORS.TEXT_PRIMARY,
    marginTop: 12,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  icon: {
    fontSize: 34,
    fontWeight: "bold",
  },
});
