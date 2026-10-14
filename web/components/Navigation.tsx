'use client';

import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Dumbbell,
  Users,
  Shield,
  Activity,
  Calendar,
  ShoppingBag,
  Bell,
  TrendingUp,
  Bot,
  QrCode,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Layers,
  Sparkles,
  Globe,
  Send,
  Download,
  Copy,
  Check,
  Settings,
  LayoutDashboard,
  Home,
  ShoppingCart,
  ClipboardList,
} from 'lucide-react';
import QRCode from 'qrcode';
import { useLanguage } from '@/lib/LanguageContext';
import { SettingsModal } from './SettingsModal';

export type UserRole = 'SUPER_ADMIN' | 'GYM_ADMIN' | 'TRAINER' | 'MEMBER';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  category: string;
}

interface NavigationProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  gymName?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  gymName = 'Titan Iron Fitness Club',
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAiCoach, setShowAiCoach] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState<
    { role: 'user' | 'assistant'; text: string; time: string }[]
  >([
    {
      role: 'assistant',
      text: 'أهلاً بك! أنا كوتش الذكاء الاصطناعي (Gemini AI) المعتمد في منصة بولس أوبس. كيف يمكنني مساعدتك في خطتك التدريبية، التغذية، أو استفسارات النادي اليوم؟',
      time: 'الآن',
    },
  ]);
  const [aiInputMessage, setAiInputMessage] = useState('');
  const [isAiCoachLoading, setIsAiCoachLoading] = useState(false);

  const handleSendAiMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const query = customText || aiInputMessage;
    if (!query.trim() || isAiCoachLoading) return;

    setAiInputMessage('');
    setAiChatMessages((prev) => [
      ...prev,
      { role: 'user', text: query, time: 'الآن' },
    ]);
    setIsAiCoachLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });
      const data = await res.json();
      setAiChatMessages((prev) => [
        ...prev,
        { role: 'assistant', text: data.reply, time: 'الآن' },
      ]);
    } catch {
      let reply = 'سؤال ممتاز! بناءً على خطتك الحالية للضخامة الصافية وهدف 2,650 سعرة حرارية، ركز على تناول 40-50 جرام بروتين عالي الجودة خلال ساعتين بعد التمرين، وحافظ على نوم استشفائي لا يقل عن 7.5 ساعات.';
      if (query.includes('كرياتين') || query.toLowerCase().includes('creatine')) {
        reply = 'تناول 5 جرامات من الكرياتين يومياً بانتظام مع مصدر كربوهيدرات أو بعد التمرين مباشرة لضمان تشبع مخازن الطاقة ATP في العضلات وزيادة القوة الانفجارية.';
      } else if (query.includes('خس') || query.includes('تنشيف') || query.includes('وزن')) {
        reply = 'لتقليل نسبة الدهون بأمان مع الحفاظ على الكتلة العضلية: حافظ على عجز سعرات حرارية من 300-500 سعرة، وزد من حصتك من البروتين إلى 2.2 جم لكل كجم، مع إضافة جلستين كارديو منخفض الشدة (LISS) أسبوعياً.';
      } else if (query.includes('تعب') || query.includes('ألم') || query.includes('شد')) {
        reply = 'ألم العضلات المتأخر (DOMS) طبيعي بعد الجهد العالي. احرص على شرب ما لا يقل عن 3-4 لترات ماء يومياً، ومارس تمارين التمدد والإحماء الديناميكي.';
      }
      setAiChatMessages((prev) => [
        ...prev,
        { role: 'assistant', text: reply, time: 'الآن' },
      ]);
    } finally {
      setIsAiCoachLoading(false);
    }
  };

  const [showBarcodePass, setShowBarcodePass] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Generate real scannable QR Code image for the digital turnstile pass
  useEffect(() => {
    const payload = JSON.stringify({
      memberId: 'usr-member-8491',
      gymId: 'gym-titan',
      memberName: 'طارق المنصور',
      membershipPlan: 'الباقة الذهبية السنوية VIP',
      validUntil: '2027-11-30',
      type: 'PULSOPS_MEMBER_PASS',
    });

    QRCode.toDataURL(
      payload,
      {
        width: 320,
        margin: 2,
        color: {
          dark: '#00FF66',
          light: '#0A0A0A',
        },
        errorCorrectionLevel: 'H',
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, []);

  const downloadPassOnMobile = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `PulsOps-TitanGym-Pass-Tariq-8491.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyPassCode = () => {
    navigator.clipboard?.writeText('usr-member-8491');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const { lang, setLang, t, isRtl } = useLanguage();

  // Member Shopping Cart state for top navbar
  const [cartCount, setCartCount] = useState(0);
  const [cartTotalVal, setCartTotalVal] = useState(0);

  const calculateCartFromStorage = () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('pulsops_member_cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        const count = Object.values(parsed).reduce((acc: number, q: any) => acc + (Number(q) || 0), 0);
        setCartCount(count);
        // Estimated prices
        const priceMap: { [k: string]: number } = {
          'p-1': 3950,
          'p-2': 1750,
          'p-3': 2250,
          'p-4': 900,
        };
        const total = Object.entries(parsed).reduce(
          (sum: number, [id, q]: [string, any]) => sum + (priceMap[id] || 1000) * (Number(q) || 0),
          0
        );
        setCartTotalVal(total);
      } else {
        setCartCount(0);
        setCartTotalVal(0);
      }
    } catch {
      setCartCount(0);
      setCartTotalVal(0);
    }
  };

  useEffect(() => {
    calculateCartFromStorage();
    const handleCartSync = () => calculateCartFromStorage();
    window.addEventListener('pulsops_cart_updated', handleCartSync);
    window.addEventListener('storage', handleCartSync);
    return () => {
      window.removeEventListener('pulsops_cart_updated', handleCartSync);
      window.removeEventListener('storage', handleCartSync);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
        setShowAiCoach(false);
        setShowBarcodePass(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [drawerOpen]);

  const getNavItems = (): NavItem[] => {
    switch (currentRole) {
      case 'SUPER_ADMIN':
        return [
          { id: 'overview', label: t.navOverview, icon: <Layers size={18} />, category: t.catCore },
          { id: 'gyms', label: t.navGyms, icon: <Dumbbell size={18} />, category: t.catManagement },
          { id: 'subscriptions', label: t.navSaaSTiers, icon: <DollarSign size={18} />, category: t.catBilling },
          { id: 'analytics', label: t.navPlatformMRR, icon: <TrendingUp size={18} />, category: t.catIntelligence },
          { id: 'audit', label: t.navAudit, icon: <Shield size={18} />, category: t.catSystem },
          { id: 'settings', label: 'إعدادات المنصة الشاملة', icon: <Bot size={18} />, category: t.catSystem },
        ];
      case 'GYM_ADMIN':
        return [
          { id: 'overview', label: t.navDashboard, icon: <Layers size={18} />, category: t.catCore },
          { id: 'members', label: t.navMembers, icon: <Users size={18} />, category: t.catPeople },
          { id: 'staff', label: t.navStaff, icon: <Shield size={18} />, category: t.catPeople },
          { id: 'plans', label: t.navPlans, icon: <DollarSign size={18} />, category: t.catOperations },
          { id: 'inbody', label: t.navInBody, icon: <Activity size={18} />, category: t.catFitness },
          { id: 'workouts', label: t.navWorkouts, icon: <Dumbbell size={18} />, category: t.catFitness },
          { id: 'nutrition', label: t.navNutrition, icon: <Calendar size={18} />, category: t.catFitness },
          { id: 'store', label: t.navStore, icon: <ShoppingBag size={18} />, category: t.catRevenue },
          { id: 'orders', label: t.navOrders, icon: <ClipboardList size={18} />, category: t.catRevenue },
          { id: 'attendance', label: t.navAttendance, icon: <QrCode size={18} />, category: t.catOperations },
          { id: 'broadcast', label: t.navBroadcast, icon: <Bell size={18} />, category: t.catCommunication },
          { id: 'analytics', label: t.navAnalytics, icon: <TrendingUp size={18} />, category: t.catIntelligence },
          { id: 'ai', label: t.navAiAssistant, icon: <Bot size={18} />, category: t.catAiTools },
        ];
      case 'TRAINER':
        return [
          { id: 'overview', label: t.navTrainerHub, icon: <Layers size={18} />, category: t.catCore },
          { id: 'assigned_members', label: t.navMyTrainees, icon: <Users size={18} />, category: t.catClients },
          { id: 'workouts', label: t.navPrescriptions, icon: <Dumbbell size={18} />, category: t.catFitness },
          { id: 'nutrition', label: t.navMealPlans, icon: <Calendar size={18} />, category: t.catFitness },
          { id: 'inbody', label: t.navInBody, icon: <Activity size={18} />, category: t.catFitness },
          { id: 'store', label: 'متجر الصالة والمكملات', icon: <ShoppingBag size={18} />, category: t.catRevenue },
          { id: 'earnings', label: t.navCommissions, icon: <DollarSign size={18} />, category: t.catFinance },
        ];
      case 'MEMBER':
        return [
          { id: 'overview', label: t.navMemberPass, icon: <LayoutDashboard size={18} />, category: t.catPersonal },
          { id: 'inbody', label: t.navMyProgress, icon: <Activity size={18} />, category: t.catFitness },
          { id: 'workouts', label: t.navMyWorkout, icon: <Dumbbell size={18} />, category: t.catFitness },
          { id: 'nutrition', label: t.navMyDiet, icon: <Calendar size={18} />, category: t.catFitness },
          { id: 'store', label: lang === 'ar' ? 'متجر النادي والمكملات' : 'Club Store & Supplements', icon: <ShoppingBag size={18} />, category: t.catShop },
          { id: 'my_orders', label: t.navMyOrders, icon: <ClipboardList size={18} />, category: t.catShop },
          { id: 'loyalty', label: t.navLoyalty, icon: <Sparkles size={18} />, category: t.catPersonal },
          { id: 'ai', label: t.navAiCoach, icon: <Bot size={18} />, category: t.catAiTools },
          { id: 'settings', label: lang === 'ar' ? 'إعدادات التطبيق' : 'App Settings', icon: <Settings size={18} />, category: lang === 'ar' ? 'الإعدادات' : 'Settings' },
        ];
    }
  };

  const navItems = getNavItems();
  const categories = Array.from(new Set(navItems.map((item) => item.category)));

  return (
    <>
      {/* ─── Top Header Bar ────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full glass-nav border-b border-[#282828] px-4 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Left / Start: Hamburger Menu Only */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open Navigation Menu"
            className="p-2 rounded-lg bg-[#181818] border border-[#282828] text-white hover:text-[#00FF66] hover:border-[#00FF66] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00FF66]"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Right / End: Action Icon Buttons (Cart, Barcode Pass & AI Coach) */}
        <div className="flex items-center gap-3">
          {/* Member Shopping Cart Icon Button (Icon Only - Exactly matches neighbor buttons) */}
          {currentRole === 'MEMBER' && (
            <button
              onClick={() => onTabChange('store')}
              className="w-10 h-10 rounded-xl bg-[#181818] border border-[#00FF66]/40 text-white hover:border-[#00FF66] hover:bg-[#00FF66]/10 transition-all cursor-pointer group shadow-[0_0_15px_rgba(0,255,102,0.15)] flex items-center justify-center relative shrink-0"
              title={cartTotalVal > 0 ? `سلة المشتريات (${cartCount} منتجات - ${cartTotalVal.toLocaleString()} ج.م)` : 'سلة المشتريات'}
              aria-label="سلة المشتريات"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingCart size={19} className="text-[#00FF66] group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#00FF66] text-[#0A0A0A] text-[10px] font-black font-mono flex items-center justify-center shadow-[0_0_10px_rgba(0,255,102,0.6)] animate-scaleIn">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>
          )}

          {/* Barcode Pass Icon Button */}
          <button
            onClick={() => setShowBarcodePass(true)}
            className="w-10 h-10 rounded-xl bg-[#181818] border border-[#00FF66]/40 text-white hover:border-[#00FF66] hover:bg-[#00FF66]/10 transition-all cursor-pointer group shadow-[0_0_15px_rgba(0,255,102,0.15)] flex items-center justify-center shrink-0"
            title="بطاقة دخول النادي (الباركود الإلكتروني)"
            aria-label="باركود الدخول"
          >
            <QrCode size={19} className="text-[#00FF66] group-hover:scale-110 transition-transform" />
          </button>

          {/* AI Coach Header Icon Button (Icon Only) */}
          <button
            onClick={() => setShowAiCoach(true)}
            className="w-10 h-10 rounded-xl bg-[#181818] border border-[#00FF66]/40 text-white hover:border-[#00FF66] hover:bg-[#00FF66]/10 transition-all cursor-pointer group shadow-[0_0_15px_rgba(0,255,102,0.15)] flex items-center justify-center relative shrink-0"
            title="كوتش الذكاء الاصطناعي (Gemini AI)"
            aria-label="كوتش الذكاء الاصطناعي"
          >
            <div className="relative flex items-center justify-center">
              <Sparkles size={19} className="text-[#00FF66] group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00FF66] animate-ping" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00FF66]" />
            </div>
          </button>
        </div>
      </header>

      {/* ─── Sliding Off-Canvas Drawer ─────────────────────────────── */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        className={`fixed top-0 bottom-0 z-50 w-80 max-w-[85vw] bg-[#121212] border-[#282828] flex flex-col transition-transform duration-300 ease-in-out shadow-2xl ${
          isRtl ? 'right-0 border-l' : 'left-0 border-r'
        } ${
          drawerOpen
            ? 'translate-x-0'
            : isRtl
            ? 'translate-x-full'
            : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#282828] flex items-center justify-between bg-[#181818]/60">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-9 h-9 rounded-xl bg-[#00FF66] text-[#0A0A0A] flex items-center justify-center font-black text-xl shadow-[0_0_15px_rgba(0,255,102,0.4)]">
              P
            </div>
            <div>
              <h2 className="font-bold text-white text-base tracking-wide">
                {lang === 'ar' ? 'بولس أوبس ERP' : 'PULSOPS ERP'}
              </h2>
              <p className="text-[11px] text-[#A0A0A0] truncate max-w-[170px]">
                {currentRole === 'SUPER_ADMIN' ? t.platformMaster : gymName}
              </p>
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close Navigation"
            className="p-1.5 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-[#282828] transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Categorized Nav Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {categories.map((cat) => (
            <div key={cat}>
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#666666]">
                {cat}
              </span>
              <div className="mt-1.5 space-y-1">
                {navItems
                  .filter((item) => item.category === cat)
                  .map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.id === 'settings') {
                            setShowSettingsModal(true);
                            setDrawerOpen(false);
                            return;
                          }
                          onTabChange(item.id);
                          setDrawerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#00FF66]/15 text-[#00FF66] border border-[#00FF66]/40 shadow-[0_0_15px_rgba(0,255,102,0.1)]'
                            : 'text-[#A0A0A0] hover:text-white hover:bg-[#1E1E1E]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={isActive ? 'text-[#00FF66]' : 'text-[#666666]'}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </div>
                        {isActive && (
                          isRtl ? (
                            <ChevronLeft size={16} className="text-[#00FF66]" />
                          ) : (
                            <ChevronRight size={16} className="text-[#00FF66]" />
                          )
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* Drawer Footer & Logout */}
        <div className="p-4 border-t border-[#282828] bg-[#181818]/60 space-y-3">
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('pulsops_session');
                window.location.href = '/login';
              }
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-bold flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all cursor-pointer"
          >
            <span>تسجيل الخروج والانتقال لحساب آخر</span>
          </button>

          <div className="flex items-center justify-between text-xs text-[#A0A0A0]">
            <span className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse"></span>
              <span>{t.connectedGateway}</span>
            </span>
            <span className="font-mono text-[10px]">v1.0.0</span>
          </div>
        </div>
      </aside>

      {/* ─── Gemini AI Coach Popup Modal ────────────────────────────── */}
      {showAiCoach && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#282828] w-full max-w-lg rounded-2xl shadow-2xl animate-scaleIn flex flex-col h-[560px] max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#282828] flex items-center justify-between bg-[#181818]/70">
              <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                <div className="w-9 h-9 rounded-xl bg-[#00FF66]/10 border border-[#00FF66]/40 flex items-center justify-center">
                  <Sparkles size={18} className="text-[#00FF66]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                    <span>كوتش الذكاء الاصطناعي (Gemini AI)</span>
                    <span className="text-[10px] font-mono text-[#00FF66] bg-[#00FF66]/15 px-2 py-0.5 rounded-full font-bold">
                      متصل الآن
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#A0A0A0]">مساعدك الذكي المعتمد للتمارين، التغذية، وبناء العضلات</p>
                </div>
              </div>

              <button
                onClick={() => setShowAiCoach(false)}
                className="p-1.5 rounded-lg bg-[#181818] border border-[#282828] text-[#A0A0A0] hover:text-white hover:border-[#00FF66] transition-all cursor-pointer"
                title="إغلاق"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="px-4 py-2 bg-[#141414] border-b border-[#242424] flex items-center space-x-2 rtl:space-x-reverse overflow-x-auto text-[11px]">
              <span className="text-[#666666] shrink-0 font-medium">اقتراحات سريعة:</span>
              {[
                'خطة تنشيف وحرق دهون',
                'أفضل وقت لتناول الكرياتين',
                'كيف أزيد أوزاني بأمان؟',
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendAiMessage(undefined, chip)}
                  className="px-2.5 py-1 rounded-lg bg-[#1E1E1E] hover:bg-[#00FF66]/20 border border-[#282828] hover:border-[#00FF66]/50 text-[#A0A0A0] hover:text-white transition-all shrink-0 cursor-pointer text-[11px]"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#0D0D0D]">
              {aiChatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#00FF66] text-[#0A0A0A] font-semibold rounded-br-none shadow-[0_0_15px_rgba(0,255,102,0.25)]'
                        : 'bg-[#181818] border border-[#282828] text-white rounded-bl-none shadow-md'
                    }`}
                  >
                    <div>{msg.text}</div>
                    <span className={`block text-[9px] mt-1.5 font-mono ${msg.role === 'user' ? 'text-black/60 text-left' : 'text-[#666666] text-right'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {isAiCoachLoading && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl bg-[#181818] border border-[#00FF66]/40 text-xs text-[#00FF66] flex items-center space-x-2 rtl:space-x-reverse rounded-bl-none animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-[#00FF66] animate-ping" />
                    <span>الكوتش الذكي يكتب تحليلك التدريبي الآن...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input Form */}
            <form onSubmit={(e) => handleSendAiMessage(e)} className="p-3.5 border-t border-[#282828] bg-[#141414] flex items-center space-x-2 rtl:space-x-reverse">
              <input
                type="text"
                placeholder="اسأل عن التمارين، كميات البروتين، المكملات، أو الاستشفاء..."
                value={aiInputMessage}
                onChange={(e) => setAiInputMessage(e.target.value)}
                className="flex-1 bg-[#1A1A1A] border border-[#282828] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#666666] focus:border-[#00FF66] focus:outline-none"
              />
              <button
                type="submit"
                disabled={isAiCoachLoading || !aiInputMessage.trim()}
                className="p-2.5 rounded-xl bg-[#00FF66] text-[#0A0A0A] hover:bg-[#39FF14] disabled:opacity-40 transition-all cursor-pointer font-bold shrink-0"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── Digital Turnstile Barcode Pass Modal ───────────────────── */}
      {showBarcodePass && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#00FF66]/40 glow-border w-full max-w-sm rounded-2xl shadow-2xl animate-scaleIn p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#00FF66]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#282828] relative z-10">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <QrCode size={18} className="text-[#00FF66]" />
                <span className="text-xs font-mono text-[#00FF66] uppercase tracking-wider font-bold">
                  بطاقة دخول نادي PulsOps
                </span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-xs font-bold text-white bg-[#00FF66]/20 px-2 py-0.5 rounded">
                  نشط ✅
                </span>
                <button
                  onClick={() => setShowBarcodePass(false)}
                  className="p-1 rounded-lg bg-[#181818] border border-[#282828] text-[#A0A0A0] hover:text-white hover:border-[#00FF66] transition-all cursor-pointer"
                  title="إغلاق"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Barcode & Download */}
            <div className="my-5 flex flex-col items-center relative z-10">
              <div className="p-2.5 bg-[#0A0A0A] rounded-2xl border-2 border-[#00FF66] shadow-[0_0_30px_rgba(0,255,102,0.35)] relative group">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="PulsOps Member Turnstile Barcode"
                    className="w-48 h-48 rounded-xl object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 bg-[#0A0A0A] flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-[#00FF66] border-t-transparent animate-spin" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/70 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-[#00FF66] font-bold">رمز دخول مشفر حقيقي</span>
                </div>
              </div>

              <div className="mt-3.5 flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-[11px] font-mono text-[#A0A0A0]">كود العضو:</span>
                <span className="text-xs font-mono font-bold text-white bg-[#181818] px-2 py-0.5 rounded border border-[#282828]">
                  #8491-TITAN
                </span>
                <button
                  onClick={copyPassCode}
                  className="p-1 rounded bg-[#181818] border border-[#282828] text-[#A0A0A0] hover:text-[#00FF66] transition-colors cursor-pointer"
                  title="نسخ الكود"
                >
                  {copiedCode ? <Check size={13} className="text-[#00FF66]" /> : <Copy size={13} />}
                </button>
              </div>

              <p className="text-[11px] text-[#A0A0A0] mt-1.5 font-mono text-center">
                قرّب الباركود من ماسح البوابة الإلكترونية Turnstile
              </p>

              {/* Download Pass to Mobile Button */}
              <button
                onClick={downloadPassOnMobile}
                className="mt-4 w-full py-2.5 px-3 rounded-xl neon-btn text-xs font-bold flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(0,255,102,0.4)] transition-all"
              >
                <Download size={15} />
                <span>تحميل الباركود على الموبايل (PNG)</span>
              </button>
            </div>

            {/* Footer details */}
            <div className="pt-3 border-t border-[#282828] flex items-center justify-between text-xs relative z-10">
              <div>
                <p className="text-[#666666] text-[10px] uppercase font-mono">نوع العضوية</p>
                <p className="text-white font-bold">الباقة السنوية الذهبية</p>
              </div>
              <div className="text-left">
                <p className="text-[#666666] text-[10px] uppercase font-mono">الزيارات هذا الشهر</p>
                <p className="text-[#00FF66] font-mono font-bold">22 زيارة</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Global App Settings & Preferences Modal ─────────────── */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </>
  );
};
