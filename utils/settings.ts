// utils/settings.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  NOTIFICATIONS: "SETTINGS_NOTIFICATIONS",
  AUTO_SAVE: "SETTINGS_AUTOSAVE",
};

export async function getSettings() {
  const notifications = await AsyncStorage.getItem(KEYS.NOTIFICATIONS);
  const autoSave = await AsyncStorage.getItem(KEYS.AUTO_SAVE);

  return {
    notifications: notifications !== "false", // default true
    autoSave: autoSave === "true",
  };
}

export async function setNotification(value: boolean) {
  await AsyncStorage.setItem(KEYS.NOTIFICATIONS, String(value));
}

export async function setAutoSave(value: boolean) {
  await AsyncStorage.setItem(KEYS.AUTO_SAVE, String(value));
}