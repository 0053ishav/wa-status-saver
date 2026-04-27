import { readStatuses } from "@/utils/fileSystem";
import { saveToGallery } from "@/utils/media";
import { isProUser } from "./pro";

let savedCache = new Set<string>();
let notifiedSet = new Set<string>();

export async function autoSaveStatuses() {
  const pro = await isProUser();

  try {
    const statuses = await readStatuses();

    let savedCount = 0;
    let newCount = 0;
    let limitReached = false;

    for (const item of statuses) {
      if (!notifiedSet.has(item.uri)) {
        newCount++;
        notifiedSet.add(item.uri);
      }

      if (savedCache.has(item.uri)) continue;

      if (!pro && savedCount >= 5) {
        limitReached = true;
        break;
      }

      const res = await saveToGallery(item.uri, item.type);

      if (res) {
        savedCache.add(item.uri);
        savedCount++;
      }
    }

    return {
      savedCount,
      newCount,
      limitReached,
    };
  } catch {
    return {
      savedCount: 0,
      newCount: 0,
      limitReached: false,
    };
  }
}