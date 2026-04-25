export type MediaItem = {
  id: string;
  uri: string;
  type: "image" | "video";
  size?: number;
};

let currentItem: MediaItem | null = null;

export function setCurrentItem(item: MediaItem) {
  currentItem = item;
}

export function getCurrentItem(): MediaItem | null {
  return currentItem;
}