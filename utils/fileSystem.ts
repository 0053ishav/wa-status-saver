import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";

export type StatusItem = {
  uri: string;
  type: "image" | "video";
};

const STORAGE_KEY = "STATUS_DIRECTORY_URI";

let directoryUri: string | null = null;

const WHATSAPP_STATUS_URI =
  "content://com.android.externalstorage.documents/tree/primary%3AAndroid%2Fmedia/document/primary%3AAndroid%2Fmedia%2Fcom.whatsapp%2FWhatsApp%2FMedia%2F.Statuses"


export async function loadSavedUri() {
  const saved = await AsyncStorage.getItem(STORAGE_KEY);
  if (saved) {
    directoryUri = saved;
    return saved;
  }
  return null;
}

// ✅ SAVE URI
export async function saveUri(uri: string) {
  directoryUri = uri;
  await AsyncStorage.setItem(STORAGE_KEY, uri);
}


export async function requestFolderPermission() {
  try {
    // Try direct open
    const result =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(
        WHATSAPP_STATUS_URI
      );

    if (result.granted) {
      await saveUri(result.directoryUri);
      return result.directoryUri;
    }

    // Fallback to manual
    const fallback =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

    if (fallback.granted) {

      await saveUri(fallback.directoryUri);
      return fallback.directoryUri;
    }
    return null;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export function getDirectoryUri() {
  return directoryUri;
}

export async function readStatuses(): Promise<StatusItem[]> {
  if (!directoryUri) return [];

  try {
    const files = await FileSystem.StorageAccessFramework.readDirectoryAsync(
      directoryUri
    );

    return files
      .filter((uri) => uri.endsWith(".jpg") || uri.endsWith(".mp4"))
      .map((uri) => ({
        uri,
        type: uri.endsWith(".mp4") ? "video" : "image",
      })) as StatusItem[];
  } catch (e) {
    console.log("SAF read error", e);
    return [];
  }
}
