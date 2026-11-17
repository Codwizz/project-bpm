import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import {
  WATER_SLOTS,
  FRUIT_TIMES,
  FRUITS,
  medicineMessage,
  waterMessage,
  fruitMessage,
} from './messages';

const CHANNEL = 'bp-reminders';
const T = Notifications.SchedulableTriggerInputTypes;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function setupNotifications() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'دوا اور صحت کی یاددہانی',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 400, 200, 400],
      sound: 'default',
    });
  }
  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;
  if (existing !== 'granted') {
    ({ status } = await Notifications.requestPermissionsAsync());
  }
  return status === 'granted';
}

const daily = (content, hour, minute) =>
  Notifications.scheduleNotificationAsync({
    content: { ...content, sound: 'default' },
    trigger: { type: T.DAILY, hour, minute, channelId: CHANNEL },
  });

const weekly = (content, weekday, hour, minute) =>
  Notifications.scheduleNotificationAsync({
    content: { ...content, sound: 'default' },
    trigger: { type: T.WEEKLY, weekday, hour, minute, channelId: CHANNEL },
  });

// Clears everything and re-creates the full schedule.
export async function scheduleAll({ name, dose, hour, minute }) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  // 1) Medicine, every day
  await daily(medicineMessage(name, dose), hour, minute);

  // 2) Water breaks, every day
  for (const slot of WATER_SLOTS) {
    await daily(waterMessage(name, slot), slot.hour, slot.minute);
  }

  // 3) Fruits: a different fruit each weekday (weekday 1 = Sunday)
  for (let weekday = 1; weekday <= 7; weekday++) {
    FRUIT_TIMES.forEach((t, i) => {
      const fruit = FRUITS[(weekday - 1 + i * 3) % FRUITS.length];
      weekly(fruitMessage(name, fruit), weekday, t.hour, t.minute);
    });
  }
}

// Fires a medicine notification in 3 seconds so you can check it works.
export async function sendTest({ name, dose }) {
  await Notifications.scheduleNotificationAsync({
    content: { ...medicineMessage(name, dose), sound: 'default' },
    trigger: { type: T.TIME_INTERVAL, seconds: 3, channelId: CHANNEL },
  });
}
