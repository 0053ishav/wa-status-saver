import { ENV } from "@/config/env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { ensureMediaPermission } from "./permission";

const KEY = "RECYCLE_BIN";

export type DeletedItem = {
    id: string;
    uri: string;
    type: "image" | "video";
    deletedAt: number;
    backupUri: string;

};

export async function getDeletedItems(): Promise<DeletedItem[]> {
    const data = await AsyncStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
}

export async function addToRecycleBin(item: DeletedItem) {
    const current = await getDeletedItems();

    const exists = current.find((i) => i.id === item.id);
    if (exists) return;

    current.push(item);
    await AsyncStorage.setItem(KEY, JSON.stringify(current));
}

export async function removeFromRecycleBin(id: string) {
    const current = await getDeletedItems();
    const updated = current.filter((i) => i.id !== id);
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
}

export async function clearExpired(days = 7) {
    const current = await getDeletedItems();
    const now = Date.now();

    const valid = current.filter(
        (i) => now - i.deletedAt < days * 24 * 60 * 60 * 1000
    );

    const expired = current.filter(
        (i) => now - i.deletedAt >= days * 24 * 60 * 60 * 1000
    );

    await AsyncStorage.setItem(KEY, JSON.stringify(valid));

    // 🔥 DELETE expired for real
    for (const item of expired) {
        try {
            await MediaLibrary.deleteAssetsAsync([item.id]);
            if (item.backupUri) {
                await FileSystem.deleteAsync(item.backupUri, { idempotent: true });
            }
        } catch (e) {
            console.log("Expire delete error", e);
        }
    }
    return expired; // you’ll delete these for real
}

export async function restoreFromRecycle(item: any) {
    try {
        const hasPermission = await ensureMediaPermission();
        if (!hasPermission) return false;

        const albumName = ENV.APP_NAME;
        let album = await MediaLibrary.getAlbumAsync(albumName);

        // 🔥 Create asset from backup (always works)
        const asset = await MediaLibrary.createAssetAsync(item.backupUri);

        if (!album) {
            await MediaLibrary.createAlbumAsync(albumName, asset, false);
        } else {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }

        return true;
    } catch (e) {
        console.log("Restore error", e);
        return false;
    }
}