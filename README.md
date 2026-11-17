# BP Saathi (بلڈ پریشر ساتھی)

A small Android app that reminds a blood-pressure patient, **in Urdu**, to:

- 💊 take the daily 5 mg BP tablet at **9:00 AM** (time and dose are editable in the app)
- 💧 drink water (5 reminders through the day)
- 🍌 eat a BP-friendly fruit (2 per day, a different fruit each weekday: banana, malta, watermelon, apple, kiwi, papaya, guava)

Reminders are **local notifications**: no internet, no server, no account. They keep firing every day after being set once.

## Set up

You need Node.js installed on a computer.

```bash
npx create-expo-app@latest bpm-reminder --template blank
cd bpm-reminder
npx expo install expo-notifications @react-native-async-storage/async-storage
```

Replace the generated `App.js` with the one from this project and copy `messages.js` and `notifications.js` next to it.

Open `app.json` and add the plugin:

```json
{
  "expo": {
    "plugins": ["expo-notifications"],
    "android": { "package": "com.yourname.bpsaathi" }
  }
}
```

## Put it on papa's phone

Build an installable APK (free Expo account needed):

```bash
npm install -g eas-cli
eas login
eas build:configure
```

In the generated `eas.json`, make the `preview` profile produce an APK:

```json
"preview": { "distribution": "internal", "android": { "buildType": "apk" } }
```

Then:

```bash
eas build -p android --profile preview
```

Download the `.apk` from the link, send it to papa's phone (WhatsApp/Drive), and install it.

## First-run checklist on papa's phone

1. Open the app and **allow notifications**.
2. Tap **"نوٹیفکیشن کا تجربہ کریں"**: a test notification should appear in 3 seconds.
3. Turn **battery optimization OFF** for the app (Settings > Apps > BP Saathi > Battery > Unrestricted). On Xiaomi, Oppo, Vivo, Realme, Infinix and Tecno phones also enable **Autostart**. Without this, the phone may delay or skip reminders.

## Customising

All Urdu text, reminder times and the fruit list are in `messages.js`. After editing, open the app and tap **"محفوظ کریں"** to reschedule.

## Medical notes

- This app does not replace a doctor's advice.
- Grapefruit is intentionally not in the list because it can interact with some BP medicines.
- If he has kidney problems, is on a fluid limit, or takes certain BP medicines (ACE inhibitors / ARBs), ask the doctor about water and high-potassium fruits like banana before relying on these reminders.
