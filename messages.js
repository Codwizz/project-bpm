// All Urdu text and the daily schedule live here, so they are easy to edit.

export const DEFAULT_NAME = 'ابو جان';
export const DEFAULT_DOSE = '5';
export const DEFAULT_MED_TIME = { hour: 9, minute: 0 };

// Water reminders (24h clock)
export const WATER_SLOTS = [
  { hour: 10, minute: 30, body: 'تھوڑا سا پانی پی لیجیے۔ پانی جسم کے لیے بہت ضروری ہے۔' },
  { hour: 13, minute: 0, body: 'کھانے کے بعد ایک گلاس پانی پی لیجیے۔' },
  { hour: 15, minute: 0, body: 'پانی پینے کا وقت ہو گیا ہے۔ ایک گلاس پانی ضرور پیجیے۔' },
  { hour: 17, minute: 30, body: 'شام ہو گئی ہے، تھوڑا پانی پی لیجیے اور کچھ دیر ٹہل لیجیے۔' },
  { hour: 19, minute: 30, body: 'آج کا آخری گلاس پانی پی لیجیے۔' },
];

// Two fruit reminders per day
export const FRUIT_TIMES = [
  { hour: 11, minute: 30 },
  { hour: 16, minute: 30 },
];

// 7 fruits, rotated by weekday. (Grapefruit is left out on purpose:
// it can interact with some BP medicines.)
export const FRUITS = [
  { name: 'کیلا', why: 'اس میں پوٹاشیم ہوتا ہے جو بلڈ پریشر کو قابو میں رکھنے میں مدد دیتا ہے۔' },
  { name: 'مالٹا', why: 'اس میں وٹامن سی اور پوٹاشیم ہوتا ہے جو دل کے لیے اچھا ہے۔' },
  { name: 'تربوز', why: 'اس میں پانی اور پوٹاشیم ہوتا ہے، جسم کو ٹھنڈک اور تازگی دیتا ہے۔' },
  { name: 'سیب', why: 'اس میں ریشہ (فائبر) ہوتا ہے جو دل کی صحت کے لیے مفید ہے۔' },
  { name: 'کیوی', why: 'اس میں پوٹاشیم اور وٹامن سی ہوتا ہے جو بلڈ پریشر کے لیے اچھا ہے۔' },
  { name: 'پپیتا', why: 'اس میں پوٹاشیم اور ریشہ ہوتا ہے جو دل کے لیے فائدہ مند ہے۔' },
  { name: 'امرود', why: 'اس میں ریشہ اور پوٹاشیم ہوتا ہے جو بلڈ پریشر کو متوازن رکھنے میں مدد دیتا ہے۔' },
];

export const medicineMessage = (name, dose) => ({
  title: 'دوا کا وقت',
  body: `${name}، دوا کا وقت ہو گیا ہے۔ بلڈ پریشر کی ${dose} ملی گرام کی گولی کھا لیجیے۔ اللہ آپ کو صحت دے۔`,
});

export const waterMessage = (name, slot) => ({
  title: 'پانی کا وقفہ',
  body: `${name}، ${slot.body}`,
});

export const fruitMessage = (name, fruit) => ({
  title: 'صحت بخش پھل',
  body: `${name}، آج ${fruit.name} کھا لیجیے۔ ${fruit.why}`,
});
