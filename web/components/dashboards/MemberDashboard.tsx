'use client';

import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Activity,
  Dumbbell,
  Sparkles,
  CheckCircle2,
  Send,
  Award,
  ShoppingBag,
  Megaphone,
  Calendar,
  Download,
  Copy,
  Smartphone,
  Flame,
  Droplets,
  Clock,
  Pill,
  TrendingUp,
  History,
  ChevronRight,
  ChevronLeft,
  LogOut,
  X,
  Check,
  Camera,
  Image as ImageIcon,
  Utensils,
  HelpCircle,
  ShoppingCart,
  MapPin,
  Phone,
  User,
  PackageCheck,
  Truck,
  Gift,
  Coins,
  CheckCheck,
  Plus,
  Scale,
  Compass,
  FileText,
  BadgeCheck,
  Sparkle,
} from 'lucide-react';
import QRCode from 'qrcode';
import { useLanguage } from '@/lib/LanguageContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const memberInBody = [
  { date: '1 يونيو', weight: 88.5, bodyFat: 23.4, muscleMass: 38.1 },
  { date: '1 يوليو', weight: 86.2, bodyFat: 21.0, muscleMass: 39.0 },
  { date: '1 أغسطس', weight: 84.0, bodyFat: 18.8, muscleMass: 39.8 },
  { date: '1 سبتمبر', weight: 82.5, bodyFat: 16.5, muscleMass: 40.5 },
  { date: '1 أكتوبر', weight: 81.0, bodyFat: 14.8, muscleMass: 41.2 },
];

interface MemberDashboardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  activeTab = 'overview',
  onTabChange,
}) => {
  const [completedExercises, setCompletedExercises] = useState<{ [key: number]: boolean }>({
    0: true,
  });

  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'assistant'; text: string; time: string }[]
  >([
    {
      role: 'assistant',
      text: 'أهلاً بك يا mr mostafa! أنا كوتش الذكاء الاصطناعي الخاص بك. لاحظت زيادة 0.7 كجم في كتلتك العضلية مع الكوتش mostafa في فحص InBody الأخير. كيف يمكنني مساعدتك في خطتك اليوم؟',
      time: '10:00 ص',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const toggleExercise = (index: number) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setInputMessage('');
    setChatMessages((prev) => [
      ...prev,
      { role: 'user', text: userText, time: 'الآن' },
    ]);
    setIsAiLoading(true);

    setTimeout(() => {
      let reply = `سؤال ممتاز! بناءً على خطتك الحالية للضخامة الصافية وهدف 2,650 سعرة حرارية، ركز على تناول 40-50 جرام بروتين عالي الجودة خلال ساعتين بعد التمرين، وحافظ على نوم استشفائي لا يقل عن 7.5 ساعات.`;
      if (userText.includes('كرياتين') || userText.toLowerCase().includes('creatine')) {
        reply = `تناول 5 جرامات من الكرياتين يومياً بانتظام مع مصدر كربوهيدرات أو بعد التمرين مباشرة لضمان تشبع مخازن الطاقة ATP في العضلات.`;
      } else if (userText.includes('ألم') || userText.includes('تعب') || userText.includes('شد')) {
        reply = `ألم العضلات المتأخر (DOMS) أمر طبيعي بعد التمارين الشديدة. احرص على شرب الماء بكثرة، تناول المغنيسيوم، والمشي الخفيف لتسريع الاستشفاء.`;
      }

      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', text: reply, time: 'الآن' },
      ]);
      setIsAiLoading(false);
    }, 1000);
  };

  // AI Meal Vision & Smart Calorie Estimation States
  const [showMealCameraModal, setShowMealCameraModal] = useState(false);
  const [mealPhotoPreview, setMealPhotoPreview] = useState<string | null>(null);
  const [mealOilType, setMealOilType] = useState('olive_light'); // none, olive_light, olive_heavy, regular_oil
  const [mealSaltLevel, setMealSaltLevel] = useState('normal'); // low, normal, high
  const [mealPortion, setMealPortion] = useState('medium'); // small, medium, large
  const [isAnalyzingMeal, setIsAnalyzingMeal] = useState(false);

  // Trigger Meal Photo Analysis
  const handleAnalyzeMeal = async () => {
    if (!mealPhotoPreview) return;
    setIsAnalyzingMeal(true);

    try {
      const res = await fetch('http://localhost:5000/api/ai/analyze-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: mealPhotoPreview,
          oilType: mealOilType,
          saltLevel: mealSaltLevel,
          portionSize: mealPortion,
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        const a = data.analysis;
        const oilText = mealOilType === 'olive_light' ? 'زيت زيتون خفيف (1 ملعقة)' : mealOilType === 'olive_heavy' ? 'زيت زيتون كثيف' : mealOilType === 'none' ? 'بدون أي زيوت (مشوي/مسلوق نقي)' : 'زيت طبخ نباتي عادي';
        const saltText = mealSaltLevel === 'low' ? 'قليل الملح' : mealSaltLevel === 'high' ? 'ملح زائد' : 'ملح معتدل';

        // Add user meal snapshot to chat
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'user',
            text: `📷 [صورة وجبتي]: قمت بتصوير وجبة (${a.mealName}) - طريقة الطهي: ${oilText}، الملح: ${saltText}، الحجم: ${mealPortion === 'large' ? 'وجبة كبيرة' : mealPortion === 'small' ? 'وجبة صغيرة' : 'حجم متوسط'}. ما هي السعرات والماكروز المحسوبة؟`,
            time: 'الآن',
          },
          {
            role: 'assistant',
            text: `🍽️ **تحليل الذكاء الاصطناعي لوجبتك (Gemini Vision Calorie Estimator):**\n\n` +
              `• **الوجبة المكتشفة:** ${a.mealName}\n` +
              `• **إجمالي السعرات الحرارية المقدرة:** 🔥 **${a.estimatedCalories} سعرة حرارية**\n` +
              `• **توزيع الماكروز الغذائي:**\n` +
              `  - 🥩 البروتين: **${a.macros.protein}**\n` +
              `  - 🍚 الكربوهيدرات: **${a.macros.carbs}**\n` +
              `  - 🥑 الدهون الصحية: **${a.macros.fats}**\n` +
              `  - 🥗 الألياف: **${a.macros.fiber}**\n\n` +
              `• **تحليل الزيوت والدهون:** ${a.oilAnalysis.impact}\n` +
              `• **تحليل الأملاح والصوديوم:** ${a.saltAnalysis.advice} (يقدر بـ ${a.saltAnalysis.estimatedSodium})\n\n` +
              `💡 **تقييم الكوتش:** ${a.coachVerdict}`,
            time: 'الآن',
          },
        ]);
      }
    } catch {
      // Local fallback simulation if backend is busy
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'user',
          text: `📷 [صورة وجبتي]: صورة طبق غداء متوازن مع زيت زيتون خفيف وملح معتدل.`,
          time: 'الآن',
        },
        {
          role: 'assistant',
          text: `🍽️ **تحليل الذكاء الاصطناعي لوجبتك بالرؤية الحاسوبية:**\n\n` +
            `• **السعرات المقدرة:** 🔥 **565 سعرة حرارية**\n` +
            `• **البروتين:** 42g | **الكارب:** 48g | **الدهون:** 19g\n` +
            `• **الزيوت:** تم احتساب زيت الزيتون كـ 45 سعرة من الدهون غير المشبعة المفيدة.\n` +
            `• **الملح والصوديوم:** نسبة معتدلة (450 mg) تدعم ضغط الدم والاستشفاء.\n` +
            `✅ وجبة ممتازة وملائمة تماماً لجدولك اليومي!`,
          time: 'الآن',
        },
      ]);
    } finally {
      setIsAnalyzingMeal(false);
      setShowMealCameraModal(false);
      setMealPhotoPreview(null);
    }
  };

  const { lang, setLang } = useLanguage();
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [memberCart, setMemberCart] = useState<{ [id: string]: number }>({});
  const [memberOrderSuccess, setMemberOrderSuccess] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Dynamic workout prescribed by Coach / Gym Admin
  const [assignedWorkout, setAssignedWorkout] = useState({
    title: 'تمارين اليوم المحددة (عضلات الجزء العلوي والأكتاف)',
    subtitle: 'محددة بواسطة الكوتش mostafa بناءً على خطة الضخامة الصافية',
    dayNumber: 'اليوم 3 من 4 في جدول الأسبوع',
    prescribedBy: 'الكوتش mostafa (المدرب المعتمد)',
    exercises: [
      { id: 'ex-1', name: 'بنش برس مائل بالبار الحر (Incline Barbell Press)', sets: 4, reps: '8-10', rest: 90, targetMuscle: 'الصدر العلوي' },
      { id: 'ex-2', name: 'عقلة بأوزان إضافية (Weighted Pull-ups)', sets: 4, reps: '6-8', rest: 90, targetMuscle: 'عضلات الظهر واللاتس' },
      { id: 'ex-3', name: 'ضغط أكتاف بالبار واقفا (Military Press)', sets: 3, reps: '8-10', rest: 75, targetMuscle: 'الكتف الأمامي والجانبي' },
      { id: 'ex-4', name: 'رفرفة جانبي بالكابل (Cable Lateral Raises)', sets: 4, reps: '12-15', rest: 60, targetMuscle: 'الكتف الجانبي' },
      { id: 'ex-5', name: 'ترايسبس بالحبل أعلى الرأس (Overhead Cable Triceps)', sets: 3, reps: '12', rest: 60, targetMuscle: 'الترايسبس الرأس الطويل' },
    ],
  });

  // Sync workout from Coach/Gym Admin API & LocalStorage
  useEffect(() => {
    const fetchPrescribedWorkout = async () => {
      // 1. Try local storage first for instant real-time reflection
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('pulsops_member_daily_workout');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed.exercises && parsed.exercises.length) {
              setAssignedWorkout(parsed);
            }
          } catch {}
        }
      }

      // 2. Fetch from backend API
      try {
        const res = await fetch(`http://localhost:5000/api/gyms/gym-titan/members/usr-member/daily-workout`);
        if (res.ok) {
          const data = await res.json();
          if (data.workout && data.workout.exercises?.length) {
            setAssignedWorkout(data.workout);
          }
        }
      } catch {}
    };

    fetchPrescribedWorkout();

    const handleWorkoutUpdated = () => {
      fetchPrescribedWorkout();
    };

    window.addEventListener('pulsops_workout_updated', handleWorkoutUpdated);
    window.addEventListener('storage', handleWorkoutUpdated);
    return () => {
      window.removeEventListener('pulsops_workout_updated', handleWorkoutUpdated);
      window.removeEventListener('storage', handleWorkoutUpdated);
    };
  }, []);

  // Static unique member pass payload for turnstiles
  const memberPassPayload = JSON.stringify({
    memberId: 'usr-member-8491',
    gymId: 'gym-pulsops',
    memberName: 'mr mostafa',
    membershipPlan: 'الباقة الذهبية السنوية VIP',
    validUntil: '2027-11-30',
    type: 'PULSOPS_MEMBER_PASS',
  });

  // Generate real scannable QR Code image (Data URL)
  useEffect(() => {
    QRCode.toDataURL(
      memberPassPayload,
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
    a.download = `PulsOps-GymPass-MrMostafa-8491.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyPassCode = () => {
    navigator.clipboard?.writeText('usr-member-8491');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const memberProducts = [
    { id: 'p-1', name: 'أوبتيموم جولد واي بروتين 5 باوند', category: 'بروتين', price: 3950, stock: 34, image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400&auto=format&fit=crop&q=80' },
    { id: 'p-2', name: 'كرياتين ميكرونايزد نقي 500 جرام', category: 'قوة واستشفاء', price: 1750, stock: 18, image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&auto=format&fit=crop&q=80' },
    { id: 'p-3', name: 'طاقة وتمرين C4 بنكهة الفواكه', category: 'طاقة وبومب', price: 2250, stock: 22, image: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=400&auto=format&fit=crop&q=80' },
    { id: 'p-4', name: 'أحزمة رفع أثقال تيتان الأصلية', category: 'مستلزمات رياضية', price: 900, stock: 50, image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80' },
  ];

  const gymBanner = {
    title: 'خصم 25% على مكملات البروتين والكرياتين',
    subtitle: 'عرض حصري لأعضاء نادي PulsOps الرياضي لفترة محدودة بمناسبة انطلاق الموسم التدريبي',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80',
    badge: 'عرض خاص للأعضاء',
    ctaText: 'اطلب من متجر النادي',
  };

  const [selectedStoreCategory, setSelectedStoreCategory] = useState('الكل');
  const [waterCups, setWaterCups] = useState(7);
  const [completedMeals, setCompletedMeals] = useState<{ [key: number]: boolean }>({ 0: true, 1: true });
  const [inbodyRequestSent, setInbodyRequestSent] = useState(false);

  // Member Cart & Order Management States
  const [showCartDrawerModal, setShowCartDrawerModal] = useState(false);
  const [customerName, setCustomerName] = useState('mr mostafa');
  const [customerPhone, setCustomerPhone] = useState('+20 100 123 4567');
  const [deliveryMethod, setDeliveryMethod] = useState<'PICKUP' | 'HOME_DELIVERY'>('PICKUP');
  const [customerAddress, setCustomerAddress] = useState('التوصيل للعنوان: شارع الثورة، مصر الجديدة، القاهرة');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState<any>(null);

  // Sync cart changes with localStorage and broadcast event
  const updateMemberCart = (newCart: { [id: string]: number }) => {
    setMemberCart(newCart);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pulsops_member_cart', JSON.stringify(newCart));
      window.dispatchEvent(new Event('pulsops_cart_updated'));
    }
  };

  const handleMemberBuy = (pId: string) => {
    const updated = { ...memberCart, [pId]: (memberCart[pId] || 0) + 1 };
    updateMemberCart(updated);
    setMemberOrderSuccess(true);
    setTimeout(() => setMemberOrderSuccess(false), 2500);
  };

  const handleUpdateCartQty = (pId: string, delta: number) => {
    const current = memberCart[pId] || 0;
    const nextQty = current + delta;
    const next = { ...memberCart };
    if (nextQty <= 0) {
      delete next[pId];
    } else {
      next[pId] = nextQty;
    }
    updateMemberCart(next);
  };

  const handleConfirmOrder = async () => {
    if (Object.keys(memberCart).length === 0) return;
    setIsSubmittingOrder(true);

    const orderedItems = Object.entries(memberCart).map(([id, qty]) => {
      const prod = memberProducts.find((p) => p.id === id);
      return {
        id,
        name: prod?.name || 'منتج',
        price: prod?.price || 0,
        quantity: qty,
      };
    });

    const payload = {
      items: orderedItems,
      totalAmount: cartTotal,
      memberName: customerName,
      phone: customerPhone,
      address: deliveryMethod === 'PICKUP' ? 'استلام فوري من ريسبشن الصالة' : customerAddress,
      deliveryMethod,
      notes: orderNotes,
    };

    try {
      const res = await fetch('http://localhost:5000/api/gyms/gym-titan/store/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setPlacedOrderDetails(data.order);
      }
    } catch {}

    updateMemberCart({});
    setIsSubmittingOrder(false);
  };

  const handleOrderCheckout = () => {
    setShowCartDrawerModal(true);
  };

  const toggleMeal = (idx: number) => {
    setCompletedMeals((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const filteredStoreProducts = selectedStoreCategory === 'الكل'
    ? memberProducts
    : memberProducts.filter((p) => p.category === selectedStoreCategory);

  const cartTotal = Object.entries(memberCart).reduce((sum, [id, qty]) => {
    const item = memberProducts.find((p) => p.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  // Feature 1: Live Order Tracking State
  const [memberOrdersList, setMemberOrdersList] = useState<any[]>([]);
  const [isFetchingOrders, setIsFetchingOrders] = useState(false);

  const fetchMemberOrders = async () => {
    setIsFetchingOrders(true);
    try {
      const res = await fetch('http://localhost:5000/api/members/usr-member/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.orders) setMemberOrdersList(data.orders);
      }
    } catch {}
    setIsFetchingOrders(false);
  };

  useEffect(() => {
    fetchMemberOrders();
    const interval = setInterval(fetchMemberOrders, 6000);
    return () => clearInterval(interval);
  }, []);

  // Feature 4: Interactive InBody Records & Measurement Logging
  const [inbodyHistory, setInbodyHistory] = useState<any[]>([
    { id: 'inb-1', date: '1 أكتوبر 2026', weight: 81.0, bodyFat: 14.8, muscleMass: 41.2, waist: 82, rating: 'ممتاز 🔥', note: 'انخفاض في نسبة الدهون مع ثبات رائع في الكتلة العضلية' },
    { id: 'inb-2', date: '1 سبتمبر 2026', weight: 82.5, bodyFat: 16.5, muscleMass: 40.5, waist: 84, rating: 'جيد جداً', note: 'استجابة مثالية لبرنامج الكارديو وتدريب الجزء العلوي' },
    { id: 'inb-3', date: '1 أغسطس 2026', weight: 84.0, bodyFat: 18.8, muscleMass: 39.8, waist: 86, rating: 'جيد جداً', note: 'بدء مرحلة التنشيف الصافي وضبط السعرات' },
    { id: 'inb-4', date: '1 يوليو 2026', weight: 86.2, bodyFat: 21.0, muscleMass: 39.0, waist: 88, rating: 'جيد', note: 'تطور ملحوظ في قوة التحمل ورفع الأوزان' },
    { id: 'inb-5', date: '1 يونيو 2026', weight: 88.5, bodyFat: 23.4, muscleMass: 38.1, waist: 91, rating: 'بداية الخطة', note: 'الفحص الافتتاحي وتحديد الخطة التدريبية والغذائية' },
  ]);
  const [showLogMeasurementModal, setShowLogMeasurementModal] = useState(false);
  const [newLogWeight, setNewLogWeight] = useState('80.5');
  const [newLogFat, setNewLogFat] = useState('14.2');
  const [newLogMuscle, setNewLogMuscle] = useState('41.6');
  const [newLogWaist, setNewLogWaist] = useState('81');
  const [newLogNote, setNewLogNote] = useState('فحص جديد عبر الميزان الذكي بنادي PulsOps');
  const [measurementAddedAlert, setMeasurementAddedAlert] = useState(false);

  const handleAddInBodyMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      id: `inb-${Date.now().toString().slice(-4)}`,
      date: 'اليوم ' + new Date().toLocaleDateString('ar-EG', { month: 'long', day: 'numeric', year: 'numeric' }),
      weight: parseFloat(newLogWeight) || 80.5,
      bodyFat: parseFloat(newLogFat) || 14.2,
      muscleMass: parseFloat(newLogMuscle) || 41.6,
      waist: parseFloat(newLogWaist) || 81,
      rating: 'تطور ممتاز 🌟',
      note: newLogNote,
    };
    setInbodyHistory((prev) => [newEntry, ...prev]);

    try {
      await fetch('http://localhost:5000/api/members/usr-member/inbody', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: newLogWeight,
          bodyFat: newLogFat,
          muscleMass: newLogMuscle,
          waist: newLogWaist,
          note: newLogNote,
        }),
      });
    } catch {}

    // Add points for inbody
    setLoyaltyPoints((prev: any) => ({
      ...prev,
      points: prev.points + 100,
      history: [
        { id: `lh-${Date.now()}`, title: 'تسجيل فحص InBody جديد', points: +100, date: 'الآن', type: 'INBODY' },
        ...prev.history,
      ],
    }));

    setShowLogMeasurementModal(false);
    setMeasurementAddedAlert(true);
    setTimeout(() => setMeasurementAddedAlert(false), 3500);
  };

  // Feature 5: AI Custom Workout & Nutrition Plan Generator State
  const [aiGoal, setAiGoal] = useState<'hypertrophy' | 'fat_loss' | 'strength'>('hypertrophy');
  const [aiDays, setAiDays] = useState(4);
  const [aiAllergies, setAiAllergies] = useState('');
  const [isGeneratingAiPlan, setIsGeneratingAiPlan] = useState(false);
  const [generatedAiPlan, setGeneratedAiPlan] = useState<any>(null);

  const handleGenerateAiPlan = async () => {
    setIsGeneratingAiPlan(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: aiGoal,
          daysPerWeek: aiDays,
          fitnessLevel: 'متوسط إلى متقدم',
          allergies: aiAllergies,
          weight: 81.0,
          height: 182,
        }),
      });
      const data = await res.json();
      if (data.success && data.plan) {
        setGeneratedAiPlan(data.plan);
      }
    } catch {
      // Local Fallback Plan
      setGeneratedAiPlan({
        planName: aiGoal === 'fat_loss' ? 'خطة التنشيف وخسارة الدهون الذكية' : 'خطة الضخامة العضلية الصافية المخصصة',
        goal: aiGoal,
        fitnessLevel: 'متوسط',
        macros: {
          calories: aiGoal === 'fat_loss' ? 1950 : 2550,
          protein: '185g',
          carbs: aiGoal === 'fat_loss' ? '160g' : '285g',
          fats: '60g',
          waterLitres: '3.5 - 4.0 لتر يومياً',
        },
        suggestedMeals: [
          { meal: 'الإفطار', items: '4 بيضات مسلوقة + 80 جم شوفان مع حليب وتوت أزرق + 1 موزة', protein: '38g', calories: 580 },
          { meal: 'الغداء', items: '200 جم صدور دجاج مشوية + 200 جم أرز بسمتي + خضار بروكلي وجزر', protein: '55g', calories: 650 },
          { meal: 'سناك بعد التمرين', items: 'سكوب واي بروتين مع ماء بارد + تفاحة خضراء أو حفنة لوز', protein: '28g', calories: 280 },
          { meal: 'العشاء', items: '150 جم سمك سلمون أو علبة تونة + سلطة خضراء غنية بزيت الزيتون', protein: '42g', calories: 520 },
        ],
        recommendedSupplements: [
          { name: 'واي بروتين جولد ستاندرد', reason: 'سريع الامتصاص بعد التمرين لتسريع الاستشفاء العضلي', storeProductId: 'p-1' },
          { name: 'كرياتين مونوهايدرات 5 جم', reason: 'لرفع مخازن الطاقة ATP وزيادة القوة والكتلة الصافية', storeProductId: 'p-2' },
        ],
        weeklySplit: [
          { day: 'اليوم الأول', focus: 'صدر وترايسبس (Push A)', exercises: ['بنش برس مستوي بالبار 4×8', 'تجميع دمبل مائل 3×10', 'بار متوازي 3×12'] },
          { day: 'اليوم الثاني', focus: 'ظهر وبايسبس (Pull A)', exercises: ['ديدلفت تقليدي 4×6', 'سحب ظهر عالي واسع 4×10', 'همر كيرل بالحبل 3×12'] },
          { day: 'اليوم الثالث', focus: 'أرجل وبطن (Legs & Core)', exercises: ['سكوات خلفي بالبار 4×8', 'دفع رجل 45 درجة 3×12', 'بلانك 3×45 ثانية'] },
          { day: 'اليوم الرابع', focus: 'أكتاف وكارديو HIIT', exercises: ['ضغط أكتاف بالدمبل 4×8', 'رفرفة جانبي بالكابل 4×15', '15 دقيقة HIIT سبرنت'] },
        ],
        coachAdvice: 'التزم بفترات النوم العميق وشرب الماء بانتظام لمضاعفة سرعة البناء والاستشفاء.',
      });
    } finally {
      setIsGeneratingAiPlan(false);
    }
  };

  // Feature 6: Loyalty & Rewards System State
  const [loyaltyPoints, setLoyaltyPoints] = useState<any>({
    points: 1250,
    tier: 'الدرجة الذهبية VIP',
    history: [
      { id: 'lh-1', title: 'تسجيل حضور عبر البوابة الإلكترونية QR', points: +50, date: 'اليوم 08:30 ص', type: 'ATTENDANCE' },
      { id: 'lh-2', title: 'شراء مكمل غذائي من متجر الصالة', points: +200, date: 'أمس 04:15 م', type: 'PURCHASE' },
      { id: 'lh-3', title: 'إكمال جدول تمارين الأسبوع بنجاح (تحدي البوش)', points: +150, date: 'منذ 3 أيام', type: 'CHALLENGE' },
      { id: 'lh-4', title: 'إجراء فحص InBody وتطور بنسبة 1.5% دهون', points: +100, date: '1 أكتوبر 2026', type: 'INBODY' },
    ],
    rewards: [
      { id: 'rew-1', name: 'خصم 500 ج.م على أي مكمل واي بروتين', cost: 800, available: true, code: 'PROTEIN500' },
      { id: 'rew-2', name: 'جلسة تدريب شخصي مجانية (1-on-1 PT)', cost: 1000, available: true, code: 'FREEPT1ON1' },
      { id: 'rew-3', name: 'مشروب طاقة / سموذي بروتين مجاني من البار', cost: 300, available: true, code: 'FREESHAKE' },
      { id: 'rew-4', name: 'فحص InBody مجاني شامل تقرير الكوتش', cost: 250, available: true, code: 'FREEINBODY' },
    ],
  });
  const [redeemedCoupon, setRedeemedCoupon] = useState<{ name: string; code: string } | null>(null);

  const handleRedeemReward = async (reward: any) => {
    if (loyaltyPoints.points < reward.cost) return;

    setLoyaltyPoints((prev: any) => ({
      ...prev,
      points: prev.points - reward.cost,
      history: [
        { id: `lh-${Date.now()}`, title: `استبدال مكافأة: ${reward.name}`, points: -reward.cost, date: 'الآن', type: 'REDEEM' },
        ...prev.history,
      ],
    }));

    setRedeemedCoupon({ name: reward.name, code: reward.code });

    try {
      await fetch('http://localhost:5000/api/members/usr-member/loyalty/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId: reward.id }),
      });
    } catch {}
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ─── Member Welcome Header ──────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3 rtl:space-x-reverse">
            <span>مرحباً بعودتك، mr mostafa!</span>
            <span className="text-xs bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40 px-2.5 py-0.5 rounded-full font-mono">
              عضو VIP ذهبي
            </span>
          </h1>
          <p className="text-sm text-[#A0A0A0] mt-1">
            نادي PulsOps الرياضي • عضوية رقم #8491 • صالحة حتى نوفمبر 2027
          </p>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse bg-[#181818] border border-[#282828] px-4 py-2 rounded-xl text-xs">
          <Award size={18} className="text-[#00FF66]" />
          <span className="text-[#A0A0A0]">المدرب المخصص:</span>
          <span className="text-white font-bold">الكوتش mostafa</span>
        </div>
      </div>

      {/* ─── TAB 1: OVERVIEW (القائمة الرئيسية) ─── */}
      {(activeTab === 'overview') && (
        <div className="space-y-6 animate-fadeIn">
          {/* Gym Admin Promotional Banner */}
          {gymBanner && (
            <div
              className="relative rounded-2xl overflow-hidden border border-[#282828] bg-cover bg-center h-44 sm:h-48 flex flex-col justify-between p-5 shadow-2xl glow-border"
              style={{ backgroundImage: `linear-gradient(to top, rgba(10,10,10,0.95), rgba(10,10,10,0.45)), url(${gymBanner.imageUrl})` }}
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
                    className="mt-2.5 text-xs font-bold text-[#00FF66] hover:underline flex items-center space-x-1 rtl:space-x-reverse cursor-pointer"
                  >
                    <span>تسوق من متجر الصالة الآن</span>
                    <ChevronLeft size={13} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: INBODY (تقدم قياسات InBody وسجل الفحوصات) ─────────── */}
      {(activeTab === 'inbody') && (
        <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828] space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                <Activity size={20} className="text-[#00FF66]" />
                <span>ميزان القياسات الذكي وتتبع تطور الجسم (InBody Tracker)</span>
              </h2>
              <p className="text-xs text-[#A0A0A0] mt-0.5">
                متابعة حية لمعدل انخفاض الدهون، بناء العضلات ومحيط الخصر مع إمكانية تسجيل القياسات
              </p>
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <button
                onClick={() => setShowLogMeasurementModal(true)}
                className="neon-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 rtl:space-x-reverse cursor-pointer shadow-[0_0_15px_rgba(0,255,102,0.25)]"
              >
                <Plus size={15} />
                <span>تسجيل قياس فحص جديد (+100 نقطة ولاء)</span>
              </button>

              <button
                onClick={() => {
                  setInbodyRequestSent(true);
                  setTimeout(() => setInbodyRequestSent(false), 3500);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#1E1E1E] border border-[#282828] hover:border-[#00FF66]/50 text-white text-xs font-bold flex items-center space-x-1.5 rtl:space-x-reverse cursor-pointer"
              >
                <Scale size={15} className="text-[#00FF66]" />
                <span>طلب حجز موعد InBody بالجيم</span>
              </button>
            </div>
          </div>

          {measurementAddedAlert && (
            <div className="p-3.5 rounded-xl bg-[#00FF66]/20 border border-[#00FF66] text-[#00FF66] text-xs font-bold animate-fadeIn flex items-center space-x-2 rtl:space-x-reverse">
              <CheckCircle2 size={16} />
              <span>تم حفظ فحص الـ InBody بنجاح وتحديث الرسم البياني مع مكافأة 100 نقطة ولاء! 🎉</span>
            </div>
          )}

          {inbodyRequestSent && (
            <div className="p-3 rounded-xl bg-[#00FF66]/20 border border-[#00FF66] text-[#00FF66] text-xs font-bold animate-fadeIn">
              ✅ تم إرسال طلب حجز فحص الـ InBody بنجاح للكوتش mostafa وسيتم تأكيد الموعد في زيارتك القادمة!
            </div>
          )}

          {/* Biometric Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[...inbodyHistory].reverse()}>
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

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#121212] border border-[#282828] text-center">
              <span className="text-[10px] text-[#A0A0A0] uppercase font-bold">الوزن الحالي</span>
              <p className="text-lg font-bold text-white font-mono mt-0.5">{inbodyHistory[0]?.weight || 81.0} كجم</p>
              <span className="text-[10px] text-emerald-400 font-mono">-7.5 كجم إجمالي</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#121212] border border-[#282828] text-center">
              <span className="text-[10px] text-[#A0A0A0] uppercase font-bold">نسبة الدهون</span>
              <p className="text-lg font-bold text-emerald-400 font-mono mt-0.5">{inbodyHistory[0]?.bodyFat || 14.8}%</p>
              <span className="text-[10px] text-emerald-400 font-mono">حرق دهون نشط</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#121212] border border-[#282828] text-center">
              <span className="text-[10px] text-[#A0A0A0] uppercase font-bold">الكتلة العضلية</span>
              <p className="text-lg font-bold text-[#00FF66] font-mono mt-0.5">{inbodyHistory[0]?.muscleMass || 41.2} كجم</p>
              <span className="text-[10px] text-[#00FF66] font-mono">+3.1 كجم عضل صافي</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#121212] border border-[#282828] text-center">
              <span className="text-[10px] text-[#A0A0A0] uppercase font-bold">محيط الخصر</span>
              <p className="text-lg font-bold text-amber-400 font-mono mt-0.5">{inbodyHistory[0]?.waist || 82} سم</p>
              <span className="text-[10px] text-amber-400 font-mono">-9 سم خصر</span>
            </div>
          </div>

          {/* Historical Test Logs Table */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
              <History size={16} className="text-[#00FF66]" />
              <span>سجل القياسات والفحوصات المحفوظة</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-[#282828] text-[#A0A0A0] font-mono text-[11px]">
                    <th className="py-2.5 px-3">تاريخ الفحص</th>
                    <th className="py-2.5 px-3">الوزن</th>
                    <th className="py-2.5 px-3">نسبة الدهون</th>
                    <th className="py-2.5 px-3">الكتلة العضلية</th>
                    <th className="py-2.5 px-3">محيط الخصر</th>
                    <th className="py-2.5 px-3">التقييم</th>
                    <th className="py-2.5 px-3">الملاحظات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#282828]">
                  {inbodyHistory.map((t, idx) => (
                    <tr key={idx} className="hover:bg-[#1E1E1E]/50 transition-colors">
                      <td className="py-3 px-3 font-semibold text-white">{t.date}</td>
                      <td className="py-3 px-3 font-mono font-bold text-white">{t.weight} كجم</td>
                      <td className="py-3 px-3 font-mono text-emerald-400 font-bold">{t.bodyFat}%</td>
                      <td className="py-3 px-3 font-mono text-[#00FF66] font-bold">{t.muscleMass} كجم</td>
                      <td className="py-3 px-3 font-mono text-amber-400 font-bold">{t.waist || '--'} سم</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-[#00FF66]/15 text-[#00FF66] text-[10px] font-bold">
                          {t.rating}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#A0A0A0] text-[11px]">{t.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: WORKOUTS (جدول تمارين اليوم المحددة) ─────────────── */}
      {(activeTab === 'workouts') && (
        <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828] space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                <Dumbbell size={20} className="text-[#00FF66]" />
                <h2 className="text-lg font-bold text-white">
                  {assignedWorkout.title}
                </h2>
              </div>
              <p className="text-xs text-[#A0A0A0]">
                {assignedWorkout.subtitle || 'جدول التمارين اليومية الموصوفة'} • جهة التحديد: <span className="text-[#00FF66] font-bold">{assignedWorkout.prescribedBy}</span>
              </p>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="text-xs font-mono text-[#00FF66] bg-[#00FF66]/10 px-3 py-1 rounded-lg border border-[#00FF66]/30 font-bold">
                {assignedWorkout.dayNumber || 'اليوم التدريبي'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {assignedWorkout.exercises.map((item, idx) => {
              const isDone = !!completedExercises[idx];
              const setsLabel = typeof item.sets === 'number' ? `${item.sets} مجموعات` : item.sets;
              const repsLabel = item.reps ? `× ${item.reps} تكرار` : '';
              const restLabel = typeof item.rest === 'number' ? `راحة ${item.rest} ثانية` : item.rest;

              return (
                <div
                  key={item.id || idx}
                  onClick={() => toggleExercise(idx)}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isDone
                      ? 'bg-[#00FF66]/10 border-[#00FF66]/50 text-white shadow-[0_0_15px_rgba(0,255,102,0.1)]'
                      : 'bg-[#121212] border-[#282828] text-[#A0A0A0] hover:border-[#00FF66]/30'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
                    <CheckCircle2
                      size={22}
                      className={isDone ? 'text-[#00FF66]' : 'text-[#555555]'}
                    />
                    <div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="w-5 h-5 rounded bg-[#1E1E1E] text-[#00FF66] font-mono text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className={`text-xs sm:text-sm font-bold ${isDone ? 'line-through text-white/70' : 'text-white'}`}>
                          {item.name}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse mt-1 text-[11px] text-[#A0A0A0]">
                        <span>{setsLabel} {repsLabel}</span>
                        {restLabel && <span>• {restLabel}</span>}
                        {item.targetMuscle && (
                          <span className="text-[#00FF66]/80 bg-[#00FF66]/10 px-1.5 py-0.2 rounded text-[10px]">
                            {item.targetMuscle}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full ${isDone ? 'bg-[#00FF66]/20 text-[#00FF66] font-bold' : 'bg-[#1E1E1E] text-[#666666]'}`}>
                    {isDone ? 'تم الإنجاز ✅' : 'انقر للإكمال'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Weekly Split Overview */}
          <div className="pt-4 border-t border-[#282828] space-y-3">
            <h3 className="text-xs font-bold text-[#A0A0A0] uppercase font-mono tracking-wider">
              الجدول التدريبي الأسبوعي (Weekly Split Routine):
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#121212] border border-[#282828]">
                <span className="text-[10px] text-[#A0A0A0]">اليوم 1</span>
                <p className="font-bold text-white mt-0.5">الصدر والترايسبس</p>
                <span className="text-[10px] text-emerald-400">مكتمل ✅</span>
              </div>
              <div className="p-3 rounded-xl bg-[#121212] border border-[#282828]">
                <span className="text-[10px] text-[#A0A0A0]">اليوم 2</span>
                <p className="font-bold text-white mt-0.5">الظهر والبايسبس</p>
                <span className="text-[10px] text-emerald-400">مكتمل ✅</span>
              </div>
              <div className="p-3 rounded-xl bg-[#121212] border border-[#00FF66]/40">
                <span className="text-[10px] text-[#00FF66] font-bold">اليوم 3 (اليوم)</span>
                <p className="font-bold text-white mt-0.5">الجزء العلوي والأكتاف</p>
                <span className="text-[10px] text-[#00FF66]">نشط حالياً ⚡</span>
              </div>
              <div className="p-3 rounded-xl bg-[#121212] border border-[#282828]">
                <span className="text-[10px] text-[#A0A0A0]">اليوم 4</span>
                <p className="font-bold text-white mt-0.5">الأرجل والبطن</p>
                <span className="text-[10px] text-[#666666]">مجدول غداً 📅</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: NUTRITION (نظام وجباتي الغذائي والسعرات) ─────────── */}
      {(activeTab === 'nutrition') && (
        <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828] space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                <Calendar size={20} className="text-[#00FF66]" />
                <span>نظام وجباتي الغذائي والسعرات اليومية المحسوبة</span>
              </h2>
              <p className="text-xs text-[#A0A0A0] mt-0.5">
                خطة التغذية المحسوبة للضخامة الصافية الموصوفة بواسطة الكوتش mostafa
              </p>
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse bg-[#121212] border border-[#282828] px-3.5 py-1.5 rounded-xl text-xs">
              <Flame size={16} className="text-orange-400" />
              <span className="text-[#A0A0A0]">الهدف اليومي:</span>
              <span className="text-[#00FF66] font-bold font-mono">2,650 سعرة</span>
            </div>
          </div>

          {/* Macro Breakdown Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#121212] border border-[#282828]">
              <span className="text-[10px] text-[#A0A0A0] uppercase font-bold">البروتين اليومي</span>
              <p className="text-xl font-black text-[#00FF66] font-mono mt-1">180 جم</p>
              <div className="w-full bg-[#222222] h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-[#00FF66] h-full w-[75%]" />
              </div>
              <span className="text-[10px] text-[#A0A0A0] mt-1 block">تم تحقيق 135 جم</span>
            </div>

            <div className="p-4 rounded-xl bg-[#121212] border border-[#282828]">
              <span className="text-[10px] text-[#A0A0A0] uppercase font-bold">الكربوهيدرات</span>
              <p className="text-xl font-black text-amber-400 font-mono mt-1">290 جم</p>
              <div className="w-full bg-[#222222] h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-amber-400 h-full w-[65%]" />
              </div>
              <span className="text-[10px] text-[#A0A0A0] mt-1 block">تم تحقيق 190 جم</span>
            </div>

            <div className="p-4 rounded-xl bg-[#121212] border border-[#282828]">
              <span className="text-[10px] text-[#A0A0A0] uppercase font-bold">الدهون الصحية</span>
              <p className="text-xl font-black text-rose-400 font-mono mt-1">65 جم</p>
              <div className="w-full bg-[#222222] h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-rose-400 h-full w-[80%]" />
              </div>
              <span className="text-[10px] text-[#A0A0A0] mt-1 block">تم تحقيق 52 جم</span>
            </div>

            <div className="p-4 rounded-xl bg-[#121212] border border-[#282828] flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-[#A0A0A0] uppercase font-bold flex items-center space-x-1 rtl:space-x-reverse">
                  <Droplets size={12} className="text-cyan-400" />
                  <span>تتبع شرب الماء</span>
                </span>
                <p className="text-lg font-black text-cyan-400 font-mono mt-1">
                  {(waterCups * 0.25).toFixed(2)} / 3.5 لتر
                </p>
              </div>
              <button
                onClick={() => setWaterCups(waterCups + 1)}
                className="mt-2 py-1 px-2.5 rounded-lg bg-[#1E1E1E] text-white hover:bg-cyan-500/20 hover:text-cyan-400 border border-[#282828] text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center space-x-1 rtl:space-x-reverse"
              >
                <span>+ إضافة كوب ماء (250 مل)</span>
              </button>
            </div>
          </div>

          {/* Daily Meals List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
              <Clock size={16} className="text-[#00FF66]" />
              <span>جدول الوجبات اليومية الموزعة:</span>
            </h3>

            {[
              {
                title: 'الوجبة 1: وجبة الإفطار (Breakfast)',
                time: '08:30 صباحاً',
                calories: '620 سعرة',
                protein: '42 جم بروتين',
                desc: '100 جم شوفان بالحليب قليل الدسم + موزة + 5 بياض بيض مسلوق + 20 جم لوز نيء',
              },
              {
                title: 'الوجبة 2: وجبة قبل التمرين (Pre-Workout)',
                time: '01:30 ظهراً',
                calories: '750 سعرة',
                protein: '55 جم بروتين',
                desc: '200 جم صدور دجاج مشوية + 250 جم أرز بسمتي مسلوق + طبق خضار سوتيه بزيت الزيتون',
              },
              {
                title: 'الوجبة 3: وجبة الاستشفاء بعد التمرين (Post-Workout)',
                time: '05:30 مساءً',
                calories: '430 سعرة',
                protein: '38 جم بروتين',
                desc: 'سكوب ونصف واي بروتين أيزوليت بماء بارد + 4 تمرات مجدولة + موزة متوسطة',
              },
              {
                title: 'الوجبة 4: وجبة العشاء (Dinner)',
                time: '09:30 مساءً',
                calories: '850 سعرة',
                protein: '45 جم بروتين',
                desc: 'علبة تونة مصفاة بزيت الزيتون + 200 جم بطاطا حلوة مشوية + طبق سلطة خضراء غني بالألياف',
              },
            ].map((m, idx) => {
              const isChecked = !!completedMeals[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleMeal(idx)}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-[#00FF66]/5 border-[#00FF66]/40'
                      : 'bg-[#121212] border-[#282828] hover:border-[#00FF66]/30'
                  }`}
                >
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <CheckCircle2
                      size={20}
                      className={`mt-0.5 shrink-0 ${isChecked ? 'text-[#00FF66]' : 'text-[#555555]'}`}
                    />
                    <div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <h4 className={`text-sm font-bold ${isChecked ? 'line-through text-white/70' : 'text-white'}`}>
                          {m.title}
                        </h4>
                        <span className="text-[10px] font-mono text-[#A0A0A0] bg-[#1E1E1E] px-2 py-0.5 rounded">
                          {m.time}
                        </span>
                      </div>
                      <p className="text-xs text-[#A0A0A0] mt-1.5 leading-relaxed">{m.desc}</p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between text-xs shrink-0 font-mono">
                    <span className="text-[#00FF66] font-bold">{m.protein}</span>
                    <span className="text-[#A0A0A0] text-[11px]">{m.calories}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Daily Supplements */}
          <div className="p-4 rounded-xl bg-[#121212] border border-[#282828] space-y-2.5">
            <h4 className="text-xs font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
              <Pill size={15} className="text-[#00FF66]" />
              <span>المكملات الغذائية اليومية الموصوفة:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-[#181818] border border-[#242424]">
                <strong className="text-white block">كرياتين ميكرونايزد (5 جم)</strong>
                <span className="text-[11px] text-[#A0A0A0]">يؤخذ يومياً بعد التمرين مباشرة مع عصير أو كارب</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#181818] border border-[#242424]">
                <strong className="text-white block">أوميغا 3 بلس (2 كبسولة)</strong>
                <span className="text-[11px] text-[#A0A0A0]">مع وجبة الإفطار لدعم المفاصل والقلب</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#181818] border border-[#242424]">
                <strong className="text-white block">ملتي فيتامين وزنك (كبسولة)</strong>
                <span className="text-[11px] text-[#A0A0A0]">صباحاً مع كوب ماء كبير لرفع المناعة</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 5: STORE (متجر النادي والمكملات - تصفح وشراء) ────────── */}
      {(activeTab === 'store') && (
        <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828] space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                <ShoppingBag size={22} className="text-[#00FF66]" />
                <span>متجر نادي PulsOps للمكملات والمستلزمات الرياضية</span>
                <span className="text-xs bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40 px-2 py-0.5 rounded-full font-mono">
                  حصري للمشتركين
                </span>
              </h2>
              <p className="text-xs text-[#A0A0A0] mt-0.5">
                تصفح المنتجات المتوفرة بصالتك واطلبها فوراً بالجنيه المصري للاستلام مباشرة من الريسبشن
              </p>
            </div>

            <span className="text-xs font-mono text-[#00FF66] bg-[#00FF66]/10 px-3 py-1.5 rounded-xl border border-[#00FF66]/30 font-bold">
              أسعار وخصومات خاصة لأعضاء النادي
            </span>
          </div>

          {memberOrderSuccess && (
            <div className="p-3.5 rounded-xl bg-[#00FF66]/20 border border-[#00FF66] text-[#00FF66] text-xs font-bold text-center animate-fadeIn">
              ✅ تم تسجيل طلبك بنجاح! تم تجهيز المنتجات بريسبشن النادي ويمكنك استلامها برقم عضويتك (#8491).
            </div>
          )}

          {/* Categories Filter Tabs */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse overflow-x-auto pb-1 text-xs">
            {['الكل', 'بروتين', 'قوة واستشفاء', 'طاقة وبومب', 'مستلزمات رياضية'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedStoreCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                  selectedStoreCategory === cat
                    ? 'bg-[#00FF66] text-[#0A0A0A] shadow-[0_0_12px_rgba(0,255,102,0.3)]'
                    : 'bg-[#121212] border border-[#282828] text-[#A0A0A0] hover:text-white hover:border-[#00FF66]/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredStoreProducts.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl bg-[#121212] border border-[#282828] hover:border-[#00FF66]/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-full h-40 rounded-lg bg-[#181818] mb-3 overflow-hidden flex items-center justify-center">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#00FF66] font-mono uppercase font-bold tracking-wider">
                      {p.category}
                    </span>
                    <span className="text-[10px] text-[#666666] font-mono">
                      المتوفر: {p.stock}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1 leading-snug line-clamp-2">{p.name}</h4>
                  <div className="mt-2 text-base font-black text-[#00FF66] font-mono">
                    {p.price.toLocaleString()} ج.م
                  </div>
                </div>

                <button
                  onClick={() => handleMemberBuy(p.id)}
                  className="mt-3.5 w-full py-2 rounded-xl bg-[#1E1E1E] text-white hover:bg-[#00FF66] hover:text-[#0A0A0A] font-bold text-xs transition-all cursor-pointer flex items-center justify-center space-x-1.5 rtl:space-x-reverse"
                >
                  <ShoppingBag size={14} />
                  <span>إضافة للسلة {memberCart[p.id] ? `(${memberCart[p.id]})` : ''}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Cart & Checkout Floating Bar */}
          {cartTotal > 0 && (
            <div className="p-4 rounded-2xl bg-[#00FF66]/10 border border-[#00FF66]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
              <div>
                <span className="text-xs text-[#A0A0A0]">إجمالي سلة مشترياتك:</span>
                <span className="text-lg font-black text-[#00FF66] mr-2 font-mono">
                  {cartTotal.toLocaleString()} ج.م
                </span>
                <span className="text-[11px] text-[#A0A0A0] block mt-0.5">
                  الدفع كاش أو بالفيزا عند استلام طلبك من ريسبشن الصالة
                </span>
              </div>
              <button
                onClick={handleOrderCheckout}
                className="neon-btn px-6 py-2.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer shadow-lg"
              >
                تأكيد طلب الشراء والاستلام من الريسبشن
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 6: AI COACH (كوتش الذكاء الاصطناعي) ─────────────────── */}
      {(activeTab === 'ai') && (
        <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828] space-y-5 animate-fadeIn">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
              <Sparkles size={20} className="text-[#00FF66]" />
              <span>كوتش الذكاء الاصطناعي (Gemini AI Fitness Advisor)</span>
            </h2>
            <p className="text-xs text-[#A0A0A0]">
              مستشارك الذكي لتحليل التمارين، السعرات، المكملات، وفترة الاستشفاء العضلي
            </p>
          </div>

          <div className="bg-[#121212] border border-[#282828] rounded-2xl p-4 flex flex-col h-[460px] justify-between">
            <div className="overflow-y-auto space-y-3 pr-1 flex-1">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#00FF66] text-[#0A0A0A] font-semibold rounded-br-none shadow-[0_0_15px_rgba(0,255,102,0.2)]'
                        : 'bg-[#181818] border border-[#282828] text-white rounded-bl-none shadow-md'
                    }`}
                  >
                    <div>{msg.text}</div>
                    <span className={`block text-[9px] mt-1 font-mono ${msg.role === 'user' ? 'text-black/60' : 'text-[#666666]'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="text-xs text-[#00FF66] flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse" />
                  <span>الكوتش الذكي يكتب تحليلك التدريبي الآن...</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#282828] space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#A0A0A0]">
                <span className="flex items-center space-x-1 rtl:space-x-reverse">
                  <Utensils size={13} className="text-[#00FF66]" />
                  <span>ميزة تصوير الوجبات وتقدير السعرات الذكية:</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowMealCameraModal(true)}
                  className="px-3 py-1 rounded-xl bg-[#00FF66]/15 hover:bg-[#00FF66]/25 border border-[#00FF66]/40 text-[#00FF66] font-bold flex items-center space-x-1.5 rtl:space-x-reverse transition-all cursor-pointer shadow-[0_0_10px_rgba(0,255,102,0.15)]"
                >
                  <Camera size={13} />
                  <span>📸 تصوير الوجبة وحساب السعرات</span>
                </button>
              </div>

              <form onSubmit={handleSendMessage} className="flex items-center space-x-2 rtl:space-x-reverse">
                <button
                  type="button"
                  onClick={() => setShowMealCameraModal(true)}
                  className="p-2.5 rounded-xl bg-[#1E1E1E] border border-[#282828] hover:border-[#00FF66] text-[#00FF66] transition-all cursor-pointer shrink-0"
                  title="التقاط أو رفع صورة وجبة لتحليل السعرات"
                >
                  <Camera size={17} />
                </button>
                <input
                  type="text"
                  placeholder="اسأل عن التمارين، كميات البروتين، المكملات، أو صور وجبتك..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 bg-[#181818] border border-[#282828] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#666666] focus:border-[#00FF66] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isAiLoading || !inputMessage.trim()}
                  className="p-2.5 rounded-xl bg-[#00FF66] text-[#0A0A0A] hover:bg-[#39FF14] transition-all cursor-pointer disabled:opacity-40 shrink-0"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* Feature 5: AI Custom Workout & Nutrition Plan Generator */}
          <div className="p-5 rounded-2xl bg-[#141414] border border-[#282828] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#282828]">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Compass size={20} className="text-[#00FF66]" />
                <h3 className="text-sm font-bold text-white">
                  منشئ البرامج الذكي (AI Workout & Nutrition Plan Generator)
                </h3>
              </div>
              <span className="text-[10px] bg-[#00FF66]/15 text-[#00FF66] px-2.5 py-1 rounded-full font-bold">
                توليد خطة مخصصة بالذكاء الاصطناعي ⚡
              </span>
            </div>

            <p className="text-xs text-[#A0A0A0] leading-relaxed">
              حدد هدفك التدريبي وأيام التفرغ وحساسيات الأكل ليقوم مساعد الذكاء الاصطناعي بصياغة جدول تمارين أسبوعي ونظام غذائي دقيق مع ربطه بمنتجات متجر الصالة:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-[#A0A0A0] block mb-1">الهدف التدريبي:</label>
                <select
                  value={aiGoal}
                  onChange={(e: any) => setAiGoal(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                >
                  <option value="hypertrophy">تضخيم عضلي صافي (Hypertrophy)</option>
                  <option value="fat_loss">تنشيف وخسارة دهون (Fat Loss)</option>
                  <option value="strength">زيادة القوة الانفجارية (Strength)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#A0A0A0] block mb-1">أيام التمرين أسبوعياً:</label>
                <select
                  value={aiDays}
                  onChange={(e) => setAiDays(Number(e.target.value))}
                  className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                >
                  <option value={3}>3 أيام (Full Body / Upper-Lower)</option>
                  <option value={4}>4 أيام (Push-Pull-Legs-Upper)</option>
                  <option value={5}>5 أيام (Bro Split متقدم)</option>
                  <option value={6}>6 أيام (PPL مزدوج)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#A0A0A0] block mb-1">حساسيات الأكل أو تفضيلات:</label>
                <input
                  type="text"
                  placeholder="مثال: بدون لاكتوز، حساسية بيض..."
                  value={aiAllergies}
                  onChange={(e) => setAiAllergies(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateAiPlan}
              disabled={isGeneratingAiPlan}
              className="w-full py-2.5 rounded-xl neon-btn text-xs font-bold flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(0,255,102,0.35)] transition-all"
            >
              <Sparkles size={16} />
              <span>{isGeneratingAiPlan ? 'جاري توليد الخطة بالذكاء الاصطناعي...' : 'توليد خطة التمارين والتغذية المخصصة الآن 🤖'}</span>
            </button>

            {/* Generated Plan Presentation Card */}
            {generatedAiPlan && (
              <div className="mt-4 p-4 rounded-xl bg-[#0D0D0D] border border-[#00FF66]/40 glow-border space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                    <BadgeCheck size={18} className="text-[#00FF66]" />
                    <span>{generatedAiPlan.planName}</span>
                  </h4>
                  <span className="text-[10px] font-mono text-[#00FF66] bg-[#00FF66]/15 px-2.5 py-0.5 rounded-full font-bold">
                    خطة معتمدة
                  </span>
                </div>

                {/* Macros Badge Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-[#181818] border border-[#282828]">
                    <span className="text-[9px] text-[#A0A0A0]">السعرات</span>
                    <p className="text-xs font-bold text-[#00FF66] font-mono">{generatedAiPlan.macros.calories} kcal</p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#181818] border border-[#282828]">
                    <span className="text-[9px] text-[#A0A0A0]">البروتين</span>
                    <p className="text-xs font-bold text-white font-mono">{generatedAiPlan.macros.protein}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#181818] border border-[#282828]">
                    <span className="text-[9px] text-[#A0A0A0]">الكربوهيدرات</span>
                    <p className="text-xs font-bold text-amber-400 font-mono">{generatedAiPlan.macros.carbs}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#181818] border border-[#282828]">
                    <span className="text-[9px] text-[#A0A0A0]">الدهون الصحية</span>
                    <p className="text-xs font-bold text-emerald-400 font-mono">{generatedAiPlan.macros.fats}</p>
                  </div>
                </div>

                {/* Suggested Meals List */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#A0A0A0] block">الوجبات اليومية المقترحة:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {generatedAiPlan.suggestedMeals?.map((m: any, i: number) => (
                      <div key={i} className="p-2.5 rounded-lg bg-[#161616] border border-[#242424] space-y-1">
                        <div className="flex justify-between font-bold">
                          <span className="text-[#00FF66]">{m.meal}</span>
                          <span className="text-[10px] text-[#A0A0A0] font-mono">{m.protein} بروتين • {m.calories} سعرة</span>
                        </div>
                        <p className="text-[11px] text-[#CCCCCC] leading-relaxed">{m.items}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Split Table */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#A0A0A0] block">توزيع التمارين الأسبوعي:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {generatedAiPlan.weeklySplit?.map((s: any, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-[#161616] border border-[#242424] space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white">{s.day}</span>
                          <span className="text-[10px] text-[#00FF66] bg-[#00FF66]/10 px-2 py-0.5 rounded font-mono">{s.focus}</span>
                        </div>
                        <ul className="text-[11px] text-[#A0A0A0] list-disc list-inside space-y-0.5">
                          {s.exercises?.map((ex: string, eIdx: number) => (
                            <li key={eIdx}>{ex}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Supplements with Buy buttons */}
                {generatedAiPlan.recommendedSupplements?.length > 0 && (
                  <div className="pt-2 border-t border-[#222222] space-y-2">
                    <span className="text-xs font-bold text-white block">مكملات موصى بها من متجر الصالة لدعم خطتك:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {generatedAiPlan.recommendedSupplements.map((sup: any, i: number) => (
                        <div key={i} className="p-2.5 rounded-lg bg-[#181818] border border-[#282828] flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-white block">{sup.name}</span>
                            <span className="text-[10px] text-[#A0A0A0]">{sup.reason}</span>
                          </div>
                          <button
                            onClick={() => handleMemberBuy(sup.storeProductId || 'p-1')}
                            className="px-2.5 py-1 rounded-lg bg-[#00FF66]/15 hover:bg-[#00FF66] hover:text-[#0A0A0A] text-[#00FF66] font-bold text-[10px] transition-all cursor-pointer shrink-0"
                          >
                            + إضافة للسلة
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-2.5 rounded-lg bg-[#121212] border border-[#222222] text-[11px] text-[#A0A0A0] leading-relaxed">
                  💡 <span className="text-white font-bold">توجيه الكوتش الذكي:</span> {generatedAiPlan.coachAdvice}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 7: MY ORDERS & ORDER TRACKING (متابعة وتتبع طلباتي بالمتجر) ─── */}
      {(activeTab === 'my_orders') && (
        <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828] space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#282828]">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                <Truck size={20} className="text-[#00FF66]" />
                <span>متابعة وتتبع طلبات المتجر الحية (Live Order Tracking)</span>
              </h2>
              <p className="text-xs text-[#A0A0A0] mt-0.5">
                تتبع حالة مشترياتك من المكملات والمستلزمات لحظياً مع إشعارات تجهيز واستلام الطلب
              </p>
            </div>

            <button
              onClick={fetchMemberOrders}
              className="px-3.5 py-1.5 rounded-xl bg-[#1E1E1E] border border-[#282828] hover:border-[#00FF66] text-white text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse shrink-0"
            >
              <span>{isFetchingOrders ? 'جاري التحديث...' : 'تحديث الطلبات 🔄'}</span>
            </button>
          </div>

          {memberOrdersList.length === 0 ? (
            <div className="py-12 text-center space-y-3 bg-[#121212] rounded-2xl border border-[#282828]">
              <div className="w-12 h-12 rounded-full bg-[#181818] flex items-center justify-center text-[#666666] mx-auto">
                <ShoppingBag size={24} />
              </div>
              <p className="text-sm text-white font-bold">لا توجد طلبات سابقة حتى الآن</p>
              <p className="text-xs text-[#A0A0A0]">تصفح متجر الصالة واطلب المكملات والمستلزمات الرياضية بسهولة.</p>
              {onTabChange && (
                <button
                  onClick={() => onTabChange('store')}
                  className="neon-btn px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  الذهاب للمتجر الآن
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {memberOrdersList.map((ord: any) => {
                const isReady = ord.status === 'تم التجهيز';
                const isDelivered = ord.status === 'تم التسليم';
                const isProcessing = ord.status === 'قيد المراجعة والتجهيز';

                return (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl bg-[#121212] border border-[#282828] hover:border-[#00FF66]/40 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#202020]">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="text-xs font-mono font-black text-white bg-[#1A1A1A] px-2.5 py-1 rounded-lg border border-[#333333]">
                          #{ord.id}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-white block">طلب متجر النادي</span>
                          <span className="text-[10px] text-[#A0A0A0] font-mono">
                            {new Date(ord.date || Date.now()).toLocaleString('ar-EG')}
                          </span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 rtl:space-x-reverse ${
                            isDelivered
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : isReady
                              ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66] shadow-[0_0_12px_rgba(0,255,102,0.3)] animate-pulse'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {isDelivered && <CheckCheck size={14} />}
                          {isReady && <PackageCheck size={14} />}
                          {isProcessing && <Clock size={14} />}
                          <span>{ord.status}</span>
                        </span>
                      </div>
                    </div>

                    {/* Progress Step Bar */}
                    <div className="py-2">
                      <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold">
                        <div className={`p-2 rounded-xl border ${isProcessing || isReady || isDelivered ? 'bg-[#00FF66]/10 border-[#00FF66]/40 text-[#00FF66]' : 'bg-[#181818] border-[#282828] text-[#666666]'}`}>
                          1. استلام الطلب ⏳
                        </div>
                        <div className={`p-2 rounded-xl border ${isReady || isDelivered ? 'bg-[#00FF66]/20 border-[#00FF66] text-[#00FF66] shadow-[0_0_10px_rgba(0,255,102,0.2)]' : 'bg-[#181818] border-[#282828] text-[#666666]'}`}>
                          2. تم التجهيز بالريسبشن 📦
                        </div>
                        <div className={`p-2 rounded-xl border ${isDelivered ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-[#181818] border-[#282828] text-[#666666]'}`}>
                          3. تم التسليم ✅
                        </div>
                      </div>
                    </div>

                    {/* Notification Callout when ready */}
                    {isReady && (
                      <div className="p-3 rounded-xl bg-[#00FF66]/15 border border-[#00FF66] text-[#00FF66] text-xs font-bold flex items-center justify-between animate-fadeIn">
                        <span>🔔 طلبك جاهز الآن للاستلام من مكتب استقبال الصالة الرياضية! أظهر رقم عضويتك (#8491).</span>
                        <span className="font-mono text-[10px] bg-black/60 px-2 py-1 rounded">كود: #{ord.id}</span>
                      </div>
                    )}

                    {/* Items List */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] text-[#A0A0A0] block font-bold">محتويات الطلب:</span>
                      <div className="space-y-1">
                        {ord.items?.map((it: any, i: number) => (
                          <div key={i} className="flex justify-between items-center text-xs bg-[#161616] p-2 rounded-lg">
                            <span className="text-white font-medium">{it.name} <span className="text-[#00FF66] font-mono">×{it.quantity}</span></span>
                            <span className="font-mono font-bold text-white">{(it.price * it.quantity).toLocaleString()} ج.م</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery & Total footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#202020] text-xs">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#A0A0A0]">
                        <MapPin size={14} className="text-[#00FF66]" />
                        <span>{ord.address}</span>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-[#A0A0A0]">الإجمالي المدفوع:</span>
                        <span className="text-base font-black text-[#00FF66] font-mono">{ord.totalAmount?.toLocaleString()} ج.م</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 8: LOYALTY & REWARDS (نقاط المكافآت وتحديات الولاء) ─────── */}
      {(activeTab === 'loyalty') && (
        <div className="p-6 rounded-2xl bg-[#181818] border border-[#282828] space-y-6 animate-fadeIn">
          {/* Hero Banner for Loyalty */}
          <div className="relative p-6 rounded-2xl bg-gradient-to-r from-[#00FF66]/15 via-[#181818] to-[#121212] border border-[#00FF66]/30 overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5 glow-border">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#00FF66] bg-[#00FF66]/20 px-3 py-1 rounded-full border border-[#00FF66]/30">
                برنامج ولاء نادي PulsOps VIP
              </span>
              <h2 className="text-2xl font-black text-white">
                رصيد نقاطك: <span className="text-[#00FF66] font-mono">{loyaltyPoints.points.toLocaleString()}</span> نقطة 🪙
              </h2>
              <p className="text-xs text-[#A0A0A0] max-w-lg leading-relaxed">
                اكسب 50 نقطة عند كل دخول بالباركود، 100 نقطة عند إجراء فحص InBody، و 200 نقطة لكل عملية شراء من المتجر. استبدل نقاطك بخصومات وجلسات تدريب حصرية!
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#242424] text-center min-w-[160px] shrink-0">
              <span className="text-[10px] text-[#A0A0A0] uppercase font-mono block">فئة العضوية</span>
              <p className="text-base font-bold text-[#00FF66] mt-0.5">{loyaltyPoints.tier}</p>
              <div className="w-full bg-[#222222] h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-[#00FF66] h-full w-[85%]" />
              </div>
              <span className="text-[9px] text-[#A0A0A0] mt-1 block">متبقي 250 نقطة للـ Platinum</span>
            </div>
          </div>

          {/* Alert for Redeemed Coupon */}
          {redeemedCoupon && (
            <div className="p-4 rounded-xl bg-[#00FF66]/20 border border-[#00FF66] text-white text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-scaleIn">
              <div>
                <span className="text-[#00FF66] block">🎉 تم استبدال المكافأة بنجاح: {redeemedCoupon.name}</span>
                <span className="text-xs text-[#A0A0A0]">استخدم الكود عند كاشير الصالة أو بمكتب الاستقبال لتفعيل العرض.</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse bg-black/70 px-3 py-1.5 rounded-lg border border-[#00FF66]/50 font-mono text-sm text-[#00FF66]">
                <span>{redeemedCoupon.code}</span>
              </div>
            </div>
          )}

          {/* Rewards Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
              <Gift size={18} className="text-[#00FF66]" />
              <span>المكافآت المتاحة للاستبدال الفوري</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {loyaltyPoints.rewards?.map((rew: any) => {
                const canAfford = loyaltyPoints.points >= rew.cost;
                return (
                  <div
                    key={rew.id}
                    className="p-4 rounded-xl bg-[#121212] border border-[#282828] hover:border-[#00FF66]/40 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#00FF66]/10 border border-[#00FF66]/20 flex items-center justify-center text-[#00FF66] mb-2">
                        <Gift size={20} />
                      </div>
                      <h4 className="text-xs font-bold text-white leading-snug">{rew.name}</h4>
                      <div className="mt-2 text-sm font-mono font-black text-[#00FF66]">
                        {rew.cost} نقطة
                      </div>
                    </div>

                    <button
                      onClick={() => handleRedeemReward(rew)}
                      disabled={!canAfford}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        canAfford
                          ? 'neon-btn shadow-md'
                          : 'bg-[#1C1C1C] text-[#555555] cursor-not-allowed border border-[#282828]'
                      }`}
                    >
                      {canAfford ? 'استبدال الآن 🎁' : `يلزمك ${rew.cost - loyaltyPoints.points} نقطة`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Points History Table */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
              <Coins size={18} className="text-[#00FF66]" />
              <span>سجل حركات واكتساب النقاط</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-[#282828] text-[#A0A0A0] font-mono text-[11px]">
                    <th className="py-2.5 px-3">النشاط / الحركة</th>
                    <th className="py-2.5 px-3">النوع</th>
                    <th className="py-2.5 px-3">التاريخ والوقت</th>
                    <th className="py-2.5 px-3">النقاط</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#282828]">
                  {loyaltyPoints.history?.map((h: any) => (
                    <tr key={h.id} className="hover:bg-[#1E1E1E]/50 transition-colors">
                      <td className="py-3 px-3 font-semibold text-white">{h.title}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-[#181818] border border-[#282828] text-[#A0A0A0] text-[10px] font-mono">
                          {h.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#A0A0A0] font-mono text-[11px]">{h.date}</td>
                      <td className={`py-3 px-3 font-mono font-bold ${h.points > 0 ? 'text-[#00FF66]' : 'text-red-400'}`}>
                        {h.points > 0 ? `+${h.points}` : h.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── Meal Photo Vision & Questions Modal ──────────────────────── */}
      {showMealCameraModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#00FF66]/40 glow-border w-full max-w-lg rounded-2xl shadow-2xl animate-scaleIn p-6 relative overflow-hidden space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#282828]">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Camera size={20} className="text-[#00FF66]" />
                <h3 className="text-base font-bold text-white">
                  تصوير الوجبة وتقدير السعرات الذكي (Gemini AI Vision)
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowMealCameraModal(false);
                  setMealPhotoPreview(null);
                }}
                className="text-[#666666] hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Photo Capture or Upload Area */}
            <div>
              <label className="block text-xs font-bold text-[#A0A0A0] mb-2">
                1. التقاط صورة الوجبة من الكاميرا أو المعرض:
              </label>
              {mealPhotoPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-[#00FF66]/50 h-48 bg-[#0A0A0A]">
                  <img
                    src={mealPhotoPreview}
                    alt="Meal Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setMealPhotoPreview(null)}
                    className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/80 text-white hover:text-red-400 cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2.5 py-1 rounded-md text-[10px] text-[#00FF66] font-mono font-bold">
                    جاهزة للتحليل ✅
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-[#282828] hover:border-[#00FF66]/50 rounded-xl p-6 text-center bg-[#161616] flex flex-col items-center justify-center space-y-3 cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-[#00FF66]/10 flex items-center justify-center text-[#00FF66]">
                    <Camera size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      التقط صورة لطبقك الآن أو اختر من الاستوديو
                    </span>
                    <span className="text-[11px] text-[#666666]">
                      يدعم كاميرا الموبايل واللابتوب بدقة عالية
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setMealPhotoPreview(
                          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-[#222222] text-[#00FF66] hover:bg-[#00FF66] hover:text-[#0A0A0A] text-xs font-bold transition-all cursor-pointer"
                    >
                      تجربة نموذج (طبق دجاج وأرز وخضار)
                    </button>
                    <label className="neon-btn px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer">
                      <span>فتح الكاميرا / الملفات</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setMealPhotoPreview(ev.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Questions Section: Oil Type & Salt Level */}
            <div className="space-y-4 pt-2 border-t border-[#222222]">
              <span className="text-xs font-bold text-white flex items-center space-x-1.5 rtl:space-x-reverse">
                <HelpCircle size={14} className="text-[#00FF66]" />
                <span>2. أسئلة لتحديد دقيق للسعرات والدهون:</span>
              </span>

              {/* Oil Question */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-[#A0A0A0] block font-medium">
                  هل تم استخدام زيوت أثناء الطهي؟ وما نوعها؟
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'none', label: 'بدون زيوت (مسلوق/مشوي نقي)' },
                    { id: 'olive_light', label: 'زيت زيتون خفيف (ملعقة)' },
                    { id: 'olive_heavy', label: 'زيت زيتون وفير' },
                    { id: 'regular_oil', label: 'زيوت نباتية / سمن' },
                  ].map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setMealOilType(o.id)}
                      className={`p-2 rounded-lg border text-right transition-all cursor-pointer ${
                        mealOilType === o.id
                          ? 'bg-[#00FF66]/15 border-[#00FF66] text-[#00FF66] font-bold'
                          : 'bg-[#181818] border-[#282828] text-[#A0A0A0] hover:border-[#383838]'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Salt Question */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-[#A0A0A0] block font-medium">
                  كمية الملح والصوديوم المضافة:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'low', label: 'قليل الملح (دايت)' },
                    { id: 'normal', label: 'معتدل طبيعي' },
                    { id: 'high', label: 'ملح كثير / صوصات' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setMealSaltLevel(s.id)}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                        mealSaltLevel === s.id
                          ? 'bg-[#00FF66]/15 border-[#00FF66] text-[#00FF66] font-bold'
                          : 'bg-[#181818] border-[#282828] text-[#A0A0A0] hover:border-[#383838]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Portion Question */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-[#A0A0A0] block font-medium">
                  حجم الحصة والطبق:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'small', label: 'طبق صغير' },
                    { id: 'medium', label: 'طبق متوسط' },
                    { id: 'large', label: 'طبق كبير مشبع' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setMealPortion(p.id)}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                        mealPortion === p.id
                          ? 'bg-[#00FF66]/15 border-[#00FF66] text-[#00FF66] font-bold'
                          : 'bg-[#181818] border-[#282828] text-[#A0A0A0] hover:border-[#383838]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-3 border-t border-[#282828] flex items-center justify-between">
              <span className="text-[11px] text-[#666666]">
                تحليل تلقائي باستخدام رؤية الذكاء الاصطناعي
              </span>
              <button
                type="button"
                onClick={handleAnalyzeMeal}
                disabled={!mealPhotoPreview || isAnalyzingMeal}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 rtl:space-x-reverse transition-all ${
                  mealPhotoPreview && !isAnalyzingMeal
                    ? 'neon-btn cursor-pointer shadow-[0_0_15px_rgba(0,255,102,0.3)]'
                    : 'bg-[#1C1C1C] text-[#555555] cursor-not-allowed border border-[#282828]'
                }`}
              >
                <Sparkles size={14} className={isAnalyzingMeal ? 'animate-spin' : ''} />
                <span>{isAnalyzingMeal ? 'جاري تحليل الصورة والسعرات...' : 'حساب السعرات والماكروز في الشات'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Digital Turnstile Barcode Pass Modal ───────────────────── */}
      {showBarcodeModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
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
                  onClick={() => setShowBarcodeModal(false)}
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
            <div className="pt-3 border-t border-[#282828] text-[10px] text-[#A0A0A0] flex justify-between relative z-10 font-mono">
              <span>الباقة: السنوية VIP</span>
              <span>صالحة حتى: 30-11-2027</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── Member Shopping Cart & Order Confirmation Modal ─────────── */}
      {showCartDrawerModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#00FF66]/40 glow-border w-full max-w-lg rounded-2xl shadow-2xl animate-scaleIn p-6 relative overflow-hidden space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#282828]">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <ShoppingCart size={20} className="text-[#00FF66]" />
                <h3 className="text-base font-bold text-white">
                  سلة المشتريات وإتمام الطلب (Store Checkout)
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowCartDrawerModal(false);
                  setPlacedOrderDetails(null);
                }}
                className="text-[#666666] hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {placedOrderDetails ? (
              <div className="py-6 text-center space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-[#00FF66]/20 border border-[#00FF66] flex items-center justify-center text-[#00FF66] mx-auto">
                  <PackageCheck size={32} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">تم تأكيد طلبك بنجاح! 🎉</h4>
                  <p className="text-xs text-[#A0A0A0] mt-1">
                    رقم الطلب: <span className="text-[#00FF66] font-mono font-bold">#{placedOrderDetails.id}</span>
                  </p>
                  <p className="text-xs text-[#A0A0A0] mt-0.5">
                    تم إرسال تفاصيل الطلب لإدارة الجيم لتجهيزه فوراً.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#161616] border border-[#282828] text-right text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#A0A0A0]">الاسم:</span>
                    <span className="text-white font-bold">{placedOrderDetails.memberName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A0A0A0]">الهاتف:</span>
                    <span className="text-white">{placedOrderDetails.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A0A0A0]">طريقة الاستلام:</span>
                    <span className="text-[#00FF66] font-bold">{placedOrderDetails.address}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#282828] text-sm">
                    <span className="text-white font-bold">الإجمالي المطلوب:</span>
                    <span className="text-[#00FF66] font-black">{placedOrderDetails.totalAmount?.toLocaleString()} ج.م</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowCartDrawerModal(false);
                    setPlacedOrderDetails(null);
                  }}
                  className="neon-btn w-full py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                >
                  العودة للمتجر
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Cart Items List */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {Object.keys(memberCart).length === 0 ? (
                    <div className="py-6 text-center text-[#666666] text-xs">
                      سلتك فارغة حالياً. قم بإضافة منتجات من المتجر.
                    </div>
                  ) : (
                    Object.entries(memberCart).map(([id, qty]) => {
                      const prod = memberProducts.find((p) => p.id === id);
                      if (!prod) return null;
                      return (
                        <div
                          key={id}
                          className="p-2.5 rounded-xl bg-[#161616] border border-[#242424] flex items-center justify-between text-xs"
                        >
                          <div className="flex-1 pr-2">
                            <h5 className="font-bold text-white line-clamp-1">{prod.name}</h5>
                            <span className="text-[10px] text-[#A0A0A0] font-mono">
                              {prod.price.toLocaleString()} ج.م × {qty}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <div className="flex items-center space-x-1 rtl:space-x-reverse bg-[#202020] rounded-lg border border-[#333333]">
                              <button
                                onClick={() => handleUpdateCartQty(id, -1)}
                                className="w-6 h-6 text-white hover:text-red-400 font-bold flex items-center justify-center cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-5 text-center font-mono font-bold text-white text-xs">
                                {qty}
                              </span>
                              <button
                                onClick={() => handleUpdateCartQty(id, 1)}
                                className="w-6 h-6 text-white hover:text-[#00FF66] font-bold flex items-center justify-center cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                            <span className="font-mono font-bold text-[#00FF66] min-w-[65px] text-left">
                              {(prod.price * qty).toLocaleString()} ج.م
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Customer Information & Delivery Form */}
                <div className="pt-3 border-t border-[#222222] space-y-3">
                  <span className="text-xs font-bold text-white block">بيانات الاستلام والتوصيل:</span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-[#A0A0A0] block mb-1">اسم العميل:</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-[#181818] border border-[#282828] rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#A0A0A0] block mb-1">رقم الموبايل للتواصل:</label>
                      <input
                        type="text"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-[#181818] border border-[#282828] rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#00FF66] focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Delivery Method Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-[#A0A0A0] block">طريقة الاستلام:</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('PICKUP')}
                        className={`p-2 rounded-lg border text-center transition-all cursor-pointer font-bold ${
                          deliveryMethod === 'PICKUP'
                            ? 'bg-[#00FF66]/15 border-[#00FF66] text-[#00FF66]'
                            : 'bg-[#181818] border-[#282828] text-[#A0A0A0]'
                        }`}
                      >
                        استلام من ريسبشن الجيم
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('HOME_DELIVERY')}
                        className={`p-2 rounded-lg border text-center transition-all cursor-pointer font-bold ${
                          deliveryMethod === 'HOME_DELIVERY'
                            ? 'bg-[#00FF66]/15 border-[#00FF66] text-[#00FF66]'
                            : 'bg-[#181818] border-[#282828] text-[#A0A0A0]'
                        }`}
                      >
                        توصيل للعنوان
                      </button>
                    </div>
                  </div>

                  {deliveryMethod === 'HOME_DELIVERY' && (
                    <div>
                      <label className="text-[10px] text-[#A0A0A0] block mb-1">عنوان التوصيل بالتفصيل:</label>
                      <input
                        type="text"
                        placeholder="المدينة، الحي، اسم الشارع، رقم العمارة..."
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        className="w-full bg-[#181818] border border-[#282828] rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] text-[#A0A0A0] block mb-1">ملاحظات إضافية على الطلب:</label>
                    <input
                      type="text"
                      placeholder="مثال: يرجى تجهيز نكهة الشوكولاتة..."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full bg-[#181818] border border-[#282828] rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Total & Submit Button */}
                <div className="pt-3 border-t border-[#282828] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#A0A0A0] block">الإجمالي الكلي:</span>
                    <span className="text-lg font-black text-[#00FF66] font-mono">
                      {cartTotal.toLocaleString()} ج.م
                    </span>
                  </div>
                  <button
                    onClick={handleConfirmOrder}
                    disabled={cartTotal === 0 || isSubmittingOrder}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 rtl:space-x-reverse transition-all ${
                      cartTotal > 0 && !isSubmittingOrder
                        ? 'neon-btn cursor-pointer shadow-[0_0_15px_rgba(0,255,102,0.3)]'
                        : 'bg-[#1C1C1C] text-[#555555] cursor-not-allowed border border-[#282828]'
                    }`}
                  >
                    <PackageCheck size={15} />
                    <span>{isSubmittingOrder ? 'جاري الإرسال...' : 'تأكيد الطلب وإرساله للجيم'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* ─── InBody Log Measurement Modal ─────────────────────────────── */}
      {showLogMeasurementModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#00FF66]/40 glow-border w-full max-w-md rounded-2xl shadow-2xl animate-scaleIn p-6 relative overflow-hidden space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#282828]">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Scale size={20} className="text-[#00FF66]" />
                <h3 className="text-base font-bold text-white">
                  تسجيل قياس فحص InBody جديد
                </h3>
              </div>
              <button
                onClick={() => setShowLogMeasurementModal(false)}
                className="text-[#666666] hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddInBodyMeasurement} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#A0A0A0] block mb-1">الوزن الحالي (كجم):</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newLogWeight}
                    onChange={(e) => setNewLogWeight(e.target.value)}
                    className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#A0A0A0] block mb-1">نسبة الدهون (%):</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newLogFat}
                    onChange={(e) => setNewLogFat(e.target.value)}
                    className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#A0A0A0] block mb-1">الكتلة العضلية (كجم):</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newLogMuscle}
                    onChange={(e) => setNewLogMuscle(e.target.value)}
                    className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#A0A0A0] block mb-1">محيط الخصر (سم):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newLogWaist}
                    onChange={(e) => setNewLogWaist(e.target.value)}
                    className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#A0A0A0] block mb-1">ملاحظات الكوتش أو الفحص:</label>
                <input
                  type="text"
                  value={newLogNote}
                  onChange={(e) => setNewLogNote(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#00FF66]/10 border border-[#00FF66]/30 text-xs text-[#00FF66] font-medium flex items-center space-x-2 rtl:space-x-reverse">
                <Coins size={15} />
                <span>تحصل تلقائياً على +100 نقطة ولاء في رصيدك فور تسجيل القياس!</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl neon-btn text-xs font-bold cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(0,255,102,0.35)] transition-all"
              >
                حفظ الفحص وتحديث المسار البياني
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
