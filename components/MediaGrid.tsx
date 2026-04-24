import { router } from "expo-router";
import { FlatList, Image, Pressable } from "react-native";

export default function MediaGrid({ data }: any) {
  return (
    <FlatList
      data={data}
      numColumns={3}
      keyExtractor={(item) => item.uri}
      renderItem={({ item }) => (
        <Pressable
          android_ripple={{ color: "#333" }}
          onPress={() =>
            router.push({
              pathname: "/preview",
              params: {
                uri: encodeURIComponent(item.uri),
                type: item.type,
              },
            })
          }
          style={{ margin: 1 }}
        >
          <Image
            source={{ uri: item.uri }}
            style={{ width: 120, height: 120 }}
          />
        </Pressable>
      )}
    />
  );
}
