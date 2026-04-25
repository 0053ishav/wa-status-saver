import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "VIDEO_CACHE_MAP";

let cache: Record<string, string> = {};

export async function loadCache() {
  const stored = await AsyncStorage.getItem(KEY);
  if (stored) cache = JSON.parse(stored);
}

export function getCached(uri: string) {
  return cache[uri];
}

export async function setCached(uri: string, fileUri: string) {
  cache[uri] = fileUri;
  await AsyncStorage.setItem(KEY, JSON.stringify(cache));
}