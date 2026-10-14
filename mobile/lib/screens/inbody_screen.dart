import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../core/constants/colors.dart';

class InBodyScreen extends StatefulWidget {
  const InBodyScreen({super.key});

  @override
  State<InBodyScreen> createState() => _InBodyScreenState();
}

class _InBodyScreenState extends State<InBodyScreen> {
  bool _requestSent = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.pitchBlack,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          'القياسات الحيوية وفحص InBody',
          style: TextStyle(
            color: AppColors.textWhite,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Stat Cards Grid
            Row(
              children: [
                Expanded(
                  child: _buildMetricCard(
                    title: 'الوزن الحالي',
                    value: '81.0 كجم',
                    change: '-7.5 كجم نزول صحي',
                    isPositive: true,
                    icon: Icons.monitor_weight_outlined,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildMetricCard(
                    title: 'نسبة الدهون',
                    value: '14.8%',
                    change: '-8.6% دهون صافية',
                    isPositive: true,
                    icon: Icons.pie_chart_outline,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildMetricCard(
                    title: 'الكتلة العضلية',
                    value: '41.2 كجم',
                    change: '+3.1 كجم عضلات صافية',
                    isPositive: true,
                    icon: Icons.fitness_center,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildMetricCard(
                    title: 'مؤشر كتلة الجسم',
                    value: '24.4 BMI',
                    change: 'مثالي وطبيعي ✅',
                    isPositive: true,
                    icon: Icons.speed,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // InBody Progress Chart
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
                        'مسار تطور القياسات (يونيو - أكتوبر)',
                        style: TextStyle(
                          color: AppColors.textWhite,
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: AppColors.neonGreen.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          'تحديث شهري',
                          style: TextStyle(color: AppColors.neonGreen, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'معدل انخفاض الدهون وتزايد الكتلة العضلية مع الكوتش mostafa',
                    style: TextStyle(color: AppColors.textMuted, fontSize: 11),
                  ),
                  const SizedBox(height: 24),

                  // FL Chart LineChart
                  SizedBox(
                    height: 180,
                    child: LineChart(
                      LineChartData(
                        gridData: FlGridData(
                          show: true,
                          drawVerticalLine: false,
                          getDrawingHorizontalLine: (value) => const FlLine(
                            color: Color(0xFF222222),
                            strokeWidth: 1,
                          ),
                        ),
                        titlesData: FlTitlesData(
                          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                          bottomTitles: AxisTitles(
                            sideTitles: SideTitles(
                              showTitles: true,
                              reservedSize: 22,
                              interval: 1,
                              getTitlesWidget: (val, meta) {
                                const titles = ['يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر'];
                                final idx = val.toInt();
                                if (idx >= 0 && idx < titles.length) {
                                  return Text(
                                    titles[idx],
                                    style: const TextStyle(color: AppColors.textMuted, fontSize: 10),
                                  );
                                }
                                return const SizedBox();
                              },
                            ),
                          ),
                          leftTitles: AxisTitles(
                            sideTitles: SideTitles(
                              showTitles: true,
                              reservedSize: 28,
                              interval: 20,
                              getTitlesWidget: (val, meta) => Text(
                                '${val.toInt()}',
                                style: const TextStyle(color: AppColors.textSubtle, fontSize: 9, fontFamily: 'monospace'),
                              ),
                            ),
                          ),
                        ),
                        borderData: FlBorderData(show: false),
                        minX: 0,
                        maxX: 4,
                        minY: 10,
                        maxY: 90,
                        lineBarsData: [
                          // Weight Line (Green)
                          LineChartBarData(
                            spots: const [
                              FlSpot(0, 88.5),
                              FlSpot(1, 86.2),
                              FlSpot(2, 84.0),
                              FlSpot(3, 82.5),
                              FlSpot(4, 81.0),
                            ],
                            isCurved: true,
                            color: AppColors.neonGreen,
                            barWidth: 3,
                            dotData: const FlDotData(show: true),
                            belowBarData: BarAreaData(
                              show: true,
                              color: AppColors.neonGreen.withOpacity(0.08),
                            ),
                          ),
                          // Muscle Mass (Cyan)
                          LineChartBarData(
                            spots: const [
                              FlSpot(0, 38.1),
                              FlSpot(1, 39.0),
                              FlSpot(2, 39.8),
                              FlSpot(3, 40.5),
                              FlSpot(4, 41.2),
                            ],
                            isCurved: true,
                            color: const Color(0xFF38BDF8),
                            barWidth: 2,
                            dotData: const FlDotData(show: false),
                          ),
                          // Body Fat % (Amber)
                          LineChartBarData(
                            spots: const [
                              FlSpot(0, 23.4),
                              FlSpot(1, 21.0),
                              FlSpot(2, 18.8),
                              FlSpot(3, 16.5),
                              FlSpot(4, 14.8),
                            ],
                            isCurved: true,
                            color: const Color(0xFFFBBF24),
                            barWidth: 2,
                            dotData: const FlDotData(show: false),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _ChartLegend('الوزن (كجم)', AppColors.neonGreen),
                      SizedBox(width: 16),
                      _ChartLegend('الكتلة العضلية', Color(0xFF38BDF8)),
                      SizedBox(width: 16),
                      _ChartLegend('نسبة الدهون %', Color(0xFFFBBF24)),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Book Next InBody Appointment CTA
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.cardDark,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: _requestSent ? AppColors.neonGreen : AppColors.cardBorder,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.neonGreen.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.calendar_month, color: AppColors.neonGreen, size: 20),
                      ),
                      const SizedBox(width: 10),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'حجز فحص دوري مع الكوتش mostafa',
                              style: TextStyle(color: AppColors.textWhite, fontSize: 13, fontWeight: FontWeight.bold),
                            ),
                            Text(
                              'فحص قياسات مجاني مشمول في باقتك الذهبية VIP مع 100 نقطة ولاء 🪙',
                              style: TextStyle(color: AppColors.textMuted, fontSize: 10),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  if (_requestSent)
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppColors.neonGreen.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.neonGreen.withOpacity(0.4)),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.check_circle, color: AppColors.neonGreen, size: 18),
                          SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'تم إرسال طلب الحجز بنجاح للكوتش mostafa! سيتم استقبالك عند زيارتك القادمة.',
                              style: TextStyle(color: AppColors.neonGreen, fontSize: 11, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                    )
                  else
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: () => setState(() => _requestSent = true),
                        icon: const Icon(Icons.send_rounded, size: 16),
                        label: const Text('إرسال طلب موعد فحص InBody الآن', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.neonGreen,
                          foregroundColor: Colors.black,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          elevation: 0,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricCard({
    required String title,
    required String value,
    required String change,
    required bool isPositive,
    required IconData icon,
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
              Text(title, style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
              Icon(icon, size: 16, color: AppColors.neonGreen),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(color: AppColors.textWhite, fontSize: 18, fontWeight: FontWeight.bold, fontFamily: 'monospace'),
          ),
          const SizedBox(height: 4),
          Text(
            change,
            style: const TextStyle(color: AppColors.neonGreen, fontSize: 10, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}

class _ChartLegend extends StatelessWidget {
  final String label;
  final Color color;
  const _ChartLegend(this.label, this.color);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(width: 8, height: 8, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
        const SizedBox(width: 4),
        Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
      ],
    );
  }
}
