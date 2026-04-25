import * as MediaLibrary from "expo-media-library";

export async function ensureMediaPermission() {
  const { status } = await MediaLibrary.getPermissionsAsync();

  if (status === "granted") {
    return true;
  }

  const res = await MediaLibrary.requestPermissionsAsync();
  return res.status === "granted";
}