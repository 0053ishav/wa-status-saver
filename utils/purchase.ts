import Purchases from "react-native-purchases";

export async function purchasePro() {
  try {
    const offerings = await Purchases.getOfferings();

    const offering = offerings.current;
    if (!offering) throw new Error("No offering");

    const pkg = offering.availablePackages.find(
      (p) => p.identifier === "$rc_lifetime"
    );

    if (!pkg) throw new Error("Package not found");

    const { customerInfo } = await Purchases.purchasePackage(pkg);

    const isPro = !!customerInfo.entitlements.active["pro"];

    return isPro;
  } catch (e: any) {
    if (!e.userCancelled) {
      console.log("Purchase error", e);
    }
    return false;
  }
}

export async function restorePurchases() {
  try {
    const info = await Purchases.restorePurchases();
    return !!info.entitlements.active["pro"];
  } catch (e) {
    console.log("Restore error", e);
    return false;
  }
}
