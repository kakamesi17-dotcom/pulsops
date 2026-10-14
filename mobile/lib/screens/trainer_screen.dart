import 'package:flutter/material.dart';
import '../../core/constants/colors.dart';

class TrainerScreen extends StatelessWidget {
  final VoidCallback onLogout;

  const TrainerScreen({super.key, required this.onLogout});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.pitchBlack,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          'لوحة المدرب والكوتش (mostafa)',
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
              // Coach Profile Card
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
                      child: const Icon(Icons.sports_gymnastics_rounded, color: AppColors.neonGreen, size: 28),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'الكوتش: mostafa',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 17,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'كبير مدربي اللياقة وكمال الأجسام • نادي PulsOps',
                            style: TextStyle(
                              color: Colors.white.withOpacity(0.7),
                              fontSize: 12,
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
                    child: _buildKpiCard('المتدربين المتابعين', '18', 'المتدرب النشط: mr mostafa', Icons.groups_rounded, AppColors.neonGreen),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildKpiCard('جلسات PT اليوم', '6', 'مكتمل منها 4 جلسات', Icons.timer_rounded, Colors.cyanAccent),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: _buildKpiCard('فحوصات InBody المطلوبة', '3', 'موعد قادم مع mr mostafa', Icons.monitor_weight_rounded, Colors.amberAccent),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildKpiCard('تقييم المتدربين', '4.9 ★', 'بناءً على 85 تقييم', Icons.star_rounded, Colors.purpleAccent),
                  ),
                ],
              ),

              const SizedBox(height: 24),

              const Text(
                'المتدرب المميز المرتبط بحسابك',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 12),

              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.surfaceDark,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppColors.neonGreen.withOpacity(0.4)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        CircleAvatar(
                          radius: 22,
                          backgroundColor: AppColors.neonGreen.withOpacity(0.2),
                          child: const Text('M', style: TextStyle(color: AppColors.neonGreen, fontWeight: FontWeight.bold, fontSize: 18)),
                        ),
                        const SizedBox(width: 14),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'mr mostafa (#8491-PULSOPS)',
                                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                              ),
                              Text(
                                'خطة التضخيم النظيف • يوم الدفع (Push Day)',
                                style: TextStyle(color: Colors.white54, fontSize: 12),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.neonGreen.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Text(
                            'VIP GOLD',
                            style: TextStyle(color: AppColors.neonGreen, fontSize: 10, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                    const Divider(color: Colors.white12, height: 24),
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('الوزن الحالي: 78.5 كجم', style: TextStyle(color: Colors.white70, fontSize: 12)),
                        Text('نسبة الدهون: 14.8%', style: TextStyle(color: Colors.white70, fontSize: 12)),
                        Text('الهدف: 82.0 كجم', style: TextStyle(color: AppColors.neonGreen, fontSize: 12, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              const Text(
                'المهام المجدولة اليوم',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 12),

              _buildTaskItem('متابعة تمرين الدفع لمصطفى (بنش برس 80 كجم)', 'تم تسجيل 4 مجموعات بنجاح', true),
              _buildTaskItem('فحص قياسات InBody الدورية لمصطفى', 'الموعد غداً الساعة 6:00 مساءً', false),
              _buildTaskItem('تعديل جدول السعرات اليومية إلى 2,650 kcal', 'تم اعتماده وتحديثه في حسابه', true),
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
              Text(title, style: const TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold)),
              Icon(icon, color: color, size: 18),
            ],
          ),
          const SizedBox(height: 10),
          Text(value, style: TextStyle(color: color, fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(sub, style: const TextStyle(color: Colors.white38, fontSize: 10)),
        ],
      ),
    );
  }

  Widget _buildTaskItem(String title, String subtitle, bool isDone) {
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
          Icon(
            isDone ? Icons.check_circle_rounded : Icons.radio_button_unchecked_rounded,
            color: isDone ? AppColors.neonGreen : Colors.white38,
            size: 20,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                Text(subtitle, style: const TextStyle(color: Colors.white54, fontSize: 11)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
