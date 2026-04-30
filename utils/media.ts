// import { NativeModules } from "react-native";


// const { SafModule } = NativeModules;

// export async function saveToGallery(uri: string, type: "image" | "video") {
//   try {
//     if (!SafModule) return false;

//     const path = await SafModule.copyToCache(uri, type);

//     const res = await SafModule.saveToGalleryNative(path, type);

//     return res;
//   } catch (e) {
//     console.log("Save error", e);
//     return false;
//   }
// }

// export async function deleteFromGallery(uri: string) {
//   try {
//     if (!SafModule) return false;

//     return await SafModule.deleteFile(uri);
//   } catch (e) {
//     console.log("Delete error", e);
//     return false;
//   }
// }

import { ENV } from "@/config/env";
import { MediaItem } from "@/stores/mediaStore";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { ensureMediaPermission } from "./permission";
import { addToRecycleBin } from "./recycleBin";

export async function saveToGallery(uri: string, type: "image" | "video") {
    try {
        // 1. Ask permission
        const hasPermission = await ensureMediaPermission();
        if (!hasPermission) return false;

        // 2. Copy file to app cache (needed for content:// URIs)
        const fileName = uri.split("/").pop() || `file_${Date.now()}`;
        const destPath = FileSystem.cacheDirectory + fileName;

        await FileSystem.copyAsync({
            from: uri,
            to: destPath,
        });

  
        const albumName = ENV.APP_NAME;

        let album = await MediaLibrary.getAlbumAsync(albumName);

        if (!album) {
            // create first asset
            const asset = await MediaLibrary.createAssetAsync(destPath);

            // create album with that asset
            album = await MediaLibrary.createAlbumAsync(albumName, asset, false);

            return asset.id;
        }
        const asset = await MediaLibrary.createAssetAsync(destPath, album);
        return asset.id;

    } catch (e) {
        console.log("Save error", e);
        return false;
    }
}


export async function deleteFromGallery(item: MediaItem) {
    try {
        const album = await MediaLibrary.getAlbumAsync(ENV.APP_NAME);

        const fileName = item.uri.split("/").pop() || `backup_${Date.now()}`;
        const backupPath = FileSystem.documentDirectory + fileName;

        await FileSystem.copyAsync({
            from: item.uri,
            to: backupPath,
        });


        await addToRecycleBin({
            id: item.id,
            uri: item.uri,
            type: item.type,
            deletedAt: Date.now(),
            backupUri: backupPath,

        });

        if (album) {
            await MediaLibrary.removeAssetsFromAlbumAsync(
                [item.id],
                album
            );
        }

        return true;
    } catch (e) {
        console.log("Soft delete error", e);
        return false;
    }
}

export async function deleteForever(item: any) {
  try {
    const hasPermission = await ensureMediaPermission();
    if (!hasPermission) return false;

    // 🔥 delete from gallery
    await MediaLibrary.deleteAssetsAsync([item.id]);

    // 🔥 delete backup file
    if (item.backupUri) {
      await FileSystem.deleteAsync(item.backupUri, { idempotent: true });
    }

    return true;
  } catch (e) {
    console.log("Delete forever error", e);
    return false;
  }
}