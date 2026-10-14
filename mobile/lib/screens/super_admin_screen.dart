import 'package:flutter/material.dart';
import '../../core/constants/colors.dart';

class SuperAdminScreen extends StatelessWidget {
  final VoidCallback onLogout;

  const SuperAdminScreen({super.key, required this.onLogout});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.pitchBlack,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          'مركز القيادة السحابي (Super Admin)',
          style: TextStyle(
            color: AppColors.textWhite,
            fontWeight: FontWeight.bold,
            fontSize: 17,
            fontFamily: 'Cairo',
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
              // Master Cloud Header
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      const Color(0xFF1E1B4B),
                      AppColors.surfaceDark,
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: Colors.indigoAccent.withOpacity(0.5), width: 1.5),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.indigo.withOpacity(0.2),
                      blurRadius: 25,
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      width: 56,
                      height: 56,
                      decoration: BoxDecoration(
                        color: Colors.indigoAccent.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.indigoAccent),
                      ),
                      child: const Icon(Icons.admin_panel_settings_rounded, color: Colors.indigoAccent, size: 30),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'المشرف العام للمنظومة',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 17,
                              fontFamily: 'Cairo',
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'superadmin@pulsops.com (التحكم السحابي الكامل)',
                            style: TextStyle(
                              color: Colors.white.withOpacity(0.7),
                              fontSize: 12,
                              fontFamily: 'Cairo',
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
                    child: _buildKpiCard('الأندية المفعلة', '48 صالة', 'بما فيها PulsOps Club', Icons.domain_rounded, Colors.indigoAccent),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildKpiCard('إجمالي المشتركين', '34,850', 'عبر كافة الفروع', Icons.people_alt_rounded, AppColors.neonGreen),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: _buildKpiCard('الإيراد الشهري (MRR)', '1.42M EGP', 'تراخيص اشتراكات SaaS', Icons.monetization_on_rounded, Colors.amberAccent),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildKpiCard('استقرار السيرفرات', '99.99%', 'البنية التحتية السحابية', Icons.cloud_done_rounded, Colors.cyanAccent),
                  ),
                ],
              ),

              const SizedBox(height: 24),

              const Text(
                'الصالات الرياضية المستضافة (Tenants)',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                  fontFamily: 'Cairo',
                ),
              ),
              const SizedBox(height: 12),

              _buildGymTenantCard('نادي PulsOps الرياضي (الفرع الرئيسي)', 'المدير: pulsops • المشتركين: 1,420 • ترخيص سنوي نشط', 'نشط', AppColors.neonGreen),
              const SizedBox(height: 10),
              _buildGymTenantCard('Titan Gym Elite (الشيخ زايد)', 'المدير: capt_tarek • المشتركين: 980 • ترخيص Enterprise', 'نشط', AppColors.neonGreen),
              const SizedBox(height: 10),
              _buildGymTenantCard('PowerZone Athletics (المعادي)', 'المدير: ahmed_pz • المشتركين: 640 • ترخيص Pro', 'نشط', AppColors.neonGreen),

              const SizedBox(height: 24),

              const Text(
                'إجراءات النظام السحابية المتقدمة',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                  fontFamily: 'Cairo',
                ),
              ),
              const SizedBox(height: 12),

              _buildActionTile(Icons.add_business_rounded, 'إصدار ترخيص صالة رياضية جديدة', 'تهيئة قاعدة بيانات معزولة ومفاتيح API فورية'),
              const SizedBox(height: 10),
              _buildActionTile(Icons.dns_rounded, 'مراقبة سعة خوادم بوابات Turnstile QR', 'معدل المعالجة: 0.4 ثانية لكل استجابة أمنية'),
              const SizedBox(height: 10),
              _buildActionTile(Icons.security_rounded, 'سجل التشفير والتحقق متعدد المستويات', 'تأمين اتصالات POS والموبايل بتشفير 256-bit'),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildKpiCard(String title, String value, String sub, IconData icon, Color color) {
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
              Text(title, style: const TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold, fontFamily: 'Cairo')),
              Icon(icon, color: color, size: 18),
            ],
          ),
          const SizedBox(height: 10),
          Text(value, style: TextStyle(color: color, fontSize: 18, fontWeight: FontWeight.bold, fontFamily: 'Cairo')),
          const SizedBox(height: 4),
          Text(sub, style: const TextStyle(color: Colors.white38, fontSize: 10, fontFamily: 'Cairo')),
        ],
      ),
    );
  }

  Widget _buildGymTenantCard(String name, String details, String badge, Color badgeColor) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surfaceDark,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.06),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.fitness_center_rounded, color: Colors.white, size: 20),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13, fontFamily: 'Cairo')),
                const SizedBox(height: 2),
                Text(details, style: const TextStyle(color: Colors.white54, fontSize: 11, fontFamily: 'Cairo')),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: badgeColor.withOpacity(0.15),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(badge, style: TextStyle(color: badgeColor, fontSize: 11, fontWeight: FontWeight.bold, fontFamily: 'Cairo')),
          ),
        ],
      ),
    );
  }

  Widget _buildActionTile(IconData icon, String title, String subtitle) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surfaceDark,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Row(
        children: [
          Icon(icon, color: Colors.indigoAccent, size: 22),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12, fontFamily: 'Cairo')),
                Text(subtitle, style: const TextStyle(color: Colors.white54, fontSize: 11, fontFamily: 'Cairo')),
              ],
            ),
          ),
          const Icon(Icons.arrow_forward_ios_rounded, color: Colors.white24, size: 12),
        ],
      ),
    );
  }
}
