import Purchases from "react-native-purchases";

export async function isProUser() {
  try {
    const info = await Purchases.getCustomerInfo();

    return !!info.entitlements.active["pro"];
  } catch (e) {
    console.log("Pro check error", e);
    return false;
  }
}