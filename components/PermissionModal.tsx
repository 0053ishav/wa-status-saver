import { Modal, Text, TouchableOpacity, View } from "react-native";

export default function PermissionModal({ visible, onGrant }: any) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {}} // 👈 blocks back button
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "85%",
            backgroundColor: "#2b2b2b",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            To Get All Status
          </Text>

          <Text
            style={{
              color: "#ccc",
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            Allow Access to &quot;.Statuses&quot; Folder
          </Text>

          {/* Fake preview button (like other apps) */}
          <View
            style={{
              backgroundColor: "#3a3a3a",
              padding: 12,
              borderRadius: 12,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#4da3ff",
                fontWeight: "600",
              }}
            >
              Use This Folder
            </Text>
          </View>

          {/* REAL ACTION BUTTON */}
          <TouchableOpacity
            onPress={onGrant}
            style={{
              backgroundColor: "#25d366",
              padding: 14,
              borderRadius: 30,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              Grant Permission
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              color: "#888",
              marginTop: 10,
              textAlign: "center",
              fontSize: 12,
            }}
          >
            *Required on Android 11 or Later
          </Text>
        </View>
      </View>
    </Modal>
  );
}
