import SaveFeedbackModal from "@/components/SaveFeedbackModal";
import UpgradeModal from "@/components/UpgradeModal";
import { getMediaList } from "@/stores/mediaStore";
import { tryShowInterstitial } from "@/utils/ads";
import { saveToGallery } from "@/utils/media";
import { ensureMediaPermission } from "@/utils/permission";
// import { saveToGallery } from "@/utils/media";
import { purchasePro } from "@/utils/purchase";
import { resetTrigger, shouldShowPaywall, trackAction } from "@/utils/trigger";
import { getCached, setCached } from "@/utils/videoCache";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function Preview() {
  // const { SafModule } = NativeModules;
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get("window");
  const params = useLocalSearchParams();

  const flatListRef = useRef<FlatList>(null);
  const data = getMediaList();
  const initialIndex = Array.isArray(params.index)
    ? Number(params.index[0])
    : Number(params.index) || 0;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const currentItem = data[currentIndex] ?? data[0];
  const swipeCountRef = useRef(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [saveState, setSaveState] = useState<
    "loading" | "success" | "error" | null
  >(null);

  useEffect(() => {
    return () => {
      tryShowInterstitial();
    };
  }, []);

  if (!data || data.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <Text style={{ color: "#fff" }}>No media found</Text>
      </View>
    );
  }

  const handleSave = async () => {
    if (!currentItem) return;

    const hasPermission = await ensureMediaPermission();
    if (!hasPermission) {
      return false;
    }
    try {
      setSaveState("loading");

      const res = await saveToGallery(currentItem.uri, currentItem.type);

      if (res) {
        setSaveState("success");

        setTimeout(() => setSaveState(null), 1200);

        tryShowInterstitial();

        trackAction(2);

        if (shouldShowPaywall()) {
          setShowUpgrade(true);
        }
      } else {
        setSaveState("error");
        setTimeout(() => setSaveState(null), 1200);
      }
    } catch {
      setSaveState("error");
      setTimeout(() => setSaveState(null), 1200);
    }
  };

  const handleShare = async () => {
    try {
      let shareUri = currentItem.uri;

      // 🔥 If video → use cached file
      if (currentItem.type === "video") {
        const cached = getCached(currentItem.uri);

        if (cached) {
          shareUri = cached;
        } else {
          // const path = await SafModule.copyToCache(
          //   currentItem.uri,
          //   currentItem.type,
          // );
          // shareUri = "file://" + path;
        }
      } else {
        // 🔥 IMAGE → convert SAF → file
        // const path = await SafModule.copyToCache(
        //   currentItem.uri,
        //   currentItem.type,
        // );
        // shareUri = "file://" + path;
      }

      await Sharing.shareAsync(shareUri);
      tryShowInterstitial();
      trackAction();

      if (shouldShowPaywall()) {
        setShowUpgrade(true);
        resetTrigger();
      }
    } catch (e) {
      console.log("Share error", e);
      ToastAndroid.show("Sharing failed", ToastAndroid.SHORT);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      {/* 🔝 HEADER */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderColor: "#111",
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>

        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
          Preview
        </Text>

        {/* Spacer for balance */}
        <View style={{ width: 22 }} />
      </View>

      {/* MEDIA */}
      {/* {type === "image" ? (
        <Image
          key={uri}
          source={{ uri }}
          style={{ flex: 1 }}
          contentFit="contain"
          cachePolicy="none"
        />
      ) : videoUri ? (
        <VideoView
          player={player}
          style={{ flex: 1 }}
          fullscreenOptions={{ enable: true }}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "#aaa" }}>Loading video...</Text>
        </View>
      )} */}

      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        onScrollToIndexFailed={() => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: initialIndex,
              animated: false,
            });
          }, 300);
        }}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIndex);

          swipeCountRef.current++;

          if (swipeCountRef.current >= 3 && newIndex > 1) {
            swipeCountRef.current = 0;

            tryShowInterstitial();
          }

          trackAction();

          if (shouldShowPaywall()) {
            setShowUpgrade(true);
            resetTrigger();
          }
        }}
        renderItem={({ item, index }) => (
          <View style={{ width, height: "100%" }}>
            <MediaItemView item={item} isActive={index === currentIndex} />
          </View>
        )}
      />

      {/* ACTIONS */}
      <View
        style={{
          position: "absolute",
          right: 16,
          bottom: insets.bottom + 100,
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* SHARE */}
        <TouchableOpacity
          onPress={handleShare}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: "#1f1f1f",
            justifyContent: "center",
            alignItems: "center",
            elevation: 4,
          }}
        >
          <Ionicons name="share-social" size={22} color="#fff" />
        </TouchableOpacity>

        {/* SAVE */}
        <TouchableOpacity
          onPress={handleSave}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: "#25D366",
            justifyContent: "center",
            alignItems: "center",
            elevation: 6,
          }}
        >
          <Ionicons name="download" size={26} color="#000" />
        </TouchableOpacity>
      </View>
      <UpgradeModal
        visible={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        onUpgrade={async () => {
          const success = await purchasePro();

          if (success) {
            setShowUpgrade(false);
            ToastAndroid.show("Pro unlocked 🚀", ToastAndroid.SHORT);
          }
        }}
      />
      <SaveFeedbackModal
        visible={saveState !== null}
        state={saveState ?? "loading"}
      />
    </SafeAreaView>
  );
}

function MediaItemView({ item, isActive }: any) {
  // const { SafModule } = NativeModules;
  const [videoUri, setVideoUri] = useState<string | null>(null);

  useEffect(() => {
    if (item.type !== "video") return;

    const load = async () => {
      try {
        const cached = getCached(item.uri);

        if (cached) {
          setVideoUri(cached);
          return;
        }

        // 🔥 convert content:// → file://
        const fileName = item.uri.split("/").pop() || `vid_${Date.now()}.mp4`;
        const dest = FileSystem.cacheDirectory + fileName;

        await FileSystem.copyAsync({
          from: item.uri,
          to: dest,
        });

        setVideoUri(dest);
        await setCached(item.uri, dest);
      } catch (e) {
        console.log("Video load error", e);
      }
    };

    load();
  }, [item.uri]);

  const player = useVideoPlayer(videoUri ?? "");

  useEffect(() => {
    if (!player || item.type !== "video" || !videoUri) return;

    try {
      if (isActive) {
        player.loop = true;
        player.play();
      } else {
        player.pause();
      }
    } catch (e) {
      // 🔥 prevent crash
      console.log("Player error (safe ignore)", e);
    }
  }, [isActive, videoUri]);

  if (item.type === "image") {
    return (
      <Image
        source={{ uri: item.uri }}
        style={{ flex: 1 }}
        contentFit="contain"
      />
    );
  }

  if (videoUri) {
    return <VideoView player={player} style={{ flex: 1 }} />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Ionicons name="play-circle-outline" size={40} color="#555" />
      <Text style={{ color: "#666", marginTop: 8 }}>Preparing video...</Text>
    </View>
  );
}
