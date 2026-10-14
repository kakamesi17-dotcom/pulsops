'use client';

import React, { useState } from 'react';
import {
  Users,
  DollarSign,
  Activity,
  QrCode,
  Bell,
  ShoppingBag,
  Send,
  Search,
  Clock,
  Percent,
  Dumbbell,
  Calendar,
  Shield,
  Bot,
  Plus,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Tag,
  ImageIcon,
  Megaphone,
  Trash2,
  Edit,
  Filter,
  UserCheck,
  ClipboardList,
  Package,
  Phone,
  MapPin,
  Truck,
  AlertTriangle,
  Lock,
  X,
  Check,
  Camera,
  Smartphone,
  Scan,
  RefreshCw,
  KeyRound,
  Wifi,
  User,
  Monitor,
  Settings,
} from 'lucide-react';
import QRCode from 'qrcode';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { DesktopPOSKiosk } from './DesktopPOSKiosk';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  status: 'نشط' | 'منتهي' | 'معلق';
  trainer: string;
  lastCheckIn: string;
}

const mockMembers: Member[] = [
  {
    id: 'MEM-101',
    name: 'mr mostafa',
    email: 'mr.mostafa@pulsops.com',
    phone: '01023456789',
    plan: 'الباقة الذهبية السنوية VIP',
    status: 'نشط',
    trainer: 'mostafa',
    lastCheckIn: 'اليوم، 04:15 ص (بوابة المرور الذكية)',
  },
];

const mockStaff: any[] = [
  {
    id: 'STF-01',
    name: 'pulsops',
    role: 'مدير الصالة والتشغيل العام',
    phone: '01000000001',
    status: 'على رأس العمل',
    shift: 'الوردية الصباحية / إدارة عامة',
  },
  {
    id: 'STF-02',
    name: 'mostafa',
    role: 'كوتش معتمد / مدرب رئيسي',
    phone: '01000000002',
    status: 'في الصالة مع المتدربين',
    shift: 'تدريب شخصي VIP وبناء أجسام',
  },
];

export interface GymPlan {
  id: string;
  name: string;
  price: string;
  rawPrice: number;
  duration: string;
  perks: string;
  services: string[];
  color?: string;
  isPopular?: boolean;
}

const mockPlans: GymPlan[] = [
  {
    id: 'pl-1',
    name: 'الباقة الذهبية السنوية VIP',
    price: '4,500 ج.م / سنة',
    rawPrice: 4500,
    duration: 'سنة كاملة',
    perks: 'دخول مفتوح 24/7 لكافة المرافق مع أولوية حجز الكوتشينج الخاص',
    services: ['دخول مفتوح 24/7', 'ساونا وجاكوزي وبخار', '12 جلسة تدريب شخصي PT', 'فحص InBody شهري مجاناً', 'خزانة VIP خاصة', 'دعوة صديق مجانية شهرياً'],
    color: '#00FF66',
    isPopular: true,
  },
  {
    id: 'pl-2',
    name: 'الباقة الفضية ربع سنوية',
    price: '1,500 ج.م / 3 أشهر',
    rawPrice: 1500,
    duration: '3 أشهر',
    perks: 'دخول شامل لصالة الحديد وأجهزة الكارديو مع متابعة دورية للقياسات',
    services: ['دخول صالة الحديد والكارديو', 'ساونا وجاكوزي (مرتين أسبوعياً)', '3 جلسات تدريب شخصي PT', 'فحص InBody كل شهر ونصف'],
    color: '#38BDF8',
    isPopular: false,
  },
  {
    id: 'pl-3',
    name: 'الباقة الشهرية الأساسية',
    price: '600 ج.م / شهر',
    rawPrice: 600,
    duration: 'شهر واحد',
    perks: 'اشتراك شهري مرن للوصول لكافة أجهزة الصالة الأساسية',
    services: ['دخول الصالة الرئيسية والكارديو', 'خزانة ملابس عادية', 'فحص InBody افتتاحي عند التسجيل'],
    color: '#A855F7',
    isPopular: false,
  },
];

const inBodyData = [
  { date: '1 يونيو', weight: 88.5, bodyFat: 23.4, muscleMass: 38.1 },
  { date: '1 يوليو', weight: 86.2, bodyFat: 21.0, muscleMass: 39.0 },
  { date: '1 أغسطس', weight: 84.0, bodyFat: 18.8, muscleMass: 39.8 },
  { date: '1 سبتمبر', weight: 82.5, bodyFat: 16.5, muscleMass: 40.5 },
  { date: '1 أكتوبر', weight: 81.0, bodyFat: 14.8, muscleMass: 41.2 },
];

const attendanceHourly = [
  { hour: '06:00', checkIns: 24 },
  { hour: '08:00', checkIns: 48 },
  { hour: '10:00', checkIns: 18 },
  { hour: '12:00', checkIns: 22 },
  { hour: '14:00', checkIns: 15 },
  { hour: '16:00', checkIns: 52 },
  { hour: '18:00', checkIns: 95 },
  { hour: '20:00', checkIns: 110 },
  { hour: '22:00', checkIns: 65 },
];

interface StoreProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
}

interface StoreBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  badge: string;
  ctaText: string;
  active: boolean;
}

const mockProducts: StoreProduct[] = [];

const initialBanners: StoreBanner[] = [
  {
    id: 'ban-1',
    title: 'خصم 25% على مكملات البروتين والكرياتين',
    subtitle: 'عرض حصري لأعضاء نادي PulsOps الرياضي لفترة محدودة بمناسبة انطلاق الموسم التدريبي',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80',
    badge: 'عرض خاص للأعضاء',
    ctaText: 'تسوق الآن',
    active: true,
  },
];

const mockWorkoutsLibrary = [
  {
    id: 'w-1',
    title: 'تمارين الصدر والترايسبس (Push Day)',
    level: 'متقدم',
    duration: '60 دقيقة',
    exercisesCount: 5,
    focus: 'تضخيم عضلي',
    exercises: [
      { id: 'ex-1', name: 'بنش برس بالبار مستوي (Flat Barbell Bench Press)', sets: 4, reps: '8-10', rest: 90, targetMuscle: 'الصدر الأوسط' },
      { id: 'ex-2', name: 'تجميع دمبل على بنش مائل (Incline DB Fly)', sets: 3, reps: '10-12', rest: 75, targetMuscle: 'الصدر العلوي' },
      { id: 'ex-3', name: 'ضغط أكتاف بالدمبل جالساً (Seated DB Shoulder Press)', sets: 4, reps: '8-10', rest: 75, targetMuscle: 'الأكتاف الأمامية' },
      { id: 'ex-4', name: 'رفرفة جانبي بالكابل (Cable Lateral Raises)', sets: 4, reps: '12-15', rest: 60, targetMuscle: 'الأكتاف الجانبية' },
      { id: 'ex-5', name: 'سكول كراشر بالبار المتعرج (Skull Crushers)', sets: 3, reps: '10-12', rest: 60, targetMuscle: 'الترايسبس' },
    ],
  },
  {
    id: 'w-2',
    title: 'تمارين الظهر والبايسبس (Pull Day)',
    level: 'متوسط',
    duration: '55 دقيقة',
    exercisesCount: 5,
    focus: 'قوة وكثافة',
    exercises: [
      { id: 'ex-21', name: 'ديدلفت بالبار التقليدي (Conventional Deadlift)', sets: 4, reps: '5-6', rest: 120, targetMuscle: 'السلسلة الخلفية والظهر' },
      { id: 'ex-22', name: 'سحب أرضي بالكيبل قبضة ضيقة (Cable Seated Row)', sets: 4, reps: '8-10', rest: 75, targetMuscle: 'عضلات الظهر الأوسط' },
      { id: 'ex-23', name: 'سحب ظهر عالي واسع (Lat Pulldown Wide Grip)', sets: 4, reps: '10-12', rest: 75, targetMuscle: 'عضلات اللاتس' },
      { id: 'ex-24', name: 'تبادل دمبل بايسبس مائل (Incline DB Biceps Curl)', sets: 3, reps: '10-12', rest: 60, targetMuscle: 'البايسبس' },
      { id: 'ex-25', name: 'همر كيرل بالحبل على الكابل (Rope Hammer Curls)', sets: 3, reps: '12-15', rest: 60, targetMuscle: 'عضلة البراكيلس والساعد' },
    ],
  },
  {
    id: 'w-3',
    title: 'تمارين الأرجل والسمانة (Leg Day)',
    level: 'متقدم',
    duration: '70 دقيقة',
    exercisesCount: 5,
    focus: 'بناء عضلي شديد',
    exercises: [
      { id: 'ex-31', name: 'سكوات بالبار الخلفي (Barbell Back Squat)', sets: 4, reps: '6-8', rest: 120, targetMuscle: 'عضلات الفخذ الأمامية' },
      { id: 'ex-32', name: 'دفع رجل على الجهاز 45 درجة (Leg Press)', sets: 4, reps: '10-12', rest: 90, targetMuscle: 'الفخذين بالكامل' },
      { id: 'ex-33', name: 'مرجحة أرجل خلفية نائم (Lying Leg Curls)', sets: 4, reps: '10-12', rest: 75, targetMuscle: 'الفخذ الخلفي' },
      { id: 'ex-34', name: 'مد أرجل أمامي بالجهاز (Leg Extension)', sets: 3, reps: '12-15', rest: 60, targetMuscle: 'رؤوس الفخذ الأمامي' },
      { id: 'ex-35', name: 'رفع سمانة واقفا بالبار (Standing Calf Raises)', sets: 4, reps: '15-20', rest: 45, targetMuscle: 'عضلات السمانة' },
    ],
  },
  {
    id: 'w-4',
    title: 'تمارين الكارديو وحرق الدهون (HIIT Cardio)',
    level: 'لجميع المستويات',
    duration: '35 دقيقة',
    exercisesCount: 4,
    focus: 'لياقة وتنشيف',
    exercises: [
      { id: 'ex-41', name: 'سبرنتات على السير الكهربائي (Treadmill Sprint Intervals)', sets: 8, reps: '30ث ركض / 30ث مشي', rest: 30, targetMuscle: 'اللياقة القلبية الوعائية' },
      { id: 'ex-42', name: 'تجديف على جهاز الروينج (Rowing Machine Intervals)', sets: 5, reps: '500 متر بأقصى سرعة', rest: 60, targetMuscle: 'تحمل الجسم الكامل' },
      { id: 'ex-43', name: 'ضرب حبال المقاومة الثقيلة (Battle Ropes Slams)', sets: 4, reps: '45 ثانية متواصلة', rest: 45, targetMuscle: 'الأكتاف وحرق الدهون' },
      { id: 'ex-44', name: 'بلانك مع رفع الركبتين (Plank Knee Tucks)', sets: 3, reps: '20 تكرار', rest: 45, targetMuscle: 'عضلات الكور والبطن' },
    ],
  },
];

const mockNutritionPlans = [
  { id: 'n-1', name: 'نظام التضخيم النظيف (Clean Bulk)', calories: '3,000 سعرة', protein: '220g', carbs: '350g', fats: '75g', target: 'زيادة وزن عضلي بدون دهون' },
  { id: 'n-2', name: 'نظام التنشيف وخسارة الدهون (Cutting Diet)', calories: '2,100 سعرة', protein: '200g', carbs: '180g', fats: '55g', target: 'حرق الدهون وإبراز العضلات' },
  { id: 'n-3', name: 'نظام اللياقة والمحافظة (Maintenance)', calories: '2,500 سعرة', protein: '180g', carbs: '260g', fats: '65g', target: 'ثبات الوزن ورفع الطاقة' },
];

export const GymAdminDashboard: React.FC<{ activeTab?: string }> = ({ activeTab = 'overview' }) => {
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [qrCodeStatus, setQrCodeStatus] = useState<string | null>(null);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [orderCompleted, setOrderCompleted] = useState(false);

  // Store Orders Management State
  const [storeOrders, setStoreOrders] = useState<any[]>([]);

  const fetchStoreOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/gyms/gym-titan/store/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.orders && data.orders.length) {
          setStoreOrders(data.orders);
        }
      }
    } catch {}
  };

  React.useEffect(() => {
    fetchStoreOrders();
    const interval = setInterval(fetchStoreOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setStoreOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    try {
      await fetch(`http://localhost:5000/api/gyms/gym-titan/store/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {}
  };

  // Plans List State, Editing & Custom Services Management
  const [plansList, setPlansList] = useState<GymPlan[]>(mockPlans);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<GymPlan | null>(null);
  const [planFormName, setPlanFormName] = useState('');
  const [planFormPrice, setPlanFormPrice] = useState('');
  const [planFormDuration, setPlanFormDuration] = useState('شهر واحد');
  const [planFormPerks, setPlanFormPerks] = useState('');
  const [planFormServices, setPlanFormServices] = useState<string[]>([]);
  const [newServiceInput, setNewServiceInput] = useState('');
  const [planCreatedAlert, setPlanCreatedAlert] = useState<string | null>(null);

  // Delete Plan Protection State
  const [planToDelete, setPlanToDelete] = useState<GymPlan | null>(null);
  const [planDeleteBlockedReason, setPlanDeleteBlockedReason] = useState<string | null>(null);

  // Members Management & Editing State
  const [selectedPlanFilter, setSelectedPlanFilter] = useState('ALL');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editMemName, setEditMemName] = useState('');
  const [editMemPhone, setEditMemPhone] = useState('');
  const [editMemPlan, setEditMemPlan] = useState('');
  const [editMemTrainer, setEditMemTrainer] = useState('');
  const [editMemStatus, setEditMemStatus] = useState<'نشط' | 'منتهي' | 'معلق'>('نشط');
  const [memberUpdatedAlert, setMemberUpdatedAlert] = useState(false);

  // New Member Modal State
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemName, setNewMemName] = useState('');
  const [newMemPhone, setNewMemPhone] = useState('');
  const [newMemPlan, setNewMemPlan] = useState(mockPlans[0]?.name || 'الباقة الذهبية السنوية VIP');
  const [newMemTrainer, setNewMemTrainer] = useState('mostafa');

  // Staff List State & Modal
  const [staffList, setStaffList] = useState(mockStaff);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('كوتش معتمد / مدرب لياقة');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffSalary, setNewStaffSalary] = useState('10,000');
  const [staffCreatedAlert, setStaffCreatedAlert] = useState(false);

  // Store Management State
  const [products, setProducts] = useState<StoreProduct[]>(mockProducts);
  const [banners, setBanners] = useState<StoreBanner[]>(initialBanners);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('بروتين');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('20');
  const [newProdImage, setNewProdImage] = useState('');
  const [productAddedAlert, setProductAddedAlert] = useState(false);

  // Promotional Banner State
  const [showAddBannerModal, setShowAddBannerModal] = useState(false);
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerImage, setNewBannerImage] = useState('');
  const [newBannerBadge, setNewBannerBadge] = useState('عرض خاص للأعضاء');
  const [newBannerCta, setNewBannerCta] = useState('تسوق الآن');
  const [bannerAddedAlert, setBannerAddedAlert] = useState(false);

  // AI Chat Assistant State inside GymAdmin
  const [aiQuery, setAiQuery] = useState('');
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Workout assignment alert
  const [workoutAssignedAlert, setWorkoutAssignedAlert] = useState<string | null>(null);

  const handleAssignWorkoutToMember = async (workout: typeof mockWorkoutsLibrary[0], targetMemberName: string = 'mr mostafa') => {
    const payload = {
      title: workout.title,
      subtitle: `تم اعتماد الروتين بواسطة إدارة نادي PulsOps الرياضي للمتدرب ${targetMemberName}`,
      dayNumber: `روتين معتمد: ${workout.focus}`,
      prescribedBy: 'إدارة نادي PulsOps الرياضي',
      exercises: workout.exercises,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('pulsops_member_daily_workout', JSON.stringify(payload));
      window.dispatchEvent(new Event('pulsops_workout_updated'));
    }

    try {
      await fetch('http://localhost:5000/api/gyms/gym-titan/members/usr-member/daily-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {}

    setWorkoutAssignedAlert(`تم إسناد روتين "${workout.title}" بنجاح للمتدرب (${targetMemberName}) وتحديث تطبيقه فوراً!`);
    setTimeout(() => setWorkoutAssignedAlert(null), 4000);
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.includes(searchTerm) ||
      m.phone.includes(searchTerm) ||
      m.plan.includes(searchTerm);
    const matchesPlan =
      selectedPlanFilter === 'ALL' || m.plan === selectedPlanFilter;
    return matchesSearch && matchesPlan;
  });

  // ─── Attendance System State (نظام الحضور والبوابات الذكية) ───────────
  interface AttendanceRecord {
    id: string;
    memberId: string;
    memberName: string;
    gate: string;
    deviceType: 'MOBILE_QR' | 'DESKTOP_SCAN' | 'TURNSTILE_STATION' | 'MANUAL_OVERRIDE';
    plan?: string;
    status: 'نشط' | 'منتهي' | 'معلق';
    timestamp: string;
  }

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: 'att-init-1',
      memberId: 'MEM-101',
      memberName: 'mr mostafa',
      gate: 'بوابة المرور الإلكترونية الذكية 1 (Turnstile A)',
      deviceType: 'MOBILE_QR',
      plan: 'الباقة الذهبية السنوية VIP',
      status: 'نشط',
      timestamp: 'اليوم، 04:15 ص',
    },
  ]);

  interface AttendancePoint {
    id: string;
    name: string;
    pointType: 'STAFF_DESK' | 'ELECTRONIC_GATE' | 'DESKTOP_KIOSK';
    supervisorName?: string;
    locationDesc?: string;
    status: 'ONLINE' | 'OFFLINE';
    countToday: number;
    ip?: string;
    mode: string;
  }

  const [activeGates, setActiveGates] = useState<AttendancePoint[]>([
    {
      id: 'point-1',
      name: 'كاونتر الاستقبال (موظف الاستقبال: أحمد كمال)',
      pointType: 'STAFF_DESK',
      supervisorName: 'أحمد كمال (موظف استقبال)',
      locationDesc: 'المدخل الرئيسي - الطابق الأرضي',
      status: 'ONLINE',
      countToday: 0,
      mode: 'تسجيل يدوي وبصري بواسطة الموظف',
    },
    {
      id: 'point-2',
      name: 'بوابة المرور الإلكترونية الذكية 1 (Turnstile A)',
      pointType: 'ELECTRONIC_GATE',
      locationDesc: 'بوابة الدخول الذاتي رقم 1',
      status: 'ONLINE',
      countToday: 0,
      ip: '192.168.1.101',
      mode: 'دخول تلقائي بالـ QR',
    },
  ]);

  // Modal State for Adding/Editing Attendance Point (بوابة أو موظف استقبال)
  const [showAddPointModal, setShowAddPointModal] = useState(false);
  const [editingPoint, setEditingPoint] = useState<AttendancePoint | null>(null);
  const [pointFormName, setPointFormName] = useState('');
  const [pointFormType, setPointFormType] = useState<'STAFF_DESK' | 'ELECTRONIC_GATE' | 'DESKTOP_KIOSK'>('STAFF_DESK');
  const [pointFormSupervisor, setPointFormSupervisor] = useState('');
  const [pointFormLocation, setPointFormLocation] = useState('');
  const [pointFormMode, setPointFormMode] = useState('تسجيل حضور عبر الموظف');
  const [pointFormIp, setPointFormIp] = useState('');
  const [pointAlert, setPointAlert] = useState<string | null>(null);

  const openCreatePointModal = () => {
    setEditingPoint(null);
    setPointFormName('');
    setPointFormType('STAFF_DESK');
    setPointFormSupervisor('');
    setPointFormLocation('الاستقبال الرئيسي');
    setPointFormMode('تسجيل حضور بواسطة الموظف');
    setPointFormIp('');
    setShowAddPointModal(true);
  };

  const openEditPointModal = (pt: AttendancePoint) => {
    setEditingPoint(pt);
    setPointFormName(pt.name);
    setPointFormType(pt.pointType);
    setPointFormSupervisor(pt.supervisorName || '');
    setPointFormLocation(pt.locationDesc || '');
    setPointFormMode(pt.mode);
    setPointFormIp(pt.ip || '');
    setShowAddPointModal(true);
  };

  const handleSaveAttendancePoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pointFormName.trim()) return;

    if (editingPoint) {
      setActiveGates((prev) =>
        prev.map((pt) =>
          pt.id === editingPoint.id
            ? {
                ...pt,
                name: pointFormName.trim(),
                pointType: pointFormType,
                supervisorName: pointFormType === 'STAFF_DESK' ? pointFormSupervisor.trim() : undefined,
                locationDesc: pointFormLocation.trim(),
                mode: pointFormMode.trim(),
                ip: pointFormType !== 'STAFF_DESK' ? pointFormIp.trim() : undefined,
              }
            : pt
        )
      );
      setPointAlert(`تم تحديث بيانات نقطة الحضور "${pointFormName}" بنجاح! ✅`);
    } else {
      const newPt: AttendancePoint = {
        id: `point-${Date.now()}`,
        name: pointFormName.trim(),
        pointType: pointFormType,
        supervisorName: pointFormType === 'STAFF_DESK' ? pointFormSupervisor.trim() : undefined,
        locationDesc: pointFormLocation.trim(),
        status: 'ONLINE',
        countToday: 0,
        mode: pointFormMode.trim(),
        ip: pointFormType !== 'STAFF_DESK' ? pointFormIp.trim() : undefined,
      };
      setActiveGates((prev) => [...prev, newPt]);
      setPointAlert(`تمت إضافة نقطة الحضور الجديدة "${pointFormName}" وتفعيلها بنجاح! ✅`);
    }

    setTimeout(() => setPointAlert(null), 3500);
    setShowAddPointModal(false);
    setEditingPoint(null);
  };

  const handleDeleteAttendancePoint = (id: string, name: string) => {
    setActiveGates((prev) => prev.filter((pt) => pt.id !== id));
    setPointAlert(`تم حذف نقطة الحضور (${name}) بنجاح.`);
    setTimeout(() => setPointAlert(null), 3000);
  };

  // Modals for Attendance System
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanMode, setScanMode] = useState<'AUTO_CAMERA' | 'MANUAL_SELECT' | 'STATION_EMULATOR'>('AUTO_CAMERA');
  const [selectedScanGate, setSelectedScanGate] = useState('كاونتر الاستقبال (موظف الاستقبال: أحمد كمال)');
  const [selectedScanMemberId, setSelectedScanMemberId] = useState(members[0]?.id || 'mem-1');
  const [lastCheckinResult, setLastCheckinResult] = useState<{
    success: boolean;
    memberName: string;
    gate: string;
    deviceType: string;
    plan?: string;
    status: string;
    message: string;
  } | null>(null);

  // Member QR Pass Modal State
  const [showMemberQrModal, setShowMemberQrModal] = useState(false);
  const [qrModalMember, setQrModalMember] = useState<Member | null>(null);
  const [qrModalCodeUrl, setQrModalCodeUrl] = useState<string>('');
  const [qrFilterGate, setQrFilterGate] = useState('ALL');

  // Generate QR for a Member
  const openMemberQrPass = async (member: Member) => {
    setQrModalMember(member);
    setShowMemberQrModal(true);
    try {
      const payload = JSON.stringify({
        memberId: member.id,
        name: member.name,
        phone: member.phone,
        plan: member.plan,
        status: member.status,
        issuedBy: 'PulsOps Smart Gate System',
        validUntil: member.status === 'نشط' ? '2027-12-31' : 'منتهي',
      });
      const url = await QRCode.toDataURL(payload, {
        width: 320,
        margin: 2,
        color: {
          dark: '#00FF66',
          light: '#0A0A0A',
        },
        errorCorrectionLevel: 'H',
      });
      setQrModalCodeUrl(url);
    } catch {
      setQrModalCodeUrl('');
    }
  };

  // Perform Gate Check-in
  const executeGateCheckin = async (
    targetMember: Member,
    gateName: string,
    device: 'MOBILE_QR' | 'DESKTOP_SCAN' | 'TURNSTILE_STATION' | 'MANUAL_OVERRIDE'
  ) => {
    const isExpired = targetMember.status === 'منتهي';
    const checkinRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      memberId: targetMember.id,
      memberName: targetMember.name,
      gate: gateName,
      deviceType: device,
      plan: targetMember.plan,
      status: targetMember.status,
      timestamp: new Date().toISOString(),
    };

    if (isExpired) {
      setLastCheckinResult({
        success: false,
        memberName: targetMember.name,
        gate: gateName,
        deviceType: device,
        plan: targetMember.plan,
        status: targetMember.status,
        message: `⛔ تم رفض فتح البوابة! اشتراك العضو (${targetMember.name}) منتهي الصلاحية. يرجى تجديد الاشتراك في الريسبشن.`,
      });
      return;
    }

    // Call Mock Server API if reachable
    try {
      await fetch('http://localhost:5000/api/gyms/gym-titan/attendance/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: targetMember.id,
          memberName: targetMember.name,
          gate: gateName,
          deviceType: device,
        }),
      });
    } catch {}

    // Add to attendance log
    setAttendanceRecords((prev) => [checkinRecord, ...prev]);

    // Update member's lastCheckIn in local state
    setMembers((prev) =>
      prev.map((m) =>
        m.id === targetMember.id
          ? { ...m, lastCheckIn: 'الآن (حضور مؤكد بالـ QR)' }
          : m
      )
    );

    // Increment gate counter
    setActiveGates((prev) =>
      prev.map((g) => (g.name === gateName ? { ...g, countToday: g.countToday + 1 } : g))
    );

    const devLabel =
      device === 'MOBILE_QR'
        ? 'مسح كود QR من هاتف المتدرب'
        : device === 'DESKTOP_SCAN'
        ? 'جهاز قارئ الباركود في الاستقبال'
        : 'بوابة إلكترونية ذكية (Turnstile Station)';

    setLastCheckinResult({
      success: true,
      memberName: targetMember.name,
      gate: gateName,
      deviceType: devLabel,
      plan: targetMember.plan,
      status: targetMember.status,
      message: `✅ تم فتح ${gateName} بنجاح! تم تسجيل حضور المتدرب (${targetMember.name}).`,
    });

    setQrCodeStatus(`تم تسجيل حضور ${targetMember.name} عبر ${gateName} بنجاح ✅`);
    setTimeout(() => setQrCodeStatus(null), 4000);
  };

  const simulateQrScan = async () => {
    const activeMember = members.find((m) => m.status === 'نشط') || members[0];
    if (activeMember) {
      await executeGateCheckin(activeMember, 'البوابة الرئيسية 1 (Turnstile A)', 'MOBILE_QR');
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastBody) return;
    try {
      await fetch('http://localhost:5000/api/gyms/gym-titan/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: broadcastTitle, body: broadcastBody }),
      });
    } catch {}
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastTitle('');
      setBroadcastBody('');
    }, 3000);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemName || !newMemPhone) return;
    const newM: Member = {
      id: `mem-${Date.now()}`,
      name: newMemName,
      email: `${newMemPhone.replace(/\D/g, '')}@gym.com`,
      phone: newMemPhone,
      plan: newMemPlan,
      status: 'نشط',
      trainer: newMemTrainer || 'الكوتش أليكس',
      lastCheckIn: 'مسجل حديثاً',
    };
    try {
      await fetch('http://localhost:5000/api/gyms/gym-titan/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newMemName, phone: newMemPhone, plan: newMemPlan }),
      });
    } catch {}
    setMembers([newM, ...members]);
    setNewMemName('');
    setNewMemPhone('');
    setShowAddMemberModal(false);
    openMemberQrPass(newM);
  };

  const openEditMemberModal = (m: Member) => {
    setEditingMember(m);
    setEditMemName(m.name);
    setEditMemPhone(m.phone);
    setEditMemPlan(m.plan);
    setEditMemTrainer(m.trainer);
    setEditMemStatus(m.status);
  };

  const handleSaveMemberEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    setMembers((prev) =>
      prev.map((m) =>
        m.id === editingMember.id
          ? {
              ...m,
              name: editMemName,
              phone: editMemPhone,
              plan: editMemPlan,
              trainer: editMemTrainer,
              status: editMemStatus,
            }
          : m
      )
    );
    setEditingMember(null);
    setMemberUpdatedAlert(true);
    setTimeout(() => setMemberUpdatedAlert(false), 3000);
  };

  const openCreatePlanModal = () => {
    setEditingPlan(null);
    setPlanFormName('');
    setPlanFormPrice('');
    setPlanFormDuration('شهر واحد');
    setPlanFormPerks('');
    setPlanFormServices(['دخول صالة الحديد والكارديو', 'ساونا وجاكوزي', 'فحص InBody دوري']);
    setNewServiceInput('');
    setShowAddPlanModal(true);
  };

  const openEditPlanModal = (plan: GymPlan) => {
    setEditingPlan(plan);
    setPlanFormName(plan.name);
    setPlanFormPrice(plan.rawPrice ? String(plan.rawPrice) : plan.price.replace(/[^\d]/g, ''));
    setPlanFormDuration(plan.duration);
    setPlanFormPerks(plan.perks);
    setPlanFormServices(plan.services ? [...plan.services] : ['دخول صالة الحديد والكارديو']);
    setNewServiceInput('');
    setShowAddPlanModal(true);
  };

  const handleAddServiceTag = () => {
    if (!newServiceInput.trim()) return;
    if (!planFormServices.includes(newServiceInput.trim())) {
      setPlanFormServices([...planFormServices, newServiceInput.trim()]);
    }
    setNewServiceInput('');
  };

  const handleRemoveServiceTag = (srv: string) => {
    setPlanFormServices(planFormServices.filter((s) => s !== srv));
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planFormName.trim() || !planFormPrice) return;

    const priceNum = Number(planFormPrice) || 1000;
    const formattedPrice = `${priceNum.toLocaleString()} ج.م / ${planFormDuration}`;

    if (editingPlan) {
      // Update existing plan
      const oldPlanName = editingPlan.name;
      const updatedPlan: GymPlan = {
        ...editingPlan,
        name: planFormName.trim(),
        price: formattedPrice,
        rawPrice: priceNum,
        duration: planFormDuration,
        perks: planFormPerks.trim() || 'دخول صالة الحديد والكارديو مع فحص قياسات دوري',
        services: planFormServices.length > 0 ? planFormServices : ['دخول صالة الحديد والكارديو'],
      };

      setPlansList((prev) => prev.map((p) => (p.id === editingPlan.id ? updatedPlan : p)));

      // If plan name changed, update members linked to it
      if (oldPlanName !== planFormName.trim()) {
        setMembers((prev) =>
          prev.map((m) => (m.plan === oldPlanName ? { ...m, plan: planFormName.trim() } : m))
        );
      }

      setPlanCreatedAlert(`✅ تم تحديث وتعديل بيانات باقة "${planFormName}" بنجاح!`);
    } else {
      // Create new plan
      const newPlan: GymPlan = {
        id: `pl-${Date.now().toString().slice(-5)}`,
        name: planFormName.trim(),
        price: formattedPrice,
        rawPrice: priceNum,
        duration: planFormDuration,
        perks: planFormPerks.trim() || 'دخول صالة الحديد والكارديو مع فحص قياسات دوري',
        services: planFormServices.length > 0 ? planFormServices : ['دخول صالة الحديد والكارديو'],
        color: '#00FF66',
        isPopular: false,
      };

      setPlansList((prev) => [...prev, newPlan]);
      setPlanCreatedAlert(`✅ تم إنشاء باقة "${planFormName}" بنجاح وإتاحتها للاشتراك!`);
    }

    setShowAddPlanModal(false);
    setEditingPlan(null);
    setTimeout(() => setPlanCreatedAlert(null), 3500);
  };

  const handleInitiateDeletePlan = (plan: GymPlan) => {
    const subscribedCount = members.filter((m) => m.plan === plan.name).length;
    if (subscribedCount > 0) {
      setPlanDeleteBlockedReason(
        `لا يمكن حذف باقة "${plan.name}" لأن هناك (${subscribedCount}) مشتركين نشطين مسجلين عليها حالياً. يجب نقل المشتركين لباقة أخرى أولاً لحماية بيانات العضويات!`
      );
      setPlanToDelete(null);
    } else {
      setPlanDeleteBlockedReason(null);
      setPlanToDelete(plan);
    }
  };

  const handleConfirmDeletePlan = () => {
    if (!planToDelete) return;
    setPlansList((prev) => prev.filter((p) => p.id !== planToDelete.id));
    setPlanCreatedAlert(`🗑️ تم حذف باقة "${planToDelete.name}" بنجاح.`);
    setPlanToDelete(null);
    setTimeout(() => setPlanCreatedAlert(null), 3500);
  };

  const handleAiConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: aiQuery }),
      });
      const data = await res.json();
      setAiReply(data.reply);
    } catch {
      setAiReply(
        `[تحليل Gemini AI الذكي لإدارة الصالة]: استناداً إلى أداء الشهر الحالي، ساعات الذروة تسجل أعلى كثافة بين 6-8 مساءً. يُنصح بتوزيع حصص الكوتش سارة على فترات ما بعد الظهيرة لتقليل الازدحام بنسبة 18% ورفع رضا المشتركين.`
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const addToCart = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = products.find((item) => item.id === id);
    return sum + (p ? p.price * qty : 0);
  }, 0);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;
    const newP: StoreProduct = {
      id: `p-${Date.now()}`,
      name: newProdName,
      category: newProdCategory,
      price: parseFloat(newProdPrice) || 0,
      stock: parseInt(newProdStock, 10) || 0,
      image: newProdImage || 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400&auto=format&fit=crop&q=80',
    };
    try {
      await fetch('http://localhost:5000/api/gyms/gym-titan/store/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newP),
      });
    } catch {}
    setProducts([newP, ...products]);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdStock('20');
    setNewProdImage('');
    setShowAddProductModal(false);
    setProductAddedAlert(true);
    setTimeout(() => setProductAddedAlert(false), 3500);
  };

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle) return;
    const newB: StoreBanner = {
      id: `ban-${Date.now()}`,
      title: newBannerTitle,
      subtitle: newBannerSubtitle,
      imageUrl: newBannerImage || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80',
      badge: newBannerBadge,
      ctaText: newBannerCta,
      active: true,
    };
    try {
      await fetch('http://localhost:5000/api/gyms/gym-titan/store/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newB),
      });
    } catch {}
    setBanners([newB, ...banners]);
    setNewBannerTitle('');
    setNewBannerSubtitle('');
    setNewBannerImage('');
    setShowAddBannerModal(false);
    setBannerAddedAlert(true);
    setTimeout(() => setBannerAddedAlert(false), 3500);
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName) return;
    const newSt = {
      id: `st-${Date.now()}`,
      name: newStaffName,
      role: newStaffRole,
      clients: 0,
      salary: `${newStaffSalary} ج.م / شهر`,
      status: 'متاح',
    };
    try {
      await fetch('http://localhost:5000/api/gyms/gym-titan/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStaffName,
          role: newStaffRole,
          email: newStaffEmail || `coach.${Date.now()}@titanfitness.com`,
          phone: newStaffPhone,
          salary: newStaffSalary,
        }),
      });
    } catch {}
    setStaffList([newSt, ...staffList]);
    setNewStaffName('');
    setNewStaffEmail('');
    setNewStaffPhone('');
    setShowAddStaffModal(false);
    setStaffCreatedAlert(true);
    setTimeout(() => setStaffCreatedAlert(false), 3500);
  };

  const handleProcessCheckout = async () => {
    try {
      await fetch('http://localhost:5000/api/gyms/gym-titan/store/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, totalAmount: cartTotal, memberName: 'mr mostafa' }),
      });
    } catch {}
    setOrderCompleted(true);
    setCart({});
    setTimeout(() => setOrderCompleted(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ─── Gym Header ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3 rtl:space-x-reverse">
            <span>إدارة وتشغيل نادي PulsOps الرياضي</span>
            <span className="text-xs bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40 px-2.5 py-0.5 rounded-full font-mono">
              مدير الصالة (pulsops)
            </span>
          </h1>
          <p className="text-sm text-[#A0A0A0] mt-1">
            إدارة أرضية الصالة في الوقت الفعلي، بوابات الحضور الإلكترونية، متجر المكملات، واشتراكات الأعضاء بالجنيه المصري.
          </p>
        </div>

        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <button
            onClick={simulateQrScan}
            className="neon-btn px-4 py-2.5 rounded-xl flex items-center space-x-2 rtl:space-x-reverse text-sm cursor-pointer"
          >
            <QrCode size={18} />
            <span>محاكاة مسح QR للبوابة الإلكترونية</span>
          </button>
        </div>
      </div>

      {qrCodeStatus && (
        <div className="p-3.5 rounded-xl bg-[#00FF66]/15 border border-[#00FF66] text-[#00FF66] text-xs font-bold flex items-center justify-between animate-fadeIn">
          <span>{qrCodeStatus}</span>
          <button onClick={() => setQrCodeStatus(null)} className="text-white hover:text-[#00FF66]">
            ✕
          </button>
        </div>
      )}

      {/* ─── TAB 1: OVERVIEW (الرئيسية) ─────────────────────────────── */}
      {(activeTab === 'overview') && (
        <>
          {/* KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#181818] border border-[#282828] hover:border-[#00FF66]/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider">
                  إجمالي الأعضاء
                </span>
                <div className="p-2 rounded-lg bg-[#00FF66]/10 text-[#00FF66]">
                  <Users size={18} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2 rtl:space-x-reverse">
                <span className="text-2xl lg:text-3xl font-black text-white">{members.length}</span>
                <span className="text-xs font-bold text-[#00FF66]">مشترك</span>
              </div>
              <p className="text-[11px] text-[#666666] mt-1">{members.filter(m => m.status === 'نشط').length} اشتراك نشط بالصالة</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#181818] border border-[#282828] hover:border-[#00FF66]/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider">
                  إيراد الصالة الشهري
                </span>
                <div className="p-2 rounded-lg bg-[#00FF66]/10 text-[#00FF66]">
                  <DollarSign size={18} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2 rtl:space-x-reverse">
                <span className="text-2xl lg:text-3xl font-black text-white">
                  {members.reduce((sum, m) => {
                    const plan = plansList.find(p => p.name === m.plan);
                    return sum + (plan?.rawPrice || 0);
                  }, 0).toLocaleString()} ج.م
                </span>
                <span className="text-xs font-bold text-[#00FF66]">فعلي</span>
              </div>
              <p className="text-[11px] text-[#666666] mt-1">إجمالي رسوم الاشتراكات المسجلة</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#181818] border border-[#282828] hover:border-[#00FF66]/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider">
                  حضور اليوم بالصالة
                </span>
                <div className="p-2 rounded-lg bg-[#00FF66]/10 text-[#00FF66]">
                  <Activity size={18} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2 rtl:space-x-reverse">
                <span className="text-2xl lg:text-3xl font-black text-white">
                  {activeGates.reduce((sum, g) => sum + (g.countToday || 0), 0) + attendanceRecords.filter(a => (a.timestamp || '').includes('اليوم') || (a.timestamp || '').includes(new Date().toISOString().split('T')[0])).length}
                </span>
                <span className="text-xs font-bold text-[#00FF66]">تسجيل دخول</span>
              </div>
              <p className="text-[11px] text-[#666666] mt-1">عبر البوابات وموظفي الاستقبال</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#181818] border border-[#282828] hover:border-[#00FF66]/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider">
                  نسبة فقدان المشتركين
                </span>
                <div className="p-2 rounded-lg bg-[#00FF66]/10 text-[#00FF66]">
                  <Percent size={18} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2 rtl:space-x-reverse">
                <span className="text-2xl lg:text-3xl font-black text-white">
                  {members.length > 0 ? ((members.filter(m => m.status === 'منتهي').length / members.length) * 100).toFixed(1) : '0'}%
                </span>
                <span className="text-xs font-bold text-[#00FF66]">
                  {members.filter(m => m.status === 'منتهي').length} منتهي
                </span>
              </div>
              <p className="text-[11px] text-[#666666] mt-1">محسوب من الاشتراكات المنتهية</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828]">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-bold text-white">ساعات ذروة الدخول عبر البوابات</h2>
                  <p className="text-xs text-[#A0A0A0]">توزيع تسجيلات الدخول بالـ QR خلال ساعات اليوم</p>
                </div>
                <Clock size={18} className="text-[#00FF66]" />
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceHourly}>
                    <XAxis dataKey="hour" stroke="#666666" fontSize={11} />
                    <YAxis stroke="#666666" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#121212',
                        border: '1px solid #282828',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                    <Bar dataKey="checkIns" fill="#00FF66" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828]">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-bold text-white">تتبع تقدم قياسات InBody (عينة متدرب)</h2>
                  <p className="text-xs text-[#A0A0A0]">الوزن (كجم) مقابل نسبة الدهون والكتلة العضلية</p>
                </div>
                <Activity size={18} className="text-[#00FF66]" />
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={inBodyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#282828" />
                    <XAxis dataKey="date" stroke="#666666" fontSize={11} />
                    <YAxis stroke="#666666" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#121212',
                        border: '1px solid #282828',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                    <Line type="monotone" dataKey="weight" name="الوزن (كجم)" stroke="#FFFFFF" strokeWidth={2} />
                    <Line type="monotone" dataKey="bodyFat" name="نسبة الدهون %" stroke="#FF5555" strokeWidth={2} />
                    <Line type="monotone" dataKey="muscleMass" name="الكتلة العضلية (كجم)" stroke="#00FF66" strokeWidth={2.5} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ─── TAB 2: MEMBERS DIRECTORY (الأعضاء) ────────────────────── */}
      {(activeTab === 'overview' || activeTab === 'members') && (
        <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828] space-y-4 animate-fadeIn">
          {/* Header & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                <Users size={20} className="text-[#00FF66]" />
                <span>سجل وقائمة الأعضاء والمشتركين</span>
                <span className="text-xs bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40 px-2.5 py-0.5 rounded-full font-mono">
                  {filteredMembers.length} عضو
                </span>
              </h2>
              <p className="text-xs text-[#A0A0A0] mt-0.5">
                استعراض الأعضاء، التعديل على بياناتهم وباقاتهم، والفلترة بحسب نوع الاشتراك
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Filter by Plan */}
              <div className="flex items-center space-x-1.5 rtl:space-x-reverse bg-[#121212] border border-[#282828] rounded-xl px-3 py-1.5 text-xs">
                <Filter size={14} className="text-[#00FF66]" />
                <span className="text-[#A0A0A0] text-[11px]">الباقة:</span>
                <select
                  value={selectedPlanFilter}
                  onChange={(e) => setSelectedPlanFilter(e.target.value)}
                  className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
                >
                  <option value="ALL" className="bg-[#121212]">جميع الباقات ({members.length})</option>
                  {plansList.map((pl) => (
                    <option key={pl.id} value={pl.name} className="bg-[#121212]">
                      {pl.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-48">
                <Search className="absolute right-3 top-2.5 text-[#666666]" size={15} />
                <input
                  type="text"
                  placeholder="بحث بالاسم أو الهاتف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#121212] border border-[#282828] rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-[#666666] focus:border-[#00FF66] focus:outline-none transition-all"
                />
              </div>

              {/* Add Member Button */}
              <button
                onClick={() => setShowAddMemberModal(true)}
                className="neon-btn px-3.5 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 rtl:space-x-reverse cursor-pointer whitespace-nowrap font-bold"
              >
                <Plus size={15} />
                <span>إضافة عضو جديد</span>
              </button>
            </div>
          </div>

          {memberUpdatedAlert && (
            <div className="p-3 rounded-xl bg-[#00FF66]/20 border border-[#00FF66] text-[#00FF66] text-xs font-bold animate-fadeIn">
              ✅ تم تحديث وتعديل بيانات العضو بنجاح وتحديث صلاحية اشتراكه!
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-[#282828] text-[#A0A0A0] uppercase font-mono text-[10px]">
                  <th className="py-3 px-4">اسم العضو وبياناته</th>
                  <th className="py-3 px-4">باقة الاشتراك المحددة</th>
                  <th className="py-3 px-4">المدرب المخصص</th>
                  <th className="py-3 px-4">آخر حضور بالصالة</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282828]">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-[#1E1E1E]/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{m.name}</div>
                      <div className="text-[11px] text-[#A0A0A0] font-mono">{m.phone} • {m.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#00FF66] bg-[#00FF66]/10 px-2.5 py-1 rounded-lg border border-[#00FF66]/30">
                        {m.plan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-white font-medium">{m.trainer}</td>
                    <td className="py-3.5 px-4 text-[#A0A0A0]">{m.lastCheckIn}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          m.status === 'نشط'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            m.status === 'نشط' ? 'bg-emerald-400' : 'bg-rose-400'
                          }`}
                        />
                        <span>{m.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5 rtl:space-x-reverse">
                        <button
                          onClick={() => openMemberQrPass(m)}
                          className="px-2.5 py-1 rounded-lg bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66] hover:bg-[#00FF66] hover:text-black text-xs font-semibold inline-flex items-center space-x-1 rtl:space-x-reverse transition-all cursor-pointer"
                          title="عرض وتصدير بطاقة الدخول الذكية QR"
                        >
                          <QrCode size={13} />
                          <span>رمز QR</span>
                        </button>
                        <button
                          onClick={() => openEditMemberModal(m)}
                          className="px-2.5 py-1 rounded-lg bg-[#1E1E1E] border border-[#282828] text-white hover:text-[#00FF66] hover:border-[#00FF66] text-xs font-semibold inline-flex items-center space-x-1 rtl:space-x-reverse transition-all cursor-pointer"
                          title="تعديل بيانات العضو"
                        >
                          <Edit size={13} />
                          <span>تعديل</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 3: STAFF & TRAINERS (المدربون والموظفون) ────────────── */}
      {(activeTab === 'staff') && (
        <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828] space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                <Shield size={20} className="text-[#00FF66]" />
                <span>فريق العمل والمدربون المعتمدون</span>
              </h2>
              <p className="text-xs text-[#A0A0A0]">إدارة طاقم التدريب، المشرفين، وإنشاء حسابات الدخول والرواتب بالجنيه المصري</p>
            </div>
            <button
              onClick={() => setShowAddStaffModal(true)}
              className="neon-btn px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 rtl:space-x-reverse cursor-pointer"
            >
              <Plus size={15} />
              <span>إضافة مدرب جديد</span>
            </button>
          </div>

          {staffCreatedAlert && (
            <div className="p-3 rounded-xl bg-[#00FF66]/20 border border-[#00FF66] text-[#00FF66] text-xs font-bold animate-fadeIn">
              ✅ تم تسجيل الكوتش الجديد بنجاح وإنشاء حساب دخوله بالمنظومة!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {staffList.map((st) => (
              <div key={st.id} className="p-4 rounded-xl bg-[#121212] border border-[#282828] flex items-center justify-between hover:border-[#00FF66]/40 transition-all">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-10 h-10 rounded-full bg-[#1E1E1E] border border-[#00FF66]/30 flex items-center justify-center font-bold text-[#00FF66]">
                    {st.name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{st.name}</h4>
                    <p className="text-xs text-[#00FF66] mt-0.5">{st.role}</p>
                    <p className="text-[11px] text-[#A0A0A0] mt-1">المتدربون المسندون: {st.clients} • الراتب الشهري: {st.salary}</p>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#1E1E1E] text-white border border-[#282828]">
                  {st.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 4: GYM MEMBERSHIP PLANS (باقات الاشتراك وعضويات الرياضيين) ─── */}
      {(activeTab === 'plans') && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header & Quick Actions */}
          <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <DollarSign size={22} className="text-[#00FF66]" />
                <h2 className="text-xl font-bold text-white">
                  باقات وعضويات الصالة الرياضية (بالجنيه المصري)
                </h2>
              </div>
              <p className="text-xs text-[#A0A0A0] mt-1 max-w-2xl">
                إدارة احترافية شاملة لتسعير العضويات، الخدمات المشمولة (الساونا، الجاكوزي، الكوتشينج)، مدة الاشتراك، وحماية الاشتراكات النشطة من الحذف العشوائي.
              </p>
            </div>

            <button
              onClick={openCreatePlanModal}
              className="neon-btn px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 rtl:space-x-reverse cursor-pointer font-bold shrink-0 shadow-[0_0_15px_rgba(0,255,102,0.25)]"
            >
              <Plus size={16} />
              <span>إنشاء باقة جديدة +</span>
            </button>
          </div>

          {/* Feedback & Alert Notification */}
          {planCreatedAlert && (
            <div className="p-4 rounded-xl bg-[#00FF66]/15 border border-[#00FF66] text-[#00FF66] text-xs font-bold animate-fadeIn flex items-center justify-between shadow-lg">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <CheckCircle2 size={16} />
                <span>{planCreatedAlert}</span>
              </div>
              <button onClick={() => setPlanCreatedAlert(null)} className="text-[#00FF66] hover:text-white cursor-pointer">
                <X size={15} />
              </button>
            </div>
          )}

          {/* Delete Blocked Warning Alert */}
          {planDeleteBlockedReason && (
            <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500 text-amber-300 text-xs font-bold animate-shake flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <AlertTriangle size={18} className="text-amber-400 shrink-0" />
                <span>{planDeleteBlockedReason}</span>
              </div>
              <button onClick={() => setPlanDeleteBlockedReason(null)} className="text-amber-400 hover:text-white cursor-pointer shrink-0">
                <X size={15} />
              </button>
            </div>
          )}

          {/* Plans Summary Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#121212] border border-[#282828]">
              <span className="text-[10px] text-[#A0A0A0] uppercase font-bold block">إجمالي الباقات المتاحة</span>
              <p className="text-xl font-bold text-white font-mono mt-0.5">{plansList.length} باقات</p>
              <span className="text-[10px] text-[#00FF66]">معتمدة بالصالة</span>
            </div>
            <div className="p-4 rounded-xl bg-[#121212] border border-[#282828]">
              <span className="text-[10px] text-[#A0A0A0] uppercase font-bold block">المشتركون النشطون</span>
              <p className="text-xl font-bold text-[#00FF66] font-mono mt-0.5">
                {members.filter((m) => m.status === 'نشط').length} عضو
              </p>
              <span className="text-[10px] text-[#A0A0A0]">مسجلون بالباقات</span>
            </div>
            <div className="p-4 rounded-xl bg-[#121212] border border-[#282828]">
              <span className="text-[10px] text-[#A0A0A0] uppercase font-bold block">أعلى باقة طلباً</span>
              <p className="text-sm font-bold text-white mt-1 truncate">الباقة الذهبية VIP</p>
              <span className="text-[10px] text-emerald-400 font-mono">4,500 ج.م / سنة</span>
            </div>
            <div className="p-4 rounded-xl bg-[#121212] border border-[#282828]">
              <span className="text-[10px] text-[#A0A0A0] uppercase font-bold block">العملة المعتمدة</span>
              <p className="text-base font-bold text-amber-400 font-mono mt-1">الجنيه المصري (EGP)</p>
              <span className="text-[10px] text-[#A0A0A0]">فوترة مباشرة</span>
            </div>
          </div>

          {/* Professional Plans Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plansList.map((pl) => {
              const subscribersCount = members.filter((m) => m.plan === pl.name).length;
              const hasSubscribers = subscribersCount > 0;

              return (
                <div
                  key={pl.id}
                  className="p-5 rounded-2xl bg-[#121212] border border-[#282828] hover:border-[#00FF66]/50 transition-all flex flex-col justify-between group relative overflow-hidden shadow-xl"
                >
                  {/* Popular Accent Line */}
                  {pl.isPopular && (
                    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#00FF66] via-emerald-400 to-[#00FF66]" />
                  )}

                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#202020]">
                      <span className="text-[10px] font-mono text-[#00FF66] bg-[#00FF66]/10 border border-[#00FF66]/30 px-2.5 py-1 rounded-full font-bold">
                        {pl.duration}
                      </span>
                      {hasSubscribers ? (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center space-x-1 rtl:space-x-reverse">
                          <Lock size={10} />
                          <span>{subscribersCount} مشترك مرتبط</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[#A0A0A0] bg-[#1A1A1A] px-2 py-0.5 rounded-full">
                          لا يوجد مشتركون
                        </span>
                      )}
                    </div>

                    {/* Plan Name & Price */}
                    <div className="my-4">
                      <h3 className="text-lg font-black text-white">{pl.name}</h3>
                      <div className="mt-2 text-2xl font-black text-[#00FF66] font-mono flex items-baseline space-x-1 rtl:space-x-reverse">
                        <span>{pl.price}</span>
                      </div>
                      <p className="text-xs text-[#A0A0A0] mt-2 leading-relaxed">
                        {pl.perks}
                      </p>
                    </div>

                    {/* Services & Features Included */}
                    <div className="pt-3 border-t border-[#202020] space-y-2">
                      <span className="text-[11px] font-bold text-white block">
                        الخدمات والمزايا المشمولة بالباقة:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {pl.services && pl.services.length > 0 ? (
                          pl.services.map((srv, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-[#1A1A1A] text-white border border-[#2E2E2E] px-2 py-0.5 rounded-md flex items-center space-x-1 rtl:space-x-reverse font-medium"
                            >
                              <span className="text-[#00FF66] font-bold">✓</span>
                              <span>{srv}</span>
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-[#666666]">لا توجد خدمات محددة بعد</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer & Action Buttons */}
                  <div className="pt-4 mt-4 border-t border-[#202020] flex items-center justify-between gap-2">
                    <button
                      onClick={() => openEditPlanModal(pl)}
                      className="flex-1 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#00FF66] text-white hover:text-[#0A0A0A] font-bold text-xs transition-all cursor-pointer flex items-center justify-center space-x-1.5 rtl:space-x-reverse border border-[#2E2E2E] hover:border-[#00FF66]"
                    >
                      <Edit size={13} />
                      <span>تعديل الباقة والخدمات</span>
                    </button>

                    <button
                      onClick={() => handleInitiateDeletePlan(pl)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                        hasSubscribers
                          ? 'bg-[#181818] text-[#555555] border-[#252525] hover:text-amber-400 hover:border-amber-500/40'
                          : 'bg-[#181818] text-red-400 border-red-500/30 hover:bg-red-500/20'
                      }`}
                      title={hasSubscribers ? 'محمية من الحذف لوجود مشتركين مرتبطين' : 'حذف الباقة'}
                    >
                      {hasSubscribers ? <Lock size={15} /> : <Trash2 size={15} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── TAB 5: INBODY BIOMETRICS (قياسات InBody) ───────────────── */}
      {(activeTab === 'inbody') && (
        <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828] space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                <Activity size={20} className="text-[#00FF66]" />
                <span>نظام تحليلات الـ InBody المتطورة</span>
              </h2>
              <p className="text-xs text-[#A0A0A0]">فحص القياسات الحيوية، نسبة الدهون، ومعدل البناء العضلي التراكمي</p>
            </div>
            <button className="neon-btn px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 rtl:space-x-reverse cursor-pointer">
              <Plus size={15} />
              <span>إدخال فحص InBody جديد</span>
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={inBodyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#282828" />
                <XAxis dataKey="date" stroke="#666666" fontSize={12} />
                <YAxis stroke="#666666" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121212',
                    border: '1px solid #282828',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Line type="monotone" dataKey="weight" name="الوزن (كجم)" stroke="#FFFFFF" strokeWidth={2.5} />
                <Line type="monotone" dataKey="bodyFat" name="نسبة الدهون %" stroke="#FF5555" strokeWidth={2.5} />
                <Line type="monotone" dataKey="muscleMass" name="الكتلة العضلية (كجم)" stroke="#00FF66" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#121212] border border-[#282828] text-center">
              <span className="text-xs text-[#A0A0A0]">متوسط نسبة الدهون بالصالة</span>
              <p className="text-xl font-bold text-white font-mono mt-1">17.2%</p>
            </div>
            <div className="p-4 rounded-xl bg-[#121212] border border-[#282828] text-center">
              <span className="text-xs text-[#A0A0A0]">الفحوصات المنجزة هذا الشهر</span>
              <p className="text-xl font-bold text-[#00FF66] font-mono mt-1">142 فحصاً</p>
            </div>
            <div className="p-4 rounded-xl bg-[#121212] border border-[#282828] text-center">
              <span className="text-xs text-[#A0A0A0]">معدل الزيادة العضلية</span>
              <p className="text-xl font-bold text-emerald-400 font-mono mt-1">+1.4 كجم / متدرب</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 6: WORKOUTS LIBRARY (مكتبة التمارين) ────────────────── */}
      {(activeTab === 'workouts') && (
        <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828] space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                <Dumbbell size={20} className="text-[#00FF66]" />
                <span>مكتبة التمارين والبرامج التدريبية المعتمدة</span>
              </h2>
              <p className="text-xs text-[#A0A0A0]">برامج تدريبية جاهزة وموثقة يمكن إسنادها فورياً لجدول تمرين المتدربين</p>
            </div>
            <button className="neon-btn px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 rtl:space-x-reverse cursor-pointer">
              <Plus size={15} />
              <span>إضافة روتين تدريبي جديد</span>
            </button>
          </div>

          {workoutAssignedAlert && (
            <div className="p-3.5 rounded-xl bg-[#00FF66]/20 border border-[#00FF66] text-[#00FF66] text-xs font-bold animate-fadeIn flex items-center space-x-2 rtl:space-x-reverse shadow-[0_0_15px_rgba(0,255,102,0.2)]">
              <CheckCircle2 size={16} />
              <span>{workoutAssignedAlert}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockWorkoutsLibrary.map((w) => (
              <div key={w.id} className="p-5 rounded-xl bg-[#121212] border border-[#282828] hover:border-[#00FF66]/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#00FF66] bg-[#00FF66]/10 px-2.5 py-0.5 rounded-full">
                      {w.focus}
                    </span>
                    <span className="text-xs text-[#A0A0A0]">{w.duration}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-2">{w.title}</h3>
                  <div className="mt-2 flex items-center space-x-4 rtl:space-x-reverse text-xs text-[#A0A0A0]">
                    <span>المستوى: <strong className="text-white">{w.level}</strong></span>
                    <span>التمارين: <strong className="text-white">{w.exercisesCount} حركات رئيسية</strong></span>
                  </div>

                  {/* Exercises preview */}
                  <div className="mt-3 pt-3 border-t border-[#202020] space-y-1">
                    {w.exercises?.slice(0, 3).map((ex, i) => (
                      <div key={i} className="text-[11px] text-[#A0A0A0] flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66]/60"></span>
                        <span className="truncate">{ex.name}</span>
                      </div>
                    ))}
                    {(w.exercises?.length || 0) > 3 && (
                      <span className="text-[10px] text-[#666666] block">
                        + {(w.exercises?.length || 0) - 3} تمارين إضافية
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#282828] flex items-center justify-between">
                  <span className="text-[11px] text-[#A0A0A0]">تعيين للمشترك:</span>
                  <button
                    onClick={() => handleAssignWorkoutToMember(w, 'mr mostafa')}
                    className="px-3 py-1.5 rounded-lg bg-[#1E1E1E] hover:bg-[#00FF66] hover:text-[#0A0A0A] text-[#00FF66] border border-[#00FF66]/30 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse"
                  >
                    <Dumbbell size={13} />
                    <span>إسناد كـ تمرين اليوم لـ mr mostafa ⚡</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 7: NUTRITION & DIETS (الأنظمة الغذائية) ─────────────── */}
      {(activeTab === 'nutrition') && (
        <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828] space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                <Calendar size={20} className="text-[#00FF66]" />
                <span>الأنظمة والخطط الغذائية المعتمدة</span>
              </h2>
              <p className="text-xs text-[#A0A0A0]">خطط السعرات والماكروز المحسوبة لمختلف أهداف اللياقة</p>
            </div>
            <button className="neon-btn px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 rtl:space-x-reverse cursor-pointer">
              <Plus size={15} />
              <span>إضافة نظام غذائي</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockNutritionPlans.map((n) => (
              <div key={n.id} className="p-5 rounded-xl bg-[#121212] border border-[#282828] hover:border-[#00FF66]/40 transition-all">
                <h3 className="text-base font-bold text-white">{n.name}</h3>
                <p className="text-xs text-[#00FF66] mt-1">{n.target}</p>
                <div className="my-4 text-2xl font-black text-white font-mono">{n.calories}</div>
                <div className="space-y-1.5 text-xs text-[#A0A0A0] border-t border-[#282828] pt-3">
                  <div className="flex justify-between"><span>البروتين:</span> <strong className="text-white">{n.protein}</strong></div>
                  <div className="flex justify-between"><span>الكربوهيدرات:</span> <strong className="text-white">{n.carbs}</strong></div>
                  <div className="flex justify-between"><span>الدهون الصحية:</span> <strong className="text-white">{n.fats}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 8: STORE & POS (إدارة المتجر ونقاط البيع) ─────────── */}
      {(activeTab === 'overview' || activeTab === 'store') && (
        <div className="space-y-6 animate-fadeIn">
          {/* PulsOps Desktop POS & Offline Kiosk */}
          <DesktopPOSKiosk />

          <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828] space-y-6">
          {/* Header & Management Action Buttons */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                <ShoppingBag size={22} className="text-[#00FF66]" />
                <span>إدارة متجر الصالة ونقاط البيع POS</span>
                <span className="text-xs bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40 px-2 py-0.5 rounded-full font-mono">
                  حصري لصالتك
                </span>
              </h2>
              <p className="text-xs text-[#A0A0A0] mt-0.5">
                إضافة المنتجات، إدارة المخزون، ونشر بنرات العروض الترويجية التي تظهر حصرياً للمتدربين والمدربين التابعين لصالتك.
              </p>
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <button
                onClick={() => setShowAddBannerModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#1E1E1E] border border-[#00FF66]/50 text-[#00FF66] hover:bg-[#00FF66]/10 text-xs font-bold flex items-center space-x-1.5 rtl:space-x-reverse transition-all cursor-pointer"
              >
                <Megaphone size={15} />
                <span>رفع بنر دعائي</span>
              </button>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="neon-btn px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 rtl:space-x-reverse cursor-pointer font-bold"
              >
                <Plus size={15} />
                <span>إضافة منتج جديد</span>
              </button>
            </div>
          </div>

          {productAddedAlert && (
            <div className="p-3 rounded-xl bg-[#00FF66]/20 border border-[#00FF66] text-[#00FF66] text-xs font-bold animate-fadeIn">
              ✅ تمت إضافة المنتج إلى متجر الصالة بنجاح، ويظهر الآن فوراً في شاشات المتدربين والمدربين!
            </div>
          )}

          {bannerAddedAlert && (
            <div className="p-3 rounded-xl bg-[#00FF66]/20 border border-[#00FF66] text-[#00FF66] text-xs font-bold animate-fadeIn">
              ✅ تم نشر البنر الدعائي بنجاح وهو معروض الآن في الصفحة الرئيسية لمتدربي ومدربي صالتك!
            </div>
          )}

          {/* ── Active Promotional Banners Section ── */}
          {banners.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#A0A0A0] flex items-center space-x-1.5 rtl:space-x-reverse">
                  <Megaphone size={14} className="text-[#00FF66]" />
                  <span>البنرات الدعائية النشطة للمشتركين والمدربين:</span>
                </span>
                <span className="text-[11px] text-[#666666] font-mono">{banners.length} بنر نشط</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners.map((ban) => (
                  <div
                    key={ban.id}
                    className="relative rounded-2xl overflow-hidden border border-[#282828] bg-cover bg-center h-48 flex flex-col justify-between p-5 group hover:border-[#00FF66]/60 transition-all shadow-lg"
                    style={{ backgroundImage: `linear-gradient(to top, rgba(10,10,10,0.95), rgba(10,10,10,0.4)), url(${ban.imageUrl})` }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold bg-[#00FF66] text-[#0A0A0A] px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(0,255,102,0.4)]">
                        {ban.badge}
                      </span>
                      <button
                        onClick={() => setBanners(banners.filter((b) => b.id !== ban.id))}
                        className="p-1 rounded-lg bg-black/60 text-[#A0A0A0] hover:text-rose-400 hover:bg-black/80 transition-all cursor-pointer"
                        title="حذف البنر"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-white group-hover:text-[#00FF66] transition-colors">
                        {ban.title}
                      </h3>
                      {ban.subtitle && (
                        <p className="text-xs text-[#A0A0A0] mt-1 line-clamp-2">{ban.subtitle}</p>
                      )}
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="text-[11px] font-semibold text-[#00FF66] font-mono">
                          مباشر في تطبيق المتدرب والكوتش
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-[#00FF66] text-[#0A0A0A] font-bold text-[11px]">
                          {ban.ctaText}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Products Grid & POS Cart ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#A0A0A0]">
                المنتجات والمكملات المعروضة بالصالة ({products.length} منتجات):
              </span>
              <span className="text-[11px] text-[#00FF66] font-mono">الأسعار بالجنيه المصري</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl bg-[#121212] border border-[#282828] flex flex-col justify-between hover:border-[#00FF66]/40 transition-all group"
                >
                  <div>
                    {p.image && (
                      <div className="w-full h-32 rounded-lg bg-[#181818] mb-2.5 overflow-hidden flex items-center justify-center">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#00FF66] uppercase font-mono font-bold tracking-wider">
                        {p.category}
                      </span>
                      <span className="text-[10px] text-[#666666] font-mono">
                        المتوفر: {p.stock}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mt-1 leading-snug line-clamp-2">{p.name}</h4>
                    <p className="text-sm font-black text-[#00FF66] mt-2 font-mono">
                      {p.price.toLocaleString()} ج.م
                    </p>
                  </div>
                  <button
                    onClick={() => addToCart(p.id)}
                    className="mt-3 w-full py-1.5 rounded-lg bg-[#1E1E1E] text-white hover:bg-[#00FF66] hover:text-[#0A0A0A] font-semibold text-xs transition-all cursor-pointer flex items-center justify-center space-x-1 rtl:space-x-reverse"
                  >
                    <span>إضافة للفاتورة</span>
                    {cart[p.id] ? <span className="font-mono">({cart[p.id]})</span> : null}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {cartTotal > 0 && (
            <div className="p-3 rounded-xl bg-[#00FF66]/10 border border-[#00FF66]/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#A0A0A0]">إجمالي الفاتورة:</span>
                <span className="text-base font-extrabold text-[#00FF66] mr-2 font-mono">
                  {cartTotal.toLocaleString()} ج.م
                </span>
              </div>
              <button
                onClick={handleProcessCheckout}
                className="neon-btn px-4 py-1.5 rounded-lg text-xs"
              >
                تأكيد الفاتورة وخصم المخزون
              </button>
            </div>
          )}

          {orderCompleted && (
            <div className="text-xs font-bold text-[#00FF66] text-center animate-fadeIn">
              ✅ تم تسجيل العملية بنجاح وإصدار الفاتورة بالجنيه المصري!
            </div>
          )}
          </div>
        </div>
      )}

      {/* ─── TAB: ORDERS (إدارة طلبات المتجر والمبيعات) ─────────────── */}
      {(activeTab === 'orders') && (
        <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828] space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#282828]">
            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <ClipboardList size={22} className="text-[#00FF66]" />
                <h2 className="text-lg font-bold text-white">إدارة طلبات المتجر والمبيعات (Online Orders)</h2>
                <span className="text-xs bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40 px-2.5 py-0.5 rounded-full font-mono font-bold">
                  {storeOrders.length} طلبات
                </span>
              </div>
              <p className="text-xs text-[#A0A0A0] mt-1">
                متابعة طلبات المتدربين القادمة من تطبيق الموبايل، تجهيز الشحنات، والتسليم بالريسبشن أو التوصيل.
              </p>
            </div>
            <button
              onClick={fetchStoreOrders}
              className="px-3.5 py-2 rounded-xl bg-[#121212] border border-[#282828] hover:border-[#00FF66] text-white text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse"
            >
              <span>تحديث الطلبات</span>
            </button>
          </div>

          {/* Orders Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {storeOrders.map((ord) => {
              const isDone = ord.status === 'تم التسليم';
              const isReady = ord.status === 'تم التجهيز';
              return (
                <div
                  key={ord.id}
                  className="p-5 rounded-2xl bg-[#121212] border border-[#282828] hover:border-[#00FF66]/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-xs font-mono font-bold text-[#00FF66] bg-[#00FF66]/10 px-2 py-0.5 rounded">
                          #{ord.id}
                        </span>
                        <span className="text-xs font-bold text-white">{ord.memberName}</span>
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full font-mono ${
                          isDone
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : isReady
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>

                    {/* Customer & Delivery details */}
                    <div className="p-3 rounded-xl bg-[#181818] border border-[#242424] text-xs space-y-1.5 text-[#A0A0A0]">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Phone size={13} className="text-[#00FF66]" />
                        <span className="font-mono text-white">{ord.phone || '+20 100 123 4567'}</span>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <MapPin size={13} className="text-[#00FF66]" />
                        <span className="text-white">{ord.address}</span>
                      </div>
                      {ord.notes && (
                        <div className="text-[11px] text-amber-300 bg-amber-950/20 px-2 py-1 rounded">
                          ملاحظة العميل: {ord.notes}
                        </div>
                      )}
                    </div>

                    {/* Order Items */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] text-[#666666] font-bold uppercase block">المنتجات المطلوبة:</span>
                      {ord.items?.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between text-xs font-mono">
                          <span className="text-white">• {item.name || item.title} (×{item.quantity || 1})</span>
                          <span className="text-[#00FF66]">{((item.price || 0) * (item.quantity || 1)).toLocaleString()} ج.م</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Status Changers */}
                  <div className="pt-3 border-t border-[#222222] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#A0A0A0] block">الإجمالي الكلي:</span>
                      <span className="text-base font-black text-white font-mono">{ord.totalAmount?.toLocaleString()} ج.م</span>
                    </div>

                    <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                      {ord.status === 'قيد المراجعة والتجهيز' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'تم التجهيز')}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          تم تجهيز الطلب 📦
                        </button>
                      )}
                      {ord.status !== 'تم التسليم' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'تم التسليم')}
                          className="px-3 py-1.5 rounded-lg bg-[#00FF66] hover:bg-[#39FF14] text-[#0A0A0A] text-xs font-bold transition-all cursor-pointer shadow-[0_0_10px_rgba(0,255,102,0.3)]"
                        >
                          تسليم للعميل ✅
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── TAB 9: ATTENDANCE & QR (حضور البوابات ونظام التشغيل الذكي) ──────────── */}
      {(activeTab === 'attendance') && (
        <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828] space-y-6 animate-fadeIn">
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-[#282828]">
            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                <span className="p-2 rounded-xl bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20">
                  <QrCode size={22} />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                    <span>نظام بوابات الحضور والتشغيل الذكي (Smart Turnstiles & QR)</span>
                    <span className="text-[10px] bg-[#00FF66]/20 text-[#00FF66] px-2 py-0.5 rounded-full border border-[#00FF66]/30 font-mono">
                      LIVE SYSTEM
                    </span>
                  </h2>
                  <p className="text-xs text-[#A0A0A0]">
                    إدارة متكاملة لتدفق الحضور عبر البوابات الإلكترونية، أجهزة القراءة في الاستقبال، ومسح QR هواتف الأعضاء
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setScanMode('AUTO_CAMERA');
                  setShowScanModal(true);
                }}
                className="neon-btn px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 rtl:space-x-reverse cursor-pointer shadow-lg shadow-[#00FF66]/10 font-bold"
              >
                <Scan size={16} />
                <span>مسح كود QR / تسجيل حضور</span>
              </button>

              <button
                onClick={() => {
                  setScanMode('STATION_EMULATOR');
                  setShowScanModal(true);
                }}
                className="px-4 py-2.5 rounded-xl text-xs bg-[#1E1E1E] hover:bg-[#252525] border border-[#333333] hover:border-[#00FF66] text-white flex items-center space-x-2 rtl:space-x-reverse cursor-pointer transition-all font-semibold"
              >
                <Smartphone size={16} className="text-[#00FF66]" />
                <span>محاكي بوابات Turnstile & قارئ الماكينة</span>
              </button>
            </div>
          </div>

          {/* Quick Notice / Feedback Banner */}
          {qrCodeStatus && (
            <div className="p-3.5 rounded-xl bg-[#00FF66]/15 border border-[#00FF66] text-[#00FF66] text-xs font-bold flex items-center justify-between animate-fadeIn">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <CheckCircle2 size={16} />
                <span>{qrCodeStatus}</span>
              </div>
              <button onClick={() => setQrCodeStatus(null)} className="text-[#A0A0A0] hover:text-white cursor-pointer">
                <X size={15} />
              </button>
            </div>
          )}

          {/* Attendance Points & Gates Management Grid */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                  <Shield size={16} className="text-[#00FF66]" />
                  <span>نقاط الحضور المسجلة بالصالة ({activeGates.length} نقطة: موظفو استقبال، بوابات ذكية، أجهزة مسح)</span>
                </h3>
                <span className="text-[11px] text-[#A0A0A0]">
                  يمكنك إضافة وتعيين أي موظف استقبال أو بوابة إلكترونية كـ "نقطة تسجيل حضور" مستقلة
                </span>
              </div>
              <button
                type="button"
                onClick={openCreatePointModal}
                className="neon-btn px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 rtl:space-x-reverse cursor-pointer font-bold self-start sm:self-auto"
              >
                <Plus size={14} />
                <span>إضافة نقطة حضور / موظف استقبال جديد</span>
              </button>
            </div>

            {pointAlert && (
              <div className="mb-3 p-3 rounded-xl bg-[#00FF66]/15 border border-[#00FF66] text-[#00FF66] text-xs font-bold animate-fadeIn">
                {pointAlert}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeGates.map((gate) => (
                <div
                  key={gate.id}
                  className="p-4 rounded-xl bg-[#121212] border border-[#282828] hover:border-[#00FF66]/50 transition-all flex flex-col justify-between space-y-3 group relative"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <span
                        className={`inline-flex items-center space-x-1 rtl:space-x-reverse px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          gate.pointType === 'STAFF_DESK'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                            : gate.pointType === 'ELECTRONIC_GATE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        }`}
                      >
                        {gate.pointType === 'STAFF_DESK' && <User size={11} />}
                        {gate.pointType === 'ELECTRONIC_GATE' && <Wifi size={11} />}
                        {gate.pointType === 'DESKTOP_KIOSK' && <Monitor size={11} />}
                        <span>
                          {gate.pointType === 'STAFF_DESK'
                            ? 'كاونتر موظف استقبال'
                            : gate.pointType === 'ELECTRONIC_GATE'
                            ? 'بوابة إلكترونية ذكية'
                            : 'جهاز تسجيل ذاتي'}
                        </span>
                      </span>

                      {/* Edit & Delete Controls */}
                      <div className="flex items-center space-x-1 rtl:space-x-reverse opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => openEditPointModal(gate)}
                          className="p-1 rounded-lg text-[#888888] hover:text-[#00FF66] hover:bg-[#1A1A1A] cursor-pointer transition-colors"
                          title="تعديل بيانات نقطة الحضور"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAttendancePoint(gate.id, gate.name)}
                          className="p-1 rounded-lg text-[#888888] hover:text-red-400 hover:bg-[#1A1A1A] cursor-pointer transition-colors"
                          title="حذف هذه النقطة"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-[#00FF66] transition-colors leading-tight">
                        {gate.name}
                      </h4>
                      {gate.supervisorName && (
                        <p className="text-[11px] text-[#00FF66] font-medium mt-0.5">
                          المسؤول: {gate.supervisorName}
                        </p>
                      )}
                      <p className="text-[10px] text-[#777777] font-mono mt-0.5">
                        {gate.locationDesc || 'الريسبشن الرئيسي'}
                        {gate.ip ? ` • IP: ${gate.ip}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#202020] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#A0A0A0] block">حضور اليوم</span>
                      <span className="text-lg font-mono font-bold text-[#00FF66]">{gate.countToday}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedScanGate(gate.name);
                        setScanMode('AUTO_CAMERA');
                        setShowScanModal(true);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#1E1E1E] hover:bg-[#00FF66] hover:text-black text-white text-[11px] font-semibold transition-all border border-[#333333] cursor-pointer flex items-center space-x-1 rtl:space-x-reverse"
                    >
                      <Scan size={12} />
                      <span>تسجيل حضور</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Attendance Stream Table */}
          <div className="pt-2 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                  <Clock size={16} className="text-[#00FF66]" />
                  <span>سجل الحضور الفوري والعمليات (Live Access Stream)</span>
                </h3>
                <p className="text-[11px] text-[#A0A0A0]">توثيق دقيق لكل عملية مرور عبر رمز الـ QR أو البوابة</p>
              </div>

              {/* Gate Filter */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-[11px] text-[#A0A0A0]">تصفية البوابة:</span>
                <select
                  value={qrFilterGate}
                  onChange={(e) => setQrFilterGate(e.target.value)}
                  className="bg-[#121212] border border-[#282828] text-white text-xs rounded-xl px-3 py-1.5 focus:border-[#00FF66] focus:outline-none cursor-pointer"
                >
                  <option value="ALL">جميع البوابات والمحطات</option>
                  {activeGates.map((g) => (
                    <option key={g.id} value={g.name}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#282828] bg-[#121212]">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-[#282828] text-[#A0A0A0] uppercase font-mono text-[10px] bg-[#161616]">
                    <th className="py-3 px-4">رقم الحركة</th>
                    <th className="py-3 px-4">اسم العضو / المشترك</th>
                    <th className="py-3 px-4">البوابة والمحطة</th>
                    <th className="py-3 px-4">طريقة التحقق (Device)</th>
                    <th className="py-3 px-4">باقة الاشتراك</th>
                    <th className="py-3 px-4">التوقيت</th>
                    <th className="py-3 px-4">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222222]">
                  {attendanceRecords
                    .filter((rec) => qrFilterGate === 'ALL' || rec.gate === qrFilterGate)
                    .map((rec) => (
                      <tr key={rec.id} className="hover:bg-[#1A1A1A] transition-colors">
                        <td className="py-3 px-4 font-mono text-[11px] text-[#888888]">{rec.id}</td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-white text-sm">{rec.memberName}</span>
                        </td>
                        <td className="py-3 px-4 text-[#D0D0D0] font-medium">{rec.gate}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center space-x-1 rtl:space-x-reverse text-[11px] text-[#A0A0A0] bg-[#1A1A1A] px-2 py-0.5 rounded-lg border border-[#2C2C2C]">
                            {rec.deviceType === 'MOBILE_QR' && <Smartphone size={12} className="text-[#00FF66]" />}
                            {rec.deviceType === 'TURNSTILE_STATION' && <Wifi size={12} className="text-cyan-400" />}
                            {rec.deviceType === 'DESKTOP_SCAN' && <Scan size={12} className="text-amber-400" />}
                            {rec.deviceType === 'MANUAL_OVERRIDE' && <KeyRound size={12} className="text-purple-400" />}
                            <span>
                              {rec.deviceType === 'MOBILE_QR'
                                ? 'رمز QR هاتف المتدرب'
                                : rec.deviceType === 'TURNSTILE_STATION'
                                ? 'حساس ماكينة البوابة الذكية'
                                : rec.deviceType === 'DESKTOP_SCAN'
                                ? 'قارئ باركود الاستقبال'
                                : 'إذن مرور إداري'}
                            </span>
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[11px] text-[#00FF66] font-medium">{rec.plan || 'عضوية نشطة'}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-[#888888]">
                          {new Date(rec.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                              rec.status === 'نشط'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                rec.status === 'نشط' ? 'bg-emerald-400' : 'bg-rose-400'
                              }`}
                            />
                            <span>{rec.status === 'نشط' ? 'تم الدخول بنجاح' : 'مرفوض'}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 10: BROADCAST NOTIFICATIONS (البث المباشر) ──────────── */}
      {(activeTab === 'broadcast') && (
        <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828] space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                <Bell size={20} className="text-[#00FF66]" />
                <span>إرسال إشعار فوري لجميع الأعضاء</span>
              </h2>
              <p className="text-xs text-[#A0A0A0]">
                إرسال تنبيه مباشر إلى هواتف ومتصفحات كافة المشتركين الـ 840
              </p>
            </div>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4 max-w-xl">
            <div>
              <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">
                عنوان الإشعار
              </label>
              <input
                type="text"
                required
                placeholder="مثال: ⚡ مواعيد العمل في العطلة / حصة تدريبية جديدة"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full bg-[#121212] border border-[#282828] rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#00FF66] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">
                نص الرسالة
              </label>
              <textarea
                required
                rows={4}
                placeholder="اكتب التنبيه الذي سيصل كرسالة فورية لهواتف المشتركين..."
                value={broadcastBody}
                onChange={(e) => setBroadcastBody(e.target.value)}
                className="w-full bg-[#121212] border border-[#282828] rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#00FF66] focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="neon-btn px-6 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer"
            >
              <Send size={15} />
              <span>إرسال البث لجميع المشتركين النشطين</span>
            </button>
          </form>

          {broadcastSent && (
            <div className="p-3 rounded-xl bg-[#00FF66]/20 border border-[#00FF66] text-[#00FF66] text-xs font-bold text-center animate-fadeIn max-w-xl">
              🚀 تم إرسال الإشعار بنجاح إلى 840 جهازاً عبر FCM و Web-Push!
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 11: ANALYTICS & GROWTH (التحليلات والنمو) ───────────── */}
      {(activeTab === 'analytics') && (
        <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828] space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
              <TrendingUp size={20} className="text-[#00FF66]" />
              <span>التحليلات المالية ونمو المشتركين (بالجنيه المصري)</span>
            </h2>
            <p className="text-xs text-[#A0A0A0]">معدل التدفقات النقدية، الاشتراكات المتجددة، ومعدلات الاحتفاظ</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { month: 'مايو', rev: 380000 },
                { month: 'يونيو', rev: 410000 },
                { month: 'يوليو', rev: 445000 },
                { month: 'أغسطس', rev: 462000 },
                { month: 'سبتمبر', rev: 478000 },
                { month: 'أكتوبر', rev: 480920 },
              ]}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FF66" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00FF66" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#666666" fontSize={12} />
                <YAxis stroke="#666666" fontSize={12} tickFormatter={(v) => `${(v / 1000).toLocaleString()} ألف`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121212',
                    border: '1px solid #282828',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(val: any) => [`${Number(val).toLocaleString()} ج.م`, 'الإيرادات']}
                />
                <Area type="monotone" dataKey="rev" name="الإيرادات" stroke="#00FF66" strokeWidth={3} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ─── TAB 12: AI ASSISTANT (مساعد Gemini الذكي) ───────────────── */}
      {(activeTab === 'ai') && (
        <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828] space-y-5 animate-fadeIn">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
              <Bot size={20} className="text-[#00FF66]" />
              <span>مساعد إدارة الصالة الذكي (Gemini AI Business Advisor)</span>
            </h2>
            <p className="text-xs text-[#A0A0A0]">تحليل ذكي لبيانات النادي وتقديم اقتراحات لرفع الإيرادات وتقليل الازدحام</p>
          </div>

          <form onSubmit={handleAiConsult} className="space-y-3 max-w-xl">
            <textarea
              rows={3}
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="اطلب استشارة ذكية: مثلاً 'كيف أزيد تجديد الاشتراكات للشهر القادم؟' أو 'حلول لتقليل الازدحام في وقت الذروة'..."
              className="w-full bg-[#121212] border border-[#282828] rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#00FF66] focus:outline-none resize-none"
            />
            <button
              type="submit"
              disabled={isAiLoading}
              className="neon-btn px-5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 rtl:space-x-reverse cursor-pointer disabled:opacity-50"
            >
              <Sparkles size={15} />
              <span>{isAiLoading ? 'جاري التحليل الذكي...' : 'طلب تحليل الذكاء الاصطناعي'}</span>
            </button>
          </form>

          {aiReply && (
            <div className="p-4 rounded-xl bg-[#121212] border border-[#00FF66]/40 text-xs text-white leading-relaxed animate-fadeIn max-w-xl">
              {aiReply}
            </div>
          )}
        </div>
      )}

      {/* ─── Modal: Add New Member ───────────────────────────────────── */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#282828] w-full max-w-md rounded-2xl p-6 shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-bold text-white mb-1">تسجيل عضو رياضي جديد</h3>
            <p className="text-xs text-[#A0A0A0] mb-5">
              إضافة المشترك، تفعيل باقته، وتوليد بطاقة الـ QR الإلكترونية فوراً.
            </p>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">اسم المشترك بالكامل</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: حسام العلي"
                  value={newMemName}
                  onChange={(e) => setNewMemName(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">رقم الهاتف</label>
                <input
                  type="tel"
                  required
                  placeholder="+20 100 000 0000"
                  value={newMemPhone}
                  onChange={(e) => setNewMemPhone(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-[#00FF66] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">باقة الاشتراك</label>
                <select
                  value={newMemPlan}
                  onChange={(e) => setNewMemPlan(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                >
                  {plansList.map((pl) => (
                    <option key={pl.id} value={pl.name}>
                      {pl.name} ({pl.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">المدرب المخصص</label>
                <select
                  value={newMemTrainer}
                  onChange={(e) => setNewMemTrainer(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                >
                  <option value="غير مسند">بدون مدرب شخصي</option>
                  {staffList.map((st) => (
                    <option key={st.id} value={st.name}>
                      {st.name} ({st.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A0A0A0] hover:text-white"
                >
                  إلغاء
                </button>
                <button type="submit" className="neon-btn px-5 py-2 rounded-xl text-xs">
                  تأكيد الاشتراك وتوليد الـ Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal: Add Staff / Coach ──────────────────────────────── */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#282828] w-full max-w-md rounded-2xl p-6 shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-bold text-white mb-1">إضافة مدرب / كوتش جديد</h3>
            <p className="text-xs text-[#A0A0A0] mb-5">
              تسجيل المدرب بالصالة وتوليد يوزر دخول مخصص له برتبة (كوتش) لمتابعة المتدربين.
            </p>

            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">اسم المدرب</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الكوتش حسام كمال"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">المسمى الوظيفي / التخصص</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: كوتش معتمد / لياقة وتغذية"
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">البريد الإلكتروني للدخول</label>
                <input
                  type="email"
                  placeholder="coach.hossam@titanfitness.com"
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-[#00FF66] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    placeholder="+20 100 000 0000"
                    value={newStaffPhone}
                    onChange={(e) => setNewStaffPhone(e.target.value)}
                    className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-[#00FF66] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">الراتب الشهري (ج.م)</label>
                  <input
                    type="text"
                    placeholder="12,000"
                    value={newStaffSalary}
                    onChange={(e) => setNewStaffSalary(e.target.value)}
                    className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-[#00FF66] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A0A0A0] hover:text-white"
                >
                  إلغاء
                </button>
                <button type="submit" className="neon-btn px-5 py-2 rounded-xl text-xs">
                  إنشاء حساب المدرب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal: Add Store Product ───────────────────────────────── */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#282828] w-full max-w-md rounded-2xl p-6 shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-bold text-white mb-1">إضافة منتج لمتجر الصالة</h3>
            <p className="text-xs text-[#A0A0A0] mb-5">
              يظهر هذا المنتج مباشرة في متجر المشتركين والمدربين التابعين لصالتك فقط.
            </p>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">اسم المنتج / المكمل</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: واي بروتين أيزوليت 2 كجم"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">التصنيف</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                  >
                    <option value="بروتين">بروتين</option>
                    <option value="قوة واستشفاء">قوة واستشفاء</option>
                    <option value="طاقة وبومب">طاقة وبومب</option>
                    <option value="فيتامينات">فيتامينات</option>
                    <option value="مستلزمات رياضية">مستلزمات رياضية</option>
                    <option value="سناكس صحي">سناكس صحي</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">السعر (ج.م)</label>
                  <input
                    type="number"
                    required
                    placeholder="2500"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-[#00FF66] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">الكمية المتوفرة</label>
                  <input
                    type="number"
                    required
                    placeholder="25"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-[#00FF66] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">رابط صورة المنتج (اختياري)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                    className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-[#00FF66] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A0A0A0] hover:text-white"
                >
                  إلغاء
                </button>
                <button type="submit" className="neon-btn px-5 py-2 rounded-xl text-xs">
                  إضافة المنتج للمتجر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal: Add Promotional Banner ──────────────────────────── */}
      {showAddBannerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#282828] w-full max-w-md rounded-2xl p-6 shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-bold text-white mb-1">رفع بنر دعائي لمتجر الصالة</h3>
            <p className="text-xs text-[#A0A0A0] mb-5">
              سيظهر البنر فوراً في الواجهة الرئيسية للمشتركين والمدربين التابعين لصالتك حصرياً.
            </p>

            <form onSubmit={handleAddBanner} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">عنوان العرض الرئيسي</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: خصم 30% على منتجات الطاقة هذا الأسبوع"
                  value={newBannerTitle}
                  onChange={(e) => setNewBannerTitle(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">الوصف الترويجي</label>
                <textarea
                  rows={2}
                  placeholder="اكتب تفاصيل إضافية عن العرض والمدة..."
                  value={newBannerSubtitle}
                  onChange={(e) => setNewBannerSubtitle(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">رابط صورة البنر (أبعاد عريضة 16:9)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newBannerImage}
                  onChange={(e) => setNewBannerImage(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-[#00FF66] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">شارة البنر (Badge)</label>
                  <input
                    type="text"
                    value={newBannerBadge}
                    onChange={(e) => setNewBannerBadge(e.target.value)}
                    className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">نص زر التفاعل (CTA)</label>
                  <input
                    type="text"
                    value={newBannerCta}
                    onChange={(e) => setNewBannerCta(e.target.value)}
                    className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddBannerModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A0A0A0] hover:text-white"
                >
                  إلغاء
                </button>
                <button type="submit" className="neon-btn px-5 py-2 rounded-xl text-xs">
                  نشر البنر للمشتركين والمدربين
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal: Edit Member (تعديل بيانات العضو) ─────────────── */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#282828] w-full max-w-md rounded-2xl p-6 shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-bold text-white mb-1">تعديل بيانات العضو</h3>
            <p className="text-xs text-[#A0A0A0] mb-5">
              تعديل تفاصيل المشترك، تغيير باقة الاشتراك، الكوتش المسؤول، وحالة الحساب.
            </p>

            <form onSubmit={handleSaveMemberEdit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">اسم العضو</label>
                <input
                  type="text"
                  required
                  value={editMemName}
                  onChange={(e) => setEditMemName(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">رقم الهاتف</label>
                <input
                  type="tel"
                  required
                  value={editMemPhone}
                  onChange={(e) => setEditMemPhone(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-[#00FF66] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">باقة الاشتراك</label>
                <select
                  value={editMemPlan}
                  onChange={(e) => setEditMemPlan(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                >
                  {plansList.map((pl) => (
                    <option key={pl.id} value={pl.name}>
                      {pl.name} ({pl.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">المدرب المخصص</label>
                  <select
                    value={editMemTrainer}
                    onChange={(e) => setEditMemTrainer(e.target.value)}
                    className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                  >
                    <option value="غير مسند">بدون مدرب</option>
                    {staffList.map((st) => (
                      <option key={st.id} value={st.name}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">حالة الاشتراك</label>
                  <select
                    value={editMemStatus}
                    onChange={(e) => setEditMemStatus(e.target.value as 'نشط' | 'منتهي' | 'معلق')}
                    className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                  >
                    <option value="نشط">نشط ✅</option>
                    <option value="منتهي">منتهي ❌</option>
                    <option value="معلق">معلق ⏸</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse pt-3">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A0A0A0] hover:text-white"
                >
                  إلغاء
                </button>
                <button type="submit" className="neon-btn px-5 py-2 rounded-xl text-xs font-bold">
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal: Add / Edit Gym Plan (إنشاء وتعديل الباقة والخدمات المشمولة) ─── */}
      {showAddPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#00FF66]/40 glow-border w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-scaleIn max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#282828]">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <DollarSign size={20} className="text-[#00FF66]" />
                <h3 className="text-base font-bold text-white">
                  {editingPlan ? `تعديل باقة (${editingPlan.name})` : 'إنشاء باقة عضوية جديدة'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddPlanModal(false);
                  setEditingPlan(null);
                }}
                className="text-[#666666] hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[#A0A0A0]">
              تحديد تسعير الباقة بالجنيه المصري، وتحديد الخدمات والمزايا الحصرية المشمولة يدويًا (مثل الساونا، الجاكوزي، الكوتشينج).
            </p>

            <form onSubmit={handleSavePlan} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">اسم الباقة</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الباقة البلاتينية VIP / باقة 6 أشهر"
                  value={planFormName}
                  onChange={(e) => setPlanFormName(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3.5 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">السعر (ج.م)</label>
                  <input
                    type="number"
                    required
                    placeholder="2500"
                    value={planFormPrice}
                    onChange={(e) => setPlanFormPrice(e.target.value)}
                    className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:border-[#00FF66] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">مدة الاشتراك</label>
                  <select
                    value={planFormDuration}
                    onChange={(e) => setPlanFormDuration(e.target.value)}
                    className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3.5 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                  >
                    <option value="شهر واحد">شهر واحد</option>
                    <option value="3 أشهر">3 أشهر</option>
                    <option value="6 أشهر">6 أشهر</option>
                    <option value="سنة كاملة">سنة كاملة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">الوصف العام للباقة</label>
                <textarea
                  rows={2}
                  placeholder="وصف مختصر لمستوى الباقة وتناسبها مع أهداف المشتركين..."
                  value={planFormPerks}
                  onChange={(e) => setPlanFormPerks(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3.5 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                />
              </div>

              {/* Dynamic Services / Features Tags Section */}
              <div className="pt-2 border-t border-[#202020] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white block">
                    الخدمات والمزايا المشمولة في الباقة (تُكتب وتُضاف يدوياً):
                  </label>
                  <span className="text-[10px] text-[#A0A0A0] font-mono">
                    {planFormServices.length} خدمات مضافة
                  </span>
                </div>

                {/* Add Service Tag Input Bar */}
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <input
                    type="text"
                    placeholder="مثال: ساونا وجاكوزي وبخار، 12 جلسة تدريب شخصي، فحص InBody شهري..."
                    value={newServiceInput}
                    onChange={(e) => setNewServiceInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddServiceTag();
                      }
                    }}
                    className="flex-1 bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddServiceTag}
                    className="neon-btn px-4 py-2 rounded-xl text-xs font-bold shrink-0 cursor-pointer"
                  >
                    + إضافة الخدمة
                  </button>
                </div>

                {/* Quick Presets Buttons */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-[#666666] self-center">مقترحات سريعة:</span>
                  {['ساونا وجاكوزي وبخار', '12 جلسة تدريب شخصي PT', 'فحص InBody شهري', 'مسبح أولمبي', 'خزانة VIP خاصة'].map(
                    (preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          if (!planFormServices.includes(preset)) {
                            setPlanFormServices([...planFormServices, preset]);
                          }
                        }}
                        className="text-[10px] bg-[#1A1A1A] hover:bg-[#282828] text-[#A0A0A0] hover:text-[#00FF66] border border-[#2A2A2A] px-2 py-0.5 rounded-lg transition-all cursor-pointer"
                      >
                        + {preset}
                      </button>
                    )
                  )}
                </div>

                {/* Added Tags Display */}
                <div className="flex flex-wrap gap-2 pt-2 min-h-[45px] p-2.5 rounded-xl bg-[#0D0D0D] border border-[#222222]">
                  {planFormServices.length === 0 ? (
                    <span className="text-[11px] text-[#555555]">
                      لم يتم إضافة خدمات للباقة بعد. اكتب الخدمة بالأعلى واضغط إضافة.
                    </span>
                  ) : (
                    planFormServices.map((srv, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-[#181818] text-white border border-[#00FF66]/30 px-2.5 py-1 rounded-xl flex items-center space-x-1.5 rtl:space-x-reverse"
                      >
                        <span className="text-[#00FF66]">✓</span>
                        <span>{srv}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveServiceTag(srv)}
                          className="text-[#666666] hover:text-red-400 cursor-pointer mr-1"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse pt-3 border-t border-[#202020]">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPlanModal(false);
                    setEditingPlan(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A0A0A0] hover:text-white cursor-pointer"
                >
                  إلغاء
                </button>
                <button type="submit" className="neon-btn px-6 py-2.5 rounded-xl text-xs font-bold cursor-pointer shadow-lg">
                  {editingPlan ? 'حفظ تعديلات الباقة' : 'إنشاء الباقة وتفعيلها فوراً'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal: Confirm Delete Plan (حذف الباقة في حال عدم وجود مشتركين) ─── */}
      {planToDelete && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-red-500/50 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-scaleIn space-y-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">تأكيد حذف الباقة</h3>
                <span className="text-xs text-[#A0A0A0]">هذا الإجراء لا يمكن التراجع عنه</span>
              </div>
            </div>

            <p className="text-xs text-white leading-relaxed bg-[#181818] p-3 rounded-xl border border-[#282828]">
              هل أنت متأكد من رغبتك في حذف باقة <strong className="text-red-400 font-bold font-mono">"{planToDelete.name}"</strong> نهائياً من نظام الصالة؟
            </p>

            <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse pt-2">
              <button
                type="button"
                onClick={() => setPlanToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A0A0A0] hover:text-white cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmDeletePlan}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              >
                نعم، حذف الباقة الآن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal: Member QR Pass (عرض وتصدير بطاقة الدخول الذكية QR للعضو) ─── */}
      {showMemberQrModal && qrModalMember && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#00FF66]/40 glow-border w-full max-w-md rounded-2xl p-6 shadow-2xl animate-scaleIn space-y-4 text-center">
            <div className="flex items-center justify-between pb-2 border-b border-[#282828]">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <QrCode size={20} className="text-[#00FF66]" />
                <h3 className="text-base font-bold text-white">بطاقة دخول الصالة الإلكترونية (QR Pass)</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowMemberQrModal(false);
                  setQrModalMember(null);
                }}
                className="text-[#666666] hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-white">{qrModalMember.name}</h4>
              <p className="text-xs text-[#00FF66] font-semibold">{qrModalMember.plan}</p>
              <p className="text-[11px] text-[#888888] font-mono">{qrModalMember.phone} • كود #{qrModalMember.id}</p>
            </div>

            {/* Rendered QR Code */}
            <div className="p-4 bg-black rounded-2xl border border-[#282828] inline-block shadow-inner mx-auto my-2">
              {qrModalCodeUrl ? (
                <img
                  src={qrModalCodeUrl}
                  alt={`QR Code Pass for ${qrModalMember.name}`}
                  className="w-52 h-52 mx-auto rounded-lg"
                />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center text-xs text-[#666666]">
                  جاري توليد الكود الرقمي...
                </div>
              )}
            </div>

            <div className="p-3 bg-[#181818] rounded-xl border border-[#282828] text-right space-y-1 text-xs">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#888888]">حالة صلاحية الدخول:</span>
                <span className={qrModalMember.status === 'نشط' ? 'text-[#00FF66] font-bold' : 'text-rose-400 font-bold'}>
                  {qrModalMember.status === 'نشط' ? 'صالح ومفعل على البوابات ✅' : 'منتهي الصلاحية ⛔'}
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#888888]">التحقق الذكي:</span>
                <span className="text-white">متوافق مع الهواتف الذكية وماكينات Turnstiles</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse pt-2">
              <button
                type="button"
                onClick={() => {
                  executeGateCheckin(qrModalMember, 'البوابة الرئيسية 1 (Turnstile A)', 'MOBILE_QR');
                  setShowMemberQrModal(false);
                }}
                className="neon-btn px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse flex-1 justify-center"
              >
                <Scan size={14} />
                <span>محاكاة مسح الكود على البوابة الآن</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMemberQrModal(false);
                  setQrModalMember(null);
                }}
                className="px-4 py-2.5 rounded-xl text-xs bg-[#1E1E1E] text-[#A0A0A0] hover:text-white cursor-pointer font-semibold border border-[#333333]"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal: Live QR Scan & Machine Turnstile Operations ─── */}
      {showScanModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#00FF66]/40 glow-border w-full max-w-xl rounded-2xl p-6 shadow-2xl animate-scaleIn space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#282828]">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Scan size={22} className="text-[#00FF66]" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    {scanMode === 'AUTO_CAMERA'
                      ? 'ماسح رمز الـ QR للبوابات الذكية (Smart Scanner)'
                      : scanMode === 'STATION_EMULATOR'
                      ? 'محاكي قارئ ماكينة البوابة الإلكترونية (Machine Turnstile Reader)'
                      : 'تسجيل الحضور اليدوي المباشر'}
                  </h3>
                  <span className="text-[11px] text-[#A0A0A0]">نظام التحقق الفوري من اشتراكات وتصاريح المرور</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowScanModal(false);
                  setLastCheckinResult(null);
                }}
                className="text-[#666666] hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mode Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#181818] rounded-xl border border-[#282828]">
              <button
                type="button"
                onClick={() => {
                  setScanMode('AUTO_CAMERA');
                  setLastCheckinResult(null);
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 rtl:space-x-reverse ${
                  scanMode === 'AUTO_CAMERA'
                    ? 'bg-[#00FF66] text-black shadow-md'
                    : 'text-[#A0A0A0] hover:text-white'
                }`}
              >
                <Smartphone size={15} />
                <span>مسح كود QR هاتف المتدرب</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setScanMode('STATION_EMULATOR');
                  setLastCheckinResult(null);
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 rtl:space-x-reverse ${
                  scanMode === 'STATION_EMULATOR'
                    ? 'bg-[#00FF66] text-black shadow-md'
                    : 'text-[#A0A0A0] hover:text-white'
                }`}
              >
                <Wifi size={15} />
                <span>محاكي ماكينة البوابة الإلكترونية</span>
              </button>
            </div>

            {/* Gate Station Selection */}
            <div>
              <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">حدد البوابة المراد فتحها وتسجيل الحضور عليها:</label>
              <select
                value={selectedScanGate}
                onChange={(e) => setSelectedScanGate(e.target.value)}
                className="w-full bg-[#181818] border border-[#282828] text-white text-xs rounded-xl px-3 py-2.5 focus:border-[#00FF66] focus:outline-none cursor-pointer"
              >
                {activeGates.map((g) => (
                  <option key={g.id} value={g.name}>
                    {g.name} ({g.ip}) — {g.mode}
                  </option>
                ))}
              </select>
            </div>

            {/* Scan Viewfinder Graphic when AUTO_CAMERA */}
            {scanMode === 'AUTO_CAMERA' && (
              <div className="p-6 bg-black rounded-2xl border border-[#282828] text-center space-y-3 relative overflow-hidden">
                <div className="w-48 h-48 mx-auto border-2 border-dashed border-[#00FF66] rounded-2xl flex flex-col items-center justify-center relative bg-[#0D0D0D]">
                  <div className="absolute inset-x-2 top-0 h-1 bg-[#00FF66] shadow-[0_0_12px_#00FF66] animate-bounce" />
                  <Camera size={36} className="text-[#00FF66] mb-2" />
                  <span className="text-[11px] text-[#A0A0A0] px-3">
                    وجه قارئ الكاميرا نحو شاشة هاتف المشترك
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-white">اختر المشترك لمحاكاة مسح الكود من هاتفه:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {members.map((mem) => (
                      <button
                        key={mem.id}
                        type="button"
                        onClick={() => executeGateCheckin(mem, selectedScanGate, 'MOBILE_QR')}
                        className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                          mem.status === 'نشط'
                            ? 'bg-[#181818] border-[#2C2C2C] hover:border-[#00FF66] hover:bg-[#1C281C]'
                            : 'bg-rose-950/20 border-rose-900/40 hover:border-rose-500'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{mem.name}</div>
                          <div className="text-[10px] text-[#888888] font-mono">{mem.plan}</div>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            mem.status === 'نشط'
                              ? 'bg-[#00FF66]/15 text-[#00FF66]'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {mem.status === 'نشط' ? 'مسح QR' : 'منتهي'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Machine Station Emulator */}
            {scanMode === 'STATION_EMULATOR' && (
              <div className="p-5 bg-black rounded-2xl border border-[#282828] space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#181818] border border-[#282828]">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Wifi size={18} className="text-cyan-400" />
                    <div>
                      <span className="text-xs font-bold text-white">وحدة التحكم بالماكينة: {selectedScanGate}</span>
                      <span className="text-[10px] text-[#666666] block">إشارة الاستشعار: مصفوفة بصرية رقمية (Laser Matrix)</span>
                    </div>
                  </div>
                  <span className="text-xs text-[#00FF66] font-mono font-bold bg-[#00FF66]/10 px-2 py-1 rounded-md">READY</span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">
                    اختر كارت أو رمز المشترك المعروض أمام حساس الماكينة:
                  </label>
                  <div className="space-y-2">
                    {members.map((mem) => (
                      <div
                        key={mem.id}
                        className="p-3 rounded-xl bg-[#141414] border border-[#282828] flex items-center justify-between"
                      >
                        <div>
                          <span className="text-xs font-bold text-white block">{mem.name}</span>
                          <span className="text-[11px] text-[#888888]">{mem.plan} • {mem.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <button
                            type="button"
                            onClick={() => executeGateCheckin(mem, selectedScanGate, 'TURNSTILE_STATION')}
                            className="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500 text-cyan-400 hover:text-black border border-cyan-500/30 text-xs font-bold transition-all cursor-pointer"
                          >
                            تمرير بالماكينة
                          </button>
                          <button
                            type="button"
                            onClick={() => executeGateCheckin(mem, selectedScanGate, 'DESKTOP_SCAN')}
                            className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-black border border-amber-500/30 text-xs font-bold transition-all cursor-pointer"
                          >
                            قارئ الباركود
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Check-in Outcome Display */}
            {lastCheckinResult && (
              <div
                className={`p-4 rounded-xl border animate-scaleIn text-right space-y-2 ${
                  lastCheckinResult.success
                    ? 'bg-emerald-950/30 border-emerald-500 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-500 text-rose-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm flex items-center space-x-1.5 rtl:space-x-reverse">
                    {lastCheckinResult.success ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                    <span>{lastCheckinResult.message}</span>
                  </span>
                  <span className="text-[11px] font-mono opacity-80">{lastCheckinResult.deviceType}</span>
                </div>
                {lastCheckinResult.success && (
                  <div className="text-xs grid grid-cols-2 gap-2 pt-1 border-t border-emerald-500/20 text-[#A0A0A0]">
                    <div>المشترك: <strong className="text-white">{lastCheckinResult.memberName}</strong></div>
                    <div>البوابة: <strong className="text-white">{lastCheckinResult.gate}</strong></div>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse pt-2 border-t border-[#202020]">
              <button
                type="button"
                onClick={() => {
                  setShowScanModal(false);
                  setLastCheckinResult(null);
                }}
                className="px-4 py-2 rounded-xl text-xs bg-[#1E1E1E] text-white hover:bg-[#252525] cursor-pointer font-semibold"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ─── Modal: Add / Edit Attendance Point (إضافة/تعديل نقطة حضور أو موظف استقبال) ─── */}
      {showAddPointModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#00FF66]/40 glow-border w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-scaleIn space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#282828]">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Shield size={20} className="text-[#00FF66]" />
                <h3 className="text-base font-bold text-white">
                  {editingPoint ? `تعديل بيانات (${editingPoint.name})` : 'إضافة نقطة حضور / موظف استقبال جديد'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddPointModal(false);
                  setEditingPoint(null);
                }}
                className="text-[#666666] hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[#A0A0A0]">
              يمكنك تخصيص نوع النقطة كـ "كاونتر موظف استقبال" يقوم بتسجيل الحضور، أو "بوابة مرور إلكترونية"، أو "جهاز تسجيل ذاتي".
            </p>

            <form onSubmit={handleSaveAttendancePoint} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">
                  نوع نقطة الحضور
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPointFormType('STAFF_DESK');
                      setPointFormMode('تسجيل حضور بواسطة الموظف');
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                      pointFormType === 'STAFF_DESK'
                        ? 'bg-purple-950/40 border-purple-500 text-purple-300'
                        : 'bg-[#181818] border-[#282828] text-[#888888] hover:text-white'
                    }`}
                  >
                    <User size={16} />
                    <span className="text-[11px] font-bold">موظف استقبال</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPointFormType('ELECTRONIC_GATE');
                      setPointFormMode('دخول تلقائي بالـ QR');
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                      pointFormType === 'ELECTRONIC_GATE'
                        ? 'bg-emerald-950/40 border-[#00FF66] text-[#00FF66]'
                        : 'bg-[#181818] border-[#282828] text-[#888888] hover:text-white'
                    }`}
                  >
                    <Wifi size={16} />
                    <span className="text-[11px] font-bold">بوابة إلكترونية</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPointFormType('DESKTOP_KIOSK');
                      setPointFormMode('مسح سريع بالباركود / QR');
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                      pointFormType === 'DESKTOP_KIOSK'
                        ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300'
                        : 'bg-[#181818] border-[#282828] text-[#888888] hover:text-white'
                    }`}
                  >
                    <Monitor size={16} />
                    <span className="text-[11px] font-bold">جهاز ذاتي / Kiosk</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">
                  اسم النقطة / عنوان الكاونتر
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    pointFormType === 'STAFF_DESK'
                      ? 'مثال: كاونتر الاستقبال - الصالة الرئيسية'
                      : 'مثال: بوابة الدخول الغربية 3'
                  }
                  value={pointFormName}
                  onChange={(e) => setPointFormName(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                />
              </div>

              {pointFormType === 'STAFF_DESK' && (
                <div>
                  <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">
                    اسم الموظف أو المشرف المسؤول عن التسجيل
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: أحمد كمال / الكابتن سامح"
                    value={pointFormSupervisor}
                    onChange={(e) => setPointFormSupervisor(e.target.value)}
                    className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">
                  الموقع داخل الصالة
                </label>
                <input
                  type="text"
                  placeholder="مثال: المدخل الرئيسي / صالة الحديد / المسبح"
                  value={pointFormLocation}
                  onChange={(e) => setPointFormLocation(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                />
              </div>

              {pointFormType !== 'STAFF_DESK' && (
                <div>
                  <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">
                    عنوان الشبكة الداخلي (IP Address)
                  </label>
                  <input
                    type="text"
                    placeholder="192.168.1.105"
                    value={pointFormIp}
                    onChange={(e) => setPointFormIp(e.target.value)}
                    className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-[#00FF66] focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-[#A0A0A0] block mb-1">
                  طريقة التشغيل والتسجيل
                </label>
                <input
                  type="text"
                  value={pointFormMode}
                  onChange={(e) => setPointFormMode(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse pt-3 border-t border-[#202020]">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPointModal(false);
                    setEditingPoint(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A0A0A0] hover:text-white cursor-pointer"
                >
                  إلغاء
                </button>
                <button type="submit" className="neon-btn px-5 py-2 rounded-xl text-xs font-bold cursor-pointer">
                  {editingPoint ? 'حفظ تعديلات النقطة' : 'إضافة وتفعيل النقطة الآن'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
