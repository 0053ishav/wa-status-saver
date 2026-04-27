import Purchases from "react-native-purchases";

export async function initRevenueCat() {
  try {
    await Purchases.configure({
      apiKey: "test_mdbuGTOHuXkJUQqXuULytvHkAmA",
    });

    console.log("RevenueCat initialized");
  } catch (e) {
    console.log("RC init error", e);
  }
}