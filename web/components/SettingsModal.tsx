'use client';

import React, { useState } from 'react';
import {
  X,
  Settings,
  Globe,
  Moon,
  Sun,
  Bell,
  Shield,
  Smartphone,
  Database,
  Trash2,
  RefreshCw,
  Check,
  Sparkles,
  Lock,
  EyeOff,
  Volume2,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { lang, setLang, isRtl } = useLanguage();

  // Settings State
  const [themeMode, setThemeMode] = useState<'neon' | 'oled' | 'slate'>('neon');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Notifications
  const [notifyWorkouts, setNotifyWorkouts] = useState(true);
  const [notifyInBody, setNotifyInBody] = useState(true);
  const [notifyStore, setNotifyStore] = useState(true);
  const [notifyCoach, setNotifyCoach] = useState(true);
  const [notifySounds, setNotifySounds] = useState(true);

  // Security & Privacy
  const [biometricAuth, setBiometricAuth] = useState(true);
  const [privacyMasking, setPrivacyMasking] = useState(false);

  // Sync & Cache
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);
  const [cacheSize, setCacheSize] = useState('42.8 ميجابايت');

  // Active section tab inside settings
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'privacy' | 'data'>('general');

  if (!isOpen) return null;

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 1200);
  };

  const handleClearCache = () => {
    setCacheCleared(true);
    setCacheSize('0.0 ميجابايت');
    setTimeout(() => setCacheCleared(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-[#121212] border border-[#282828] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scaleIn">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-[#222222] bg-[#161616]/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00FF66]/15 border border-[#00FF66]/40 flex items-center justify-center text-[#00FF66] shadow-[0_0_15px_rgba(0,255,102,0.2)]">
              <Settings size={20} className="animate-[spin_10s_linear_infinite]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>إعدادات وتفضيلات التطبيق</span>
                <span className="text-[10px] bg-[#00FF66]/15 text-[#00FF66] border border-[#00FF66]/30 px-2 py-0.5 rounded-full font-mono">
                  PRO
                </span>
              </h2>
              <p className="text-xs text-[#888888]">تخصيص اللغة، المظهر، الإشعارات، والأمان</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1A1A1A] border border-[#282828] text-[#888888] hover:text-white hover:border-[#00FF66] transition-all cursor-pointer"
            aria-label="إغلاق الإعدادات"
          >
            <X size={18} />
          </button>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="px-5 pt-3 border-b border-[#222222] bg-[#141414] flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'general'
                ? 'border-[#00FF66] text-[#00FF66]'
                : 'border-transparent text-[#888888] hover:text-white'
            }`}
          >
            <Globe size={15} />
            <span>اللغة والمظهر</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'notifications'
                ? 'border-[#00FF66] text-[#00FF66]'
                : 'border-transparent text-[#888888] hover:text-white'
            }`}
          >
            <Bell size={15} />
            <span>الإشعارات والتنبيهات</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-[#00FF66] text-[#00FF66]'
                : 'border-transparent text-[#888888] hover:text-white'
            }`}
          >
            <Shield size={15} />
            <span>الأمان والخصوصية</span>
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'data'
                ? 'border-[#00FF66] text-[#00FF66]'
                : 'border-transparent text-[#888888] hover:text-white'
            }`}
          >
            <Database size={15} />
            <span>المزامنة والذاكرة</span>
          </button>
        </div>

        {/* Modal Body / Tab Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-[#0F0F0F]">
          
          {/* ─── TAB 1: GENERAL & THEME (اللغة والمظهر) ─────────── */}
          {activeTab === 'general' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Language Selection Section */}
              <div className="p-4.5 rounded-2xl bg-[#161616] border border-[#262626] space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Globe size={18} className="text-[#00FF66]" />
                    <h3 className="text-sm font-bold text-white">لغة واجهة التطبيق</h3>
                  </div>
                  <span className="text-[11px] text-[#888888] font-mono">Language / RTL</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => setLang('ar')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      lang === 'ar'
                        ? 'bg-[#00FF66]/15 border-[#00FF66] text-[#00FF66] shadow-[0_0_15px_rgba(0,255,102,0.15)] font-bold'
                        : 'bg-[#1A1A1A] border-[#2E2E2E] text-[#AAAAAA] hover:text-white hover:border-[#444444]'
                    }`}
                  >
                    <div className="text-right">
                      <p className="text-sm">العربية</p>
                      <span className="text-[10px] text-[#777777] block mt-0.5">من اليمين لليسار (RTL)</span>
                    </div>
                    {lang === 'ar' && <Check size={18} className="text-[#00FF66]" />}
                  </button>

                  <button
                    onClick={() => setLang('en')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      lang === 'en'
                        ? 'bg-[#00FF66]/15 border-[#00FF66] text-[#00FF66] shadow-[0_0_15px_rgba(0,255,102,0.15)] font-bold'
                        : 'bg-[#1A1A1A] border-[#2E2E2E] text-[#AAAAAA] hover:text-white hover:border-[#444444]'
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-sm">English</p>
                      <span className="text-[10px] text-[#777777] block mt-0.5">Left to Right (LTR)</span>
                    </div>
                    {lang === 'en' && <Check size={18} className="text-[#00FF66]" />}
                  </button>
                </div>
              </div>

              {/* Theme & Display Mode */}
              <div className="p-4.5 rounded-2xl bg-[#161616] border border-[#262626] space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Sparkles size={18} className="text-[#00FF66]" />
                    <h3 className="text-sm font-bold text-white">نمط ومظهر التطبيق (App Mode)</h3>
                  </div>
                  <span className="text-[11px] text-[#00FF66] font-mono">Dark Neon Pro</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  {/* Neon Mode */}
                  <button
                    onClick={() => setThemeMode('neon')}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer relative overflow-hidden ${
                      themeMode === 'neon'
                        ? 'bg-[#00FF66]/10 border-[#00FF66] shadow-[0_0_15px_rgba(0,255,102,0.15)]'
                        : 'bg-[#1A1A1A] border-[#2E2E2E] hover:border-[#444444]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#00FF66] shadow-[0_0_8px_#00FF66]" />
                      {themeMode === 'neon' && <Check size={14} className="text-[#00FF66]" />}
                    </div>
                    <p className="text-xs font-bold text-white">الداكن النيون</p>
                    <span className="text-[10px] text-[#777777]">أخضر فسفوري رياضي</span>
                  </button>

                  {/* OLED Mode */}
                  <button
                    onClick={() => setThemeMode('oled')}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer relative overflow-hidden ${
                      themeMode === 'oled'
                        ? 'bg-neutral-900 border-[#00FF66] shadow-[0_0_15px_rgba(0,255,102,0.15)]'
                        : 'bg-[#1A1A1A] border-[#2E2E2E] hover:border-[#444444]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="w-3 h-3 rounded-full bg-black border border-white/20" />
                      {themeMode === 'oled' && <Check size={14} className="text-[#00FF66]" />}
                    </div>
                    <p className="text-xs font-bold text-white">OLED الفاحم</p>
                    <span className="text-[10px] text-[#777777]">أسود نقي موفر للطاقة</span>
                  </button>

                  {/* Slate Mode */}
                  <button
                    onClick={() => setThemeMode('slate')}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer relative overflow-hidden ${
                      themeMode === 'slate'
                        ? 'bg-slate-900/60 border-[#00FF66] shadow-[0_0_15px_rgba(0,255,102,0.15)]'
                        : 'bg-[#1A1A1A] border-[#2E2E2E] hover:border-[#444444]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="w-3 h-3 rounded-full bg-slate-600" />
                      {themeMode === 'slate' && <Check size={14} className="text-[#00FF66]" />}
                    </div>
                    <p className="text-xs font-bold text-white">الليلي الكحلي</p>
                    <span className="text-[10px] text-[#777777]">هادئ ومريح للعين</span>
                  </button>
                </div>

                {/* Micro-animations Toggle */}
                <div className="pt-2 flex items-center justify-between border-t border-[#222222]">
                  <div>
                    <p className="text-xs font-bold text-white">المؤثرات الحركية والتفاعل (Animations)</p>
                    <span className="text-[10px] text-[#777777]">تأثيرات الانتقال الناعمة والـ Glow</span>
                  </div>
                  <button
                    onClick={() => setAnimationsEnabled(!animationsEnabled)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      animationsEnabled ? 'bg-[#00FF66]' : 'bg-[#333333]'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                        animationsEnabled ? 'right-1' : 'right-6'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 2: NOTIFICATIONS (الإشعارات والتنبيهات) ──────── */}
          {activeTab === 'notifications' && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="p-4.5 rounded-2xl bg-[#161616] border border-[#262626] space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#222222]">
                  <Bell size={18} className="text-[#00FF66]" />
                  <h3 className="text-sm font-bold text-white">إشعارات وتنبيهات النادي الذكية</h3>
                </div>

                {/* Workout Reminder */}
                <div className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-xs font-bold text-white">تذكيرات مواعيد التمارين وجدول الحصص</p>
                    <span className="text-[10px] text-[#777777]">تنبيه قبل موعد التمرين اليومي بساعتين</span>
                  </div>
                  <button
                    onClick={() => setNotifyWorkouts(!notifyWorkouts)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      notifyWorkouts ? 'bg-[#00FF66]' : 'bg-[#333333]'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                        notifyWorkouts ? 'right-1' : 'right-6'
                      }`}
                    />
                  </button>
                </div>

                {/* InBody Test Due */}
                <div className="flex items-center justify-between py-1 border-t border-[#222222]">
                  <div>
                    <p className="text-xs font-bold text-white">تنبيهات فحص قياسات InBody الدوري</p>
                    <span className="text-[10px] text-[#777777]">إشعار عند اقتراب موعد الفحص الشهري المعتمد بالصالة</span>
                  </div>
                  <button
                    onClick={() => setNotifyInBody(!notifyInBody)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      notifyInBody ? 'bg-[#00FF66]' : 'bg-[#333333]'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                        notifyInBody ? 'right-1' : 'right-6'
                      }`}
                    />
                  </button>
                </div>

                {/* Club Store Offers */}
                <div className="flex items-center justify-between py-1 border-t border-[#222222]">
                  <div>
                    <p className="text-xs font-bold text-white">عروض متجر الصالة وخصومات المكملات</p>
                    <span className="text-[10px] text-[#777777]">تنبيهات الخصومات الحصرية لمشتركي تيتان VIP</span>
                  </div>
                  <button
                    onClick={() => setNotifyStore(!notifyStore)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      notifyStore ? 'bg-[#00FF66]' : 'bg-[#333333]'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                        notifyStore ? 'right-1' : 'right-6'
                      }`}
                    />
                  </button>
                </div>

                {/* Coach & Reception Messages */}
                <div className="flex items-center justify-between py-1 border-t border-[#222222]">
                  <div>
                    <p className="text-xs font-bold text-white">رسائل كوتش الذكاء الاصطناعي وإدارة الجيم</p>
                    <span className="text-[10px] text-[#777777]">إشعارات التوجيهات التدريبية وتحديثات الاشتراك</span>
                  </div>
                  <button
                    onClick={() => setNotifyCoach(!notifyCoach)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      notifyCoach ? 'bg-[#00FF66]' : 'bg-[#333333]'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                        notifyCoach ? 'right-1' : 'right-6'
                      }`}
                    />
                  </button>
                </div>

                {/* Sound & Haptics */}
                <div className="flex items-center justify-between py-1 border-t border-[#222222]">
                  <div className="flex items-center gap-2">
                    <Volume2 size={16} className="text-[#888888]" />
                    <div>
                      <p className="text-xs font-bold text-white">أصوات التنبيهات والاهتزاز اللمسي</p>
                      <span className="text-[10px] text-[#777777]">تشغيل نغمة عند تأكيد الدخول بالبوابة الإلكترونية</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifySounds(!notifySounds)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      notifySounds ? 'bg-[#00FF66]' : 'bg-[#333333]'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                        notifySounds ? 'right-1' : 'right-6'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 3: PRIVACY & SECURITY (الأمان والخصوصية) ────── */}
          {activeTab === 'privacy' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4.5 rounded-2xl bg-[#161616] border border-[#262626] space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#222222]">
                  <Shield size={18} className="text-[#00FF66]" />
                  <h3 className="text-sm font-bold text-white">الأمان وحماية بيانات المشترك</h3>
                </div>

                {/* Biometrics */}
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2.5">
                    <Lock size={16} className="text-[#00FF66]" />
                    <div>
                      <p className="text-xs font-bold text-white">تسجيل الدخول السريع (Face ID / بصمة الإصبع)</p>
                      <span className="text-[10px] text-[#777777]">تأمين الدخول السريع لحسابك على هاتفك الشخصي</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setBiometricAuth(!biometricAuth)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      biometricAuth ? 'bg-[#00FF66]' : 'bg-[#333333]'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                        biometricAuth ? 'right-1' : 'right-6'
                      }`}
                    />
                  </button>
                </div>

                {/* Privacy in Gym (Masking stats) */}
                <div className="flex items-center justify-between py-1 border-t border-[#222222]">
                  <div className="flex items-center gap-2.5">
                    <EyeOff size={16} className="text-[#00FF66]" />
                    <div>
                      <p className="text-xs font-bold text-white">وضع الخصوصية في الصالة (Gym Privacy Mode)</p>
                      <span className="text-[10px] text-[#777777]">إخفاء أرقام الوزن والدهون الصريحة في الشاشة العامة</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setPrivacyMasking(!privacyMasking)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      privacyMasking ? 'bg-[#00FF66]' : 'bg-[#333333]'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                        privacyMasking ? 'right-1' : 'right-6'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="p-4 rounded-2xl bg-[#161616] border border-[#262626]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Smartphone size={16} className="text-[#00FF66]" />
                    <span>الجلسة الحالية الموثقة</span>
                  </span>
                  <span className="text-[10px] text-[#00FF66] bg-[#00FF66]/15 px-2 py-0.5 rounded-full font-bold">
                    نشطة الآن
                  </span>
                </div>
                <p className="text-xs text-[#888888]">
                  تطبيق موبايل / متصفح الويب PWA • عنوان IP محلي آمن • مشفر بواسطة TLS 1.3
                </p>
              </div>
            </div>
          )}

          {/* ─── TAB 4: DATA & SYNC (المزامنة والذاكرة) ───────────── */}
          {activeTab === 'data' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4.5 rounded-2xl bg-[#161616] border border-[#262626] space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#222222]">
                  <Database size={18} className="text-[#00FF66]" />
                  <h3 className="text-sm font-bold text-white">المزامنة مع سيرفرات نادي تيتان السحابية</h3>
                </div>

                <div className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-xs font-bold text-white">مزامنة البيانات والتمارين (Cloud Sync)</p>
                    <span className="text-[10px] text-[#777777]">
                      {syncSuccess ? '✅ تمت المزامنة بنجاح وحفظ أحدث البيانات' : 'آخر مزامنة تمت بنجاح قبل دقيقتين'}
                    </span>
                  </div>
                  <button
                    onClick={handleSyncNow}
                    disabled={isSyncing}
                    className="px-3 py-1.5 rounded-xl bg-[#1E1E1E] border border-[#00FF66]/50 text-xs font-bold text-[#00FF66] hover:bg-[#00FF66]/10 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
                    <span>{isSyncing ? 'جارٍ المزامنة...' : 'مزامنة الآن'}</span>
                  </button>
                </div>

                {/* Clear Cache */}
                <div className="flex items-center justify-between py-1 border-t border-[#222222]">
                  <div>
                    <p className="text-xs font-bold text-white">مسح الذاكرة المؤقتة (App Cache)</p>
                    <span className="text-[10px] text-[#777777]">
                      {cacheCleared ? '✅ تم تفريغ الكاش وتحرير المساحة' : `المساحة المستخدمة حالياً: ${cacheSize}`}
                    </span>
                  </div>
                  <button
                    onClick={handleClearCache}
                    className="px-3 py-1.5 rounded-xl bg-rose-950/20 border border-rose-500/40 text-xs font-bold text-rose-400 hover:bg-rose-900/30 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>مسح الكاش</span>
                  </button>
                </div>
              </div>

              {/* System Info */}
              <div className="p-4 rounded-2xl bg-[#141414] border border-[#222222] text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[#888888]">
                  <span>إصدار منصة بولس أوبس:</span>
                  <span className="font-mono text-white font-bold">v1.0.0 (Titan Gym Edition)</span>
                </div>
                <div className="flex items-center justify-between text-[#888888]">
                  <span>تشفير الاتصال:</span>
                  <span className="text-[#00FF66] font-mono">TLS 1.3 / AES-256 GCM</span>
                </div>
                <div className="flex items-center justify-between text-[#888888]">
                  <span>بوابة النادي الرياضي:</span>
                  <span className="text-white">Titan Iron Fitness Gateway #8491</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#222222] bg-[#161616] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#888888]">
            <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse" />
            <span>يتم تطبيق وحفظ كافة التعديلات تلقائياً</span>
          </div>

          <button
            onClick={onClose}
            className="neon-btn px-6 py-2 rounded-xl text-xs font-bold cursor-pointer shadow-lg"
          >
            تم الحفظ والإغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
