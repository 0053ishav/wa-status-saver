import { NativeModules } from "react-native";


const { SafModule } = NativeModules;

export async function saveToGallery(uri: string, type: "image" | "video") {
  try {
    if (!SafModule) return false;

    const path = await SafModule.copyToCache(uri, type);

    const res = await SafModule.saveToGalleryNative(path, type);

    return res;
  } catch (e) {
    console.log("Save error", e);
    return false;
  }
}

export async function deleteFromGallery(uri: string) {
  try {
    if (!SafModule) return false;

    return await SafModule.deleteFile(uri);
  } catch (e) {
    console.log("Delete error", e);
    return false;
  }
}