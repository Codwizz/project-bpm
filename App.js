import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setupNotifications, scheduleAll, sendTest } from './notifications';
import {
  DEFAULT_NAME,
  DEFAULT_DOSE,
  DEFAULT_MED_TIME,
  WATER_SLOTS,
  FRUIT_TIMES,
} from './messages';

const KEY = 'bpm-settings-v1';

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

const fmt = (h, m) => {
  const period = h < 12 ? 'صبح' : h < 16 ? 'دوپہر' : h < 19 ? 'شام' : 'رات';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${period} ${h12}:${String(m).padStart(2, '0')}`;
};

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState(DEFAULT_NAME);
  const [dose, setDose] = useState(DEFAULT_DOSE);
  const [hour, setHour] = useState(DEFAULT_MED_TIME.hour);
  const [minute, setMinute] = useState(DEFAULT_MED_TIME.minute);
  const [takenDate, setTakenDate] = useState('');

  const persist = (patch = {}) => {
    const data = { name, dose, hour, minute, takenDate, ...patch };
    return AsyncStorage.setItem(KEY, JSON.stringify(data));
  };

  useEffect(() => {
    (async () => {
      let s = { name, dose, hour, minute };
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          s = { ...s, ...saved };
          setName(s.name);
          setDose(s.dose);
          setHour(s.hour);
          setMinute(s.minute);
          setTakenDate(saved.takenDate || '');
        }
      } catch (e) {}
      const ok = await setupNotifications();
      if (ok) await scheduleAll(s);
      else
        Alert.alert(
          'اجازت درکار ہے',
          'یاددہانی کے لیے براہِ کرم سیٹنگز میں جا کر نوٹیفکیشن کی اجازت دیں۔'
        );
      setLoaded(true);
    })();
  }, []);

  const save = async () => {
    const ok = await setupNotifications();
    if (!ok) {
      Alert.alert('اجازت درکار ہے', 'نوٹیفکیشن کی اجازت نہیں ملی۔');
      return;
    }
    await persist();
    await scheduleAll({ name, dose, hour, minute });
    Alert.alert('محفوظ ہو گیا', 'یاددہانیاں اپ ڈیٹ کر دی گئی ہیں۔');
  };

  const markTaken = async () => {
    const t = todayStr();
    setTakenDate(t);
    await persist({ takenDate: t });
  };

  const stepHour = (d) => setHour((h) => (h + d + 24) % 24);
  const stepMinute = (d) => setMinute((m) => (m + d + 60) % 60);
  const takenToday = takenDate === todayStr();

  if (!loaded) {
    return (
      <View style={[s.root, { justifyContent: 'center' }]}>
        <Text style={s.center}>...</Text>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0f766e" />
      <View style={s.header}>
        <Text style={s.headerText}>بلڈ پریشر ساتھی</Text>
      </View>

      <ScrollView contentContainerStyle={s.body}>
        {/* Medicine card */}
        <View style={s.card}>
          <Text style={s.cardTitle}>روزانہ دوا</Text>
          <Text style={s.big}>{fmt(hour, minute)}</Text>
          <Text style={s.sub}>بلڈ پریشر کی {dose} ملی گرام کی گولی</Text>

          <View style={s.row}>
            <Stepper label="گھنٹہ" onUp={() => stepHour(1)} onDown={() => stepHour(-1)} />
            <Stepper label="منٹ" onUp={() => stepMinute(5)} onDown={() => stepMinute(-5)} />
          </View>

          <TouchableOpacity
            style={[s.btn, takenToday && s.btnDone]}
            onPress={markTaken}
            disabled={takenToday}
          >
            <Text style={s.btnText}>
              {takenToday ? 'آج کی دوا کھا لی گئی ✓' : 'میں نے دوا کھا لی'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <View style={s.card}>
          <Text style={s.cardTitle}>ترتیبات</Text>
          <Text style={s.label}>نام (نوٹیفکیشن میں اسی نام سے پکارا جائے گا)</Text>
          <TextInput style={s.input} value={name} onChangeText={setName} />
          <Text style={s.label}>گولی کی مقدار (ملی گرام)</Text>
          <TextInput
            style={s.input}
            value={dose}
            onChangeText={setDose}
            keyboardType="numeric"
          />
          <TouchableOpacity style={s.btn} onPress={save}>
            <Text style={s.btnText}>محفوظ کریں</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.btn, s.btnLight]}
            onPress={() => {
              sendTest({ name, dose });
              Alert.alert('ٹھیک ہے', '3 سیکنڈ میں ایک تجرباتی نوٹیفکیشن آئے گا۔');
            }}
          >
            <Text style={[s.btnText, { color: '#0f766e' }]}>نوٹیفکیشن کا تجربہ کریں</Text>
          </TouchableOpacity>
        </View>

        {/* Schedule */}
        <View style={s.card}>
          <Text style={s.cardTitle}>روزانہ کا شیڈول</Text>
          <Line icon="💊" text={`دوا: ${fmt(hour, minute)}`} />
          {WATER_SLOTS.map((w, i) => (
            <Line key={i} icon="💧" text={`پانی: ${fmt(w.hour, w.minute)}`} />
          ))}
          {FRUIT_TIMES.map((f, i) => (
            <Line key={i} icon="🍌" text={`پھل: ${fmt(f.hour, f.minute)}`} />
          ))}
        </View>

        <Text style={s.note}>
          یہ ایپ ڈاکٹر کے مشورے کا متبادل نہیں ہے۔ پانی یا پھلوں کی مقدار کے بارے میں اپنے
          ڈاکٹر سے ضرور پوچھ لیں۔
        </Text>
      </ScrollView>
    </View>
  );
}

const Stepper = ({ label, onUp, onDown }) => (
  <View style={s.stepper}>
    <Text style={s.label}>{label}</Text>
    <View style={s.row}>
      <TouchableOpacity style={s.stepBtn} onPress={onDown}>
        <Text style={s.stepText}>−</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.stepBtn} onPress={onUp}>
        <Text style={s.stepText}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const Line = ({ icon, text }) => (
  <View style={s.line}>
    <Text style={s.lineIcon}>{icon}</Text>
    <Text style={s.lineText}>{text}</Text>
  </View>
);

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f0fdfa' },
  header: {
    backgroundColor: '#0f766e',
    paddingTop: (StatusBar.currentHeight || 24) + 12,
    paddingBottom: 16,
    alignItems: 'center',
  },
  headerText: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  body: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#134e4a',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 8,
  },
  big: { fontSize: 40, fontWeight: 'bold', color: '#0f766e', textAlign: 'center' },
  sub: { fontSize: 18, color: '#475569', textAlign: 'center', marginBottom: 12, writingDirection: 'rtl' },
  label: { fontSize: 16, color: '#475569', textAlign: 'right', writingDirection: 'rtl', marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 10,
    fontSize: 20,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 4,
  },
  row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  stepper: { alignItems: 'center', marginHorizontal: 20 },
  stepBtn: {
    backgroundColor: '#ccfbf1',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
  },
  stepText: { fontSize: 30, color: '#0f766e', fontWeight: 'bold' },
  btn: {
    backgroundColor: '#0f766e',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 14,
    alignItems: 'center',
  },
  btnDone: { backgroundColor: '#16a34a' },
  btnLight: { backgroundColor: '#ccfbf1' },
  btnText: { color: '#fff', fontSize: 20, fontWeight: 'bold', writingDirection: 'rtl' },
  line: { flexDirection: 'row-reverse', alignItems: 'center', paddingVertical: 6 },
  lineIcon: { fontSize: 22, marginLeft: 10 },
  lineText: { fontSize: 18, color: '#334155', writingDirection: 'rtl' },
  note: { fontSize: 14, color: '#64748b', textAlign: 'center', writingDirection: 'rtl', marginTop: 4 },
  center: { textAlign: 'center', fontSize: 24 },
});
