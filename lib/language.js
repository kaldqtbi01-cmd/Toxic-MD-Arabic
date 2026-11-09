import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LANG_FILE = path.join(__dirname, '..', 'database', 'language.json');
const DEFAULT_LANG = 'ar';
const SUPPORTED_LANGS = { ar: 'العربية' };
let _currentLang = DEFAULT_LANG;
try {
  if (fs.existsSync(LANG_FILE)) _currentLang = 'ar';
} catch { _currentLang = DEFAULT_LANG; }
function _save() {
  try { fs.mkdirSync(path.dirname(LANG_FILE), { recursive: true }); fs.writeFileSync(LANG_FILE, JSON.stringify({ lang: 'ar' }, null, 2)); } catch {}
}
export function setLanguage(lang) { if (String(lang).toLowerCase() !== 'ar') return false; _currentLang = 'ar'; _save(); return true; }
export function getLanguage() { return _currentLang; }
export function getSupportedLanguages() { return { ...SUPPORTED_LANGS }; }
const TRANSLATIONS = {
  ar: {
    greetings: { morning: 'صباح الخير', afternoon: 'مساء الخير', evening: 'مساء الخير', night: 'تصبح على خير' },
    errors: { ownerOnly: 'هذا الأمر مخصص للمالك فقط.', adminOnly: 'يلزم امتلاك صلاحيات المشرف.', botAdmin: 'أحتاج إلى صلاحيات المشرف لتنفيذ هذا الأمر.', groupOnly: 'هذا الأمر يعمل داخل المجموعات فقط.', failed: 'حدث خطأ غير متوقع.' },
    common: { enabled: 'مفعّل', disabled: 'معطّل', success: 'تم بنجاح', failed: 'فشل التنفيذ', loading: 'جارٍ التحميل...', wait: 'يرجى الانتظار...' },
    welcome: { welcome: 'مرحبًا بك', goodbye: 'إلى اللقاء' }
  }
};
export function t(key, section = 'common') { return TRANSLATIONS.ar?.[section]?.[key] || key; }
export function getGreeting() { const h = new Date().getHours(); if (h >= 5 && h < 12) return 'صباح الخير'; if (h < 17) return 'مساء الخير'; if (h < 21) return 'مساء الخير'; return 'تصبح على خير'; }
