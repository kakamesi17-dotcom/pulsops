import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../core/constants/colors.dart';
import 'pass_screen.dart';
import 'workouts_screen.dart';
import 'inbody_screen.dart';
import 'nutrition_screen.dart';
import 'store_screen.dart';
import 'ai_coach_screen.dart';
import 'gym_admin_screen.dart';
import 'trainer_screen.dart';

/// Top Tab — maps to a role portal/category like the web does
enum TopTab { member, trainer, gymAdmin }

class MainNavigationScreen extends StatefulWidget {
  final VoidCallback? onLogout;

  const MainNavigationScreen({super.key, this.onLogout});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen>
    with TickerProviderStateMixin {
  int _bottomIndex = 0;
  TopTab _topTab = TopTab.member;

  late TabController _topTabController;

  @override
  void initState() {
    super.initState();
    _topTabController = TabController(length: 3, vsync: this);
    _topTabController.addListener(() {
      if (!_topTabController.indexIsChanging) {
        setState(() {
          _topTab = TopTab.values[_topTabController.index];
          _bottomIndex = 0; // Reset bottom nav on tab switch
        });
        HapticFeedback.selectionClick();
      }
    });
  }

  @override
  void dispose() {
    _topTabController.dispose();
    super.dispose();
  }

  // ─── Member Bottom Nav Items & Screens ─────────────────────────────
  List<_NavItem> get _memberNavItems => const [
        _NavItem(Icons.qr_code_2_outlined, Icons.qr_code_2_rounded, 'الدخول'),
        _NavItem(Icons.fitness_center_outlined, Icons.fitness_center_rounded, 'التمارين'),
        _NavItem(Icons.monitor_weight_outlined, Icons.monitor_weight_rounded, 'InBody'),
        _NavItem(Icons.restaurant_menu_outlined, Icons.restaurant_menu_rounded, 'التغذية'),
        _NavItem(Icons.storefront_outlined, Icons.storefront_rounded, 'المتجر'),
        _NavItem(Icons.auto_awesome_outlined, Icons.auto_awesome_rounded, 'الذكاء'),
      ];

  List<Widget> _memberScreens(BuildContext context) => [
        PassScreen(onLogout: widget.onLogout),
        const WorkoutsScreen(),
        const InBodyScreen(),
        const NutritionScreen(),
        const StoreScreen(),
        const AiCoachScreen(),
      ];

  // ─── Trainer Bottom Nav Items & Screens ────────────────────────────
  List<_NavItem> get _trainerNavItems => const [
        _NavItem(Icons.dashboard_outlined, Icons.dashboard_rounded, 'لوحتي'),
        _NavItem(Icons.groups_outlined, Icons.groups_rounded, 'متدربيني'),
        _NavItem(Icons.fitness_center_outlined, Icons.fitness_center_rounded, 'التمارين'),
        _NavItem(Icons.monitor_weight_outlined, Icons.monitor_weight_rounded, 'InBody'),
        _NavItem(Icons.auto_awesome_outlined, Icons.auto_awesome_rounded, 'AI Coach'),
      ];

  List<Widget> _trainerScreens(BuildContext context) => [
        TrainerScreen(onLogout: widget.onLogout ?? () {}),
        const _TrainerMembersScreen(),
        const WorkoutsScreen(),
        const InBodyScreen(),
        const AiCoachScreen(),
      ];

  // ─── Gym Admin Bottom Nav Items & Screens ─────────────────────────
  List<_NavItem> get _adminNavItems => const [
        _NavItem(Icons.bar_chart_outlined, Icons.bar_chart_rounded, 'الإحصائيات'),
        _NavItem(Icons.people_outline_rounded, Icons.people_rounded, 'المشتركين'),
        _NavItem(Icons.sensor_door_outlined, Icons.sensor_door_rounded, 'البوابات'),
        _NavItem(Icons.storefront_outlined, Icons.storefront_rounded, 'المتجر'),
        _NavItem(Icons.settings_outlined, Icons.settings_rounded, 'الإعدادات'),
      ];

  List<Widget> _adminScreens(BuildContext context) => [
        GymAdminScreen(onLogout: widget.onLogout ?? () {}),
        const _AdminMembersScreen(),
        const _AdminGatesScreen(),
        const StoreScreen(),
        const _AdminSettingsScreen(),
      ];

  // ─── Current nav items / screens based on top tab ─────────────────
  List<_NavItem> get _currentNavItems {
    switch (_topTab) {
      case TopTab.member:
        return _memberNavItems;
      case TopTab.trainer:
        return _trainerNavItems;
      case TopTab.gymAdmin:
        return _adminNavItems;
    }
  }

  List<Widget> _currentScreens(BuildContext ctx) {
    switch (_topTab) {
      case TopTab.member:
        return _memberScreens(ctx);
      case TopTab.trainer:
        return _trainerScreens(ctx);
      case TopTab.gymAdmin:
        return _adminScreens(ctx);
    }
  }

  // ─── Build ─────────────────────────────────────────────────────────
  @override
  Widget build(BuildContext context) {
    final screens = _currentScreens(context);
    final safeIndex = _bottomIndex.clamp(0, screens.length - 1);

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: AppColors.pitchBlack,
        // ─── Branded Top Header ───
        appBar: _buildTopBar(),
        body: IndexedStack(
          index: safeIndex,
          children: screens,
        ),
        // ─── Enhanced Bottom Navigation ───
        bottomNavigationBar: _buildBottomNav(safeIndex),
      ),
    );
  }

  // ─── Top Bar with 3-tab category switcher ─────────────────────────
  PreferredSizeWidget _buildTopBar() {
    return PreferredSize(
      preferredSize: const Size.fromHeight(100),
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.surfaceDark,
          border: Border(
            bottom: BorderSide(color: AppColors.cardBorder, width: 1),
          ),
        ),
        child: SafeArea(
          bottom: false,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // ─── Brand Row ───
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 10, 16, 6),
                child: Row(
                  children: [
                    // Logo
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [AppColors.neonGreen, Color(0xFF00CC52)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(10),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.neonGreen.withOpacity(0.4),
                            blurRadius: 12,
                          ),
                        ],
                      ),
                      child: const Center(
                        child: Text(
                          'P',
                          style: TextStyle(
                            color: Colors.black,
                            fontWeight: FontWeight.w900,
                            fontSize: 20,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'PULSOPS',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w900,
                              fontSize: 15,
                              letterSpacing: 1.5,
                              fontFamily: 'Cairo',
                            ),
                          ),
                          Text(
                            _topTab == TopTab.member
                                ? 'بوابة المشترك — mr mostafa'
                                : _topTab == TopTab.trainer
                                    ? 'لوحة الكوتش — mostafa'
                                    : 'إدارة الصالة — pulsops',
                            style: const TextStyle(
                              color: AppColors.textMuted,
                              fontSize: 11,
                              fontFamily: 'Cairo',
                            ),
                          ),
                        ],
                      ),
                    ),
                    // Status dot
                    Row(
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: AppColors.neonGreen,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 6),
                        const Text(
                          'Online',
                          style: TextStyle(
                            color: AppColors.neonGreen,
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            fontFamily: 'Cairo',
                          ),
                        ),
                        const SizedBox(width: 8),
                        if (widget.onLogout != null)
                          GestureDetector(
                            onTap: widget.onLogout,
                            child: Container(
                              padding: const EdgeInsets.all(6),
                              decoration: BoxDecoration(
                                color: Colors.red.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: Colors.red.withOpacity(0.3)),
                              ),
                              child: const Icon(
                                Icons.logout_rounded,
                                color: Colors.redAccent,
                                size: 16,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
              // ─── 3-Tab Category Switcher ───
              Padding(
                padding: const EdgeInsets.fromLTRB(14, 0, 14, 8),
                child: Container(
                  height: 36,
                  decoration: BoxDecoration(
                    color: AppColors.pitchBlack,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.cardBorder),
                  ),
                  child: Row(
                    children: [
                      _buildTopTabBtn(0, Icons.person_rounded, 'المشترك', TopTab.member, AppColors.neonGreen),
                      _buildTopTabDivider(),
                      _buildTopTabBtn(1, Icons.sports_gymnastics_rounded, 'الكوتش', TopTab.trainer, Colors.cyanAccent),
                      _buildTopTabDivider(),
                      _buildTopTabBtn(2, Icons.business_rounded, 'الإدارة', TopTab.gymAdmin, Colors.amberAccent),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTopTabDivider() => Container(
        width: 1,
        height: 20,
        color: AppColors.cardBorder,
      );

  Widget _buildTopTabBtn(int idx, IconData icon, String label, TopTab tab, Color color) {
    final isActive = _topTab == tab;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          HapticFeedback.selectionClick();
          setState(() {
            _topTab = tab;
            _bottomIndex = 0;
            _topTabController.index = idx;
          });
        },
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          decoration: BoxDecoration(
            color: isActive ? color.withOpacity(0.15) : Colors.transparent,
            borderRadius: BorderRadius.circular(11),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 14,
                color: isActive ? color : AppColors.textSubtle,
              ),
              const SizedBox(width: 4),
              Text(
                label,
                style: TextStyle(
                  color: isActive ? color : AppColors.textSubtle,
                  fontSize: 11,
                  fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                  fontFamily: 'Cairo',
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ─── Enhanced Bottom Navigation Bar ───────────────────────────────
  Widget _buildBottomNav(int currentIndex) {
    final items = _currentNavItems;

    return Container(
      decoration: BoxDecoration(
        color: AppColors.surfaceDark,
        border: const Border(
          top: BorderSide(color: AppColors.cardBorder, width: 1),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.5),
            blurRadius: 20,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 6),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: List.generate(items.length, (i) {
              final item = items[i];
              final isActive = i == currentIndex;
              return _buildNavItem(item, isActive, () {
                HapticFeedback.selectionClick();
                setState(() => _bottomIndex = i);
              });
            }),
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(_NavItem item, bool isActive, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isActive ? AppColors.neonGreen.withOpacity(0.1) : Colors.transparent,
          borderRadius: BorderRadius.circular(14),
          border: isActive
              ? Border.all(color: AppColors.neonGreen.withOpacity(0.3), width: 1)
              : null,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 200),
              child: Icon(
                isActive ? item.activeIcon : item.icon,
                key: ValueKey(isActive),
                color: isActive ? AppColors.neonGreen : AppColors.textSubtle,
                size: 22,
              ),
            ),
            const SizedBox(height: 3),
            Text(
              item.label,
              style: TextStyle(
                color: isActive ? AppColors.neonGreen : AppColors.textSubtle,
                fontSize: 9.5,
                fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                fontFamily: 'Cairo',
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Lightweight NavItem model ──────────────────────────────────────
class _NavItem {
  final IconData icon;
  final IconData activeIcon;
  final String label;

  const _NavItem(this.icon, this.activeIcon, this.label);
}

// ─── Admin Members Screen ────────────────────────────────────────────
class _AdminMembersScreen extends StatelessWidget {
  const _AdminMembersScreen();

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: AppColors.pitchBlack,
        body: SafeArea(
          child: CustomScrollView(
            slivers: [
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Text('إدارة المشتركين', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold, fontFamily: 'Cairo')),
                          const Spacer(),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: AppColors.neonGreen.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: AppColors.neonGreen.withOpacity(0.4)),
                            ),
                            child: const Text('1,420 مشترك', style: TextStyle(color: AppColors.neonGreen, fontSize: 11, fontWeight: FontWeight.bold, fontFamily: 'Cairo')),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      // Search Bar
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceDark,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: AppColors.cardBorder),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.search_rounded, color: AppColors.textSubtle, size: 18),
                            SizedBox(width: 8),
                            Text('ابحث باسم المشترك أو الكود...', style: TextStyle(color: AppColors.textSubtle, fontSize: 12, fontFamily: 'Cairo')),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],
                  ),
                ),
              ),
              SliverList(
                delegate: SliverChildListDelegate([
                  _buildMemberTile('mr mostafa', '#8491-PULSOPS', 'VIP GOLD', '2027-11-30', AppColors.neonGreen, true),
                  _buildMemberTile('ahmed kamal', '#7211-PULSOPS', 'Premium', '2026-12-15', Colors.cyanAccent, true),
                  _buildMemberTile('sara hassan', '#6509-PULSOPS', 'Standard', '2026-10-01', Colors.amberAccent, false),
                  _buildMemberTile('mahmoud ali', '#5832-PULSOPS', 'VIP GOLD', '2027-03-20', AppColors.neonGreen, true),
                  _buildMemberTile('nour ibrahim', '#5100-PULSOPS', 'Standard', '2026-11-05', Colors.amberAccent, true),
                ]),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMemberTile(String name, String code, String tier, String expiry, Color tierColor, bool isActive) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppColors.surfaceDark,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.cardBorder),
        ),
        child: Row(
          children: [
            CircleAvatar(
              radius: 20,
              backgroundColor: tierColor.withOpacity(0.15),
              child: Text(name[0].toUpperCase(), style: TextStyle(color: tierColor, fontWeight: FontWeight.bold, fontSize: 16)),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13, fontFamily: 'Cairo')),
                  Text('$code  •  ينتهي $expiry', style: const TextStyle(color: AppColors.textMuted, fontSize: 10, fontFamily: 'Cairo')),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: tierColor.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(tier, style: TextStyle(color: tierColor, fontSize: 10, fontWeight: FontWeight.bold)),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Container(
                      width: 6,
                      height: 6,
                      decoration: BoxDecoration(
                        color: isActive ? AppColors.neonGreen : Colors.redAccent,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Text(isActive ? 'نشط' : 'منتهي', style: TextStyle(color: isActive ? AppColors.neonGreen : Colors.redAccent, fontSize: 10, fontFamily: 'Cairo')),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Admin Gates Screen ──────────────────────────────────────────────
class _AdminGatesScreen extends StatefulWidget {
  const _AdminGatesScreen();

  @override
  State<_AdminGatesScreen> createState() => _AdminGatesScreenState();
}

class _AdminGatesScreenState extends State<_AdminGatesScreen> {
  final List<Map<String, dynamic>> gates = [
    {'name': 'بوابة الاستقبال الرئيسية (Gate 01)', 'speed': '0.4s', 'entries': 142, 'online': true},
    {'name': 'بوابة الصالة VIP (Gate 02)', 'speed': '0.4s', 'entries': 88, 'online': true},
    {'name': 'بوابة كروس فت (Gate 03)', 'speed': '0.4s', 'entries': 56, 'online': true},
    {'name': 'بوابة المسبح (Gate 04)', 'speed': '—', 'entries': 0, 'online': false},
  ];

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: AppColors.pitchBlack,
        body: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Text('بوابات Turnstile QR', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold, fontFamily: 'Cairo')),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: AppColors.neonGreen.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppColors.neonGreen.withOpacity(0.4)),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.wifi_tethering_rounded, color: AppColors.neonGreen, size: 12),
                          SizedBox(width: 4),
                          Text('3 متصلة', style: TextStyle(color: AppColors.neonGreen, fontSize: 10, fontWeight: FontWeight.bold, fontFamily: 'Cairo')),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                const Text('مراقبة لحظية لبوابات الدخول الذكية', style: TextStyle(color: AppColors.textMuted, fontSize: 12, fontFamily: 'Cairo')),
                const SizedBox(height: 20),
                ...gates.map((gate) => _buildGateCard(gate)),
                const SizedBox(height: 20),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceDark,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.cardBorder),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('سجل الحركات اليوم', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14, fontFamily: 'Cairo')),
                      const SizedBox(height: 12),
                      _buildLogEntry('mr mostafa', 'دخول', '06:42 ص', Icons.login_rounded, AppColors.neonGreen),
                      _buildLogEntry('ahmed kamal', 'دخول', '06:38 ص', Icons.login_rounded, AppColors.neonGreen),
                      _buildLogEntry('sara hassan', 'خروج', '06:20 ص', Icons.logout_rounded, Colors.redAccent),
                      _buildLogEntry('mr mostafa', 'دخول', '05:55 ص', Icons.login_rounded, AppColors.neonGreen),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildGateCard(Map<String, dynamic> gate) {
    final bool isOnline = gate['online'] as bool;
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surfaceDark,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: isOnline ? AppColors.neonGreen.withOpacity(0.3) : AppColors.cardBorder),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: isOnline ? AppColors.neonGreen.withOpacity(0.1) : Colors.white.withOpacity(0.05),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(Icons.sensor_door_rounded, color: isOnline ? AppColors.neonGreen : AppColors.textSubtle, size: 22),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(gate['name'], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13, fontFamily: 'Cairo')),
                  Text('${gate['entries']} دخول اليوم  •  ${gate['speed']} استجابة', style: const TextStyle(color: AppColors.textMuted, fontSize: 11, fontFamily: 'Cairo')),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: isOnline ? AppColors.neonGreen.withOpacity(0.12) : Colors.red.withOpacity(0.12),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                isOnline ? '● Online' : '○ Offline',
                style: TextStyle(color: isOnline ? AppColors.neonGreen : Colors.redAccent, fontSize: 11, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLogEntry(String name, String action, String time, IconData icon, Color color) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
            child: Icon(icon, color: color, size: 14),
          ),
          const SizedBox(width: 10),
          Expanded(child: Text('$name — $action', style: const TextStyle(color: Colors.white70, fontSize: 12, fontFamily: 'Cairo'))),
          Text(time, style: const TextStyle(color: AppColors.textSubtle, fontSize: 11, fontFamily: 'Cairo')),
        ],
      ),
    );
  }
}

// ─── Admin Settings Screen ───────────────────────────────────────────
class _AdminSettingsScreen extends StatelessWidget {
  const _AdminSettingsScreen();

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: AppColors.pitchBlack,
        body: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('إعدادات الصالة', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold, fontFamily: 'Cairo')),
                const SizedBox(height: 20),
                _buildSection('الصالة الرياضية', [
                  _buildSettingRow(Icons.business_rounded, 'اسم الصالة', 'نادي PulsOps الرياضي'),
                  _buildSettingRow(Icons.location_on_rounded, 'العنوان', 'التجمع الخامس، القاهرة'),
                  _buildSettingRow(Icons.phone_rounded, 'رقم التواصل', '+20 100 000 0000'),
                ]),
                const SizedBox(height: 16),
                _buildSection('الاشتراك السحابي', [
                  _buildSettingRow(Icons.cloud_done_rounded, 'الخطة', 'Enterprise — سنوي'),
                  _buildSettingRow(Icons.security_rounded, 'التشفير', 'Multi-Tenant 256-bit'),
                  _buildSettingRow(Icons.dns_rounded, 'السيرفر', 'cloud-pulsops-01 (Egypt)'),
                ]),
                const SizedBox(height: 16),
                _buildSection('النظام', [
                  _buildSettingRow(Icons.notifications_rounded, 'الإشعارات', 'مفعلة'),
                  _buildSettingRow(Icons.backup_rounded, 'النسخ الاحتياطية', 'يومياً 03:00 ص'),
                  _buildSettingRow(Icons.update_rounded, 'إصدار النظام', 'v2.4.0 Cloud'),
                ]),
                const SizedBox(height: 24),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.red.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.red.withOpacity(0.2)),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.info_outline_rounded, color: Colors.redAccent, size: 18),
                      SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          'هذه إعدادات القراءة فقط في الوضع التجريبي. لتعديل الإعدادات الكاملة، يرجى الدخول عبر لوحة التحكم الرئيسية على الويب.',
                          style: TextStyle(color: Colors.white60, fontSize: 11, fontFamily: 'Cairo'),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSection(String title, List<Widget> children) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: const TextStyle(color: AppColors.neonGreen, fontSize: 13, fontWeight: FontWeight.bold, fontFamily: 'Cairo')),
        const SizedBox(height: 8),
        Container(
          decoration: BoxDecoration(
            color: AppColors.surfaceDark,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.cardBorder),
          ),
          child: Column(children: children),
        ),
      ],
    );
  }

  Widget _buildSettingRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          Icon(icon, color: AppColors.textMuted, size: 18),
          const SizedBox(width: 12),
          Text(label, style: const TextStyle(color: Colors.white70, fontSize: 13, fontFamily: 'Cairo')),
          const Spacer(),
          Text(value, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold, fontFamily: 'Cairo')),
        ],
      ),
    );
  }
}

// ─── Trainer Members Screen ──────────────────────────────────────────
class _TrainerMembersScreen extends StatelessWidget {
  const _TrainerMembersScreen();

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: AppColors.pitchBlack,
        body: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('متدربيني', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold, fontFamily: 'Cairo')),
                const SizedBox(height: 4),
                const Text('المتدربون المرتبطون بحسابك', style: TextStyle(color: AppColors.textMuted, fontSize: 12, fontFamily: 'Cairo')),
                const SizedBox(height: 20),
                _buildTraineeTile('mr mostafa', '#8491-PULSOPS', 'Push Day', 'VIP GOLD', AppColors.neonGreen, '78.5 كجم', '14.8%', true),
                const SizedBox(height: 10),
                _buildTraineeTile('ahmed kamal', '#7211-PULSOPS', 'Pull Day', 'Premium', Colors.cyanAccent, '82.0 كجم', '18.2%', true),
                const SizedBox(height: 10),
                _buildTraineeTile('sara hassan', '#6509-PULSOPS', 'Legs Day', 'Standard', Colors.amberAccent, '61.5 كجم', '22.4%', false),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTraineeTile(String name, String code, String plan, String tier, Color tierColor, String weight, String fat, bool isActive) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surfaceDark,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: isActive ? tierColor.withOpacity(0.3) : AppColors.cardBorder),
      ),
      child: Column(
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 22,
                backgroundColor: tierColor.withOpacity(0.15),
                child: Text(name[0].toUpperCase(), style: TextStyle(color: tierColor, fontWeight: FontWeight.bold, fontSize: 18)),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14, fontFamily: 'Cairo')),
                    Text('$code  •  $plan', style: const TextStyle(color: AppColors.textMuted, fontSize: 11, fontFamily: 'Cairo')),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: tierColor.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(tier, style: TextStyle(color: tierColor, fontSize: 10, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(child: _buildStat('الوزن', weight, AppColors.neonGreen)),
              const SizedBox(width: 8),
              Expanded(child: _buildStat('نسبة الدهون', fat, Colors.amberAccent)),
              const SizedBox(width: 8),
              Expanded(
                child: _buildStat(
                  'الحالة',
                  isActive ? 'نشط' : 'انتهى',
                  isActive ? AppColors.neonGreen : Colors.redAccent,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStat(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.07),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Column(
        children: [
          Text(value, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 13, fontFamily: 'Cairo'), textAlign: TextAlign.center),
          Text(label, style: const TextStyle(color: AppColors.textSubtle, fontSize: 9, fontFamily: 'Cairo'), textAlign: TextAlign.center),
        ],
      ),
    );
  }
}
