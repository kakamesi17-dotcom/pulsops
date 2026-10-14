import 'package:flutter/material.dart';
import '../core/constants/colors.dart';

class WorkoutsScreen extends StatefulWidget {
  const WorkoutsScreen({super.key});

  @override
  State<WorkoutsScreen> createState() => _WorkoutsScreenState();
}

class _WorkoutsScreenState extends State<WorkoutsScreen> {
  final List<Map<String, dynamic>> exercises = [
    {
      'name': 'بنش برس مائل بالبار الحر (Incline Barbell Bench)',
      'muscle': 'الصدر العلوي',
      'sets': '4 جولات',
      'reps': '8-10 تكرار',
      'rest': '90 ثانية',
      'done': true,
    },
    {
      'name': 'تجميع دمبل على بنش مستوي (Flat DB Fly)',
      'muscle': 'الصدر الأوسط والألياف الداخلية',
      'sets': '3 جولات',
      'reps': '10-12 تكرار',
      'rest': '75 ثانية',
      'done': true,
    },
    {
      'name': 'ضغط أكتاف عسكري بالبار واقفا (Military Press)',
      'muscle': 'الكتف الأمامي والجانبي',
      'sets': '4 جولات',
      'reps': '8-10 تكرار',
      'rest': '75 ثانية',
      'done': false,
    },
    {
      'name': 'رفرفة جانبي بالكابل المستمر (Cable Lateral Raises)',
      'muscle': 'الكتف الجانبي وتكوير الكتف',
      'sets': '4 جولات',
      'reps': '12-15 تكرار',
      'rest': '60 ثانية',
      'done': false,
    },
    {
      'name': 'ترايسبس بالحبل أعلى الرأس (Overhead Cable Triceps)',
      'muscle': 'الترايسبس الرأس الطويل',
      'sets': '3 جولات',
      'reps': '12 تكرار',
      'rest': '60 ثانية',
      'done': false,
    },
  ];

  int get completedCount => exercises.where((e) => e['done'] == true).length;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.pitchBlack,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          'جدول تمارين اليوم',
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
          // Workout Overview Hero Banner
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.surfaceDark,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.neonGreen.withOpacity(0.35)),
              boxShadow: [
                BoxShadow(
                  color: AppColors.neonGreen.withOpacity(0.08),
                  blurRadius: 20,
                  spreadRadius: 1,
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.neonGreen.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Text(
                        'تمارين الدفع (Push Day)',
                        style: TextStyle(
                          color: AppColors.neonGreen,
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const Row(
                      children: [
                        Icon(Icons.verified, color: AppColors.neonGreen, size: 16),
                        SizedBox(width: 4),
                        Text(
                          'معتمد من الكوتش mostafa',
                          style: TextStyle(
                            color: AppColors.neonGreen,
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                const Text(
                  'تمارين الصدر والكتف والترايسبس المتقدمة',
                  style: TextStyle(
                    color: AppColors.textWhite,
                    fontWeight: FontWeight.bold,
                    fontSize: 17,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'خطة الضخامة الصافية • 5 تمارين • المدة التقديرية 55 دقيقة',
                  style: TextStyle(color: AppColors.textMuted, fontSize: 12),
                ),
                const SizedBox(height: 16),

                // Progress Bar
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'نسبة إنجاز الجلسة: $completedCount من ${exercises.length} تمارين',
                      style: const TextStyle(color: AppColors.textMuted, fontSize: 11),
                    ),
                    Text(
                      '${((completedCount / exercises.length) * 100).toInt()}%',
                      style: const TextStyle(
                        color: AppColors.neonGreen,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                        fontFamily: 'monospace',
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: LinearProgressIndicator(
                    value: completedCount / exercises.length,
                    backgroundColor: AppColors.cardBorder,
                    valueColor: const AlwaysStoppedAnimation<Color>(AppColors.neonGreen),
                    minHeight: 6,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          const Text(
            'قائمة التمارين المجدولة للجلسة',
            style: TextStyle(
              color: AppColors.textWhite,
              fontWeight: FontWeight.bold,
              fontSize: 15,
            ),
          ),
          const SizedBox(height: 10),

          // Exercise List Items
          ...List.generate(exercises.length, (idx) {
            final ex = exercises[idx];
            final bool isDone = ex['done'];

            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDone ? AppColors.surfaceDark.withOpacity(0.6) : AppColors.cardDark,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isDone ? AppColors.neonGreen.withOpacity(0.5) : AppColors.cardBorder,
                ),
              ),
              child: Row(
                children: [
                  // Number or Checkbox
                  InkWell(
                    onTap: () {
                      setState(() {
                        ex['done'] = !isDone;
                      });
                    },
                    borderRadius: BorderRadius.circular(10),
                    child: Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: isDone ? AppColors.neonGreen : AppColors.cardBorder.withOpacity(0.4),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Center(
                        child: isDone
                            ? const Icon(Icons.check, color: Colors.black, size: 20)
                            : Text(
                                '${idx + 1}',
                                style: const TextStyle(
                                  color: AppColors.textWhite,
                                  fontWeight: FontWeight.bold,
                                  fontFamily: 'monospace',
                                ),
                              ),
                      ),
                    ),
                  ),

                  const SizedBox(width: 14),

                  // Exercise Info
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          ex['name'],
                          style: TextStyle(
                            color: isDone ? AppColors.neonGreen : AppColors.textWhite,
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                            decoration: isDone ? TextDecoration.lineThrough : null,
                          ),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          'العضلة: ${ex['muscle']}',
                          style: const TextStyle(color: AppColors.textMuted, fontSize: 11),
                        ),
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppColors.surfaceDark,
                                borderRadius: BorderRadius.circular(6),
                                border: Border.all(color: AppColors.cardBorder),
                              ),
                              child: Text(
                                ex['sets'],
                                style: const TextStyle(color: AppColors.textWhite, fontSize: 10, fontFamily: 'monospace'),
                              ),
                            ),
                            const SizedBox(width: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppColors.surfaceDark,
                                borderRadius: BorderRadius.circular(6),
                                border: Border.all(color: AppColors.cardBorder),
                              ),
                              child: Text(
                                ex['reps'],
                                style: const TextStyle(color: AppColors.textWhite, fontSize: 10, fontFamily: 'monospace'),
                              ),
                            ),
                            const SizedBox(width: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppColors.neonGreen.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                'راحة: ${ex['rest']}',
                                style: const TextStyle(color: AppColors.neonGreen, fontSize: 10, fontFamily: 'monospace'),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          }),

          const SizedBox(height: 10),

          // Coach Note Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.surfaceDark,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.cardBorder),
            ),
            child: const Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(Icons.tips_and_updates, color: AppColors.neonGreen, size: 20),
                SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'ملاحظة الكوتش mostafa لجلسة اليوم:',
                        style: TextStyle(color: AppColors.neonGreen, fontWeight: FontWeight.bold, fontSize: 12),
                      ),
                      SizedBox(height: 4),
                      Text(
                        'احرص على أداء مدى حركي كامل في بنش برس مع ثانية توقف أسفل الحركة، ولا تنسَ شرب 1.5 لتر ماء أثناء التمرين لتعزيز الامتلاء العضلي.',
                        style: TextStyle(color: AppColors.textMuted, fontSize: 11, height: 1.4),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
