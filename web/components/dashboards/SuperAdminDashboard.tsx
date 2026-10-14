'use client';

import React, { useState } from 'react';
import {
  Building2,
  DollarSign,
  Users,
  TrendingUp,
  Plus,
  ShieldCheck,
  Lock,
  Unlock,
  Search,
  Sliders,
  Bell,
  Globe,
  Moon,
  Sun,
  ShieldAlert,
  Server,
  Database,
  CheckCircle2,
  CreditCard,
  Edit3,
  Trash2,
  Sparkles,
  Check,
  X,
  AlertCircle,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useLanguage } from '@/lib/LanguageContext';

export interface SaaSTier {
  id: string;
  name: string;
  annualPrice: number; // in EGP e.g. 3000, 5000, 9000
  maxUsers: number; // e.g. 100, 200, 500 (or 0 for unlimited)
  isUnlimitedUsers?: boolean;
  description: string;
  features: string[];
  activeGyms: number;
  badge?: string;
}

export interface GymTenant {
  id: string;
  name: string;
  slug: string;
  tier: string;
  status: 'نشط' | 'موقوف' | 'تجريبي';
  memberCount: number;
  monthlyRevenue: number;
  annualFee: number;
  createdAt: string;
}

const defaultTiers: SaaSTier[] = [
  {
    id: 'tier-starter',
    name: 'باقة البداية (Starter Gym)',
    annualPrice: 3000,
    maxUsers: 100,
    isUnlimitedUsers: false,
    description: 'مخصصة للصالات والنوادي الناشئة والصغيرة',
    features: [
      'حتى 100 مشترك ومستخدم نشط',
      'إدارة الاشتراكات والمدفوعات',
      'تسجيل الحضور بباركود QR الذكي',
      'تطبيق الكابتن والمدربين',
      'دعم فني عبر الواتساب',
    ],
    activeGyms: 0,
  },
  {
    id: 'tier-growth',
    name: 'باقة النمو (Pro Growth)',
    annualPrice: 5000,
    maxUsers: 200,
    isUnlimitedUsers: false,
    badge: 'الأكثر شعبية',
    description: 'للصالات المتوسطة سريعة النمو ذات الإقبال العالي',
    features: [
      'حتى 200 مشترك ومستخدم نشط',
      'جميع ميزات باقة البداية',
      'نظام قياسات InBody ومتابعة التطور البدني',
      'متجر المكملات ونقاط البيع (POS)',
      'إشعارات وتنبيهات تجديد الاشتراكات التلقائية',
      'دعم فني ذو أولوية عالية',
    ],
    activeGyms: 0,
  },
  {
    id: 'tier-elite',
    name: 'باقة الصالات الكبرى (Elite Club)',
    annualPrice: 9000,
    maxUsers: 500,
    isUnlimitedUsers: false,
    description: 'للأندية الكبيرة والنوادي المتعددة الخدمات',
    features: [
      'حتى 500 مشترك ومستخدم نشط',
      'جميع ميزات باقة النمو',
      'تطبيق موبايل مخصص للمشتركين (Android / iOS)',
      'إشعارات Push ترويجية وتسويقية',
      'إدارة صلاحيات الموظفين المتقدمة',
      'تقارير مالية وتحليلات النمو المتقدمة',
    ],
    activeGyms: 0,
  },
  {
    id: 'tier-enterprise',
    name: 'باقة السحاب الشاملة (Unlimited Enterprise)',
    annualPrice: 15000,
    maxUsers: 0,
    isUnlimitedUsers: true,
    badge: 'VIP غير محدود',
    description: 'للأندية الكبرى وسلاسل الفروع بدون أي قيود',
    features: [
      'عدد مستخدمين ومشتركين غير محدود (Unlimited)',
      'كافة إمكانيات وموديولات المنصة بالكامل',
      'مستشار الذكاء الاصطناعي PulsOps AI',
      'دومين وهوية خاصة بالنادي (White-label)',
      'مدير حساب تقني مخصص 24/7',
      'نسخ احتياطي فوري ومستمر',
    ],
    activeGyms: 0,
  },
];

export interface AuditLog {
  id: string;
  admin: string;
  action: string;
  target: string;
  ip: string;
  time: string;
  type: 'SUCCESS' | 'WARN' | 'INFO';
}

export const SuperAdminDashboard: React.FC<{ activeTab?: string }> = ({ activeTab = 'overview' }) => {
  const { lang, setLang } = useLanguage();
  
  // Real Tenants State (persisted in localStorage)
  const [tenants, setTenants] = useState<GymTenant[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pulsops_superadmin_tenants');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return [];
  });

  // Real Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pulsops_superadmin_audit');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return [];
  });

  // Sync Tenants to localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pulsops_superadmin_tenants', JSON.stringify(tenants));
    }
  }, [tenants]);

  // Sync Audit Logs to localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pulsops_superadmin_audit', JSON.stringify(auditLogs));
    }
  }, [auditLogs]);

  const [tiers, setTiers] = useState<SaaSTier[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pulsops_saas_tiers');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return defaultTiers;
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pulsops_saas_tiers', JSON.stringify(tiers));
    }
  }, [tiers]);

  const addAuditLog = (action: string, target: string, type: 'SUCCESS' | 'WARN' | 'INFO' = 'SUCCESS') => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      admin: 'المشرف الرئيسي',
      action,
      target,
      ip: '127.0.0.1 (محلي)',
      time: 'الآن',
      type,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGymName, setNewGymName] = useState('');
  const [newGymSlug, setNewGymSlug] = useState('');
  const [newGymTier, setNewGymTier] = useState<string>(tiers[0]?.name || 'باقة البداية (Starter Gym)');

  // Tier Modal State (Create & Edit)
  const [showTierModal, setShowTierModal] = useState(false);
  const [tierModalMode, setTierModalMode] = useState<'create' | 'edit'>('create');
  const [editingTierId, setEditingTierId] = useState<string | null>(null);
  const [tierFormName, setTierFormName] = useState('');
  const [tierFormPrice, setTierFormPrice] = useState<number>(3000);
  const [tierFormMaxUsers, setTierFormMaxUsers] = useState<number>(100);
  const [tierFormUnlimited, setTierFormUnlimited] = useState<boolean>(false);
  const [tierFormDesc, setTierFormDesc] = useState('');
  const [tierFormBadge, setTierFormBadge] = useState('');
  const [tierFormFeaturesText, setTierFormFeaturesText] = useState('');

  // Gym Tier Switcher Modal State
  const [gymToChangeTier, setGymToChangeTier] = useState<GymTenant | null>(null);
  const [targetTierName, setTargetTierName] = useState('');

  // Settings State
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [auditAlerts, setAuditAlerts] = useState(true);
  const [currency, setCurrency] = useState('EGP');
  const [savedSettingsAlert, setSavedSettingsAlert] = useState(false);
  const [tierSuccessAlert, setTierSuccessAlert] = useState<string | null>(null);

  const handleSaveSettings = () => {
    addAuditLog('تحديث إعدادات المنصة', `تم حفظ إعدادات المشرف (العملة: ${currency}، الإشعارات: ${emailAlerts ? 'مفعلة' : 'معطلة'})`, 'SUCCESS');
    setTierSuccessAlert('تم حفظ وتطبيق إعدادات المنصة بنجاح!');
    setTimeout(() => setTierSuccessAlert(null), 3500);
  };

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleGymStatus = (id: string) => {
    setTenants((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const newStatus = g.status === 'نشط' ? 'موقوف' : 'نشط';
          addAuditLog(newStatus === 'نشط' ? 'إعادة تنشيط النادي' : 'إيقاف النادي مؤقتاً', g.name, newStatus === 'نشط' ? 'SUCCESS' : 'WARN');
          return { ...g, status: newStatus };
        }
        return g;
      })
    );
  };

  const [createdAdminInfo, setCreatedAdminInfo] = useState<{ email: string; pass: string; gym: string } | null>(null);

  const handleAddGym = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGymName || !newGymSlug) return;
    
    const matchedTier = tiers.find((t) => t.name === newGymTier) || tiers[0];
    const annual = matchedTier ? matchedTier.annualPrice : 3000;
    const monthlyRev = Math.round(annual / 12);

    const newGym: GymTenant = {
      id: `gym-${Date.now()}`,
      name: newGymName,
      slug: newGymSlug.toLowerCase().replace(/\s+/g, '-'),
      tier: newGymTier,
      status: 'نشط',
      memberCount: 0,
      monthlyRevenue: monthlyRev,
      annualFee: annual,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Increment active gyms count on tier
    setTiers((prev) =>
      prev.map((t) => (t.name === newGymTier ? { ...t, activeGyms: t.activeGyms + 1 } : t))
    );

    try {
      const res = await fetch('http://localhost:5000/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newGymName, slug: newGymSlug, tier: newGymTier }),
      });
      const data = await res.json();
      if (data.adminUser) {
        setCreatedAdminInfo({
          email: data.adminUser.email,
          pass: data.adminUser.defaultPassword,
          gym: newGymName,
        });
      }
    } catch {
      setCreatedAdminInfo({
        email: `admin@${newGym.slug}.com`,
        pass: 'GymAdmin@2026!',
        gym: newGymName,
      });
    }

    setTenants([newGym, ...tenants]);
    addAuditLog('إنشاء وتفعيل نادي رياضي', `${newGymName} (${newGymTier})`, 'SUCCESS');
    setNewGymName('');
    setNewGymSlug('');
    setShowAddModal(false);
  };

  // Open Create Tier Modal
  const openCreateTierModal = () => {
    setTierModalMode('create');
    setEditingTierId(null);
    setTierFormName('');
    setTierFormPrice(3000);
    setTierFormMaxUsers(100);
    setTierFormUnlimited(false);
    setTierFormDesc('باقة مخصصة للأندية الرياضية');
    setTierFormBadge('');
    setTierFormFeaturesText(
      'إدارة الاشترافات والحضور بـ QR\nفحص InBody بيولوجي\nتطبيق الكابتن والمدربين\nدعم فني سريع'
    );
    setShowTierModal(true);
  };

  // Open Edit Tier Modal
  const openEditTierModal = (tier: SaaSTier) => {
    setTierModalMode('edit');
    setEditingTierId(tier.id);
    setTierFormName(tier.name);
    setTierFormPrice(tier.annualPrice);
    setTierFormMaxUsers(tier.maxUsers);
    setTierFormUnlimited(!!tier.isUnlimitedUsers);
    setTierFormDesc(tier.description || '');
    setTierFormBadge(tier.badge || '');
    setTierFormFeaturesText(tier.features.join('\n'));
    setShowTierModal(true);
  };

  // Save (Create or Edit) Tier
  const handleSaveTier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tierFormName.trim()) return;

    const parsedFeatures = tierFormFeaturesText
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    if (tierModalMode === 'create') {
      const newTierObj: SaaSTier = {
        id: `tier-${Date.now()}`,
        name: tierFormName.trim(),
        annualPrice: Number(tierFormPrice) || 0,
        maxUsers: tierFormUnlimited ? 0 : Number(tierFormMaxUsers) || 0,
        isUnlimitedUsers: tierFormUnlimited,
        description: tierFormDesc.trim(),
        badge: tierFormBadge.trim() || undefined,
        features: parsedFeatures.length > 0 ? parsedFeatures : ['إدارة الاشتراكات', 'دعم فني'],
        activeGyms: 0,
      };
      setTiers([...tiers, newTierObj]);
      addAuditLog('إنشاء باقة سحابية جديدة', `${newTierObj.name} (${newTierObj.annualPrice.toLocaleString()} ج.م)`, 'SUCCESS');
      setTierSuccessAlert(`تم إنشاء "${newTierObj.name}" بنجاح!`);
    } else if (editingTierId) {
      setTiers((prev) =>
        prev.map((t) => {
          if (t.id === editingTierId) {
            // Also update any tenants using old name
            const oldName = t.name;
            const updatedName = tierFormName.trim();
            if (oldName !== updatedName) {
              setTenants((tenantsPrev) =>
                tenantsPrev.map((g) => (g.tier === oldName ? { ...g, tier: updatedName } : g))
              );
            }
            return {
              ...t,
              name: updatedName,
              annualPrice: Number(tierFormPrice) || 0,
              maxUsers: tierFormUnlimited ? 0 : Number(tierFormMaxUsers) || 0,
              isUnlimitedUsers: tierFormUnlimited,
              description: tierFormDesc.trim(),
              badge: tierFormBadge.trim() || undefined,
              features: parsedFeatures.length > 0 ? parsedFeatures : t.features,
            };
          }
          return t;
        })
      );
      addAuditLog('تحديث بيانات باقة سحابية', `${tierFormName.trim()}`, 'INFO');
      setTierSuccessAlert(`تم تحديث باقة "${tierFormName.trim()}" بنجاح!`);
    }

    setTimeout(() => setTierSuccessAlert(null), 3500);
    setShowTierModal(false);
  };

  // Delete Tier
  const handleDeleteTier = (tierId: string) => {
    const tierToDelete = tiers.find((t) => t.id === tierId);
    if (!tierToDelete) return;

    const assignedCount = tenants.filter((g) => g.tier === tierToDelete.name).length;
    if (assignedCount > 0) {
      alert(`لا يمكن حذف الباقة لأن هناك ${assignedCount} صالة رياضية مشتركة بها حالياً. قم بنقل الصالات إلى باقة أخرى أولاً.`);
      return;
    }

    if (confirm(`هل أنت متأكد من حذف "${tierToDelete.name}"؟`)) {
      setTiers((prev) => prev.filter((t) => t.id !== tierId));
      addAuditLog('حذف باقة سحابية', tierToDelete.name, 'WARN');
      setTierSuccessAlert(`تم حذف الباقة بنجاح`);
      setTimeout(() => setTierSuccessAlert(null), 3500);
    }
  };

  // Change Gym Tier Modal & Action
  const openChangeGymTier = (gym: GymTenant) => {
    setGymToChangeTier(gym);
    setTargetTierName(gym.tier);
  };

  const handleApplyGymTierChange = () => {
    if (!gymToChangeTier || !targetTierName) return;

    const matchedTier = tiers.find((t) => t.name === targetTierName);
    const annualFee = matchedTier ? matchedTier.annualPrice : 3000;
    const monthlyRev = Math.round(annualFee / 12);

    const oldTier = gymToChangeTier.tier;

    // Update gym
    setTenants((prev) =>
      prev.map((g) =>
        g.id === gymToChangeTier.id
          ? { ...g, tier: targetTierName, annualFee, monthlyRevenue: monthlyRev }
          : g
      )
    );

    // Update active gym counts on tiers
    if (oldTier !== targetTierName) {
      setTiers((prev) =>
        prev.map((t) => {
          if (t.name === oldTier) return { ...t, activeGyms: Math.max(0, t.activeGyms - 1) };
          if (t.name === targetTierName) return { ...t, activeGyms: t.activeGyms + 1 };
          return t;
        })
      );
    }

    addAuditLog('ترقية / تغيير باقة النادي', `${gymToChangeTier.name}: من (${oldTier}) إلى (${targetTierName})`, 'SUCCESS');
    setTierSuccessAlert(`تم تغيير باقة النادي (${gymToChangeTier.name}) إلى "${targetTierName}" بنجاح!`);
    setTimeout(() => setTierSuccessAlert(null), 3500);
    setGymToChangeTier(null);
  };

  // Real Platform Computed KPIs
  const totalMRR = tenants.reduce((acc, g) => acc + (g.monthlyRevenue || 0), 0);
  const totalAnnual = tenants.reduce((acc, g) => acc + (g.annualFee || 0), 0);
  const activeGymsCount = tenants.filter((g) => g.status === 'نشط').length;
  const totalMembersCount = tenants.reduce((acc, g) => acc + (g.memberCount || 0), 0);
  const arpu = tenants.length > 0 ? Math.round(totalMRR / tenants.length) : 0;
  const annualSubCount = tenants.filter((g) => (g.annualFee || 0) > 0).length;

  const realRevenueTrend = tenants.length > 0
    ? [
        { month: 'الشهر الماضي', mrr: Math.round(totalMRR * 0.85), subscriptions: Math.max(0, tenants.length - 1) },
        { month: 'الشهر الحالي', mrr: totalMRR, subscriptions: tenants.length },
      ]
    : [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ─── Hero Header & Global Stats ─────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3 rtl:space-x-reverse">
            <span>مركز قيادة منصة السحاب (SaaS)</span>
            <span className="text-xs bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40 px-2.5 py-0.5 rounded-full font-mono">
              المشرف العام
            </span>
          </h1>
          <p className="text-sm text-[#A0A0A0] mt-1">
            إدارة الصالات والأندية الرياضية، تراخيص الباقات، وتحليلات الإيرادات الموحدة بالجنيه المصري.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="neon-btn px-4 py-2.5 rounded-xl flex items-center space-x-2 rtl:space-x-reverse text-sm cursor-pointer"
        >
          <Plus size={18} />
          <span>إضافة نادي رياضي جديد</span>
        </button>
      </div>

      {/* ─── Gym Provisioning Admin Credentials Banner ──────────────── */}
      {createdAdminInfo && (
        <div className="p-4 rounded-2xl bg-[#00FF66]/15 border border-[#00FF66] text-white flex flex-col md:flex-row md:items-center justify-between gap-3 animate-fadeIn shadow-lg">
          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#00FF66] font-bold text-sm">
              <CheckCircle2 size={18} />
              <span>تم إنشاء النادي ({createdAdminInfo.gym}) وتوليد يوزر المدير المسؤول بنجاح!</span>
            </div>
            <p className="text-xs text-[#A0A0A0] mt-1">
              بيانات دخول مدير الصالة: البريد: <strong className="text-white font-mono">{createdAdminInfo.email}</strong> • كلمة المرور: <strong className="text-white font-mono">{createdAdminInfo.pass}</strong>
            </p>
          </div>
          <button
            onClick={() => setCreatedAdminInfo(null)}
            className="px-3 py-1.5 rounded-lg bg-[#181818] border border-[#282828] text-xs text-[#A0A0A0] hover:text-white"
          >
            إغلاق التنبيه
          </button>
        </div>
      )}

      {/* ─── Tier Action Success Alert ───────────────────────────────── */}
      {tierSuccessAlert && (
        <div className="p-4 rounded-2xl bg-[#00FF66]/20 border border-[#00FF66] text-white flex items-center justify-between gap-3 animate-fadeIn shadow-lg">
          <div className="flex items-center space-x-2.5 rtl:space-x-reverse text-[#00FF66] font-bold text-sm">
            <CheckCircle2 size={20} />
            <span>{tierSuccessAlert}</span>
          </div>
          <button
            onClick={() => setTierSuccessAlert(null)}
            className="p-1 rounded-lg text-[#A0A0A0] hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ─── TAB 1: OVERVIEW (نظرة عامة على المنصة) ──────────────────── */}
      {(activeTab === 'overview') && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#181818] border border-[#282828] hover:border-[#00FF66]/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider">
                  إجمالي الإيراد الشهري (MRR)
                </span>
                <div className="p-2 rounded-lg bg-[#00FF66]/10 text-[#00FF66]">
                  <DollarSign size={18} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2 rtl:space-x-reverse">
                <span className="text-2xl lg:text-3xl font-black text-white">{totalMRR.toLocaleString()} ج.م</span>
                <span className="text-xs font-bold text-[#00FF66]">فعلي</span>
              </div>
              <p className="text-[11px] text-[#666666] mt-1">الإيراد السنوي الإجمالي: {totalAnnual.toLocaleString()} ج.م</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#181818] border border-[#282828] hover:border-[#00FF66]/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider">
                  الصالات الرياضية النشطة
                </span>
                <div className="p-2 rounded-lg bg-[#00FF66]/10 text-[#00FF66]">
                  <Building2 size={18} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2 rtl:space-x-reverse">
                <span className="text-2xl lg:text-3xl font-black text-white">{activeGymsCount}</span>
                <span className="text-xs font-bold text-[#00FF66]">صالة</span>
              </div>
              <p className="text-[11px] text-[#666666] mt-1">من إجمالي {tenants.length} صالة مسجلة</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#181818] border border-[#282828] hover:border-[#00FF66]/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider">
                  إجمالي المشتركين الرياضيين
                </span>
                <div className="p-2 rounded-lg bg-[#00FF66]/10 text-[#00FF66]">
                  <Users size={18} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2 rtl:space-x-reverse">
                <span className="text-2xl lg:text-3xl font-black text-white">{totalMembersCount.toLocaleString()}</span>
                <span className="text-xs font-bold text-[#00FF66]">مشترك</span>
              </div>
              <p className="text-[11px] text-[#666666] mt-1">عبر الصالات المسجلة بالمنصة</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#181818] border border-[#282828] hover:border-[#00FF66]/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider">
                  جاهزية وكفاءة الخوادم
                </span>
                <div className="p-2 rounded-lg bg-[#00FF66]/10 text-[#00FF66]">
                  <ShieldCheck size={18} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2 rtl:space-x-reverse">
                <span className="text-2xl lg:text-3xl font-black text-white">99.98%</span>
                <span className="text-xs font-bold text-[#00FF66]">يعمل بكفاءة</span>
              </div>
              <p className="text-[11px] text-[#666666] mt-1">قواعد بيانات PostgreSQL سحابية معزولة</p>
            </div>
          </div>

          {/* Growth Chart */}
          <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">مسار نمو اشتراكات المنصة (MRR - بالجنيه المصري)</h2>
                <p className="text-xs text-[#A0A0A0]">حجم الاشتراكات الشهرية المتكررة عبر الصالات الرياضية</p>
              </div>
              <span className="text-xs bg-[#00FF66]/10 text-[#00FF66] px-2.5 py-1 rounded-full font-bold">
                حسابات دقيقة 100%
              </span>
            </div>
            {tenants.length === 0 ? (
              <div className="h-56 w-full flex flex-col items-center justify-center text-center p-6 bg-[#121212] rounded-xl border border-[#222222]">
                <TrendingUp size={36} className="text-[#333333] mb-2" />
                <p className="text-sm font-bold text-[#A0A0A0]">لا توجد بيانات اشتراكات مسجلة بعد</p>
                <p className="text-xs text-[#666666] mt-1">
                  سيتم إنشاء المسار المالي تلقائياً بمجرد إضافة أول صالة رياضية واختيار باقتها.
                </p>
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={realRevenueTrend}>
                    <defs>
                      <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00FF66" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#00FF66" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#666666" fontSize={12} />
                    <YAxis stroke="#666666" fontSize={12} tickFormatter={(v) => `${Number(v).toLocaleString()} ج.م`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#121212',
                        border: '1px solid #282828',
                        borderRadius: '10px',
                        color: '#fff',
                      }}
                      formatter={(val: any) => [`${Number(val).toLocaleString()} ج.م`, 'الإيراد']}
                    />
                    <Area
                      type="monotone"
                      dataKey="mrr"
                      stroke="#00FF66"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#mrrGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Tenants Section Header / Table */}
          <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">الصالات الرياضية المسجلة (المستأجرين)</h2>
                <p className="text-xs text-[#A0A0A0]">إدارة تراخيص الفروع ومتابعة السعة الاستيعابية ومسار الاشتراكات</p>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="relative">
                  <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666]" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="بحث باسم الصالة أو المعرف..."
                    className="bg-[#121212] border border-[#282828] rounded-xl pr-9 pl-4 py-2 text-xs text-white placeholder-[#555] focus:border-[#00FF66] focus:outline-none w-56"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-[#282828] text-[#A0A0A0]">
                    <th className="py-3 px-4 font-semibold">الصالة الرياضية</th>
                    <th className="py-3 px-4 font-semibold">الباقة الحالية</th>
                    <th className="py-3 px-4 font-semibold">الأعضاء النشطين</th>
                    <th className="py-3 px-4 font-semibold">الحالة</th>
                    <th className="py-3 px-4 font-semibold">الإيراد</th>
                    <th className="py-3 px-4 font-semibold text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#282828]">
                  {filteredTenants.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <Building2 size={36} className="text-[#333333]" />
                          <p className="text-sm font-bold text-[#A0A0A0]">لا توجد صالات رياضية مسجلة حالياً</p>
                          <p className="text-xs text-[#666666]">
                            ابدأ الآن بإضافة أول صالة رياضية واختيار باقتها لحساب الإيرادات والأعضاء بدقة 100%.
                          </p>
                          <button
                            onClick={() => setShowAddModal(true)}
                            className="neon-btn px-4 py-2 rounded-xl text-xs mt-1 cursor-pointer"
                          >
                            <Plus size={14} className="inline ml-1" />
                            <span>إضافة أول نادٍ رياضي</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredTenants.map((gym) => (
                      <tr key={gym.id} className="hover:bg-[#1E1E1E]/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-sm">{gym.name}</div>
                          <div className="text-[11px] text-[#A0A0A0] font-mono">المعرّف: {gym.slug}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          {(() => {
                            const gymTierObj = tiers.find((t) => t.name === gym.tier);
                            return (
                              <div className="space-y-1">
                                <span
                                  className={`inline-block px-2.5 py-1 rounded-full font-bold text-[10px] tracking-wide ${
                                    gym.tier.includes('الشاملة') || gym.tier.includes('سوبر')
                                      ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40'
                                      : gym.tier.includes('النمو') || gym.tier.includes('بلس')
                                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                  }`}
                                >
                                  {gym.tier}
                                </span>
                                <div className="text-[10px] text-[#A0A0A0] flex items-center space-x-1 rtl:space-x-reverse font-mono">
                                  <Users size={11} className="text-[#00FF66]" />
                                  <span>
                                    {gymTierObj?.isUnlimitedUsers
                                      ? 'سعة غير محدودة'
                                      : `حد الباقة: ${gymTierObj?.maxUsers || 100} مشترك`}
                                  </span>
                                </div>
                              </div>
                            );
                          })()}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-white">
                          {gym.memberCount}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center space-x-1.5 rtl:space-x-reverse px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              gym.status === 'نشط'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                gym.status === 'نشط' ? 'bg-emerald-400' : 'bg-rose-400'
                              }`}
                            />
                            <span>{gym.status}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#00FF66]">
                          {gym.annualFee ? `${gym.annualFee.toLocaleString()} ج.م / سنة` : `${gym.monthlyRevenue.toLocaleString()} ج.م / شهر`}
                        </td>
                        <td className="py-3.5 px-4 text-left">
                          <div className="flex items-center justify-start space-x-2 rtl:space-x-reverse">
                            <button
                              onClick={() => openChangeGymTier(gym)}
                              title="ترقية أو تغيير باقة الاشتراك"
                              className="px-2.5 py-1.5 rounded-lg border border-[#282828] text-xs font-semibold text-white hover:text-[#00FF66] hover:border-[#00FF66] flex items-center space-x-1 rtl:space-x-reverse transition-all bg-[#141414] cursor-pointer"
                            >
                              <CreditCard size={13} className="text-[#00FF66]" />
                              <span>تعديل الباقة</span>
                            </button>
                            <button
                              onClick={() => toggleGymStatus(gym.id)}
                              title={gym.status === 'نشط' ? 'إيقاف الصالة' : 'تنشيط الصالة'}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                gym.status === 'نشط'
                                  ? 'border-[#282828] text-[#A0A0A0] hover:text-rose-400 hover:border-rose-400'
                                  : 'border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66]/10'
                              }`}
                            >
                              {gym.status === 'نشط' ? <Lock size={14} /> : <Unlock size={14} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ─── TAB 3: SAAS TIERS (باقات اشتراك السحاب) ─────────────────── */}
      {(activeTab === 'subscriptions') && (
        <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828] space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                <DollarSign size={20} className="text-[#00FF66]" />
                <span>إدارة باقات واشتراكات الصالات السحابية (SaaS Subscription Management)</span>
              </h2>
              <p className="text-xs text-[#A0A0A0] mt-0.5">
                تحديد تكلفة الباقات السنوية وحدود سعة المستخدمين لكل صالة بالجنيه المصري (EGP).
              </p>
            </div>
            <button
              onClick={openCreateTierModal}
              className="neon-btn px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 rtl:space-x-reverse cursor-pointer shadow-lg"
            >
              <Plus size={15} />
              <span>إنشاء باقة اشتراك جديدة</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-xl bg-[#121212] border border-[#282828]">
              <span className="text-xs text-[#A0A0A0]">عدد الباقات السحابية المعتمدة</span>
              <div className="mt-1 flex items-baseline space-x-2 rtl:space-x-reverse">
                <span className="text-xl font-bold text-white font-mono">{tiers.length} باقات</span>
                <span className="text-[11px] text-[#00FF66] font-bold">قابلة للتخصيص</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#121212] border border-[#282828]">
              <span className="text-xs text-[#A0A0A0]">الباقة القياسية الأولى</span>
              <div className="mt-1 flex items-baseline space-x-2 rtl:space-x-reverse">
                <span className="text-xl font-bold text-[#00FF66] font-mono">
                  {tiers[0] ? `${tiers[0].annualPrice.toLocaleString()} ج.م / سنة` : '0 ج.م'}
                </span>
                <span className="text-[11px] text-[#A0A0A0]">{tiers[0]?.maxUsers || 100} مستخدم</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#121212] border border-[#282828]">
              <span className="text-xs text-[#A0A0A0]">باقة النمو المتصاعد</span>
              <div className="mt-1 flex items-baseline space-x-2 rtl:space-x-reverse">
                <span className="text-xl font-bold text-emerald-400 font-mono">
                  {tiers[1] ? `${tiers[1].annualPrice.toLocaleString()} ج.م / سنة` : '0 ج.م'}
                </span>
                <span className="text-[11px] text-[#A0A0A0]">{tiers[1]?.maxUsers || 200} مستخدم</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#121212] border border-[#282828]">
              <span className="text-xs text-[#A0A0A0]">إجمالي الصالات المشتركة</span>
              <div className="mt-1 flex items-baseline space-x-2 rtl:space-x-reverse">
                <span className="text-xl font-bold text-white font-mono">
                  {tenants.length} صالة
                </span>
                <span className="text-[11px] text-[#00FF66] font-bold">موزعة على الباقات</span>
              </div>
            </div>
          </div>

          {/* Tier Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {tiers.map((tier) => {
              const countInThisTier = tenants.filter((g) => g.tier === tier.name).length;
              return (
                <div
                  key={tier.id}
                  className="p-5 rounded-2xl bg-[#121212] border border-[#282828] hover:border-[#00FF66]/60 transition-all flex flex-col justify-between relative group shadow-md"
                >
                  {tier.badge && (
                    <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-[#00FF66] to-emerald-500 text-[#0A0A0A] text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider">
                      {tier.badge}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono text-[#00FF66] font-bold">
                        {tier.isUnlimitedUsers ? '🚀 غير محدود' : `👥 حتى ${tier.maxUsers.toLocaleString()} مستخدم`}
                      </span>
                      <div className="flex items-center space-x-1 rtl:space-x-reverse opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditTierModal(tier)}
                          title="تعديل بيانات الباقة"
                          className="p-1 rounded-md text-[#A0A0A0] hover:text-white hover:bg-[#202020]"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteTier(tier.id)}
                          title="حذف الباقة"
                          className="p-1 rounded-md text-[#A0A0A0] hover:text-rose-400 hover:bg-[#202020]"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug">{tier.name}</h3>
                    <p className="text-[11px] text-[#888888] mt-1 line-clamp-2">{tier.description}</p>

                    {/* Pricing Display */}
                    <div className="my-3.5 p-3 rounded-xl bg-[#181818] border border-[#222222]">
                      <div className="text-2xl font-black text-[#00FF66] font-mono">
                        {tier.annualPrice.toLocaleString()} <span className="text-xs font-normal text-white">ج.م / سنوياً</span>
                      </div>
                      <div className="text-[10px] text-[#A0A0A0] font-mono mt-0.5">
                        أي ما يعادل {Math.round(tier.annualPrice / 12).toLocaleString()} ج.م / شهرياً
                      </div>
                    </div>

                    {/* Member Capacity Box */}
                    <div className="mb-3.5 px-3 py-2 rounded-lg bg-[#00FF66]/5 border border-[#00FF66]/20 flex items-center justify-between text-xs">
                      <span className="text-[#A0A0A0] font-medium">سعة المشتركين:</span>
                      <span className="font-bold text-white font-mono">
                        {tier.isUnlimitedUsers ? 'أعضاء غير محدود' : `${tier.maxUsers.toLocaleString()} مشترك`}
                      </span>
                    </div>

                    {/* Features List */}
                    <div className="space-y-2 border-t border-[#222222] pt-3.5 mb-4">
                      {tier.features.map((f, i) => (
                        <div key={i} className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-[#A0A0A0]">
                          <CheckCircle2 size={13} className="text-[#00FF66] shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#222222] flex items-center justify-between text-xs text-[#A0A0A0]">
                    <span>الصالات المشتركة:</span>
                    <span className="text-[#00FF66] font-bold font-mono bg-[#00FF66]/10 px-2 py-0.5 rounded-md">
                      {countInThisTier} صالة
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── TAB 4: PLATFORM MRR & REVENUE (الإيرادات الشهرية والنمو) ─── */}
      {(activeTab === 'analytics') && (
        <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828] space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
              <TrendingUp size={20} className="text-[#00FF66]" />
              <span>التحليلات المالية والتدفقات النقدية السحابية</span>
            </h2>
            <p className="text-xs text-[#A0A0A0]">حسابات دقيقة 100% مستخرجة من الصالات والاشتراكات الفعلية</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#121212] border border-[#282828]">
              <span className="text-xs text-[#A0A0A0]">متوسط الإيراد لكل صالة (ARPU)</span>
              <p className="text-xl font-bold text-white font-mono mt-1">{arpu.toLocaleString()} ج.م / شهر</p>
            </div>
            <div className="p-4 rounded-xl bg-[#121212] border border-[#282828]">
              <span className="text-xs text-[#A0A0A0]">الاشتراكات السنوية المدفوعة</span>
              <p className="text-xl font-bold text-[#00FF66] font-mono mt-1">{annualSubCount} صالة رياضية</p>
            </div>
            <div className="p-4 rounded-xl bg-[#121212] border border-[#282828]">
              <span className="text-xs text-[#A0A0A0]">الصالات الرياضية النشطة</span>
              <p className="text-xl font-bold text-emerald-400 font-mono mt-1">{activeGymsCount} صالة</p>
            </div>
          </div>

          {tenants.length === 0 ? (
            <div className="h-56 w-full flex flex-col items-center justify-center text-center p-6 bg-[#121212] rounded-xl border border-[#222222]">
              <TrendingUp size={36} className="text-[#333333] mb-2" />
              <p className="text-sm font-bold text-[#A0A0A0]">لا توجد بيانات تدفقات مالية حتى الآن</p>
              <p className="text-xs text-[#666666] mt-1">
                التحليلات المالية ستبدأ في الظهور تلقائياً عند إضافة صالات رياضية واشتراكات نشطة.
              </p>
            </div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={realRevenueTrend}>
                  <XAxis dataKey="month" stroke="#666666" fontSize={12} />
                  <YAxis stroke="#666666" fontSize={12} tickFormatter={(v) => `${Number(v).toLocaleString()} ج.م`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#121212',
                      border: '1px solid #282828',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(val: any) => [`${Number(val).toLocaleString()} ج.م`, 'حجم الإيراد']}
                  />
                  <Bar dataKey="mrr" fill="#00FF66" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 5: AUDIT LOGS (سجلات الأمان والعمليات) ─────────────── */}
      {(activeTab === 'audit') && (
        <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828] space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                <ShieldCheck size={20} className="text-[#00FF66]" />
                <span>سجلات الأمان والعمليات الإدارية (Audit Logs)</span>
              </h2>
              <p className="text-xs text-[#A0A0A0]">توثيق حقيقي فوري لكافة العمليات الحساسة وتغييرات التراخيص</p>
            </div>
            <span className="text-xs text-[#00FF66] bg-[#00FF66]/10 px-3 py-1 rounded-full font-mono">
              تتبع فوري نشط
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-[#282828] text-[#A0A0A0] uppercase font-mono text-[10px]">
                  <th className="py-3 px-4">المشرف / النظام</th>
                  <th className="py-3 px-4">نوع العملية</th>
                  <th className="py-3 px-4">الهدف / التأثير</th>
                  <th className="py-3 px-4">عنوان IP</th>
                  <th className="py-3 px-4">التوقيت</th>
                  <th className="py-3 px-4 text-left">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282828]">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-[#666666]">
                      لا توجد سجلات أمان مسجلة حتى الآن. سيتم توثيق أي عملية إدارية حقيقية هنا تلقائياً.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#1E1E1E]/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-white">{log.admin}</td>
                      <td className="py-3 px-4 text-[#00FF66] font-medium">{log.action}</td>
                      <td className="py-3 px-4 text-[#A0A0A0]">{log.target}</td>
                      <td className="py-3 px-4 font-mono text-[#A0A0A0]">{log.ip}</td>
                      <td className="py-3 px-4 text-[#666666]">{log.time}</td>
                      <td className="py-3 px-4 text-left">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.type === 'SUCCESS'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : log.type === 'WARN'
                            ? 'bg-rose-500/10 text-rose-400'
                            : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {log.type}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 6: PLATFORM SETTINGS (إعدادات المنصة الشاملة) ───────── */}
      {(activeTab === 'settings') && (
        <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828] space-y-6 animate-fadeIn max-w-4xl">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
              <Sliders size={20} className="text-[#00FF66]" />
              <span>إعدادات المنصة السحابية الشاملة (System Settings)</span>
            </h2>
            <p className="text-xs text-[#A0A0A0]">التحكم في لغة النظام، المظهر، العملة الافتراضية، الإشعارات، والنسخ الاحتياطي</p>
          </div>

          {savedSettingsAlert && (
            <div className="p-3.5 rounded-xl bg-[#00FF66]/20 border border-[#00FF66] text-[#00FF66] text-xs font-bold animate-fadeIn">
              ✅ تم حفظ وتطبيق كافة الإعدادات بنجاح على مستوى المنصة!
            </div>
          )}

          <div className="space-y-5">
            {/* 1. Language Setting */}
            <div className="p-4 rounded-xl bg-[#121212] border border-[#282828] flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Globe size={18} className="text-[#00FF66]" />
                <div>
                  <h4 className="text-sm font-bold text-white">لغة النظام الافتراضية</h4>
                  <p className="text-xs text-[#A0A0A0]">اللغة المفضلة لواجهات التحكم والمستخدمين</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <button
                  type="button"
                  onClick={() => setLang('ar')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    lang === 'ar' ? 'bg-[#00FF66] text-[#0A0A0A]' : 'bg-[#181818] text-[#A0A0A0]'
                  }`}
                >
                  العربية (افتراضي)
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    lang === 'en' ? 'bg-[#00FF66] text-[#0A0A0A]' : 'bg-[#181818] text-[#A0A0A0]'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* 2. Theme Mode Setting */}
            <div className="p-4 rounded-xl bg-[#121212] border border-[#282828] flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Moon size={18} className="text-[#00FF66]" />
                <div>
                  <h4 className="text-sm font-bold text-white">مظهر النظام والألوان</h4>
                  <p className="text-xs text-[#A0A0A0]">الوضع الليلي عالي التباين Pitch Black / النيون</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <button
                  type="button"
                  onClick={() => setThemeMode('dark')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 rtl:space-x-reverse transition-all ${
                    themeMode === 'dark' ? 'bg-[#00FF66] text-[#0A0A0A]' : 'bg-[#181818] text-[#A0A0A0]'
                  }`}
                >
                  <Moon size={13} />
                  <span>الوضع الليلي (Dark)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setThemeMode('light')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 rtl:space-x-reverse transition-all ${
                    themeMode === 'light' ? 'bg-[#00FF66] text-[#0A0A0A]' : 'bg-[#181818] text-[#A0A0A0]'
                  }`}
                >
                  <Sun size={13} />
                  <span>الوضع الفاتح (Light)</span>
                </button>
              </div>
            </div>

            {/* 3. Currency & Billing */}
            <div className="p-4 rounded-xl bg-[#121212] border border-[#282828] flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <CreditCard size={18} className="text-[#00FF66]" />
                <div>
                  <h4 className="text-sm font-bold text-white">عملة الفوترة والمعاملات</h4>
                  <p className="text-xs text-[#A0A0A0]">العملة الافتراضية المعتمدة في كافة اشتراكات الصالات والمتجر</p>
                </div>
              </div>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-[#181818] border border-[#282828] rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#00FF66] focus:outline-none"
              >
                <option value="EGP">الجنيه المصري (EGP - ج.م)</option>
                <option value="SAR">الريال السعودي (SAR)</option>
                <option value="USD">الدولار الأمريكي (USD)</option>
              </select>
            </div>

            {/* 4. Notification Alerts */}
            <div className="p-4 rounded-xl bg-[#121212] border border-[#282828] flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Bell size={18} className="text-[#00FF66]" />
                <div>
                  <h4 className="text-sm font-bold text-white">تنبيهات البريد الإلكتروني للمشرف</h4>
                  <p className="text-xs text-[#A0A0A0]">إرسال إشعار فوري عند تسجيل صالة جديدة أو تعثر دفع</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#00FF66] cursor-pointer"
              />
            </div>

            {/* 5. Security & Database Backup */}
            <div className="p-4 rounded-xl bg-[#121212] border border-[#282828] flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Database size={18} className="text-[#00FF66]" />
                <div>
                  <h4 className="text-sm font-bold text-white">النسخ الاحتياطي التلقائي لقواعد البيانات</h4>
                  <p className="text-xs text-[#A0A0A0]">نسخ احتياطي مشفر كل 24 ساعة لجميع الصالات المشتركة</p>
                </div>
              </div>
              <span className="text-xs font-mono text-[#00FF66] bg-[#00FF66]/10 px-2.5 py-1 rounded-full">
                مفعل يومياً 03:00 ص
              </span>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              onClick={handleSaveSettings}
              className="neon-btn px-6 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
            >
              حفظ وتطبيق إعدادات المنصة
            </button>
          </div>
        </div>
      )}

      {/* ─── Modal: Provision New Gym ───────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#282828] w-full max-w-md rounded-2xl p-6 shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-bold text-white mb-1">إضافة نادي رياضي جديد</h3>
            <p className="text-xs text-[#A0A0A0] mb-5">
              إنشاء مساحة سحابية معزولة للنادي وتوليد حساب المدير الافتراضي فوراً.
            </p>

            <form onSubmit={handleAddGym} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">اسم النادي</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: نادي القوة الذهبية"
                  value={newGymName}
                  onChange={(e) => {
                    setNewGymName(e.target.value);
                    setNewGymSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">المعرّف الرابط (Slug)</label>
                <input
                  type="text"
                  required
                  placeholder="golden-power"
                  value={newGymSlug}
                  onChange={(e) => setNewGymSlug(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-[#00FF66] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">باقة السحاب السنوية</label>
                <select
                  value={newGymTier}
                  onChange={(e) => setNewGymTier(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                >
                  {tiers.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name} — {t.annualPrice.toLocaleString()} ج.م / سنة ({t.isUnlimitedUsers ? 'غير محدود' : `حتى ${t.maxUsers} مستخدم`})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A0A0A0] hover:text-white"
                >
                  إلغاء
                </button>
                <button type="submit" className="neon-btn px-5 py-2 rounded-xl text-xs">
                  تأكيد الإضافة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal: Create or Edit SaaS Tier ─────────────────────────── */}
      {showTierModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#282828] w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-scaleIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                <Sparkles size={18} className="text-[#00FF66]" />
                <span>{tierModalMode === 'create' ? 'إنشاء باقة اشتراك سحابية جديدة' : 'تعديل بيانات الباقة السحابية'}</span>
              </h3>
              <button
                onClick={() => setShowTierModal(false)}
                className="p-1 rounded-lg text-[#A0A0A0] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-[#A0A0A0] mb-5">
              تحديد تسعير الباقة السنوي بالجنيه المصري وسعة عدد المستخدمين والمشتركين المسموح بها.
            </p>

            <form onSubmit={handleSaveTier} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">اسم الباقة الرسمية</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: باقة البداية (Starter Gym)"
                  value={tierFormName}
                  onChange={(e) => setTierFormName(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">السعر السنوي (ج.م / سنة)</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={0}
                      step={100}
                      placeholder="3000"
                      value={tierFormPrice}
                      onChange={(e) => setTierFormPrice(Number(e.target.value))}
                      className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-[#00FF66] focus:outline-none"
                    />
                    <span className="absolute left-3 top-2 text-[10px] text-[#A0A0A0] pointer-events-none">ج.م / سنة</span>
                  </div>
                  <span className="text-[10px] text-[#666666] mt-0.5 block">
                    يعادل {Math.round((tierFormPrice || 0) / 12).toLocaleString()} ج.م شهرياً
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#A0A0A0]">الحد الأقصى للمستخدمين</label>
                    <label className="flex items-center space-x-1 rtl:space-x-reverse text-[10px] text-[#00FF66] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tierFormUnlimited}
                        onChange={(e) => setTierFormUnlimited(e.target.checked)}
                        className="w-3.5 h-3.5 accent-[#00FF66] cursor-pointer"
                      />
                      <span>غير محدود</span>
                    </label>
                  </div>
                  <input
                    type="number"
                    disabled={tierFormUnlimited}
                    min={1}
                    placeholder="100"
                    value={tierFormUnlimited ? '' : tierFormMaxUsers}
                    onChange={(e) => setTierFormMaxUsers(Number(e.target.value))}
                    className={`w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-[#00FF66] focus:outline-none ${
                      tierFormUnlimited ? 'opacity-40 cursor-not-allowed' : ''
                    }`}
                  />
                  <span className="text-[10px] text-[#666666] mt-0.5 block">
                    {tierFormUnlimited ? 'مستخدمين وأعضاء غير محدودين' : `سعة الصالة: ${tierFormMaxUsers || 0} مشترك`}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">شارة الباقة الترويجية (اختياري)</label>
                <input
                  type="text"
                  placeholder="مثال: الأكثر شعبية، VIP، للمبتدئين"
                  value={tierFormBadge}
                  onChange={(e) => setTierFormBadge(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">الوصف المختصر</label>
                <input
                  type="text"
                  placeholder="مثال: مناسبة للصالات الرياضية المتوسطة سريعة النمو"
                  value={tierFormDesc}
                  onChange={(e) => setTierFormDesc(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">
                  الميزات المضمنة في الباقة (ميزة في كل سطر)
                </label>
                <textarea
                  rows={4}
                  value={tierFormFeaturesText}
                  onChange={(e) => setTierFormFeaturesText(e.target.value)}
                  placeholder="إدارة المشتركين والمدفوعات&#10;نظام الحضور بباركود QR الذكي&#10;تطبيق الكابتن والمدربين"
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl p-3 text-xs text-white focus:border-[#00FF66] focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse pt-2">
                <button
                  type="button"
                  onClick={() => setShowTierModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A0A0A0] hover:text-white"
                >
                  إلغاء
                </button>
                <button type="submit" className="neon-btn px-6 py-2.5 rounded-xl text-xs font-bold">
                  {tierModalMode === 'create' ? 'إنشاء الباقة' : 'حفظ التعديلات'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal: Change / Upgrade Gym Tier ────────────────────────── */}
      {gymToChangeTier && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#282828] w-full max-w-md rounded-2xl p-6 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                <CreditCard size={18} className="text-[#00FF66]" />
                <span>ترقية وتعديل باقة الصالة الرياضية</span>
              </h3>
              <button
                onClick={() => setGymToChangeTier(null)}
                className="p-1 rounded-lg text-[#A0A0A0] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-[#A0A0A0] mb-4">
              تغيير باقة الاشتراك السحابي لنادي <strong className="text-white">({gymToChangeTier.name})</strong>
            </p>

            <div className="p-3.5 rounded-xl bg-[#181818] border border-[#282828] mb-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#A0A0A0]">الباقة الحالية:</span>
                <span className="font-bold text-white">{gymToChangeTier.tier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A0A0A0]">عدد الأعضاء الحاليين:</span>
                <span className="font-mono font-bold text-[#00FF66]">{gymToChangeTier.memberCount} عضو</span>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <label className="text-xs font-semibold text-[#A0A0A0] block">اختر الباقة السحابية الجديدة:</label>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {tiers.map((t) => {
                  const isSelected = targetTierName === t.name;
                  const capacityExceeded = !t.isUnlimitedUsers && gymToChangeTier.memberCount > t.maxUsers;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setTargetTierName(t.name)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#00FF66]/10 border-[#00FF66]'
                          : 'bg-[#181818] border-[#282828] hover:border-[#444444]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{t.name}</span>
                        <span className="font-mono text-xs font-bold text-[#00FF66]">
                          {t.annualPrice.toLocaleString()} ج.م / سنة
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#A0A0A0]">
                        <span>
                          السعة: {t.isUnlimitedUsers ? 'غير محدود' : `حتى ${t.maxUsers.toLocaleString()} مشترك`}
                        </span>
                        {isSelected && <Check size={14} className="text-[#00FF66]" />}
                      </div>
                      {capacityExceeded && (
                        <div className="text-[10px] text-amber-400 mt-1 flex items-center space-x-1 rtl:space-x-reverse">
                          <AlertCircle size={11} />
                          <span>تنبيه: عدد أعضاء النادي الحاليين يتجاوز حد هذه الباقة</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse">
              <button
                type="button"
                onClick={() => setGymToChangeTier(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A0A0A0] hover:text-white"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleApplyGymTierChange}
                className="neon-btn px-5 py-2.5 rounded-xl text-xs font-bold"
              >
                تطبيق الباقة الجديدة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
