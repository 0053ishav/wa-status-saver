export type MediaItem = {
  uri: string;
  type: "image" | "video";
};

let currentItem: MediaItem | null = null;

export function setCurrentItem(item: MediaItem) {
  currentItem = item;
}

export function getCurrentItem(): MediaItem | null {
  return currentItem;
}