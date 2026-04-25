import * as MediaLibrary from "expo-media-library";
import { NativeModules } from "react-native";
import { ensureMediaPermission } from "./permission";


const { SafModule } = NativeModules;

export async function saveToGallery(uri: string, type: "image" | "video") {
  try {
    if (!SafModule) {
      console.log("SafModule not available");
      return false;
    }
    const hasPermission = await ensureMediaPermission();
    if (!hasPermission) {
      console.log("Permission denied");
      return false;
    }    
    
    // ✅ Convert SAF → file
    const path = await SafModule.copyToCache(uri, type);
    const fileUri = "file://" + path;

    // ✅ Create asset from FILE (not SAF)
    const asset = await MediaLibrary.createAssetAsync(fileUri);

    // ✅ Ensure album exists
    let album = await MediaLibrary.getAlbumAsync("StatusSaver");

    if (!album) {
      album = await MediaLibrary.createAlbumAsync(
        "StatusSaver",
        asset,
        false
      );
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    }

    return true;
  } catch (e) {
    console.log("Save error", e);
    return false;
  }
}