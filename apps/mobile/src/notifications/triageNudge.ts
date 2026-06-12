import * as Notifications from "expo-notifications";

export const TRIAGE_NUDGE_DELAY_SECONDS = 2 * 60 * 60;

const TRIAGE_NUDGE_ID = "triage-nudge";

export async function scheduleTriageNudge(queueLength: number): Promise<void> {
  if (queueLength <= 0) return;

  await cancelTriageNudge();

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") return;
  }

  await Notifications.scheduleNotificationAsync({
    identifier: TRIAGE_NUDGE_ID,
    content: {
      title: "People waiting to review",
      body: `You have ${queueLength} encounter${queueLength === 1 ? "" : "s"} left in triage.`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: TRIAGE_NUDGE_DELAY_SECONDS,
    },
  });
}

export async function cancelTriageNudge(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(TRIAGE_NUDGE_ID);
}
