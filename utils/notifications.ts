import * as Notifications from "expo-notifications";

export async function initNotifications() {
  await Notifications.requestPermissionsAsync();
}

export async function sendStatusNotification(count: number) {
  if (count <= 0) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "New Status Found 👀",
      body: `${count} new statuses available`,
    },
    trigger: null,
  });
}