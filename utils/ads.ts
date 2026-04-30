import { ENV } from "@/config/env";
import {
    AdEventType,
    InterstitialAd,
    TestIds,
} from "react-native-google-mobile-ads";
import { isProUser } from "./pro";

const adUnitId = __DEV__
    ? TestIds.INTERSTITIAL
    : ENV.ADS.INTERSTITIAL_ID;

let interstitial: InterstitialAd | null = null;
let isLoaded = false;
let unsubscribeLoaded: any;
let unsubscribeClosed: any;
let unsubscribeError: any;

export function loadInterstitial() {
    // cleanup old listeners
    unsubscribeLoaded?.();
    unsubscribeClosed?.();
    unsubscribeError?.();

    interstitial = InterstitialAd.createForAdRequest(adUnitId);

    unsubscribeLoaded = interstitial.addAdEventListener(
        AdEventType.LOADED,
        () => {
            console.log("✅ Interstitial Loaded");

            isLoaded = true;
        }
    );

    unsubscribeClosed = interstitial.addAdEventListener(
        AdEventType.CLOSED,
        (error) => {
            console.log("❌ Interstitial Error", error);

            isLoaded = false;
            loadInterstitial(); // preload next
        }
    );

    unsubscribeError = interstitial.addAdEventListener(
        AdEventType.ERROR,
        () => {
            isLoaded = false;
            setTimeout(loadInterstitial, 2000); // retry after 2s
        }
    );

    interstitial.load();
}

export function showInterstitial() {
    console.log("Trying to show ad", isLoaded);

    if (isLoaded && interstitial) {
        interstitial.show();
    } else {
        console.log("❌ Ad not ready");

    }
}

let actionCount = 0;

export async function tryShowInterstitial() {
    const pro = await isProUser();
    if (pro) return;
    actionCount++;

    if (actionCount >= ENV.ADS.FREQUENCY) {
        actionCount = 0;
        showInterstitial();
    }
}