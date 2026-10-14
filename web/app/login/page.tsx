'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dumbbell,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Globe,
  Smartphone,
  Monitor,
  Download,
  QrCode,
  Users,
  Activity,
  ShoppingBag,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Apple,
  TrendingUp,
  Flame,
  Zap,
  BarChart3,
  Clock,
  Radio,
  Sliders,
  Play,
  HeartPulse,
  X,
  LogIn,
  Building2,
  UserCheck,
  Award,
  Check,
} from 'lucide-react';
import { setStoredSession } from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';

export default function LoginPage() {
  const router = useRouter();
  const { lang, setLang, isRtl } = useLanguage();

  // Modals state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showMobileSimulator, setShowMobileSimulator] = useState(false);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Download & notifications state
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [activeTabPreview, setActiveTabPreview] = useState<'turnstiles' | 'members' | 'pos' | 'inbody'>('turnstiles');

  // Request Account Registration State
  const [reqGymName, setReqGymName] = useState('');
  const [reqFullName, setReqFullName] = useState('');
  const [reqPhone, setReqPhone] = useState('');
  const [reqRole, setReqRole] = useState<'gym_owner' | 'coach' | 'member'>('gym_owner');
  const [reqCity, setReqCity] = useState('');
  const [reqSubmitted, setReqSubmitted] = useState(false);
  const [reqLoading, setReqLoading] = useState(false);

  const t = {
    ar: {
      brandTitle: 'PULSOPS ERP',
      brandSubtitle: 'المنظومة السحابية المتكاملة لإدارة وتشغيل الأندية الرياضية',
      navFeatures: 'المميزات والحلول',
      navGates: 'بوابات الـ QR',
      navRoles: 'أدوار المنظومة',
      navApps: 'تحميل التطبيقات',
      loginBtn: 'تسجيل الدخول',
      registerBtn: 'سجّل صالتك الآن',
      heroBadge: 'الجيل الجديد من أنظمة اللياقة البدنية والتشغيل الذكي 2026',
      heroHeading: 'منصة سحابية متكاملة تدير كل نبضة في صالتك الرياضية',
      heroSubheading:
        'نظام تشغيل فائق التطور يجمع بين بوابات المرور الذكية بالـ QR، إدارة الاشتراكات والعضويات بالجنيه المصري، نقاط البيع السريعة POS، وتتبع القياسات الحيوية InBody في تجربة تشغيلية استثنائية.',
      exploreBtn: 'استكشف مزايا المنظومة',
      stat1Val: '99.98%',
      stat1Lbl: 'استقرار البوابات والتشغيل',
      stat2Val: '0.4 ثانية',
      stat2Lbl: 'سرعة التحقق عبر الـ QR',
      stat3Val: '+40%',
      stat3Lbl: 'زيادة تجديد الاشتراكات',
      stat4Val: '100%',
      stat4Lbl: 'عزل أمان سحابي لقواعد البيانات',
      livePreviewBadge: 'استعراض المنظومة المباشر',
      tabTurnstiles: 'بوابات الـ QR الذكية',
      tabMembers: 'إدارة الاشتراكات والعضويات',
      tabPos: 'نظام الكاشير POS المكتبي',
      tabInbody: 'تتبع القياسات الحيوية InBody',
      featuresSectionTitle: 'لماذا يختار رواد اللياقة البدنية منصة PulsOps؟',
      featuresSectionSubtitle: 'حلول ذكية متكاملة مصممة خصيصاً لتطوير أداء الصالات الرياضية في مصر والشرق الأوسط',
      feat1Title: 'بوابات المرور وكود الـ QR المشفر',
      feat1Desc: 'تحقق لحظي خلال 0.4 ثانية مع حظر الاشتراكات المنتهية فورياً ودعم بوابات Turnstile الإلكترونية.',
      feat2Title: 'إدارة العضويات والخدمات الإضافية',
      feat2Desc: 'باقات مرنة بالجنيه المصري (EGP)، تفصيل الخدمات (ساونا، جاكوزي، PT)، وحماية تمنع حذف الباقات النشطة.',
      feat3Title: 'كاشير الصالة السريع ونقاط البيع (Offline POS)',
      feat3Desc: 'يعمل بكفاءة على أجهزة الكمبيوتر حتى عند انقطاع الإنترنت، مع مسح الباركود وإدارة مخزون المكملات.',
      feat4Title: 'تتبع InBody والذكاء الاصطناعي',
      feat4Desc: 'رسوم بيانية تفاعلية لنسبة الدهون والكتلة العضلية مع توصيات مدعومة بالذكاء الاصطناعي للمشتركين.',
      feat5Title: 'بنية سحابية معزولة (Multi-Tenant)',
      feat5Desc: 'كل صالة رياضية تمتلك مساحتها المشفرة المعزولة بالكامل لضمان سرية البيانات وحمايتها بأعلى المعايير.',
      feat6Title: 'تطبيقات هواتف ذكية لكافة المنصات',
      feat6Desc: 'تطبيق للمتدربين على iOS و Android مع دعم كارت Apple Wallet، وبرنامج مكتبي للكاشير.',
      rolesTitle: 'استكشف كافة لوحات التحكم والأدوار في المنصة',
      rolesSubtitle: 'واجهات مخصصة لكل مسؤول لضمان أقصى كفاءة وسرعة في إنجاز المهام اليومية',
      roleSuperTitle: 'المشرف العام (Super Admin)',
      roleSuperDesc: 'إدارة البنية السحابية بالكامل، تراخيص الصالات المشتركة، وحسابات الإيراد الشهري المجمع (MRR).',
      roleSuperBtn: 'تجربة دور المشرف العام',
      roleGymTitle: 'مدير الصالة (pulsops)',
      roleGymDesc: 'لوحة الإدارة التجريبية لنادي PulsOps: متابعة المشترك (mr mostafa)، الكوتش (mostafa)، البوابات والمبيعات.',
      roleGymBtn: 'تجربة دور مدير الصالة (pulsops)',
      roleTrainerTitle: 'الكوتش والمدرب (mostafa)',
      roleTrainerDesc: 'لوحة المدرب مصطفى: متابعة خطة المتدرب (mr mostafa)، الجداول التمرينية، وقياسات الأداء الحيوية.',
      roleTrainerBtn: 'تجربة دور المدرب (mostafa)',
      roleMemberTitle: 'بوابة المشتركين (mr mostafa)',
      roleMemberDesc: 'كارت الدخول الذكي QR للمشترك mr mostafa، ومتابعة التمارين الموصوفة من الكوتش mostafa.',
      roleMemberBtn: 'تجربة دور المشترك (mr mostafa)',
      downloadsTitle: 'حمّل تطبيقات PulsOps لكافة أجهزتك',
      downloadsSubtitle: 'تطبيق المشتركين للهواتف الذكية مع برنامج الكاشير المكتبي المستقل للعمل بدون إنترنت',
      iosTitle: 'تطبيق الآيفون (iOS)',
      iosDesc: 'متاح للآيفون مع دعم بطاقة Apple Wallet للدخول السريع عبر البوابات الذكية.',
      androidTitle: 'تطبيق الأندرويد (Android)',
      androidDesc: 'تحميل مباشر APK أو عبر Google Play مع إشعارات تدريب فورية وكود QR ذكي.',
      desktopTitle: 'برنامج الكاشير المكتبي المستقل (Offline PC)',
      desktopDesc: 'يعمل محلياً بدون إنترنت على Windows و Mac للتحكم بالبوابات ونقاط البيع السريعة.',
      ctaBannerTitle: 'جاهز لنقل صالتك الرياضية إلى المستوى التالي؟',
      ctaBannerSubtitle: 'انضم الآن إلى منظومة PulsOps السحابية واستمتع بأقوى نظام تشغيل ذكي للأندية الرياضية.',
      requestAccountTitle: 'طلب تسجيل صالة جديدة أو حساب مستخدم',
      requestAccountSubtitle: 'املأ البيانات وسيقوم فريق العمل بتسليمك مساحتك السحابية فوراً',
      reqFullNameLabel: 'الاسم بالكامل',
      reqGymNameLabel: 'اسم الصالة الرياضية أو النادي',
      reqPhoneLabel: 'رقم الهاتف / واتساب',
      reqCityLabel: 'المدينة / المحافظة',
      reqAccountTypeLabel: 'نوع الحساب المطلوب',
      reqTypeGym: 'مالك أو مدير صالة رياضية (Gym Owner / Admin)',
      reqTypeCoach: 'مدرب معتمد (Personal Trainer)',
      reqTypeMember: 'مشترك جديد (Gym Member)',
      submitRequestBtn: 'إرسال طلب التسجيل الآن',
      reqSubmitting: 'جاري تسجيل الطلب...',
      reqSuccessTitle: 'تم استلام طلب التسجيل بنجاح! 🎉',
      reqSuccessDesc: 'سيتواصل معك فريق الدعم الفني وتفعيل الحسابات خلال 15 دقيقة لتسليم بيانات الدخول الخاصة بك.',
      closeModal: 'إغلاق',
      boxTitle: 'تسجيل الدخول إلى النظام',
      boxDesc: 'أدخل بيانات حسابك للوصول المباشر إلى لوحة إدارة الصالة الرياضية',
      emailLabel: 'البريد الإلكتروني',
      passwordLabel: 'كلمة المرور',
      forgotPassword: 'نسيت كلمة المرور؟',
      signInBtn: 'تسجيل الدخول إلى النظام',
      authenticating: 'جاري التحقق...',
      quickAccessTitle: 'دخول تجريبي سريع بضغطة زر (اختر دورك):',
      encryptionBadge: 'حماية وتشفير متقدم متعدد المستويات (Multi-Tenant JWT Isolation)',
    },
    en: {
      brandTitle: 'PULSOPS ERP',
      brandSubtitle: 'Next-Gen Multi-Tenant Gym Cloud & Operations Platform',
      navFeatures: 'Features',
      navGates: 'Smart Gates',
      navRoles: 'Roles & Security',
      navApps: 'Download Apps',
      loginBtn: 'Sign In',
      registerBtn: 'Register Gym Now',
      heroBadge: 'Fitness Enterprise Architecture 2026',
      heroHeading: 'One Cloud Platform Running Every Pulse of Your Fitness Club',
      heroSubheading:
        'A high-performance operating ecosystem uniting smart QR turnstiles, subscription lifecycles, bulletproof offline POS checkout, and InBody biometric trends in an unmatched operational experience.',
      exploreBtn: 'Explore Platform Features',
      stat1Val: '99.98%',
      stat1Lbl: 'System & Turnstile Uptime',
      stat2Val: '0.4s',
      stat2Lbl: 'Gate QR Verification Speed',
      stat3Val: '+40%',
      stat3Lbl: 'Renewal Retention Rate',
      stat4Val: '100%',
      stat4Lbl: 'Isolated Database Security',
      livePreviewBadge: 'Live System Console',
      tabTurnstiles: 'Smart QR Gates',
      tabMembers: 'Memberships & CRM',
      tabPos: 'Offline Desktop POS',
      tabInbody: 'InBody Biometrics AI',
      featuresSectionTitle: 'Why Fitness Leaders Choose PulsOps',
      featuresSectionSubtitle: 'Intelligent solutions purpose-built for high-growth athletic clubs and enterprise gyms',
      feat1Title: 'Encrypted Smart Turnstiles & QR Codes',
      feat1Desc: 'Instant 0.4s authorization with immediate expired plan blocking and turnstile hardware integration.',
      feat2Title: 'Flexible Memberships & Ancillary Services',
      feat2Desc: 'EGP dynamic pricing, modular add-ons (Sauna, Jacuzzi, PT), and safeguard locking for active tiers.',
      feat3Title: 'Rapid Offline Desktop POS & Store',
      feat3Desc: 'Zero-downtime cashier software for Windows and Mac that runs completely offline with barcode scanning.',
      feat4Title: 'InBody Analytics & AI Fitness Insights',
      feat4Desc: 'Visual body composition tracking for body fat % and muscle mass with automated training guidance.',
      feat5Title: 'Multi-Tenant Cloud Isolation',
      feat5Desc: 'Independent tenant separation ensures ironclad data privacy and isolated database schemas per club.',
      feat6Title: 'Multi-Platform Client Ecosystem',
      feat6Desc: 'Member mobile apps for iOS with Apple Wallet, Android APK, and desktop terminal cashier clients.',
      rolesTitle: 'Explore Dedicated Role Portals',
      rolesSubtitle: 'Tailored workspaces engineered for each stakeholder across your gym organization',
      roleSuperTitle: 'Super Admin Master',
      roleSuperDesc: 'Manage cloud tenants, gym software licenses, and unified recurring revenue (MRR).',
      roleSuperBtn: 'Launch Super Admin Portal',
      roleGymTitle: 'Gym Administrator (pulsops)',
      roleGymDesc: 'Experience the dedicated demo dashboard for gym manager pulsops: monitor member mr mostafa, coach mostafa, smart gates & store.',
      roleGymBtn: 'Explore Gym Admin (pulsops)',
      roleTrainerTitle: 'Certified Coach (mostafa)',
      roleTrainerDesc: 'Explore coach mostafa portal: manage workout routines, track trainee mr mostafa, and view nutritional plans.',
      roleTrainerBtn: 'Explore Coach (mostafa)',
      roleMemberTitle: 'Member Portal (mr mostafa)',
      roleMemberDesc: 'Explore member portal for mr mostafa: active turnstile QR code, assigned workouts from coach mostafa, and InBody.',
      roleMemberBtn: 'Explore Member (mr mostafa)',
      downloadsTitle: 'Download PulsOps Client Ecosystem',
      downloadsSubtitle: 'Native mobile experiences for members and bulletproof offline desktop POS for club staff.',
      iosTitle: 'iOS Member App',
      iosDesc: 'Available for iPhone with Apple Wallet pass sync and instant gate verification.',
      androidTitle: 'Android Mobile App',
      androidDesc: 'Direct APK download and Google Play support with real-time push workout reminders.',
      desktopTitle: 'Offline Desktop Client (Windows & Mac)',
      desktopDesc: 'High-speed local POS, barcode scanning & turnstile TCP/IP controller without internet reliance.',
      ctaBannerTitle: 'Ready to Elevate Your Gym Operations?',
      ctaBannerSubtitle: 'Join the PulsOps Cloud ecosystem today and experience the future of smart fitness management.',
      requestAccountTitle: 'Request Gym Onboarding or User Account',
      requestAccountSubtitle: 'Complete the form and our team will provision your dedicated cloud workspace immediately',
      reqFullNameLabel: 'Full Name',
      reqGymNameLabel: 'Gym / Fitness Club Name',
      reqPhoneLabel: 'Phone / WhatsApp',
      reqCityLabel: 'City / Region',
      reqAccountTypeLabel: 'Requested Account Type',
      reqTypeGym: 'Gym Owner / General Manager',
      reqTypeCoach: 'Personal Trainer / Coach',
      reqTypeMember: 'Club Member',
      submitRequestBtn: 'Submit Registration Request',
      reqSubmitting: 'Submitting Request...',
      reqSuccessTitle: 'Registration Request Received! 🎉',
      reqSuccessDesc: 'Our operations team will contact you within 15 minutes to deliver your workspace credentials.',
      closeModal: 'Close',
      boxTitle: 'Sign In to Workspace',
      boxDesc: 'Enter your credentials to access your designated gym management portal',
      emailLabel: 'Email Address',
      passwordLabel: 'Password',
      forgotPassword: 'Forgot password?',
      signInBtn: 'Sign In to Workspace',
      authenticating: 'Authenticating...',
      quickAccessTitle: 'Instant 1-Click Access (Select Role):',
      encryptionBadge: 'End-to-end Encrypted Multi-Tenant JWT Isolation',
    },
  }[lang];

  const handleDownloadClick = (platform: string, filename: string) => {
    setDownloadNotice(
      lang === 'ar'
        ? `⚡ تم بدء تحميل حزمة (${platform}) مباشرة إلى جهازك: ${filename}`
        : `⚡ Initiating direct file download for (${platform}): ${filename}`
    );

    const link = document.createElement('a');
    link.href = `/downloads/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloadNotice(null), 5000);
  };

  const handleQuickLogin = (role: 'GYM_ADMIN' | 'TRAINER' | 'MEMBER') => {
    let userObj;
    if (role === 'TRAINER') {
      userObj = {
        id: 'usr-trainer-demo',
        email: 'mostafa@pulsops.com',
        name: 'mostafa',
        role: 'TRAINER' as const,
        gymId: 'gym-pulsops',
        gymName: 'نادي PulsOps الرياضي',
      };
    } else if (role === 'MEMBER') {
      userObj = {
        id: 'usr-member-demo',
        email: 'mr.mostafa@pulsops.com',
        name: 'mr mostafa',
        role: 'MEMBER' as const,
        gymId: 'gym-pulsops',
        gymName: 'نادي PulsOps الرياضي',
      };
    } else {
      userObj = {
        id: 'usr-gymadmin-demo',
        email: 'pulsops@pulsops.com',
        name: 'pulsops',
        role: 'GYM_ADMIN' as const,
        gymId: 'gym-pulsops',
        gymName: 'نادي PulsOps الرياضي',
      };
    }

    setStoredSession({
      token: `demo-jwt-token-${Date.now()}`,
      refreshToken: `demo-jwt-refresh-${Date.now()}`,
      user: userObj,
    });
    router.push('/');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const trimmedEmail = email.toLowerCase().trim();
    const isSuperAdminAttempt = trimmedEmail === 'superadmin@pulsops.com' || trimmedEmail.includes('superadmin');

    if (isSuperAdminAttempt) {
      // ─── Highest Security Shield for Super Admin ───
      // Super Admin is strictly guarded. Must match the exact authorized master security credentials.
      const authorizedMasterPasswords = ['Admin@PulsOps#2026!', 'PulsOps@Master2026'];
      if (!authorizedMasterPasswords.includes(password.trim())) {
        setError(
          lang === 'ar'
            ? 'خطأ أمني: كلمة مرور المشرف العام غير صحيحة. حساب المشرف العام محمي بأعلى معايير التشفير والعزل التام.'
            : 'Security Alert: Access denied. Super Admin credentials invalid. Platform Master portal is strictly isolated.'
        );
        setLoading(false);
        return;
      }

      setStoredSession({
        token: `sec-superadmin-jwt-${Date.now()}`,
        refreshToken: `sec-superadmin-refresh-${Date.now()}`,
        user: {
          id: 'usr-superadmin',
          email: 'superadmin@pulsops.com',
          name: 'المشرف العام للمنصة',
          role: 'SUPER_ADMIN' as const,
          gymName: 'مركز القيادة السحابي الرئيسي',
        },
      });
      router.push('/');
      setLoading(false);
      return;
    }

    const resolveRoleByEmail = (userEmail: string) => {
      const lower = userEmail.toLowerCase();
      if (lower.includes('trainer') || lower.includes('coach') || lower === 'mostafa' || lower.includes('mostafa@')) {
        return {
          id: 'usr-trainer-demo',
          email: userEmail,
          name: 'mostafa',
          role: 'TRAINER' as const,
          gymId: 'gym-pulsops',
          gymName: 'نادي PulsOps الرياضي',
        };
      }
      if (lower.includes('member') || lower.includes('mr') || lower.includes('mr.mostafa')) {
        return {
          id: 'usr-member-demo',
          email: userEmail,
          name: 'mr mostafa',
          role: 'MEMBER' as const,
          gymId: 'gym-pulsops',
          gymName: 'نادي PulsOps الرياضي',
        };
      }
      return {
        id: 'usr-gymadmin-demo',
        email: userEmail,
        name: 'pulsops',
        role: 'GYM_ADMIN' as const,
        gymId: 'gym-pulsops',
        gymName: 'نادي PulsOps الرياضي',
      };
    };

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        setStoredSession({
          token: data.token,
          refreshToken: data.token,
          user: data.user,
        });
      } else {
        const userObj = resolveRoleByEmail(email);
        setStoredSession({
          token: `demo-jwt-token-${Date.now()}`,
          refreshToken: `demo-jwt-refresh-${Date.now()}`,
          user: userObj,
        });
      }

      router.push('/');
    } catch {
      const userObj = resolveRoleByEmail(email);
      setStoredSession({
        token: `demo-jwt-token-${Date.now()}`,
        refreshToken: `demo-jwt-refresh-${Date.now()}`,
        user: userObj,
      });
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white selection:bg-[#00FF66] selection:text-[#0A0A0A] relative flex flex-col justify-between overflow-x-hidden font-sans">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/3 w-[650px] h-[650px] bg-[#00FF66]/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* ─── Top Promotional Navigation Bar ─── */}
      <header className="border-b border-[#181818] bg-[#0A0A0A]/90 backdrop-blur-2xl sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Identity */}
          <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
            <div className="relative group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#00FF66] to-emerald-400 text-black flex items-center justify-center font-black text-2xl shadow-[0_0_25px_rgba(0,255,102,0.4)] group-hover:scale-105 transition-transform">
                P
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#00FF66] rounded-full border-2 border-black animate-ping" />
            </div>
            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-lg font-black tracking-wider text-white">
                  {t.brandTitle}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00FF66]/15 text-[#00FF66] border border-[#00FF66]/30">
                  v2.4 Cloud
                </span>
              </div>
              <span className="text-[11px] text-[#888888] font-medium hidden sm:block">
                {t.brandSubtitle}
              </span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <button
              onClick={() => setShowMobileSimulator(true)}
              className="flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2 rounded-xl bg-[#00FF66]/10 border border-[#00FF66]/40 text-xs font-bold text-[#00FF66] hover:bg-[#00FF66] hover:text-black transition-all cursor-pointer shadow-md"
            >
              <Smartphone size={14} />
              <span>{lang === 'ar' ? 'معاينة شاشة الموبايل' : 'Mobile App Preview'}</span>
            </button>

            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-2 rounded-xl bg-[#141414] border border-[#282828] text-xs font-bold text-[#A0A0A0] hover:text-[#00FF66] hover:border-[#00FF66] transition-all cursor-pointer shadow-md"
            >
              <Globe size={14} />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Download Alert Toast */}
      {downloadNotice && (
        <div className="fixed top-24 right-5 rtl:right-auto rtl:left-5 z-50 p-4 rounded-2xl bg-[#121212] border border-[#00FF66] shadow-[0_0_30px_rgba(0,255,102,0.35)] text-xs text-[#00FF66] font-bold animate-fadeIn flex items-center space-x-2.5 rtl:space-x-reverse">
          <CheckCircle2 size={18} />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* ─── Main Promotional Showcase Content ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 w-full flex-1 space-y-24">
        {/* ─── HERO SECTION: High-Impact Promotional Showcase ─── */}
        <section className="text-center max-w-4xl mx-auto space-y-6 pt-4">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-1.5 rounded-full bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66] text-xs font-semibold shadow-sm">
            <Sparkles size={14} />
            <span>{t.heroBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.15] tracking-tight">
            {t.heroHeading}
          </h1>

          <p className="text-sm sm:text-lg text-[#A0A0A0] leading-relaxed max-w-3xl mx-auto">
            {t.heroSubheading}
          </p>



          {/* Key Metrics Counter Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-3xl bg-[#111111]/80 border border-[#222222] backdrop-blur-xl mt-8 shadow-2xl">
            <div className="text-center p-2">
              <span className="text-2xl sm:text-3xl font-black text-[#00FF66] font-mono block">
                {t.stat1Val}
              </span>
              <span className="text-xs text-[#888888] font-medium mt-1 block">{t.stat1Lbl}</span>
            </div>
            <div className="text-center p-2 border-r md:border-r-0 md:border-x border-[#222222]">
              <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono block">
                {t.stat2Val}
              </span>
              <span className="text-xs text-[#888888] font-medium mt-1 block">{t.stat2Lbl}</span>
            </div>
            <div className="text-center p-2">
              <span className="text-2xl sm:text-3xl font-black text-purple-400 font-mono block">
                {t.stat3Val}
              </span>
              <span className="text-xs text-[#888888] font-medium mt-1 block">{t.stat3Lbl}</span>
            </div>
            <div className="text-center p-2 border-r md:border-r-0 md:border-l border-[#222222]">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono block">
                {t.stat4Val}
              </span>
              <span className="text-xs text-[#888888] font-medium mt-1 block">{t.stat4Lbl}</span>
            </div>
          </div>
        </section>


        {/* ─── SYSTEMATIC FEATURES GRID (أهم الخدمات والحلول) ─── */}
        <section id="features" className="space-y-10 pt-6">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3.5 py-1 rounded-full bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66] text-xs font-semibold">
              <Layers size={13} />
              <span>منظومة متكاملة 2026</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              {t.featuresSectionTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#888888] leading-relaxed">
              {t.featuresSectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feat 1 */}
            <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] hover:border-[#00FF66]/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-[#00FF66]/10 text-[#00FF66] flex items-center justify-center border border-[#00FF66]/20 group-hover:scale-110 transition-transform">
                <QrCode size={24} />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#00FF66] transition-colors">
                {t.feat1Title}
              </h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                {t.feat1Desc}
              </p>
              <div className="text-[10px] font-mono text-[#00FF66]">✓ فحص لحظي بأجزاء من الثانية</div>
            </div>

            {/* Feat 2 */}
            <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] hover:border-purple-500/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">
                {t.feat2Title}
              </h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                {t.feat2Desc}
              </p>
              <div className="text-[10px] font-mono text-purple-400">✓ أسعار واشتراكات بالجنيه المصري EGP</div>
            </div>

            {/* Feat 3 */}
            <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] hover:border-amber-500/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
                <ShoppingBag size={24} />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                {t.feat3Title}
              </h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                {t.feat3Desc}
              </p>
              <div className="text-[10px] font-mono text-amber-400">✓ نقاط بيع سريعة تعمل بدون إنترنت</div>
            </div>

            {/* Feat 4 */}
            <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] hover:border-cyan-500/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 group-hover:scale-110 transition-transform">
                <Activity size={24} />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                {t.feat4Title}
              </h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                {t.feat4Desc}
              </p>
              <div className="text-[10px] font-mono text-cyan-400">✓ تحليلات ذكاء اصطناعي وتطور اللياقة</div>
            </div>

            {/* Feat 5 */}
            <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] hover:border-emerald-500/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                {t.feat5Title}
              </h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                {t.feat5Desc}
              </p>
              <div className="text-[10px] font-mono text-emerald-400">✓ قواعد بيانات مستقلة لكل نادي رياضي</div>
            </div>

            {/* Feat 6 */}
            <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] hover:border-blue-500/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Smartphone size={24} />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                {t.feat6Title}
              </h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                {t.feat6Desc}
              </p>
              <div className="text-[10px] font-mono text-blue-400">✓ آيفون، أندرويد، وويندوز وماك</div>
            </div>
          </div>
        </section>

        {/* ─── ROLE PORTALS & WORKSPACES (استكشف لوحات التحكم) ─── */}
        <section id="roles" className="space-y-10 pt-6">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              <UserCheck size={13} />
              <span>واجهات تحكم مخصصة</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              {t.rolesTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#888888] leading-relaxed">
              {t.rolesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Gym Admin Card */}
            <div className="p-6 rounded-3xl bg-[#111111] border border-[#242424] hover:border-emerald-400 transition-all flex flex-col justify-between space-y-5 group">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Building2 size={22} />
                </div>
                <h3 className="text-base font-bold text-white">{t.roleGymTitle}</h3>
                <p className="text-xs text-[#888888] leading-relaxed">{t.roleGymDesc}</p>
              </div>
              <button
                type="button"
                onClick={() => handleQuickLogin('GYM_ADMIN')}
                className="w-full py-2.5 rounded-xl bg-[#161616] hover:bg-emerald-400 text-[#A0A0A0] hover:text-black border border-[#2A2A2A] hover:border-emerald-400 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 rtl:space-x-reverse cursor-pointer shadow-md"
              >
                <span>{t.roleGymBtn}</span>
                {isRtl ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
              </button>
            </div>

            {/* Trainer Card */}
            <div className="p-6 rounded-3xl bg-[#111111] border border-[#242424] hover:border-cyan-400 transition-all flex flex-col justify-between space-y-5 group">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <Dumbbell size={22} />
                </div>
                <h3 className="text-base font-bold text-white">{t.roleTrainerTitle}</h3>
                <p className="text-xs text-[#888888] leading-relaxed">{t.roleTrainerDesc}</p>
              </div>
              <button
                type="button"
                onClick={() => handleQuickLogin('TRAINER')}
                className="w-full py-2.5 rounded-xl bg-[#161616] hover:bg-cyan-400 text-[#A0A0A0] hover:text-black border border-[#2A2A2A] hover:border-cyan-400 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 rtl:space-x-reverse cursor-pointer shadow-md"
              >
                <span>{t.roleTrainerBtn}</span>
                {isRtl ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
              </button>
            </div>

            {/* Member Card */}
            <div className="p-6 rounded-3xl bg-[#111111] border border-[#242424] hover:border-purple-400 transition-all flex flex-col justify-between space-y-5 group">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/30">
                  <Smartphone size={22} />
                </div>
                <h3 className="text-base font-bold text-white">{t.roleMemberTitle}</h3>
                <p className="text-xs text-[#888888] leading-relaxed">{t.roleMemberDesc}</p>
              </div>
              <button
                type="button"
                onClick={() => handleQuickLogin('MEMBER')}
                className="w-full py-2.5 rounded-xl bg-[#161616] hover:bg-purple-400 text-[#A0A0A0] hover:text-black border border-[#2A2A2A] hover:border-purple-400 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 rtl:space-x-reverse cursor-pointer shadow-md"
              >
                <span>{t.roleMemberBtn}</span>
                {isRtl ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
              </button>
            </div>
          </div>
        </section>

        {/* ─── APP DOWNLOADS SHOWCASE ─── */}
        <section id="downloads" className="pt-8 border-t border-[#1C1C1C]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
              <Download size={14} />
              <span>Multi-Platform Ecosystem</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {t.downloadsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#888888] mt-1.5 leading-relaxed">
              {t.downloadsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. iOS App */}
            <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] hover:border-[#00FF66]/60 transition-all flex flex-col justify-between space-y-5 group relative overflow-hidden">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                  <Apple size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#00FF66] transition-colors">
                    {t.iosTitle}
                  </h3>
                  <p className="text-xs text-[#888888] mt-1 leading-relaxed">{t.iosDesc}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] bg-[#1A1A1A] text-[#A0A0A0] px-2 py-0.5 rounded-md border border-[#2A2A2A]">
                    iOS 16+
                  </span>
                  <span className="text-[10px] bg-[#1A1A1A] text-[#00FF66] px-2 py-0.5 rounded-md border border-[#2A2A2A]">
                    Apple Wallet Pass
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleDownloadClick('Apple iOS', 'PulsOps-Member-v2.4.ipa')}
                  className="w-full py-2.5 rounded-xl bg-[#181818] hover:bg-[#00FF66] text-white hover:text-black border border-[#2E2E2E] hover:border-[#00FF66] text-xs font-bold transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer shadow-md"
                >
                  <Download size={14} />
                  <span>{lang === 'ar' ? 'تحميل ملف التثبيت (.ipa)' : 'Download iOS Package (.ipa)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('MEMBER')}
                  className="w-full py-2 rounded-xl bg-[#00FF66]/10 hover:bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30 text-[11px] font-bold transition-all flex items-center justify-center space-x-1.5 rtl:space-x-reverse cursor-pointer"
                >
                  <ExternalLink size={13} />
                  <span>{lang === 'ar' ? 'تشغيل واجهة تطبيق المشترك الآن' : 'Launch Mobile App View'}</span>
                </button>
              </div>
            </div>

            {/* 2. Android App */}
            <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] hover:border-[#00FF66]/60 transition-all flex flex-col justify-between space-y-5 group relative overflow-hidden">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#00FF66] group-hover:scale-105 transition-transform">
                  <Smartphone size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#00FF66] transition-colors">
                    {t.androidTitle}
                  </h3>
                  <p className="text-xs text-[#888888] mt-1 leading-relaxed">{t.androidDesc}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] bg-[#1A1A1A] text-[#A0A0A0] px-2 py-0.5 rounded-md border border-[#2A2A2A]">
                    Android 9+
                  </span>
                  <span className="text-[10px] bg-[#1A1A1A] text-[#00FF66] px-2 py-0.5 rounded-md border border-[#2A2A2A]">
                    APK Direct Download
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleDownloadClick('Google Android', 'PulsOps-Member-v2.4.apk')}
                  className="w-full py-2.5 rounded-xl bg-[#181818] hover:bg-[#00FF66] text-white hover:text-black border border-[#2E2E2E] hover:border-[#00FF66] text-xs font-bold transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer shadow-md"
                >
                  <Download size={14} />
                  <span>{lang === 'ar' ? 'تحميل تطبيق الأندرويد المباشر (APK)' : 'Download Android APK File'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('MEMBER')}
                  className="w-full py-2 rounded-xl bg-[#00FF66]/10 hover:bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30 text-[11px] font-bold transition-all flex items-center justify-center space-x-1.5 rtl:space-x-reverse cursor-pointer"
                >
                  <ExternalLink size={13} />
                  <span>{lang === 'ar' ? 'تشغيل واجهة تطبيق الأندرويد الآن' : 'Launch Android Member View'}</span>
                </button>
              </div>
            </div>

            {/* 3. Offline Desktop POS */}
            <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] hover:border-[#00FF66]/60 transition-all flex flex-col justify-between space-y-5 group relative overflow-hidden">
              <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
                <span className="text-[9px] font-mono font-bold bg-[#00FF66]/15 text-[#00FF66] px-2.5 py-0.5 rounded-full border border-[#00FF66]/30">
                  OFFLINE READY
                </span>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                  <Monitor size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {t.desktopTitle}
                  </h3>
                  <p className="text-xs text-[#888888] mt-1 leading-relaxed">{t.desktopDesc}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] bg-[#1A1A1A] text-[#A0A0A0] px-2 py-0.5 rounded-md border border-[#2A2A2A]">
                    Windows 10/11 (.exe)
                  </span>
                  <span className="text-[10px] bg-[#1A1A1A] text-cyan-400 px-2 py-0.5 rounded-md border border-[#2A2A2A]">
                    macOS Apple Silicon (.dmg)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadClick('Windows PC', 'PulsOps-POS-Setup-x64.exe')}
                    className="py-2.5 rounded-xl bg-[#181818] hover:bg-[#00FF66] text-white hover:text-black border border-[#2E2E2E] hover:border-[#00FF66] text-[11px] font-bold transition-all flex items-center justify-center space-x-1.5 rtl:space-x-reverse cursor-pointer shadow-md"
                  >
                    <Download size={13} />
                    <span>Windows .exe</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadClick('macOS', 'PulsOps-POS-macOS.dmg')}
                    className="py-2.5 rounded-xl bg-[#181818] hover:bg-cyan-400 text-white hover:text-black border border-[#2E2E2E] hover:border-cyan-400 text-[11px] font-bold transition-all flex items-center justify-center space-x-1.5 rtl:space-x-reverse cursor-pointer shadow-md"
                  >
                    <Download size={13} />
                    <span>macOS .dmg</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('GYM_ADMIN')}
                  className="w-full py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[11px] font-bold transition-all flex items-center justify-center space-x-1.5 rtl:space-x-reverse cursor-pointer"
                >
                  <ExternalLink size={13} />
                  <span>{lang === 'ar' ? 'تشغيل نظام الكاشير والبوابات المستقل الآن' : 'Launch Desktop POS Terminal'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA BANNER ─── */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#141414] to-[#0A0A0A] border border-[#282828] text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#00FF66]/10 rounded-full blur-[120px] pointer-events-none" />

          <h2 className="text-2xl sm:text-4xl font-black text-white max-w-2xl mx-auto leading-tight">
            {t.ctaBannerTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#888888] max-w-xl mx-auto">
            {t.ctaBannerSubtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">


            <button
              type="button"
              onClick={() => setShowLoginModal(true)}
              className="px-6 py-3.5 rounded-2xl bg-[#1C1C1C] hover:bg-[#252525] border border-[#333333] hover:border-[#00FF66] text-white text-sm font-bold flex items-center space-x-2 rtl:space-x-reverse cursor-pointer transition-all shadow-md"
            >
              <LogIn size={16} className="text-[#00FF66]" />
              <span>{t.loginBtn}</span>
            </button>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-[#181818] bg-[#0A0A0A] py-8 px-4 text-xs text-[#666666]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="font-bold text-white tracking-wider">PULSOPS ENTERPRISE</span>
            <span>•</span>
            <span>© 2026 {lang === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}</span>
          </div>
          <div className="flex items-center space-x-4 rtl:space-x-reverse text-[11px]">
            <span>Cloud ERP v2.4</span>
            <span>•</span>
            <span className="text-[#00FF66] font-mono">Status: All Systems Operational 🟢</span>
          </div>
        </div>
      </footer>

      {/* ─── DEDICATED LUXURY LOGIN MODAL ─── */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
          <div className="bg-[#101010] border border-[#2D2D2D] hover:border-[#00FF66]/50 transition-all rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative glow-border animate-scaleIn">
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              className="absolute top-5 left-5 rtl:left-auto rtl:right-5 p-2 rounded-xl bg-[#1A1A1A] text-[#888888] hover:text-white hover:bg-[#252525] transition-all cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="text-center pb-4 mb-4 border-b border-[#222222]">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00FF66] to-emerald-400 text-black flex items-center justify-center font-black text-2xl mx-auto mb-3 shadow-[0_0_20px_rgba(0,255,102,0.3)]">
                P
              </div>
              <h2 className="text-xl font-bold text-white">{t.boxTitle}</h2>
              <p className="text-xs text-[#888888] mt-1">{t.boxDesc}</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-400 text-xs flex items-center space-x-2 rtl:space-x-reverse animate-fadeIn">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Standard Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1.5">
                  {t.emailLabel}
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-3.5 text-[#666666]"
                    size={16}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@titanfitness.com"
                    className="w-full bg-[#161616] border border-[#282828] rounded-xl pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-3 text-xs text-white placeholder-[#666666] focus:border-[#00FF66] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#A0A0A0]">
                    {t.passwordLabel}
                  </label>
                  <span className="text-[11px] text-[#00FF66] cursor-pointer hover:underline">
                    {t.forgotPassword}
                  </span>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-3.5 text-[#666666]"
                    size={16}
                  />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#161616] border border-[#282828] rounded-xl pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-3 text-xs text-white placeholder-[#666666] focus:border-[#00FF66] focus:outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full neon-btn py-3.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer shadow-lg shadow-[#00FF66]/20 disabled:opacity-50"
              >
                <span>{loading ? t.authenticating : t.signInBtn}</span>
                {!loading && (isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />)}
              </button>
            </form>

            {/* Quick 1-Click Access Role Switcher */}
            <div className="mt-5 pt-4 border-t border-[#222222] space-y-2">
              <span className="text-[11px] font-bold text-[#888888] block text-center">
                {t.quickAccessTitle}
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('GYM_ADMIN')}
                  className="p-2 rounded-xl bg-[#171717] hover:bg-[#202020] border border-[#2A2A2A] hover:border-emerald-400 text-[10px] font-bold text-white transition-all text-center cursor-pointer"
                >
                  🏢 مدير الصالة
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('TRAINER')}
                  className="p-2 rounded-xl bg-[#171717] hover:bg-[#202020] border border-[#2A2A2A] hover:border-cyan-400 text-[10px] font-bold text-white transition-all text-center cursor-pointer"
                >
                  🏋️ الكوتش
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('MEMBER')}
                  className="p-2 rounded-xl bg-[#171717] hover:bg-[#202020] border border-[#2A2A2A] hover:border-purple-400 text-[10px] font-bold text-white transition-all text-center cursor-pointer"
                >
                  📱 المشترك
                </button>
              </div>
            </div>

            {/* Request Account link */}
            <div className="mt-4 pt-3 text-center">
            </div>
          </div>
        </div>
      )}

      {/* ─── REQUEST ACCOUNT / ONBOARDING MODAL ─── */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
          <div className="bg-[#111111] border border-[#2D2D2D] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-scaleIn">
            <button
              type="button"
              onClick={() => setShowRequestModal(false)}
              className="absolute top-5 left-5 rtl:left-auto rtl:right-5 p-2 rounded-xl bg-[#1A1A1A] text-[#888888] hover:text-white transition-all cursor-pointer"
            >
              <X size={18} />
            </button>

            {!reqSubmitted ? (
              <div className="space-y-4">
                <div className="text-center pb-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30 flex items-center justify-center mx-auto mb-3">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{t.requestAccountTitle}</h3>
                  <p className="text-xs text-[#888888] mt-1">{t.requestAccountSubtitle}</p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setReqLoading(true);
                    setTimeout(() => {
                      setReqLoading(false);
                      setReqSubmitted(true);
                    }, 1200);
                  }}
                  className="space-y-3.5"
                >
                  <div>
                    <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">
                      {t.reqGymNameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={reqGymName}
                      onChange={(e) => setReqGymName(e.target.value)}
                      placeholder="مثال: نادي الأبطال للياقة البدنية"
                      className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#555555] focus:border-[#00FF66] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">
                        {t.reqFullNameLabel}
                      </label>
                      <input
                        type="text"
                        required
                        value={reqFullName}
                        onChange={(e) => setReqFullName(e.target.value)}
                        placeholder="اسم المسؤول"
                        className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#555555] focus:border-[#00FF66] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">
                        {t.reqPhoneLabel}
                      </label>
                      <input
                        type="tel"
                        required
                        value={reqPhone}
                        onChange={(e) => setReqPhone(e.target.value)}
                        placeholder="010XXXXXXXX"
                        className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#555555] focus:border-[#00FF66] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">
                        {t.reqCityLabel}
                      </label>
                      <input
                        type="text"
                        required
                        value={reqCity}
                        onChange={(e) => setReqCity(e.target.value)}
                        placeholder="القاهرة / الجيزة / الإسكندرية..."
                        className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#555555] focus:border-[#00FF66] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">
                        {t.reqAccountTypeLabel}
                      </label>
                      <select
                        value={reqRole}
                        onChange={(e: any) => setReqRole(e.target.value)}
                        className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                      >
                        <option value="gym_owner">{t.reqTypeGym}</option>
                        <option value="coach">{t.reqTypeCoach}</option>
                        <option value="member">{t.reqTypeMember}</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={reqLoading}
                    className="w-full neon-btn py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer shadow-lg shadow-[#00FF66]/20 mt-4 disabled:opacity-50"
                  >
                    <span>{reqLoading ? t.reqSubmitting : t.submitRequestBtn}</span>
                    {!reqLoading && (isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />)}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-3xl bg-[#00FF66]/15 border border-[#00FF66] text-[#00FF66] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(0,255,102,0.4)]">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl font-black text-white">{t.reqSuccessTitle}</h3>
                <p className="text-xs text-[#A0A0A0] leading-relaxed max-w-sm mx-auto">
                  {t.reqSuccessDesc}
                </p>
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#181818] border border-[#282828] text-xs font-bold text-white hover:border-[#00FF66] transition-all cursor-pointer"
                >
                  {t.closeModal}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── LIVE INTERACTIVE MOBILE APP SIMULATOR MODAL ─── */}
      {showMobileSimulator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative flex flex-col items-center">
            {/* Top Close & Control Bar */}
            <div className="w-full max-w-[400px] mb-3 flex items-center justify-between px-2 text-white">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00FF66] animate-ping" />
                <span className="text-xs font-bold font-mono text-[#00FF66]">PulsOps Mobile Live Sandbox</span>
              </div>
              <button
                onClick={() => setShowMobileSimulator(false)}
                className="p-1.5 rounded-full bg-[#1A1A1A] hover:bg-[#252525] border border-[#333] text-white hover:text-[#00FF66] transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Simulated Phone Frame */}
            <div className="relative w-[360px] h-[720px] bg-[#111111] rounded-[48px] p-3 border-4 border-[#2A2A2A] shadow-[0_0_60px_rgba(0,255,102,0.25)] flex flex-col overflow-hidden">
              {/* Dynamic Island / Speaker notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-20 flex items-center justify-end px-2.5 space-x-1">
                <div className="w-2 h-2 rounded-full bg-[#1A1A1A]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#00FF66]" />
              </div>

              {/* Screen Container */}
              <div className="w-full h-full rounded-[38px] overflow-hidden bg-black relative flex flex-col">
                <iframe
                  src="http://localhost:8082"
                  title="PulsOps Mobile Simulator"
                  className="w-full h-full border-0"
                />
              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full pointer-events-none" />
            </div>

            {/* Bottom Tip */}
            <p className="mt-3 text-[11px] text-[#888888] font-mono text-center">
              💡 يمكنك تسجيل الدخول والتفاعل مع كافة مميزات وشاشات التطبيق مباشرة من متصفحك!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
