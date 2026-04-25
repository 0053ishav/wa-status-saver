import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "IS_PRO_USER";

export async function isProUser() {
  return (await AsyncStorage.getItem(KEY)) === "true";
}

export async function setProUser(value: boolean) {
  await AsyncStorage.setItem(KEY, value ? "true" : "false");
}