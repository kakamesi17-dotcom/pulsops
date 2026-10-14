import 'package:flutter/material.dart';
import '../../core/constants/colors.dart';

class GymAdminScreen extends StatelessWidget {
  final VoidCallback onLogout;

  const GymAdminScreen({super.key, required this.onLogout});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.pitchBlack,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          'لوحة مدير الصالة (pulsops)',
          style: TextStyle(
            color: AppColors.textWhite,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded, color: Colors.redAccent),
            tooltip: 'تسجيل الخروج',
            onPressed: onLogout,
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Admin Header Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.surfaceDark,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.neonGreen.withOpacity(0.3)),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.neonGreen.withOpacity(0.08),
                      blurRadius: 20,
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      width: 54,
                      height: 54,
                      decoration: BoxDecoration(
                        color: AppColors.neonGreen.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.neonGreen),
                      ),
                      child: const Icon(Icons.business_rounded, color: AppColors.neonGreen, size: 28),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'نادي PulsOps الرياضي',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 17,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'مدير الصالة: pulsops (حساب تجريبي)',
                            style: TextStyle(
                              color: Colors.white.withOpacity(0.7),
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // KPI Stats
              Row(
                children: [
                  Expanded(
                    child: _buildKpiCard(
                      title: 'المشتركين النشطين',
                      value: '1,420',
                      sub: 'منهم mr mostafa',
                      icon: Icons.people_alt_rounded,
                      color: AppColors.neonGreen,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildKpiCard(
                      title: 'حركات الدخول اليوم',
                      value: '318',
                      sub: 'بوابات Turnstile QR',
                      icon: Icons.qr_code_scanner_rounded,
                      color: Colors.cyanAccent,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: _buildKpiCard(
                      title: 'المدربين المعتمدين',
                      value: '14',
                      sub: 'بما فيهم mostafa',
                      icon: Icons.sports_gymnastics_rounded,
                      color: Colors.amberAccent,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildKpiCard(
                      title: 'إيراد الاشتراكات (EGP)',
                      value: '185,400',
                      sub: 'خلال هذا الشهر',
                      icon: Icons.payments_rounded,
                      color: Colors.purpleAccent,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 24),

              const Text(
                'البوابات الذكية المتصلة لحظياً',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 12),

              _buildGateItem('بوابة الاستقبال الرئيسية (Gate 01)', 'متصلة بالشبكة • 0.4s', true),
              const SizedBox(height: 10),
              _buildGateItem('بوابة الصالة VIP (Gate 02)', 'متصلة بالشبكة • نشطة', true),
              const SizedBox(height: 10),
              _buildGateItem('بوابة منطقة الكروس فت (Gate 03)', 'متصلة بالشبكة • جاهزة', true),

              const SizedBox(height: 24),

              const Text(
                'آخر الحركات والعمليات المسجلة',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 12),

              _buildActivityItem('mr mostafa', 'دخول ناجح عبر البوابة الرئيسية (QR)', 'منذ دقيقة', Icons.check_circle_rounded, AppColors.neonGreen),
              _buildActivityItem('mostafa (كوتش)', 'تحديث جدول تدريب المتدرب mr mostafa', 'منذ 15 دقيقة', Icons.fitness_center_rounded, Colors.cyanAccent),
              _buildActivityItem('pulsops (الإدارة)', 'تجديد اشتراك VIP سنوي بقيمة 7,500 EGP', 'منذ ساعة', Icons.receipt_long_rounded, Colors.amberAccent),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildKpiCard({
    required String title,
    required String value,
    required String sub,
    required IconData icon,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surfaceDark,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: const TextStyle(
                  color: Colors.white70,
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Icon(icon, color: color, size: 18),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            value,
            style: TextStyle(
              color: color,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            sub,
            style: const TextStyle(
              color: Colors.white38,
              fontSize: 10,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGateItem(String name, String status, bool isOnline) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: AppColors.surfaceDark,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Row(
        children: [
          Icon(Icons.sensor_door_rounded, color: isOnline ? AppColors.neonGreen : Colors.grey, size: 22),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                ),
                Text(
                  status,
                  style: const TextStyle(color: Colors.white54, fontSize: 11),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.neonGreen.withOpacity(0.15),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Text(
              'Online',
              style: TextStyle(color: AppColors.neonGreen, fontSize: 11, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActivityItem(String name, String action, String time, IconData icon, Color iconColor) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surfaceDark,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: iconColor.withOpacity(0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: iconColor, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                ),
                Text(
                  action,
                  style: const TextStyle(color: Colors.white70, fontSize: 11),
                ),
              ],
            ),
          ),
          Text(
            time,
            style: const TextStyle(color: Colors.white38, fontSize: 10),
          ),
        ],
      ),
    );
  }
}
