export type MediaItem = {
  id: string;
  uri: string;
  type: "image" | "video";
  duration?: number;
};

let currentItem: MediaItem | null = null;

export function setCurrentItem(item: MediaItem) {
  currentItem = item;
}

export function getCurrentItem(): MediaItem | null {
  return currentItem;
}

export let mediaList: MediaItem[] = [];

export function setMediaList(list: MediaItem[]) {
  mediaList = list;
}

export function getMediaList() {
  return mediaList;
}