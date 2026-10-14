'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Dumbbell,
  Plus,
  Flame,
  Award,
  ShoppingBag,
  Megaphone,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  Calendar,
  Activity,
  DollarSign,
  Layers,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Scale,
  Utensils,
  Share2,
  Check,
  UserCheck,
  Search,
  Filter,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export interface Trainee {
  id: string;
  name: string;
  email: string;
  phone: string;
  goal: string;
  currentWeight: number;
  targetWeight: number;
  height: number;
  bodyFat: number;
  muscleMass: number;
  activePlan: string;
  lastWorkout: string;
  attendanceRate: number;
  joinDate: string;
  vipTier: string;
}

const mockTrainees: Trainee[] = [
  {
    id: 't-1',
    name: 'mr mostafa',
    email: 'mr.mostafa@pulsops.com',
    phone: '01023456789',
    goal: 'زيادة الكتلة العضلية وضخامة صافية',
    currentWeight: 81.0,
    targetWeight: 84.0,
    height: 182,
    bodyFat: 14.8,
    muscleMass: 41.2,
    activePlan: 'جدول تمارين الكوتش mostafa المتقدم (Push-Pull-Legs)',
    lastWorkout: 'اليوم، 04:15 ص (بوابة المرور الذكية)',
    attendanceRate: 96,
    joinDate: 'نوفمبر 2025',
    vipTier: 'الباقة الذهبية السنوية VIP',
  },
  {
    id: 't-2',
    name: 'عمر شريف',
    email: 'omar.sherif@pulsops.com',
    phone: '01011223344',
    goal: 'حرق الدهون ورفع اللياقة البدنية',
    currentWeight: 92.5,
    targetWeight: 82.0,
    height: 178,
    bodyFat: 24.2,
    muscleMass: 37.8,
    activePlan: 'برنامج الكارديو وحرق الدهون HIIT',
    lastWorkout: 'منذ يومين (ديدلفت + ظهر)',
    attendanceRate: 88,
    joinDate: 'يناير 2026',
    vipTier: 'الباقة الفضية ربع سنوية',
  },
  {
    id: 't-3',
    name: 'ناصر الكندي',
    email: 'nasser.k@pulsops.com',
    phone: '01055667788',
    goal: 'إعداد بطولات باورليفتنج والقوة القصوى',
    currentWeight: 88.0,
    targetWeight: 90.0,
    height: 180,
    bodyFat: 17.5,
    muscleMass: 42.5,
    activePlan: 'برنامج 5x5 للقوة الانفجارية والسكوات',
    lastWorkout: 'اليوم (سكوات + عضلات الجذع)',
    attendanceRate: 92,
    joinDate: 'فبراير 2026',
    vipTier: 'الباقة الذهبية السنوية VIP',
  },
  {
    id: 't-4',
    name: 'كريم عبد العزيز',
    email: 'kareem.a@pulsops.com',
    phone: '01099887766',
    goal: 'لياقة عامة ومرونة عضلية واستشفاء',
    currentWeight: 75.0,
    targetWeight: 78.0,
    height: 175,
    bodyFat: 16.0,
    muscleMass: 36.5,
    activePlan: 'نظام Upper/Lower 4 أيام أسبوعياً',
    lastWorkout: 'منذ 3 أيام (أكتاف وكارديو)',
    attendanceRate: 84,
    joinDate: 'مارس 2026',
    vipTier: 'الباقة الشهرية الأساسية',
  },
];

const mockWorkoutsPresets = [
  {
    id: 'w-push',
    title: 'تمارين الصدر والأكتاف والترايسبس (Push Day)',
    exercises: [
      { id: 'ex-1', name: 'بنش برس مائل بالبار الحر (Incline Barbell Press)', sets: 4, reps: '8-10', rest: 90, targetMuscle: 'الصدر العلوي' },
      { id: 'ex-2', name: 'تجميع دمبل بنش مستوي (Flat DB Fly)', sets: 3, reps: '10-12', rest: 75, targetMuscle: 'الصدر الأوسط' },
      { id: 'ex-3', name: 'ضغط أكتاف بالبار واقفا (Military Press)', sets: 3, reps: '8-10', rest: 75, targetMuscle: 'الكتف الأمامي والجانبي' },
      { id: 'ex-4', name: 'رفرفة جانبي بالكابل (Cable Lateral Raises)', sets: 4, reps: '12-15', rest: 60, targetMuscle: 'الكتف الجانبي' },
      { id: 'ex-5', name: 'ترايسبس بالحبل أعلى الرأس (Overhead Cable Triceps)', sets: 3, reps: '12', rest: 60, targetMuscle: 'الترايسبس الرأس الطويل' },
    ],
  },
  {
    id: 'w-pull',
    title: 'تمارين الظهر والبايسبس والسمانة (Pull Day)',
    exercises: [
      { id: 'ex-11', name: 'عقلة بأوزان إضافية (Weighted Pull-ups)', sets: 4, reps: '6-8', rest: 90, targetMuscle: 'عضلات الظهر واللاتس' },
      { id: 'ex-12', name: 'سحب أرضي بالبار قبضة مقلوبة (Barbell Row)', sets: 4, reps: '8-10', rest: 90, targetMuscle: 'منتصف الظهر والسمك' },
      { id: 'ex-13', name: 'سحب عالي كابل ضيق (Close-Grip Pulldown)', sets: 3, reps: '10-12', rest: 75, targetMuscle: 'أسفل اللاتس' },
      { id: 'ex-14', name: 'تبادل دمبل بايسبس مائل (Incline Biceps Curl)', sets: 4, reps: '10-12', rest: 60, targetMuscle: 'عضلة البايسبس' },
      { id: 'ex-15', name: 'همر كيرل بالحبل على الكابل (Cable Hammer Curls)', sets: 3, reps: '12-15', rest: 60, targetMuscle: 'الساعد وعضلة البراكيلس' },
    ],
  },
  {
    id: 'w-legs',
    title: 'تمارين الأرجل والسمانة الشاملة (Leg Day)',
    exercises: [
      { id: 'ex-21', name: 'سكوات بالبار الخلفي (Back Barbell Squats)', sets: 4, reps: '6-8', rest: 120, targetMuscle: 'الفخذ الأمامي والكوادز' },
      { id: 'ex-22', name: 'دفع رجل على الجهاز 45 درجة (Leg Press)', sets: 4, reps: '10-12', rest: 90, targetMuscle: 'الفخذين بالكامل' },
      { id: 'ex-23', name: 'ديدلفت روماني بالدمبل (Romanian Deadlift)', sets: 4, reps: '8-10', rest: 90, targetMuscle: 'الفخذ الخلفي والأوتار' },
      { id: 'ex-24', name: 'مد أرجل أمامي بالجهاز (Leg Extensions)', sets: 3, reps: '12-15', rest: 60, targetMuscle: 'رؤوس الفخذ الأمامية' },
      { id: 'ex-25', name: 'رفع سمانة واقفا على الجهاز (Calf Raises)', sets: 4, reps: '15-20', rest: 45, targetMuscle: 'عضلات السمانة' },
    ],
  },
];

const mockTraineeInBodyHistory = [
  { date: '1 يونيو', weight: 88.5, bodyFat: 23.4, muscleMass: 38.1 },
  { date: '1 يوليو', weight: 86.2, bodyFat: 21.0, muscleMass: 39.0 },
  { date: '1 أغسطس', weight: 84.0, bodyFat: 18.8, muscleMass: 39.8 },
  { date: '1 سبتمبر', weight: 82.5, bodyFat: 16.5, muscleMass: 40.5 },
  { date: '1 أكتوبر', weight: 81.0, bodyFat: 14.8, muscleMass: 41.2 },
];

interface TrainerDashboardProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export const TrainerDashboard: React.FC<TrainerDashboardProps> = ({
  activeTab = 'overview',
  onTabChange,
}) => {
  const [trainees, setTrainees] = useState<Trainee[]>(mockTrainees);
  const [selectedTrainee, setSelectedTrainee] = useState<Trainee>(mockTrainees[0]);
  const [searchTerm, setSearchTerm] = useState('');

  // Workout Builder State
  const [workoutRoutineTitle, setWorkoutRoutineTitle] = useState('تمارين اليوم المحددة (عضلات الجزء العلوي والأكتاف)');
  const [exercises, setExercises] = useState(mockWorkoutsPresets[0].exercises);
  const [newExName, setNewExName] = useState('');
  const [newExSets, setNewExSets] = useState(4);
  const [newExReps, setNewExReps] = useState('8-10');
  const [newExRest, setNewExRest] = useState(60);
  const [newExMuscle, setNewExMuscle] = useState('');
  const [planSaved, setPlanSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Nutrition State
  const [caloriesTarget, setCaloriesTarget] = useState(2650);
  const [proteinTarget, setProteinTarget] = useState(210);
  const [carbsTarget, setCarbsTarget] = useState(260);
  const [fatsTarget, setFatsTarget] = useState(60);
  const [dietPlanTitle, setDietPlanTitle] = useState('نظام الضخامة الصافية للبطولات (Clean Bulk)');
  const [dietSaved, setDietSaved] = useState(false);

  // InBody & Pending Requests State
  const [pendingInbodyRequests, setPendingInbodyRequests] = useState([
    {
      id: 'req-1',
      traineeName: 'mr mostafa',
      phone: '01023456789',
      requestedTime: 'اليوم، 05:30 م (في الصالة)',
      status: 'في انتظار التأكيد',
      notes: 'فحص دوري لمتابعة الزيادة العضلية للشهر الحالي',
    },
  ]);
  const [inbodyRequestConfirmed, setInbodyRequestConfirmed] = useState<string | null>(null);

  // New Measurement Form
  const [newWeight, setNewWeight] = useState('81.2');
  const [newFat, setNewFat] = useState('14.5');
  const [newMuscle, setNewMuscle] = useState('41.5');
  const [measurementSaved, setMeasurementSaved] = useState(false);

  // Products with Coach Commission
  const trainerProducts = [
    { id: 'p-1', name: 'أوبتيموم جولد واي بروتين 5 باوند', category: 'بروتين', price: 3950, stock: 34, commission: '150 ج.م', image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400&auto=format&fit=crop&q=80' },
    { id: 'p-2', name: 'كرياتين ميكرونايزد نقي 500 جرام', category: 'قوة واستشفاء', price: 1750, stock: 18, commission: '80 ج.م', image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&auto=format&fit=crop&q=80' },
    { id: 'p-3', name: 'طاقة وتمرين C4 بنكهة الفواكه', category: 'طاقة وبومب', price: 2250, stock: 22, commission: '100 ج.م', image: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=400&auto=format&fit=crop&q=80' },
    { id: 'p-4', name: 'أحزمة رفع أثقال تيتان الأصلية', category: 'مستلزمات رياضية', price: 900, stock: 50, commission: '50 ج.م', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80' },
  ];

  const [recommendNotice, setRecommendNotice] = useState<string | null>(null);

  // Promotional Gym Banner
  const gymBanner = {
    title: 'خصم 25% على مكملات البروتين والكرياتين',
    subtitle: 'عرض حصري لأعضاء نادي PulsOps الرياضي لفترة محدودة بمناسبة انطلاق الموسم التدريبي',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80',
    badge: 'عرض خاص للمشتركين والمدربين',
    ctaText: 'التوصية للمتدربين',
  };

  // Sync workout if saved in storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pulsops_member_daily_workout');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.exercises?.length) setExercises(parsed.exercises);
          if (parsed.title) setWorkoutRoutineTitle(parsed.title);
        } catch {}
      }
    }
  }, [selectedTrainee]);

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExName.trim()) return;
    const newEx = {
      id: `ex-${Date.now()}`,
      name: newExName.trim(),
      sets: Number(newExSets) || 3,
      reps: newExReps.trim() || '8-10',
      rest: Number(newExRest) || 60,
      targetMuscle: newExMuscle.trim() || 'عضلة مستهدفة',
    };
    setExercises((prev) => [...prev, newEx]);
    setNewExName('');
    setNewExMuscle('');
  };

  const handleDeleteExercise = (id: string) => {
    setExercises((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSavePlan = async () => {
    setIsSaving(true);
    const payload = {
      title: workoutRoutineTitle,
      subtitle: `محددة بواسطة الكوتش mostafa للمتدرب ${selectedTrainee.name}`,
      dayNumber: 'تمارين اليوم المعتمدة من الكوتش',
      prescribedBy: 'الكوتش mostafa (مدرب معتمد)',
      exercises,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('pulsops_member_daily_workout', JSON.stringify(payload));
      window.dispatchEvent(new Event('pulsops_workout_updated'));
    }

    try {
      await fetch(`http://localhost:5000/api/gyms/gym-titan/members/usr-member/daily-workout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {}

    setIsSaving(false);
    setPlanSaved(true);
    setTimeout(() => setPlanSaved(false), 4000);
  };

  const handleSaveDiet = () => {
    setDietSaved(true);
    setTimeout(() => setDietSaved(false), 3500);
  };

  const handleConfirmInBody = (id: string, name: string) => {
    setPendingInbodyRequests((prev) => prev.filter((r) => r.id !== id));
    setInbodyRequestConfirmed(`تم تأكيد موعد فحص InBody بنجاح للمتدرب (${name}) وإرسال إشعار فوري له!`);
    setTimeout(() => setInbodyRequestConfirmed(null), 4000);
  };

  const handleRecordMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    setMeasurementSaved(true);
    setTimeout(() => setMeasurementSaved(false), 3500);
  };

  const handleRecommendProduct = (prodName: string) => {
    setRecommendNotice(`تم إرسال توصية المنتج (${prodName}) إلى المتدرب (${selectedTrainee.name}) واحتساب كود العمولة!`);
    setTimeout(() => setRecommendNotice(null), 4000);
  };

  const filteredTrainees = trainees.filter(
    (t) => t.name.includes(searchTerm) || t.phone.includes(searchTerm) || t.goal.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ─── Trainer Header ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3 rtl:space-x-reverse">
            <span>منصة الكوتش mostafa — لوحة المدرب</span>
            <span className="text-xs bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40 px-2.5 py-0.5 rounded-full font-mono">
              مدرب معتمد
            </span>
          </h1>
          <p className="text-sm text-[#A0A0A0] mt-1">
            تصميم جداول التمارين المخصصة، متابعة القياسات الحيوية، واحتساب العمولات الشهرية بالجنيه المصري.
          </p>
        </div>

        <div className="flex items-center space-x-3 rtl:space-x-reverse bg-[#181818] border border-[#282828] px-4 py-2 rounded-xl">
          <Award size={18} className="text-[#00FF66]" />
          <span className="text-xs text-[#A0A0A0]">عمولة شهر أكتوبر:</span>
          <span className="text-sm font-black text-[#00FF66] font-mono">18,500 ج.م</span>
        </div>
      </div>

      {/* Global Alerts / Toasts */}
      {recommendNotice && (
        <div className="p-3.5 rounded-xl bg-[#00FF66]/20 border border-[#00FF66] text-[#00FF66] text-xs font-bold animate-fadeIn flex items-center space-x-2 rtl:space-x-reverse">
          <CheckCircle2 size={16} />
          <span>{recommendNotice}</span>
        </div>
      )}

      {inbodyRequestConfirmed && (
        <div className="p-3.5 rounded-xl bg-[#00FF66]/20 border border-[#00FF66] text-[#00FF66] text-xs font-bold animate-fadeIn flex items-center space-x-2 rtl:space-x-reverse">
          <CheckCircle2 size={16} />
          <span>{inbodyRequestConfirmed}</span>
        </div>
      )}

      {/* ─── TAB 1: OVERVIEW (نظرة عامة والمركز الرئيسي) ───────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Trainer KPI Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#141414] border border-[#242424] hover:border-[#00FF66]/40 transition-all shadow-md">
              <div className="flex items-center justify-between text-[#888888] mb-2">
                <span className="text-xs font-semibold">المتدربون المخصصون</span>
                <Users size={18} className="text-[#00FF66]" />
              </div>
              <div className="text-2xl font-black text-white font-mono">{trainees.length} متدربين</div>
              <p className="text-[11px] text-[#00FF66] mt-1 font-medium flex items-center space-x-1 rtl:space-x-reverse">
                <span>المتدرب المميز: {selectedTrainee.name}</span>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#141414] border border-[#242424] hover:border-[#00FF66]/40 transition-all shadow-md">
              <div className="flex items-center justify-between text-[#888888] mb-2">
                <span className="text-xs font-semibold">جلسات اليوم المجدولة</span>
                <Clock size={18} className="text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">3 جلسات PT</div>
              <p className="text-[11px] text-[#A0A0A0] mt-1">جلسة اليوم: mr mostafa (05:00 م)</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#141414] border border-[#242424] hover:border-[#00FF66]/40 transition-all shadow-md">
              <div className="flex items-center justify-between text-[#888888] mb-2">
                <span className="text-xs font-semibold">عمولات متجر الصالة</span>
                <ShoppingBag size={18} className="text-purple-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">4,500 ج.م</div>
              <p className="text-[11px] text-[#A0A0A0] mt-1">من 28 منتج تم تزكيته</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#141414] border border-[#242424] hover:border-[#00FF66]/40 transition-all shadow-md">
              <div className="flex items-center justify-between text-[#888888] mb-2">
                <span className="text-xs font-semibold">معدل التزام المتدربين</span>
                <Activity size={18} className="text-amber-400" />
              </div>
              <div className="text-2xl font-black text-[#00FF66] font-mono">94%</div>
              <p className="text-[11px] text-[#A0A0A0] mt-1">حضور منتظم خلال الأسبوع</p>
            </div>
          </div>

          {/* Promotional Banner */}
          {gymBanner && (
            <div
              className="relative rounded-2xl overflow-hidden border border-[#282828] bg-cover bg-center h-44 sm:h-48 flex flex-col justify-between p-6 shadow-2xl glow-border"
              style={{ backgroundImage: `linear-gradient(to top, rgba(10,10,10,0.92), rgba(10,10,10,0.45)), url(${gymBanner.imageUrl})` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold bg-[#00FF66] text-[#0A0A0A] px-3 py-1 rounded-full shadow-[0_0_12px_rgba(0,255,102,0.4)] flex items-center space-x-1.5 rtl:space-x-reverse">
                  <Megaphone size={13} />
                  <span>{gymBanner.badge}</span>
                </span>
                <span className="text-[11px] text-[#A0A0A0] bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                  إعلان إدارة نادي PulsOps
                </span>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-black text-white">{gymBanner.title}</h2>
                <p className="text-xs text-[#A0A0A0] mt-1 max-w-xl">{gymBanner.subtitle}</p>
                {onTabChange && (
                  <button
                    onClick={() => onTabChange('store')}
                    className="mt-3 px-3.5 py-1.5 rounded-xl bg-[#00FF66] text-black text-xs font-bold hover:bg-[#39FF14] transition-all cursor-pointer inline-flex items-center space-x-1 rtl:space-x-reverse"
                  >
                    <span>{gymBanner.ctaText}</span>
                    <ArrowLeft size={13} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Active Highlight Trainee Card & Quick Links */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-2xl bg-[#141414] border border-[#242424] space-y-4">
              <div className="flex items-center justify-between border-b border-[#222222] pb-3">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-10 h-10 rounded-xl bg-[#00FF66]/20 text-[#00FF66] flex items-center justify-center font-bold font-mono">
                    VIP
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                      <span>المتدرب الرئيسي المخصص: {selectedTrainee.name}</span>
                      <span className="text-[10px] bg-[#00FF66]/20 text-[#00FF66] px-2 py-0.5 rounded-full font-mono">
                        {selectedTrainee.vipTier}
                      </span>
                    </h3>
                    <p className="text-xs text-[#A0A0A0]">{selectedTrainee.goal}</p>
                  </div>
                </div>
                {onTabChange && (
                  <button
                    onClick={() => onTabChange('workouts')}
                    className="neon-btn px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1 rtl:space-x-reverse cursor-pointer"
                  >
                    <Dumbbell size={14} />
                    <span>تعديل تمارينه</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-[#181818] rounded-xl border border-[#282828]">
                  <span className="text-[10px] text-[#888888] block">الوزن الحالي</span>
                  <span className="text-base font-black text-white font-mono">{selectedTrainee.currentWeight} كجم</span>
                </div>
                <div className="p-3 bg-[#181818] rounded-xl border border-[#282828]">
                  <span className="text-[10px] text-[#888888] block">الوزن المستهدف</span>
                  <span className="text-base font-black text-[#00FF66] font-mono">{selectedTrainee.targetWeight} كجم</span>
                </div>
                <div className="p-3 bg-[#181818] rounded-xl border border-[#282828]">
                  <span className="text-[10px] text-[#888888] block">نسبة الدهون</span>
                  <span className="text-base font-black text-cyan-400 font-mono">{selectedTrainee.bodyFat}%</span>
                </div>
                <div className="p-3 bg-[#181818] rounded-xl border border-[#282828]">
                  <span className="text-[10px] text-[#888888] block">نسبة الالتزام</span>
                  <span className="text-base font-black text-emerald-400 font-mono">{selectedTrainee.attendanceRate}%</span>
                </div>
              </div>

              <div className="pt-2 text-xs text-[#888888] flex items-center justify-between">
                <span>آخر تسجيل حضور مؤكد بالـ QR: <strong className="text-white">{selectedTrainee.lastWorkout}</strong></span>
                {onTabChange && (
                  <button
                    onClick={() => onTabChange('assigned_members')}
                    className="text-[#00FF66] hover:underline cursor-pointer font-bold"
                  >
                    عرض جميع المتدربين ←
                  </button>
                )}
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="p-6 rounded-2xl bg-[#141414] border border-[#242424] space-y-3 flex flex-col justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                <Sparkles size={16} className="text-[#00FF66]" />
                <span>إجراءات تدريبية سريعة</span>
              </h3>

              <div className="space-y-2">
                {onTabChange && (
                  <>
                    <button
                      onClick={() => onTabChange('workouts')}
                      className="w-full p-2.5 rounded-xl bg-[#181818] hover:bg-[#202020] border border-[#282828] hover:border-[#00FF66] text-xs font-semibold text-white flex items-center justify-between cursor-pointer transition-all"
                    >
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Dumbbell size={15} className="text-[#00FF66]" />
                        <span>منشئ التمارين والبرامج</span>
                      </div>
                      <ChevronRight size={14} className="text-[#666666]" />
                    </button>

                    <button
                      onClick={() => onTabChange('nutrition')}
                      className="w-full p-2.5 rounded-xl bg-[#181818] hover:bg-[#202020] border border-[#282828] hover:border-[#00FF66] text-xs font-semibold text-white flex items-center justify-between cursor-pointer transition-all"
                    >
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Flame size={15} className="text-orange-400" />
                        <span>تعديل السعرات والماكروز</span>
                      </div>
                      <ChevronRight size={14} className="text-[#666666]" />
                    </button>

                    <button
                      onClick={() => onTabChange('inbody')}
                      className="w-full p-2.5 rounded-xl bg-[#181818] hover:bg-[#202020] border border-[#282828] hover:border-[#00FF66] text-xs font-semibold text-white flex items-center justify-between cursor-pointer transition-all"
                    >
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Scale size={15} className="text-cyan-400" />
                        <span>فحوصات وقياسات InBody</span>
                      </div>
                      <ChevronRight size={14} className="text-[#666666]" />
                    </button>

                    <button
                      onClick={() => onTabChange('earnings')}
                      className="w-full p-2.5 rounded-xl bg-[#181818] hover:bg-[#202020] border border-[#282828] hover:border-[#00FF66] text-xs font-semibold text-white flex items-center justify-between cursor-pointer transition-all"
                    >
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <DollarSign size={15} className="text-[#00FF66]" />
                        <span>تقرير العمولات المالية</span>
                      </div>
                      <ChevronRight size={14} className="text-[#666666]" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: ASSIGNED MEMBERS (المتدربون المخصصون) ───────────── */}
      {activeTab === 'assigned_members' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-2xl bg-[#141414] border border-[#242424] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                  <Users size={20} className="text-[#00FF66]" />
                  <span>قائمة المتدربين المخصصين للكوتش mostafa</span>
                </h2>
                <p className="text-xs text-[#A0A0A0]">
                  اختر أي متدرب لمراجعة قياساته، ضبط جدوله التدريبي وغذائه فورياً.
                </p>
              </div>

              {/* Search Trainees */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="بحث عن متدرب..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#181818] border border-[#282828] rounded-xl px-3.5 py-2 pl-9 text-xs text-white placeholder-[#666666] focus:border-[#00FF66] focus:outline-none"
                />
                <Search size={14} className="absolute left-3 top-3 text-[#666666]" />
              </div>
            </div>

            {/* Trainees Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {filteredTrainees.map((t) => {
                const isSelected = selectedTrainee.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTrainee(t)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#181818] border-[#00FF66] shadow-[0_0_20px_rgba(0,255,102,0.18)]'
                        : 'bg-[#181818] border-[#282828] hover:border-[#00FF66]/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white flex items-center space-x-1.5 rtl:space-x-reverse">
                          <span>{t.name}</span>
                          {t.id === 't-1' && (
                            <span className="text-[10px] bg-[#00FF66] text-black px-1.5 rounded font-black font-mono">
                              VIP
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] bg-[#121212] text-[#00FF66] px-2 py-0.5 rounded border border-[#282828] font-mono">
                          {t.currentWeight} كجم
                        </span>
                      </div>
                      <p className="text-xs text-[#00FF66] font-medium mt-1 leading-snug">{t.goal}</p>

                      <div className="mt-3 text-[11px] text-[#A0A0A0] space-y-1.5">
                        <div className="flex justify-between">
                          <span>نسبة الدهون:</span>
                          <span className="text-white font-mono">{t.bodyFat}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>نسبة الالتزام:</span>
                          <span className="text-[#00FF66] font-mono font-bold">{t.attendanceRate}%</span>
                        </div>
                        <div className="truncate">
                          <span>البرنامج: </span>
                          <span className="text-white">{t.activePlan}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#242424] flex items-center justify-between text-xs">
                      <span className="text-[#666666] text-[10px] font-mono">{t.phone}</span>
                      {isSelected ? (
                        <span className="text-[#00FF66] text-[11px] font-bold flex items-center space-x-1 rtl:space-x-reverse">
                          <Check size={13} />
                          <span>محدد حالياً</span>
                        </span>
                      ) : (
                        <span className="text-[#A0A0A0] hover:text-white text-[11px]">اختيار ←</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: WORKOUTS (الجداول التدريبية والتمارين) ─────────── */}
      {activeTab === 'workouts' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Preset Workouts Selector */}
          <div className="p-4 rounded-2xl bg-[#141414] border border-[#242424] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Sparkles size={16} className="text-[#00FF66]" />
              <span className="text-xs font-bold text-white">قوالب تدريبية سريعة جاهزة للاعتماد:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {mockWorkoutsPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setWorkoutRoutineTitle(preset.title);
                    setExercises(preset.exercises);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#1A1A1A] hover:bg-[#00FF66]/20 border border-[#282828] hover:border-[#00FF66] text-xs font-semibold text-white transition-all cursor-pointer"
                >
                  {preset.title.split('(')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Workout Routine Builder */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-[#242424] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                  <Dumbbell size={18} className="text-[#00FF66]" />
                  <span>منشئ التمارين والبرامج — المتدرب ({selectedTrainee.name})</span>
                </h2>
                <p className="text-xs text-[#A0A0A0]">
                  تحديد الجولات والتكرارات وفترات الراحة مع المزامنة اللحظية مع تطبيق المشترك
                </p>
              </div>
              <button
                onClick={handleSavePlan}
                disabled={isSaving}
                className="neon-btn px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center space-x-1.5 rtl:space-x-reverse shadow-lg shadow-[#00FF66]/20"
              >
                <Sparkles size={14} />
                <span>{isSaving ? 'جاري النشر والمزامنة...' : 'إرسال ونشر للمتدرب فوراً'}</span>
              </button>
            </div>

            {/* Workout Routine Title Input */}
            <div className="p-3 bg-[#181818] border border-[#282828] rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <span className="text-xs text-[#00FF66] font-bold whitespace-nowrap">عنوان روتين اليوم:</span>
              <input
                type="text"
                value={workoutRoutineTitle}
                onChange={(e) => setWorkoutRoutineTitle(e.target.value)}
                placeholder="مثال: تمارين الصدر والكتف المتقدمة"
                className="w-full bg-[#121212] border border-[#282828] rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#00FF66] focus:outline-none"
              />
            </div>

            {planSaved && (
              <div className="p-3.5 rounded-xl bg-[#00FF66]/20 border border-[#00FF66] text-[#00FF66] text-xs font-bold animate-fadeIn flex items-center space-x-2 rtl:space-x-reverse">
                <CheckCircle2 size={16} />
                <span>تم تحديث ونقل الجدول التدريبي بنجاح إلى تطبيق {selectedTrainee.name}!</span>
              </div>
            )}

            {/* Exercises List */}
            <div className="space-y-2.5">
              {exercises.map((ex, idx) => (
                <div
                  key={ex.id || idx}
                  className="p-3.5 rounded-xl bg-[#181818] border border-[#282828] flex items-center justify-between text-xs hover:border-[#00FF66]/40 transition-colors"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="w-6 h-6 rounded-md bg-[#222222] text-[#00FF66] font-bold flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-white block">{ex.name}</span>
                      {ex.targetMuscle && (
                        <span className="text-[10px] text-[#A0A0A0]">{ex.targetMuscle}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse font-mono text-[#A0A0A0]">
                      <span className="bg-[#121212] px-2 py-0.5 rounded border border-[#282828] text-white">{ex.sets} جولات</span>
                      <span className="bg-[#121212] px-2 py-0.5 rounded border border-[#282828] text-white">{ex.reps} تكرار</span>
                      <span className="text-[#00FF66] bg-[#00FF66]/10 px-2 py-0.5 rounded">راحة {ex.rest}ث</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteExercise(ex.id)}
                      className="p-1 text-[#666666] hover:text-red-400 transition-colors cursor-pointer"
                      title="حذف التمرين"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Exercise Inline Form */}
            <form onSubmit={handleAddExercise} className="p-4 rounded-xl bg-[#181818] border border-[#282828] space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                <Plus size={14} className="text-[#00FF66]" />
                <span>إضافة تمرين جديد للجلسة التدريبية</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
                <input
                  type="text"
                  placeholder="اسم التمرين (مثال: سكوات حر بالبار)"
                  value={newExName}
                  onChange={(e) => setNewExName(e.target.value)}
                  className="sm:col-span-2 bg-[#121212] border border-[#282828] rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="العضلة المستهدفة (مثال: أرجل أمامية)"
                  value={newExMuscle}
                  onChange={(e) => setNewExMuscle(e.target.value)}
                  className="bg-[#121212] border border-[#282828] rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="الجولات (3)"
                  value={newExSets}
                  onChange={(e) => setNewExSets(Number(e.target.value))}
                  className="bg-[#121212] border border-[#282828] rounded-lg px-2 py-1.5 text-xs text-white focus:border-[#00FF66] focus:outline-none text-center font-mono"
                />
                <input
                  type="text"
                  placeholder="التكرارات (8-10)"
                  value={newExReps}
                  onChange={(e) => setNewExReps(e.target.value)}
                  className="bg-[#121212] border border-[#282828] rounded-lg px-2 py-1.5 text-xs text-white focus:border-[#00FF66] focus:outline-none text-center font-mono"
                />
                <button type="submit" className="neon-btn py-1.5 rounded-lg text-xs flex items-center justify-center space-x-1 rtl:space-x-reverse cursor-pointer font-bold">
                  <Plus size={14} />
                  <span>إضافة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── TAB 4: NUTRITION (الأنظمة الغذائية والماكروز) ──────────── */}
      {activeTab === 'nutrition' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-2xl bg-[#141414] border border-[#242424] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                  <Flame size={18} className="text-[#00FF66]" />
                  <span>مخطط السعرات والماكروز اليومية — المتدرب ({selectedTrainee.name})</span>
                </h2>
                <p className="text-xs text-[#A0A0A0]">
                  حساب احتياجات البروتين والكاربوهيدرات والدهون الصحية مع عكسها على تطبيق المتدرب
                </p>
              </div>
              <button
                onClick={handleSaveDiet}
                className="neon-btn px-4 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse"
              >
                <CheckCircle2 size={14} />
                <span>حفظ وتحديث خطة التغذية للمتدرب</span>
              </button>
            </div>

            {dietSaved && (
              <div className="p-3.5 rounded-xl bg-[#00FF66]/20 border border-[#00FF66] text-[#00FF66] text-xs font-bold animate-fadeIn">
                ✅ تم حفظ خطة التغذية والماكروز وإرسال إشعار فوري لتطبيق {selectedTrainee.name}!
              </div>
            )}

            {/* Diet Plan Title Input */}
            <div className="p-3 bg-[#181818] border border-[#282828] rounded-xl flex items-center gap-2">
              <span className="text-xs text-[#00FF66] font-bold whitespace-nowrap">اسم الخطة الغذائية:</span>
              <input
                type="text"
                value={dietPlanTitle}
                onChange={(e) => setDietPlanTitle(e.target.value)}
                className="w-full bg-[#121212] border border-[#282828] rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#00FF66] focus:outline-none"
              />
            </div>

            {/* Interactive Macros Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#181818] border border-[#282828] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#A0A0A0]">الهدف اليومي من السعرات</span>
                  <span className="text-white font-mono font-bold">{caloriesTarget} kcal</span>
                </div>
                <input
                  type="range"
                  min="1500"
                  max="4000"
                  step="50"
                  value={caloriesTarget}
                  onChange={(e) => setCaloriesTarget(Number(e.target.value))}
                  className="w-full accent-[#00FF66] cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#181818] border border-[#282828] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-400">البروتين المستهدف</span>
                  <span className="text-white font-mono font-bold">{proteinTarget}g</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="300"
                  step="5"
                  value={proteinTarget}
                  onChange={(e) => setProteinTarget(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#181818] border border-[#282828] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-cyan-400">الكربوهيدرات</span>
                  <span className="text-white font-mono font-bold">{carbsTarget}g</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="450"
                  step="10"
                  value={carbsTarget}
                  onChange={(e) => setCarbsTarget(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#181818] border border-[#282828] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-amber-400">الدهون الصحية</span>
                  <span className="text-white font-mono font-bold">{fatsTarget}g</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="120"
                  step="5"
                  value={fatsTarget}
                  onChange={(e) => setFatsTarget(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Prescribed Meals Overview */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-white flex items-center space-x-1.5 rtl:space-x-reverse">
                <Utensils size={15} className="text-[#00FF66]" />
                <span>توزيع الوجبات اليومية الموصوفة</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 bg-[#181818] rounded-xl border border-[#282828]">
                  <span className="text-xs font-bold text-white block">الوجبة 1 (الإفطار الصباحي)</span>
                  <p className="text-[11px] text-[#A0A0A0] mt-1">5 بياض بيض + بيضة كاملة + 80g شوفان مع التوت وملعقة زبدة فول سوداني</p>
                </div>
                <div className="p-3.5 bg-[#181818] rounded-xl border border-[#282828]">
                  <span className="text-xs font-bold text-white block">الوجبة 2 (قبل التمرين بـ ساعتين)</span>
                  <p className="text-[11px] text-[#A0A0A0] mt-1">200g صدور دجاج مشوية + 200g أرز بسمتي مسلوق + خضار سوتيه</p>
                </div>
                <div className="p-3.5 bg-[#181818] rounded-xl border border-[#282828]">
                  <span className="text-xs font-bold text-white block">الوجبة 3 (وجبة الاستشفاء والعشاء)</span>
                  <p className="text-[11px] text-[#A0A0A0] mt-1">1 سكوب واي بروتين مع ماء + 180g لحم بقري صافي + بطاطا حلوة مشوية</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 5: INBODY (القياسات الحيوية وفحوصات InBody) ───────── */}
      {activeTab === 'inbody' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Pending InBody Requests From Trainees */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-[#242424] space-y-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
              <Clock size={18} className="text-[#00FF66]" />
              <span>طلبات حجز فحص InBody المعلقة من المتدربين</span>
            </h2>

            {pendingInbodyRequests.length > 0 ? (
              <div className="space-y-2.5">
                {pendingInbodyRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl bg-[#181818] border border-[#282828] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-sm font-bold text-white">{req.traineeName}</span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-mono">
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#A0A0A0] mt-1">{req.notes}</p>
                      <span className="text-[11px] text-[#00FF66] font-mono mt-1 block">الموعد المطلوب: {req.requestedTime}</span>
                    </div>

                    <button
                      onClick={() => handleConfirmInBody(req.id, req.traineeName)}
                      className="neon-btn px-4 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center space-x-1.5 rtl:space-x-reverse shrink-0"
                    >
                      <CheckCircle2 size={14} />
                      <span>تأكيد موعد الفحص وتعيين القراءة</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#888888]">لا توجد طلبات معلقة حالياً. جميع فحوصات المتدربين مؤكدة.</p>
            )}
          </div>

          {/* Trainee Historical Biometric Chart */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-[#242424] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                  <Activity size={18} className="text-[#00FF66]" />
                  <span>تطور قياسات InBody — المتدرب ({selectedTrainee.name})</span>
                </h3>
                <p className="text-xs text-[#A0A0A0]">تتبع نسبة الدهون والكتلة العضلية والوزن الكلي على مدار الشهور</p>
              </div>

              <div className="flex items-center space-x-3 rtl:space-x-reverse text-xs font-mono">
                <span className="flex items-center space-x-1 rtl:space-x-reverse text-[#00FF66]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00FF66] inline-block" />
                  <span>الوزن (كجم)</span>
                </span>
                <span className="flex items-center space-x-1 rtl:space-x-reverse text-cyan-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                  <span>الكتلة العضلية</span>
                </span>
                <span className="flex items-center space-x-1 rtl:space-x-reverse text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  <span>نسبة الدهون %</span>
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTraineeInBodyHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="date" stroke="#666" tick={{ fill: '#888', fontSize: 11 }} />
                  <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 11 }} domain={[10, 95]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#00FF66" strokeWidth={2.5} name="الوزن (كجم)" dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="muscleMass" stroke="#38BDF8" strokeWidth={2} name="الكتلة العضلية (كجم)" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="bodyFat" stroke="#FBBF24" strokeWidth={2} name="نسبة الدهون (%)" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Record New InBody Measurement Form */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-[#242424] space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
              <Scale size={18} className="text-[#00FF66]" />
              <span>تسجيل قراءة فحص InBody جديدة لـ ({selectedTrainee.name})</span>
            </h3>

            {measurementSaved && (
              <div className="p-3.5 rounded-xl bg-[#00FF66]/20 border border-[#00FF66] text-[#00FF66] text-xs font-bold animate-fadeIn">
                ✅ تم حفظ واعتماد قياسات InBody الجديدة بنجاح للمتدرب وتحديث سجله فوراً!
              </div>
            )}

            <form onSubmit={handleRecordMeasurement} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-[#A0A0A0] block mb-1">الوزن (كجم):</label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-[#A0A0A0] block mb-1">نسبة الدهون (%):</label>
                <input
                  type="number"
                  step="0.1"
                  value={newFat}
                  onChange={(e) => setNewFat(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-[#A0A0A0] block mb-1">الكتلة العضلية (كجم):</label>
                <input
                  type="number"
                  step="0.1"
                  value={newMuscle}
                  onChange={(e) => setNewMuscle(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none font-mono"
                  required
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full neon-btn py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 rtl:space-x-reverse cursor-pointer"
                >
                  <Plus size={14} />
                  <span>اعتماد القياس</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── TAB 6: STORE (متجر الصالة والمكملات وعمولات الكوتش) ─────── */}
      {activeTab === 'store' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-2xl bg-[#141414] border border-[#242424] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                  <ShoppingBag size={20} className="text-[#00FF66]" />
                  <span>متجر نادي PulsOps الرياضي — منتجات وعمولات الكوتش</span>
                </h2>
                <p className="text-xs text-[#A0A0A0]">
                  المنتجات المعروضة في متجر صالتك مع قيمة العمولة المضافة لحسابك عند تزكية المنتج لمتدربيك
                </p>
              </div>
              <span className="text-xs font-mono text-[#00FF66] bg-[#00FF66]/10 px-3 py-1 rounded-full border border-[#00FF66]/30 font-bold">
                عمولتك الإجمالية: 4,500 ج.م
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {trainerProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl bg-[#181818] border border-[#282828] hover:border-[#00FF66]/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-full h-36 rounded-lg bg-[#121212] mb-3 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#00FF66] font-mono uppercase font-bold">{p.category}</span>
                      <span className="text-[10px] bg-[#00FF66]/20 text-[#00FF66] px-2 py-0.5 rounded font-mono font-bold">
                        عمولتك: {p.commission}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mt-1 leading-snug">{p.name}</h4>
                    <div className="mt-2 text-base font-black text-white font-mono">
                      {p.price.toLocaleString()} ج.م
                    </div>
                  </div>

                  <button
                    onClick={() => handleRecommendProduct(p.name)}
                    className="mt-3 w-full py-2 rounded-xl bg-[#1E1E1E] text-white hover:bg-[#00FF66] hover:text-[#0A0A0A] font-bold text-xs transition-all cursor-pointer flex items-center justify-center space-x-1 rtl:space-x-reverse"
                  >
                    <Share2 size={13} />
                    <span>تزكية للمتدرب ({selectedTrainee.name})</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 7: EARNINGS (العمولات والأرباح الشهرية) ────────────── */}
      {activeTab === 'earnings' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-2xl bg-[#141414] border border-[#242424] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                  <DollarSign size={20} className="text-[#00FF66]" />
                  <span>كشف العمولات والأرباح الشهرية — الكوتش mostafa</span>
                </h2>
                <p className="text-xs text-[#A0A0A0]">
                  تفصيل إجمالي الدخل من حصص التدريب الشخصي (PT)، مبيعات المتجر، ومكافآت التزام المتدربين
                </p>
              </div>
              <span className="text-xs font-mono text-[#00FF66] bg-[#00FF66]/10 px-3.5 py-1.5 rounded-xl border border-[#00FF66]/40 font-black">
                إجمالي مستحقات شهر أكتوبر: 18,500 ج.م
              </span>
            </div>

            {/* Income Streams Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-[#181818] border border-[#282828]">
                <div className="flex items-center justify-between text-[#888888] mb-1">
                  <span className="text-xs">تدريب خاص (VIP PT)</span>
                  <Award size={16} className="text-[#00FF66]" />
                </div>
                <div className="text-2xl font-black text-white font-mono">12,000 ج.م</div>
                <p className="text-[10px] text-[#A0A0A0] mt-1">من 8 مشتركين VIP في الصالة</p>
              </div>

              <div className="p-5 rounded-xl bg-[#181818] border border-[#282828]">
                <div className="flex items-center justify-between text-[#888888] mb-1">
                  <span className="text-xs">تزكيات متجر المكملات</span>
                  <ShoppingBag size={16} className="text-purple-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">4,500 ج.م</div>
                <p className="text-[10px] text-[#A0A0A0] mt-1">28 عملية بيع تمت بنجاح</p>
              </div>

              <div className="p-5 rounded-xl bg-[#181818] border border-[#282828]">
                <div className="flex items-center justify-between text-[#888888] mb-1">
                  <span className="text-xs">حوافز الالتزام والأداء</span>
                  <TrendingUp size={16} className="text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">2,000 ج.م</div>
                <p className="text-[10px] text-[#A0A0A0] mt-1">بناءً على نسبة التزام 94% للمتدربين</p>
              </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-white flex items-center space-x-1.5 rtl:space-x-reverse">
                <FileText size={15} className="text-[#00FF66]" />
                <span>سجل العمليات المالية الأخيرة</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-[#282828] text-[#888888]">
                      <th className="py-2.5 px-3">البيان</th>
                      <th className="py-2.5 px-3">المتدرب</th>
                      <th className="py-2.5 px-3">التاريخ</th>
                      <th className="py-2.5 px-3">النوع</th>
                      <th className="py-2.5 px-3 text-left">قيمة العمولة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222222]">
                    <tr>
                      <td className="py-3 px-3 text-white font-semibold">اشتراك باقة PT شهرية VIP</td>
                      <td className="py-3 px-3 text-[#00FF66]">mr mostafa</td>
                      <td className="py-3 px-3 text-[#888888] font-mono">اليوم، 10:30 ص</td>
                      <td className="py-3 px-3"><span className="bg-[#00FF66]/10 text-[#00FF66] px-2 py-0.5 rounded text-[10px]">تدريب خاص</span></td>
                      <td className="py-3 px-3 text-left font-mono font-bold text-[#00FF66]">+ 1,500 ج.م</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-white font-semibold">تزكية أوبتيموم واي بروتين 5 باوند</td>
                      <td className="py-3 px-3 text-white">mr mostafa</td>
                      <td className="py-3 px-3 text-[#888888] font-mono">أمس، 06:15 م</td>
                      <td className="py-3 px-3"><span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded text-[10px]">متجر الصالة</span></td>
                      <td className="py-3 px-3 text-left font-mono font-bold text-[#00FF66]">+ 150 ج.م</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-white font-semibold">اشتراك تدريب شخصي ربع سنوي</td>
                      <td className="py-3 px-3 text-white">ناصر الكندي</td>
                      <td className="py-3 px-3 text-[#888888] font-mono">منذ يومين</td>
                      <td className="py-3 px-3"><span className="bg-[#00FF66]/10 text-[#00FF66] px-2 py-0.5 rounded text-[10px]">تدريب خاص</span></td>
                      <td className="py-3 px-3 text-left font-mono font-bold text-[#00FF66]">+ 3,000 ج.م</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-white font-semibold">تزكية كرياتين ميكرونايزد 500g</td>
                      <td className="py-3 px-3 text-white">عمر شريف</td>
                      <td className="py-3 px-3 text-[#888888] font-mono">منذ 3 أيام</td>
                      <td className="py-3 px-3"><span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded text-[10px]">متجر الصالة</span></td>
                      <td className="py-3 px-3 text-left font-mono font-bold text-[#00FF66]">+ 80 ج.م</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
