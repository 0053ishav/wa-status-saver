import * as MediaLibrary from "expo-media-library";

export async function requestMediaPermission() {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === "granted";
}


export async function saveToGallery(uri: string) {
  try {
    const asset = await MediaLibrary.createAssetAsync(uri);

    // Save into album
    await MediaLibrary.createAlbumAsync("StatusSaver", asset, false);

    return true;
  } catch (e) {
    console.log("Save error", e);
    return false;
  }
}