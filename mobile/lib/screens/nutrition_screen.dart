import 'package:flutter/material.dart';
import '../core/constants/colors.dart';

class NutritionScreen extends StatefulWidget {
  const NutritionScreen({super.key});

  @override
  State<NutritionScreen> createState() => _NutritionScreenState();
}

class _NutritionScreenState extends State<NutritionScreen> {
  int waterCups = 6;
  final int totalCupsTarget = 8;

  final List<Map<String, dynamic>> meals = [
    {
      'title': 'الوجبة 1 (الإفطار الصباحي)',
      'detail': '5 بياض بيض + 1 بيضة كاملة + 80g شوفان مع التوت وزبدة فول سوداني',
      'cals': '550 kcal',
      'protein': '42g بروتين',
      'eaten': true,
    },
    {
      'title': 'الوجبة 2 (قبل التمرين بـ ساعتين)',
      'detail': '200g صدور دجاج مشوية + 200g أرز بسمتي مسلوق + خضار سوتيه',
      'cals': '720 kcal',
      'protein': '52g بروتين',
      'eaten': true,
    },
    {
      'title': 'الوجبة 3 (وجبة الاستشفاء والعشاء)',
      'detail': '1 سكوب واي بروتين مع ماء + 180g لحم بقري صافي + بطاطا مشوية',
      'cals': '680 kcal',
      'protein': '58g بروتين',
      'eaten': false,
    },
    {
      'title': 'وجبة خفيفة (سناك المساء)',
      'detail': '200g جبن قريش قليل الدسم + حفنة لوز نيء وخيار',
      'cals': '320 kcal',
      'protein': '28g بروتين',
      'eaten': false,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.pitchBlack,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          'الأنظمة الغذائية والماكروز',
          style: TextStyle(
            color: AppColors.textWhite,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        children: [
          // Daily Macros Target Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.surfaceDark,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.cardBorder),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'خطة التغذية للضخامة الصافية',
                      style: TextStyle(color: AppColors.textWhite, fontSize: 15, fontWeight: FontWeight.bold),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppColors.neonGreen.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text(
                        'الكوتش mostafa',
                        style: TextStyle(color: AppColors.neonGreen, fontSize: 10, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                const Text(
                  'الهدف اليومي: 2,650 سعرة حرارية محسوبة لدعم البناء والاستشفاء',
                  style: TextStyle(color: AppColors.textMuted, fontSize: 11),
                ),
                const SizedBox(height: 20),

                // Macro Progress Bars
                _buildMacroBar('البروتين المستهدف', '140g / 210g', 140 / 210, AppColors.neonGreen),
                const SizedBox(height: 12),
                _buildMacroBar('الكربوهيدرات', '190g / 260g', 190 / 260, const Color(0xFF38BDF8)),
                const SizedBox(height: 12),
                _buildMacroBar('الدهون الصحية', '45g / 60g', 45 / 60, const Color(0xFFFBBF24)),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Water Tracker
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: AppColors.cardDark,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.cardBorder),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.water_drop, color: Color(0xFF38BDF8), size: 20),
                        SizedBox(width: 8),
                        Text(
                          'متتبع شرب الماء اليومي',
                          style: TextStyle(color: AppColors.textWhite, fontWeight: FontWeight.bold, fontSize: 14),
                        ),
                      ],
                    ),
                    Text(
                      '$waterCups من $totalCupsTarget أكواب (${waterCups * 250} مل)',
                      style: const TextStyle(color: Color(0xFF38BDF8), fontSize: 12, fontWeight: FontWeight.bold, fontFamily: 'monospace'),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(totalCupsTarget, (idx) {
                    final bool filled = idx < waterCups;
                    return InkWell(
                      onTap: () {
                        setState(() {
                          waterCups = idx + 1;
                        });
                      },
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 5),
                        child: Icon(
                          Icons.water_drop,
                          size: 26,
                          color: filled ? const Color(0xFF38BDF8) : const Color(0xFF333333),
                        ),
                      ),
                    );
                  }),
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    IconButton(
                      onPressed: waterCups > 0 ? () => setState(() => waterCups--) : null,
                      icon: const Icon(Icons.remove_circle_outline, color: AppColors.textMuted),
                    ),
                    const SizedBox(width: 20),
                    IconButton(
                      onPressed: waterCups < totalCupsTarget ? () => setState(() => waterCups++) : null,
                      icon: const Icon(Icons.add_circle, color: Color(0xFF38BDF8), size: 28),
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          const Text(
            'جدول وجبات اليوم الموصوفة',
            style: TextStyle(color: AppColors.textWhite, fontWeight: FontWeight.bold, fontSize: 15),
          ),
          const SizedBox(height: 10),

          // Meals List
          ...List.generate(meals.length, (idx) {
            final m = meals[idx];
            final bool eaten = m['eaten'];

            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: eaten ? AppColors.surfaceDark.withOpacity(0.6) : AppColors.cardDark,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: eaten ? AppColors.neonGreen.withOpacity(0.4) : AppColors.cardBorder,
                ),
              ),
              child: Row(
                children: [
                  InkWell(
                    onTap: () => setState(() => m['eaten'] = !eaten),
                    child: Container(
                      width: 28,
                      height: 28,
                      decoration: BoxDecoration(
                        color: eaten ? AppColors.neonGreen : AppColors.surfaceDark,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: eaten ? AppColors.neonGreen : AppColors.cardBorder),
                      ),
                      child: eaten ? const Icon(Icons.check, size: 18, color: Colors.black) : null,
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              m['title'],
                              style: TextStyle(
                                color: eaten ? AppColors.neonGreen : AppColors.textWhite,
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                              ),
                            ),
                            Text(
                              '${m['cals']} • ${m['protein']}',
                              style: const TextStyle(color: AppColors.textMuted, fontSize: 10, fontFamily: 'monospace'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          m['detail'],
                          style: const TextStyle(color: AppColors.textMuted, fontSize: 11),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildMacroBar(String title, String val, double ratio, Color color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(title, style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
            Text(val, style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.bold, fontFamily: 'monospace')),
          ],
        ),
        const SizedBox(height: 4),
        ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: LinearProgressIndicator(
            value: ratio.clamp(0.0, 1.0),
            backgroundColor: AppColors.cardBorder,
            valueColor: AlwaysStoppedAnimation<Color>(color),
            minHeight: 6,
          ),
        ),
      ],
    );
  }
}
