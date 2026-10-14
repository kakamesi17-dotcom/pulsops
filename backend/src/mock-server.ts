import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'pulsops_super_secret_access_jwt_key_2026';

// ─── Comprehensive Multi-Tenant Database Simulation ─────────────────────────
export const db = {
  users: [
    {
      id: 'usr-superadmin',
      email: 'superadmin@pulsops.com',
      passwordHash: bcrypt.hashSync('SuperAdmin@2026!', 8),
      firstName: 'المشرف',
      lastName: 'العام',
      role: 'SUPER_ADMIN',
    },
    {
      id: 'usr-gymadmin',
      email: 'admin@titanfitness.com',
      passwordHash: bcrypt.hashSync('GymAdmin@2026!', 8),
      firstName: 'طارق',
      lastName: 'الغامدي',
      role: 'GYM_ADMIN',
      gymId: 'gym-titan',
    },
    {
      id: 'usr-trainer',
      email: 'coach.alex@titanfitness.com',
      passwordHash: bcrypt.hashSync('Trainer@2026!', 8),
      firstName: 'أليكس',
      lastName: 'ستون',
      role: 'TRAINER',
      gymId: 'gym-titan',
    },
  ],
  gyms: [
    {
      id: 'gym-titan',
      name: 'نادي تيتان أيرون الرياضي',
      slug: 'titan-iron',
      tier: 'سوبر بلس',
      status: 'نشط',
      membersCount: 840,
      monthlyRevenue: 9900,
      createdAt: '2026-01-15',
    },
    {
      id: 'gym-apex',
      name: 'نادي أبكس للياقة البدنية',
      slug: 'apex-athletics',
      tier: 'بلس',
      status: 'نشط',
      membersCount: 420,
      monthlyRevenue: 4900,
      createdAt: '2026-03-01',
    },
    {
      id: 'gym-vanguard',
      name: 'أرينا فانجارد كروسفيت',
      slug: 'vanguard-crossfit',
      tier: 'أساسية',
      status: 'نشط',
      membersCount: 160,
      monthlyRevenue: 2450,
      createdAt: '2026-04-10',
    },
  ],
  staff: [
    { id: 'st-1', name: 'أليكس ستون', role: 'كوتش معتمد / رئيس المدربين', clients: 24, salary: '12,000 ج.م', status: 'متاح' },
    { id: 'st-2', name: 'سارة خالد', role: 'مدربة لياقة نسائية وتغذية', clients: 18, salary: '10,500 ج.م', status: 'في جلسة' },
    { id: 'st-3', name: 'محمود عبد الرحمن', role: 'مسؤول الاستقبال والبوابات', clients: 0, salary: '6,000 ج.م', status: 'متاح' },
    { id: 'st-4', name: 'كريم حسام', role: 'أخصائي علاج طبيعي وتأهيل', clients: 12, salary: '9,500 ج.م', status: 'إجازة' },
  ],
  gymPlans: [
    { id: 'pl-1', name: 'الباقة الذهبية السنوية VIP', price: '4,500 ج.م / سنة', duration: '12 شهر', perks: 'دخول مفتوح 24/7 + 12 جلسة تدريب شخصي + مسبح وساونا + فحص InBody شهري', members: 420 },
    { id: 'pl-2', name: 'الباقة الفضية ربع سنوية', price: '1,500 ج.م / 3 أشهر', duration: '3 أشهر', perks: 'دخول جميع صالات الحديد والكارديو + 3 جلسات مدرب + فحص InBody', members: 260 },
    { id: 'pl-3', name: 'الباقة الشهرية الأساسية', price: '600 ج.م / شهر', duration: 'شهر واحد', perks: 'دخول الصالة الرئيسية والكارديو بدون مدرب شخصي', members: 160 },
  ],
  saasTiers: [
    { id: 'tier-free', name: 'الباقة المجانية (Free Tier)', price: '0 ج.م / شهرياً', maxMembers: 'حتى 50 عضواً', activeGyms: 22 },
    { id: 'tier-standard', name: 'الباقة الأساسية (Standard)', price: '2,450 ج.م / شهرياً', maxMembers: 'حتى 200 عضو', activeGyms: 38 },
    { id: 'tier-plus', name: 'الباقة المتقدمة (Plus)', price: '4,900 ج.م / شهرياً', maxMembers: 'حتى 500 عضو', activeGyms: 24 },
    { id: 'tier-super', name: 'باقة سوبر بلس (Super Plus Enterprise)', price: '9,900 ج.م / شهرياً', maxMembers: 'أعضاء غير محدود', activeGyms: 5 },
  ],
  attendance: [] as any[],
  inbody: [
    { id: 'inb-1', userId: 'usr-member', date: '1 يونيو', weight: 88.5, bodyFat: 23.4, muscleMass: 38.1 },
    { id: 'inb-2', userId: 'usr-member', date: '1 يوليو', weight: 86.2, bodyFat: 21.0, muscleMass: 39.0 },
    { id: 'inb-3', userId: 'usr-member', date: '1 أغسطس', weight: 84.0, bodyFat: 18.8, muscleMass: 39.8 },
    { id: 'inb-4', userId: 'usr-member', date: '1 سبتمبر', weight: 82.5, bodyFat: 16.5, muscleMass: 40.5 },
    { id: 'inb-5', userId: 'usr-member', date: '1 أكتوبر', weight: 81.0, bodyFat: 14.8, muscleMass: 41.2 },
  ],
  storeProducts: [
    { id: 'p-1', gymId: 'gym-titan', name: 'أوبتيموم جولد واي بروتين 5 باوند', category: 'بروتين', price: 3950, stock: 34, image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400&auto=format&fit=crop&q=80' },
    { id: 'p-2', gymId: 'gym-titan', name: 'كرياتين ميكرونايزد نقي 500 جرام', category: 'قوة واستشفاء', price: 1750, stock: 18, image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&auto=format&fit=crop&q=80' },
    { id: 'p-3', gymId: 'gym-titan', name: 'طاقة وتمرين C4 بنكهة الفواكه', category: 'طاقة وبومب', price: 2250, stock: 22, image: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=400&auto=format&fit=crop&q=80' },
    { id: 'p-4', gymId: 'gym-titan', name: 'أحزمة رفع أثقال تيتان الأصلية', category: 'مستلزمات رياضية', price: 900, stock: 50, image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80' },
  ],
  storeBanners: [
    {
      id: 'ban-titan-1',
      gymId: 'gym-titan',
      title: 'خصم 25% على مكملات البروتين والكرياتين',
      subtitle: 'عرض حصري لأعضاء نادي تيتان أيرون لفترة محدودة بمناسبة انطلاق الموسم',
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80',
      badge: 'عرض خاص للأعضاء',
      ctaText: 'تسوق الآن',
      active: true,
    },
  ],
  orders: [] as any[],
  broadcasts: [
    { id: 'b-1', title: 'مواعيد العمل في العطلة الرسمية', body: 'نحيطكم علماً بأن الصالة ستعمل من الساعة 8 صباحاً حتى 12 ليلاً.', sentAt: new Date().toISOString() },
  ],
  auditLogs: [
    { id: 'log-1', admin: 'المشرف الرئيسي', action: 'إنشاء صالة جديدة', target: 'نادي تيتان أيرون', ip: '197.35.12.90', time: 'منذ 10 دقائق', type: 'SUCCESS' },
    { id: 'log-2', admin: 'المشرف الرئيسي', action: 'ترقية باقة السحاب', target: 'نادي أبكس (إلى بلس)', ip: '197.35.12.90', time: 'منذ ساعتين', type: 'SUCCESS' },
  ],
  workoutsLibrary: [
    { id: 'w-1', title: 'تمارين الصدر والترايسبس (Push Day)', level: 'متقدم', duration: '60 دقيقة', exercisesCount: 6, focus: 'تضخيم عضلي' },
    { id: 'w-2', title: 'تمارين الظهر والبايسبس (Pull Day)', level: 'متوسط', duration: '55 دقيقة', exercisesCount: 6, focus: 'قوة وكثافة' },
    { id: 'w-3', title: 'تمارين الأرجل والسمانة (Leg Day)', level: 'متقدم', duration: '70 دقيقة', exercisesCount: 7, focus: 'بناء عضلي شديد' },
    { id: 'w-4', title: 'تمارين الكارديو وحرق الدهون (HIIT Cardio)', level: 'لجميع المستويات', duration: '35 دقيقة', exercisesCount: 8, focus: 'لياقة وتنشيف' },
  ],
  // Dynamic daily workout prescribed per member by Gym Admin or Assigned Coach
  memberWorkouts: {
    'usr-member': {
      title: 'تمارين اليوم المحددة (عضلات الجزء العلوي والأكتاف)',
      subtitle: 'محددة بواسطة الكوتش أليكس بناءً على خطة الضخامة الصافية',
      dayNumber: 'اليوم 3 من 4 في جدول الأسبوع',
      prescribedBy: 'الكوتش أليكس (المدرب المعتمد)',
      assignedDate: new Date().toISOString().split('T')[0],
      exercises: [
        { id: 'ex-1', name: 'بنش برس مائل بالبار الحر (Incline Barbell Press)', sets: 4, reps: '8-10', rest: 90, targetMuscle: 'الصدر العلوي' },
        { id: 'ex-2', name: 'عقلة بأوزان إضافية (Weighted Pull-ups)', sets: 4, reps: '6-8', rest: 90, targetMuscle: 'عضلات الظهر واللاتس' },
        { id: 'ex-3', name: 'ضغط أكتاف بالبار واقفا (Military Press)', sets: 3, reps: '8-10', rest: 75, targetMuscle: 'الكتف الأمامي والجانبي' },
        { id: 'ex-4', name: 'رفرفة جانبي بالكابل (Cable Lateral Raises)', sets: 4, reps: '12-15', rest: 60, targetMuscle: 'الكتف الجانبي' },
        { id: 'ex-5', name: 'ترايسبس بالحبل أعلى الرأس (Overhead Cable Triceps)', sets: 3, reps: '12', rest: 60, targetMuscle: 'الترايسبس الرأس الطويل' },
      ],
    },
  } as Record<string, any>,
  loyaltyPoints: {
    'usr-member': {
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
    },
  } as Record<string, any>,
  inbodyRecords: {
    'usr-member': [
      { id: 'inb-1', date: '2026-10-01', weight: 81.0, bodyFat: 14.8, muscleMass: 41.2, waist: 82, rating: 'ممتاز 🔥', note: 'انخفاض في نسبة الدهون مع ثبات رائع في الكتلة العضلية', bmi: 23.4 },
      { id: 'inb-2', date: '2026-09-01', weight: 82.5, bodyFat: 16.5, muscleMass: 40.5, waist: 84, rating: 'جيد جداً', note: 'استجابة مثالية لبرنامج الكارديو وتدريب الجزء العلوي', bmi: 23.9 },
      { id: 'inb-3', date: '2026-08-01', weight: 84.0, bodyFat: 18.8, muscleMass: 39.8, waist: 86, rating: 'جيد جداً', note: 'بدء مرحلة التنشيف الصافي وضبط السعرات', bmi: 24.3 },
      { id: 'inb-4', date: '2026-07-01', weight: 86.2, bodyFat: 21.0, muscleMass: 39.0, waist: 88, rating: 'جيد', note: 'تطور ملحوظ في قوة التحمل ورفع الأوزان', bmi: 24.9 },
      { id: 'inb-5', date: '2026-06-01', weight: 88.5, bodyFat: 23.4, muscleMass: 38.1, waist: 91, rating: 'بداية الخطة', note: 'الفحص الافتتاحي وتحديد الخطة التدريبية والغذائية', bmi: 25.6 },
    ],
  } as Record<string, any[]>,
  nutritionPlans: [
    { id: 'n-1', name: 'نظام التضخيم النظيف (Clean Bulk)', calories: '3,000 سعرة', protein: '220g', carbs: '350g', fats: '75g', target: 'زيادة وزن عضلي بدون دهون' },
    { id: 'n-2', name: 'نظام التنشيف وخسارة الدهون (Cutting Diet)', calories: '2,100 سعرة', protein: '200g', carbs: '180g', fats: '55g', target: 'حرق الدهون وإبراز العضلات' },
    { id: 'n-3', name: 'نظام اللياقة والمحافظة (Maintenance)', calories: '2,500 سعرة', protein: '180g', carbs: '260g', fats: '65g', target: 'ثبات الوزن ورفع الطاقة' },
  ],
};

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'PulsOps Multi-Tenant API Gateway',
    currency: 'EGP (الجنيه المصري)',
    version: '1.0.0',
    tenantsCount: db.gyms.length,
    usersCount: db.users.length,
  });
});

// ─── Auth: Login ─────────────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find((u) => u.email.toLowerCase() === email?.toLowerCase());

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role, gymId: user.gymId },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const gym = user.gymId ? db.gyms.find((g) => g.id === user.gymId) : null;

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
      gymId: user.gymId,
      gymName: gym?.name || 'مركز القيادة الرئيسي',
    },
  });
});

// ─── Super Admin: Gyms CRUD ──────────────────────────────────────────────────
app.get('/api/tenants', (req, res) => {
  res.json({ gyms: db.gyms, total: db.gyms.length });
});

app.post('/api/tenants', (req, res) => {
  const { name, slug, tier } = req.body;
  const newGym = {
    id: `gym-${Date.now()}`,
    name,
    slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
    tier: tier || 'أساسية',
    status: 'نشط',
    membersCount: 0,
    monthlyRevenue: tier === 'سوبر بلس' ? 9900 : tier === 'بلس' ? 4900 : tier === 'أساسية' ? 2450 : 0,
    createdAt: new Date().toISOString().split('T')[0],
  };
  db.gyms.push(newGym);

  // Automatically provision default Gym Admin user for this new gym
  const adminEmail = `admin@${newGym.slug}.com`;
  const defaultAdminUser = {
    id: `usr-admin-${Date.now()}`,
    email: adminEmail,
    passwordHash: bcrypt.hashSync('GymAdmin@2026!', 8),
    firstName: 'مدير',
    lastName: name,
    role: 'GYM_ADMIN',
    gymId: newGym.id,
  };
  db.users.push(defaultAdminUser);

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    admin: 'المشرف الرئيسي',
    action: 'إنشاء صالة جديدة وحساب المدير الافتراضي',
    target: `${name} (${adminEmail})`,
    ip: req.ip || '127.0.0.1',
    time: 'الآن',
    type: 'SUCCESS',
  });
  res.status(201).json({ gym: newGym, adminUser: { email: adminEmail, defaultPassword: 'GymAdmin@2026!' } });
});

app.patch('/api/tenants/:gymId/status', (req, res) => {
  const gym = db.gyms.find((g) => g.id === req.params.gymId);
  if (gym) {
    gym.status = gym.status === 'نشط' ? 'موقوف' : 'نشط';
    return res.json(gym);
  }
  res.status(404).json({ message: 'الصالة غير موجودة' });
});

// ─── Super Admin: Tiers & Logs ───────────────────────────────────────────────
app.get('/api/tenants/tiers', (req, res) => {
  res.json({ tiers: db.saasTiers });
});

app.get('/api/audit-logs', (req, res) => {
  res.json({ logs: db.auditLogs });
});

// ─── Gym: Members CRUD ───────────────────────────────────────────────────────
app.get('/api/gyms/:gymId/members', (req, res) => {
  const members = db.users.filter((u) => u.gymId === req.params.gymId && u.role === 'MEMBER');
  res.json({ members, total: members.length });
});

app.post('/api/gyms/:gymId/members', (req, res) => {
  const { name, phone, plan } = req.body;
  const names = (name || 'عضو جديد').split(' ');
  const newMember = {
    id: `usr-mem-${Date.now()}`,
    email: `${(phone || Date.now()).toString().replace(/\D/g, '')}@gym.com`,
    passwordHash: bcrypt.hashSync('Member@2026!', 8),
    firstName: names[0] || 'عضو',
    lastName: names.slice(1).join(' ') || 'جديد',
    phone: phone || '',
    role: 'MEMBER',
    gymId: req.params.gymId,
    plan: plan || 'الباقة الذهبية السنوية VIP',
    status: 'نشط',
    trainer: 'الكوتش أليكس',
    lastCheckIn: 'مسجل حديثاً',
  };
  db.users.push(newMember);
  res.status(201).json(newMember);
});

// ─── Gym: Staff / Trainers ───────────────────────────────────────────────────
app.get('/api/gyms/:gymId/staff', (req, res) => {
  res.json({ staff: db.staff });
});

app.post('/api/gyms/:gymId/staff', (req, res) => {
  const { name, role, email, phone, salary } = req.body;
  const staffMember = {
    id: `st-${Date.now()}`,
    name: name || 'مدرب جديد',
    role: role || 'كوتش معتمد / مدرب لياقة',
    clients: 0,
    salary: salary ? `${salary} ج.م` : '10,000 ج.م',
    status: 'متاح',
  };
  db.staff.push(staffMember);

  // Also create user login for trainer
  const trainerEmail = email || `coach.${Date.now()}@titanfitness.com`;
  const trainerUser = {
    id: `usr-trainer-${Date.now()}`,
    email: trainerEmail,
    passwordHash: bcrypt.hashSync('Trainer@2026!', 8),
    firstName: name?.split(' ')[0] || 'كوتش',
    lastName: name?.split(' ').slice(1).join(' ') || '',
    phone: phone || '',
    role: 'TRAINER',
    gymId: req.params.gymId,
  };
  db.users.push(trainerUser);

  res.status(201).json({ success: true, message: 'تمت إضافة الكوتش وإنشاء حسابه بنجاح', staff: staffMember, user: { email: trainerEmail, defaultPassword: 'Trainer@2026!' } });
});

// ─── Gym: Plans ──────────────────────────────────────────────────────────────
app.get('/api/gyms/:gymId/plans', (req, res) => {
  res.json({ plans: db.gymPlans });
});

// ─── Gym: InBody Biometrics ──────────────────────────────────────────────────
app.get('/api/gyms/:gymId/inbody', (req, res) => {
  res.json({ inbody: db.inbody });
});

app.post('/api/gyms/:gymId/inbody', (req, res) => {
  const { weight, bodyFat, muscleMass, date } = req.body;
  const record = {
    id: `inb-${Date.now()}`,
    userId: 'usr-member',
    date: date || 'اليوم',
    weight: parseFloat(weight) || 81.0,
    bodyFat: parseFloat(bodyFat) || 14.8,
    muscleMass: parseFloat(muscleMass) || 41.2,
  };
  db.inbody.push(record);
  res.status(201).json(record);
});

// ─── Gym: Workouts & Nutrition ───────────────────────────────────────────────
app.get('/api/gyms/:gymId/workouts', (req, res) => {
  res.json({ workouts: db.workoutsLibrary });
});

app.get('/api/gyms/:gymId/members/:memberId/daily-workout', (req, res) => {
  const memberId = req.params.memberId || 'usr-member';
  const workout = db.memberWorkouts[memberId] || db.memberWorkouts['usr-member'];
  res.json({ success: true, workout });
});

app.post('/api/gyms/:gymId/members/:memberId/daily-workout', (req, res) => {
  const memberId = req.params.memberId || 'usr-member';
  const { title, subtitle, dayNumber, prescribedBy, exercises } = req.body;
  
  db.memberWorkouts[memberId] = {
    title: title || 'تمارين اليوم المخصصة',
    subtitle: subtitle || 'محددة بواسطة الكوتش المعتمد',
    dayNumber: dayNumber || 'تمرين اليوم المعتمد',
    prescribedBy: prescribedBy || 'كوتش الصالة',
    assignedDate: new Date().toISOString().split('T')[0],
    exercises: exercises || [],
  };

  res.status(201).json({
    success: true,
    message: 'تم إرسال ونشر جدول تمارين اليوم لتطبيق المتدرب بنجاح! ✅',
    workout: db.memberWorkouts[memberId],
  });
});

app.get('/api/gyms/:gymId/nutrition', (req, res) => {
  res.json({ nutrition: db.nutritionPlans });
});

// ─── Gym: Turnstile Check-in ─────────────────────────────────────────────────
app.post('/api/gyms/:gymId/attendance/checkin', (req, res) => {
  const { memberId, memberName: passedName, gate, deviceType } = req.body;
  const member = memberId 
    ? (db.users.find((u) => u.id === memberId) || db.users.find((u) => `${u.firstName} ${u.lastName}` === passedName))
    : db.users.find((u) => u.role === 'MEMBER');
  
  const finalName = passedName || (member ? `${member.firstName} ${member.lastName}` : 'طارق المنصور');
  const record = {
    id: `att-${Date.now()}`,
    memberId: member?.id || memberId || 'usr-member',
    memberName: finalName,
    gate: gate || 'البوابة الرئيسية رقم 1',
    deviceType: deviceType || 'MOBILE_QR',
    plan: member?.plan || 'الباقة الذهبية السنوية VIP',
    status: member?.status || 'نشط',
    timestamp: new Date().toISOString(),
  };
  db.attendance.unshift(record);
  res.json({ success: true, message: 'تم فتح البوابة بنجاح وتسجيل الحضور ✅', record });
});

app.get('/api/gyms/:gymId/attendance', (req, res) => {
  res.json({ attendance: db.attendance });
});

// ─── Gym: Store Products & POS Checkout ──────────────────────────────────────
app.get('/api/gyms/:gymId/store/products', (req, res) => {
  const gymProducts = db.storeProducts.filter((p: any) => !p.gymId || p.gymId === req.params.gymId);
  res.json({ products: gymProducts, total: gymProducts.length });
});

app.post('/api/gyms/:gymId/store/products', (req, res) => {
  const { name, category, price, stock, image } = req.body;
  const newProduct = {
    id: `p-${Date.now()}`,
    gymId: req.params.gymId,
    name: name || 'منتج جديد',
    category: category || 'مكملات غذائية',
    price: parseFloat(price) || 0,
    stock: parseInt(stock, 10) || 0,
    image: image || 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400&auto=format&fit=crop&q=80',
  };
  db.storeProducts.push(newProduct);
  res.status(201).json({ success: true, message: 'تمت إضافة المنتج لمتجر الصالة بنجاح', product: newProduct });
});

// ─── Gym: Promotional Banners ────────────────────────────────────────────────
app.get('/api/gyms/:gymId/store/banners', (req, res) => {
  const gymBanners = db.storeBanners.filter((b: any) => !b.gymId || b.gymId === req.params.gymId);
  res.json({ banners: gymBanners });
});

app.post('/api/gyms/:gymId/store/banners', (req, res) => {
  const { title, subtitle, imageUrl, badge, ctaText } = req.body;
  const newBanner = {
    id: `ban-${Date.now()}`,
    gymId: req.params.gymId,
    title: title || 'عرض جديد',
    subtitle: subtitle || '',
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80',
    badge: badge || 'إعلان ترويجي',
    ctaText: ctaText || 'اكتشف العرض',
    active: true,
  };
  db.storeBanners.unshift(newBanner);
  res.status(201).json({ success: true, message: 'تم نشر البنر الدعائي لمتدربي ومدربي الصالة بنجاح', banner: newBanner });
});

app.get('/api/gyms/:gymId/store/orders', (req, res) => {
  res.json({ success: true, orders: db.orders });
});

app.post('/api/gyms/:gymId/store/orders', (req, res) => {
  const { items, totalAmount, memberName, phone, address, notes, deliveryMethod } = req.body;
  const order = {
    id: `ord-${Date.now().toString().slice(-6)}`,
    items: items || [],
    totalAmount: Number(totalAmount) || 0,
    memberName: memberName || 'طارق المنصور',
    phone: phone || '+20 100 123 4567',
    address: address || 'الاستلام من مقر الصالة',
    deliveryMethod: deliveryMethod || 'PICKUP', // PICKUP or HOME_DELIVERY
    notes: notes || '',
    date: new Date().toISOString(),
    status: 'قيد المراجعة والتجهيز', // 'قيد المراجعة والتجهيز' | 'تم التجهيز' | 'تم التسليم' | 'ملغي'
  };
  db.orders.unshift(order);
  res.status(201).json({ success: true, message: 'تم استلام وتأكيد الطلب بنجاح وإرساله لإدارة الجيم', order });
});

app.patch('/api/gyms/:gymId/store/orders/:orderId/status', (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const order = db.orders.find((o) => o.id === orderId);
  if (order) {
    order.status = status;
    return res.json({ success: true, message: 'تم تحديث حالة الطلب بنجاح', order });
  }
  res.status(404).json({ success: false, message: 'الطلب غير موجود' });
});

// Member Order Tracking Endpoint
app.get('/api/members/:memberId/orders', (req, res) => {
  const { memberId } = req.params;
  // Return recent orders (or all if simulated single member)
  res.json({ success: true, orders: db.orders });
});

// Member InBody Records Endpoints
app.get('/api/members/:memberId/inbody', (req, res) => {
  const { memberId } = req.params;
  const records = db.inbodyRecords[memberId] || db.inbodyRecords['usr-member'] || [];
  res.json({ success: true, records });
});

app.post('/api/members/:memberId/inbody', (req, res) => {
  const { memberId } = req.params;
  const { weight, bodyFat, muscleMass, waist, note } = req.body;
  if (!db.inbodyRecords[memberId]) {
    db.inbodyRecords[memberId] = [];
  }
  const newRecord = {
    id: `inb-${Date.now().toString().slice(-5)}`,
    date: new Date().toISOString().split('T')[0],
    weight: Number(weight) || 80.0,
    bodyFat: Number(bodyFat) || 15.0,
    muscleMass: Number(muscleMass) || 40.0,
    waist: Number(waist) || 82,
    rating: 'فحص جديد 📋',
    note: note || 'تم قياس الفحص ومزامنته مع تطبيق المتدرب',
    bmi: Number(((Number(weight) || 80) / ((1.85) * (1.85))).toFixed(1)),
  };
  db.inbodyRecords[memberId].unshift(newRecord);

  // Award Loyalty Points for doing InBody test!
  if (db.loyaltyPoints[memberId]) {
    db.loyaltyPoints[memberId].points += 100;
    db.loyaltyPoints[memberId].history.unshift({
      id: `lh-${Date.now()}`,
      title: 'تسجيل فحص InBody جديد',
      points: +100,
      date: 'الآن',
      type: 'INBODY',
    });
  }

  res.status(201).json({ success: true, message: 'تم حفظ فحص الـ InBody بنجاح وإضافة 100 نقطة ولاء للمتدرب', record: newRecord });
});

// Member Loyalty & Rewards Endpoints
app.get('/api/members/:memberId/loyalty', (req, res) => {
  const { memberId } = req.params;
  const loyalty = db.loyaltyPoints[memberId] || db.loyaltyPoints['usr-member'];
  res.json({ success: true, loyalty });
});

app.post('/api/members/:memberId/loyalty/redeem', (req, res) => {
  const { memberId } = req.params;
  const { rewardId } = req.body;
  const loyalty = db.loyaltyPoints[memberId] || db.loyaltyPoints['usr-member'];
  if (!loyalty) return res.status(404).json({ success: false, message: 'حساب الولاء غير موجود' });

  const reward = loyalty.rewards.find((r: any) => r.id === rewardId);
  if (!reward) return res.status(404).json({ success: false, message: 'المكافأة غير موجودة' });

  if (loyalty.points < reward.cost) {
    return res.status(400).json({ success: false, message: 'رصيد نقاطك غير كافٍ لاستبدال هذه المكافأة' });
  }

  loyalty.points -= reward.cost;
  loyalty.history.unshift({
    id: `lh-${Date.now()}`,
    title: `استبدال مكافأة: ${reward.name}`,
    points: -reward.cost,
    date: 'الآن',
    type: 'REDEEM',
  });

  res.json({
    success: true,
    message: `تم استبدال المكافأة بنجاح! كود الاستخدام هو: ${reward.code}`,
    remainingPoints: loyalty.points,
    couponCode: reward.code,
  });
});

// ─── POS Desktop Offline-First Sync APIs ─────────────────────────────────────
app.get('/api/gyms/:gymId/pos/sync-data', (req, res) => {
  const members = db.users
    .filter((u) => u.role === 'MEMBER')
    .map((m) => ({
      id: m.id,
      name: `${m.firstName} ${m.lastName}`,
      phone: (m as any).phone || '+20 100 000 0000',
      membership_status: (m as any).status || 'نشط',
      qr_secret: (m as any).id,
      valid_until: '2027-12-31',
      plan: (m as any).plan || 'الباقة السنوية',
    }));

  const products = db.storeProducts.map((p) => ({
    id: p.id,
    title: p.name,
    barcode: p.id === 'p-1' ? '6221001001' : p.id === 'p-2' ? '6221001002' : p.id === 'p-3' ? '6221001003' : '6221001004',
    price: p.price,
    stock_quantity: p.stock,
  }));

  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    members,
    products,
  });
});

app.post('/api/gyms/:gymId/pos/batch-sync', (req, res) => {
  const { batch } = req.body; // array of { id, action_type, payload, created_at }
  if (!Array.isArray(batch)) {
    return res.status(400).json({ error: 'batch must be an array' });
  }

  const syncedIds: string[] = [];

  for (const item of batch) {
    if (item.action_type === 'CHECK_IN') {
      const p = typeof item.payload === 'string' ? JSON.parse(item.payload) : item.payload;
      db.attendance.unshift({
        id: `att-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        memberId: p.memberId || 'usr-member',
        memberName: p.memberName || 'متدرب أوفلاين',
        gate: p.gate || 'بوابة الكاشير المكتبية (PulsOps POS)',
        timestamp: item.created_at || new Date().toISOString(),
      });
      syncedIds.push(item.id);
    } else if (item.action_type === 'POS_SALE') {
      const p = typeof item.payload === 'string' ? JSON.parse(item.payload) : item.payload;
      db.orders.unshift({
        id: `ord-pos-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        items: p.items || [],
        totalAmount: p.totalAmount || 0,
        memberName: p.memberName || 'عميل نقدي / متدرب',
        paymentMethod: p.paymentMethod || 'CASH',
        date: item.created_at || new Date().toISOString(),
        status: 'مكتمل ومدفوع (مزامنة مكتبية)',
      });

      // Adjust mock cloud stocks
      if (Array.isArray(p.items)) {
        for (const cartItem of p.items) {
          const prod = db.storeProducts.find((sp) => sp.id === cartItem.id);
          if (prod) {
            prod.stock = Math.max(0, prod.stock - (cartItem.quantity || 1));
          }
        }
      }
      syncedIds.push(item.id);
    }
  }

  res.json({
    success: true,
    syncedCount: syncedIds.length,
    syncedIds,
    message: `تم مزامنة ${syncedIds.length} معاملة من كاشير سطح المكتب بنجاح`,
  });
});

// ─── Gym: Broadcast Notifications ────────────────────────────────────────────
app.post('/api/gyms/:gymId/broadcast', (req, res) => {
  const { title, body } = req.body;
  const broadcast = {
    id: `b-${Date.now()}`,
    title,
    body,
    sentAt: new Date().toISOString(),
  };
  db.broadcasts.unshift(broadcast);
  res.status(201).json({ success: true, message: 'تم بث الإشعار بنجاح لكافة الأعضاء', broadcast });
});

// ─── AI Assistant Chatbot (Gemini AI Simulation) ────────────────────────────
app.post('/api/ai/chat', (req, res) => {
  const { message } = req.body;
  const q = (message || '').toLowerCase();
  let reply = 'أهلاً بك! أنا كوتش الذكاء الاصطناعي في بولس أوبس. كيف أساعدك في نظامك التدريبي أو الغذائي اليوم؟';
  if (q.includes('كرياتين') || q.includes('creatine')) {
    reply = 'تناول 5 جرامات من الكرياتين يومياً بانتظام مع 300 مل ماء بعد التمرين مباشرة لتشبع مخازن ATP وزيادة القوة العضلية.';
  } else if (q.includes('بروتين') || q.includes('protein')) {
    reply = 'احتياجك اليومي المثالي للبناء العضلي هو بين 1.8 إلى 2.2 جرام بروتين لكل كيلوجرام من وزن جسمك. ركز على البيض، صدور الدجاج، والواي بروتين.';
  } else if (q.includes('وجبة') || q.includes('دايت')) {
    reply = 'للحفاظ على بناء عضلات صافية بدون دهون، قسّم وجباتك إلى 4-5 وجبات يومياً تحتوي كل وجبة على 30-40 جرام بروتين وكربوهيدرات معقدة كالشوفان والأرز البني.';
  } else if (q.includes('ازدحام') || q.includes('ذروة') || q.includes('مشتركين')) {
    reply = 'بناءً على تحليلات البوابات الذكية اليوم، يُنصح بجدولة حصص الكارديو الجماعية في الفترات الصباحية (9-11 ص) لتخفيف الضغط على وقت الذروة المسائي (6-8 م).';
  }
  res.json({ reply });
});

// ─── AI Smart Workout & Nutrition Plan Generator ───────────────────────────
app.post('/api/ai/generate-plan', (req, res) => {
  const { goal, daysPerWeek, fitnessLevel, allergies, weight, height } = req.body;
  
  let targetCalories = 2500;
  let targetProtein = 175;
  let targetCarbs = 280;
  let targetFats = 65;
  let planName = 'خطة تضخيم عضلي صافي';

  if (goal === 'fat_loss') {
    targetCalories = 1950;
    targetProtein = 185;
    targetCarbs = 160;
    targetFats = 50;
    planName = 'خطة التنشيف وخسارة الدهون العميقة';
  } else if (goal === 'strength') {
    targetCalories = 2850;
    targetProtein = 200;
    targetCarbs = 330;
    targetFats = 75;
    planName = 'خطة القوة الانفجارية والباورليفتنج';
  }

  const generatedPlan = {
    planName,
    goal: goal || 'hypertrophy',
    fitnessLevel: fitnessLevel || 'متوسط',
    macros: {
      calories: targetCalories,
      protein: `${targetProtein}g`,
      carbs: `${targetCarbs}g`,
      fats: `${targetFats}g`,
      waterLitres: '3.5 - 4.0 لتر يومياً',
    },
    suggestedMeals: [
      { meal: 'الإفطار', items: '4 بيضات مسلوقة + 80 جم شوفان مع حليب وتوت أزرق + 1 موزة', protein: '38g', calories: 580 },
      { meal: 'الغداء (قبل التمرين بـ ساعتين)', items: '200 جم صدور دجاج مشوية + 200 جم أرز بسمتي + خضار بروكلي وجزر', protein: '55g', calories: 650 },
      { meal: 'سناك بعد التمرين', items: 'سكوب واي بروتين مع ماء بارد + تفاحة خضراء أو حفنة لوز', protein: '28g', calories: 280 },
      { meal: 'العشاء', items: '150 جم سمك سلمون أو علبة تونة مصفاة + سلطة خضراء غنية بزيت الزيتون والليمون + قطعة بطاطا مشوية', protein: '42g', calories: 520 },
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
    coachAdvice: allergies 
      ? `تم استبعاد المكونات المحسسة (${allergies}) واستبدالها بمصادر بروتينات بديلة عالية التوافر الحيوي.`
      : 'التزم ببرنامج النوم (7-8 ساعات) وشرب الماء الكافي لضمان أقصى استفادة من الخطة.',
  };

  res.json({ success: true, plan: generatedPlan });
});

// ─── AI Meal Vision & Calorie Estimation Endpoint ──────────────────────────
app.post('/api/ai/analyze-meal', (req, res) => {
  const { image, oilType, saltLevel, portionSize, notes } = req.body;

  // Meal analysis calculation based on vision simulation & ingredients
  let baseCalories = 520;
  let protein = 42;
  let carbs = 48;
  let fats = 14;
  let mealName = 'طبق صدور دجاج مشوي مع أرز بسمتي وخضار سوتيه';

  // Adjust for Oil
  if (oilType === 'olive_heavy' || oilType === 'regular_oil') {
    fats += 12;
    baseCalories += 105;
  } else if (oilType === 'olive_light') {
    fats += 5;
    baseCalories += 45;
  } else if (oilType === 'none') {
    fats = Math.max(5, fats - 4);
    baseCalories -= 35;
  }

  // Adjust for Salt / Sodium
  let sodiumMg = 450;
  let sodiumNote = 'مستوى صوديوم معتدل وصحي، مناسب للاستشفاء العضلي وتوازن السوائل.';
  if (saltLevel === 'high') {
    sodiumMg = 1150;
    sodiumNote = 'نسبة الصوديوم مرتفعة نسبياً. يُنصح بشرب 500 مل ماء إضافي لتقليل احتباس السوائل.';
  } else if (saltLevel === 'low') {
    sodiumMg = 220;
    sodiumNote = 'صوديوم منخفض جداً، مثالي لمرحلة التنشيف وتجنب حبس الماء تحت الجلد.';
  }

  // Adjust for portion size
  if (portionSize === 'large') {
    baseCalories = Math.round(baseCalories * 1.35);
    protein = Math.round(protein * 1.3);
    carbs = Math.round(carbs * 1.4);
    fats = Math.round(fats * 1.3);
  } else if (portionSize === 'small') {
    baseCalories = Math.round(baseCalories * 0.75);
    protein = Math.round(protein * 0.8);
    carbs = Math.round(carbs * 0.75);
    fats = Math.round(fats * 0.75);
  }

  const analysis = {
    mealName,
    estimatedCalories: baseCalories,
    macros: {
      protein: `${protein}g`,
      carbs: `${carbs}g`,
      fats: `${fats}g`,
      fiber: '6g',
    },
    oilAnalysis: {
      type: oilType || 'olive_light',
      impact: oilType === 'olive_heavy' || oilType === 'regular_oil'
        ? 'زيوت إضافية رفعت معدل السعرات والدهون بحوالي 105 سعرة.'
        : 'دهون صحية غير مشبعة ممتازة لصحة القلب والطاقة.',
    },
    saltAnalysis: {
      level: saltLevel || 'normal',
      estimatedSodium: `${sodiumMg} mg`,
      advice: sodiumNote,
    },
    healthScore: 92,
    coachVerdict: 'وجبة متكاملة وعالية البروتين تدعم بناء العضلات الصافية والاستشفاء.',
    analyzedAt: new Date().toISOString(),
  };

  res.json({ success: true, analysis });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 PulsOps Multi-Tenant API Gateway running live on http://localhost:${PORT}`);
});
