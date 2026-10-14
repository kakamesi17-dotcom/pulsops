import 'package:flutter/material.dart';
import '../core/constants/colors.dart';

class AiCoachScreen extends StatefulWidget {
  const AiCoachScreen({super.key});

  @override
  State<AiCoachScreen> createState() => _AiCoachScreenState();
}

class _AiCoachScreenState extends State<AiCoachScreen> {
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isLoading = false;

  final List<Map<String, String>> messages = [
    {
      'role': 'ai',
      'text': 'أهلاً بك يا mr mostafa! أنا كوتش الذكاء الاصطناعي (Gemini AI) المعتمد في نادي PulsOps الرياضي. لاحظت تقدمك الممتاز بزيادة 0.7 كجم عضلات صافية في فحص InBody الأخير مع الكوتش mostafa. كيف يمكنني مساعدتك في خطتك التدريبية، التغذية، أو الاستشفاء اليوم؟',
      'time': 'الآن',
    }
  ];

  final List<String> quickSuggestions = [
    'أفضل وقت لتناول الكرياتين؟',
    'كم جرام بروتين أحتاج اليوم؟',
    'كيف أتجنب الإجهاد في تمرين البنش؟',
    'ما هي أفضل وجبة بعد التمرين؟',
  ];

  void _sendMessage([String? presetQuery]) {
    final text = presetQuery ?? _controller.text.trim();
    if (text.isEmpty || _isLoading) return;

    if (presetQuery == null) _controller.clear();

    setState(() {
      messages.add({'role': 'user', 'text': text, 'time': 'الآن'});
      _isLoading = true;
    });

    _scrollToBottom();

    // AI Response Simulation
    Future.delayed(const Duration(milliseconds: 1200), () {
      if (!mounted) return;
      String reply = '';

      if (text.contains('كرياتين')) {
        reply = 'أفضل وقت لتناول الكرياتين هو 5 جرام يومياً مباشرة بعد التمرين مع مصدر كربوهيدرات سريع (مثل العصير أو الموز) لتعظيم الامتصاص العضلي. واحرص على شرب ما لا يقل عن 3 لترات ماء يومياً.';
      } else if (text.contains('بروتين')) {
        reply = 'بناءً على خطتك الحالية مع الكوتش mostafa ووزنك البالغ 81 كجم، هدفك اليومي هو 210 جرام بروتين عالي الجودة مقسمة على 4-5 وجبات بمعدل 40-50 جرام لكل وجبة.';
      } else if (text.contains('بنش') || text.contains('صدر')) {
        reply = 'لتجنب آلام الكتف في تمرين البنش برس: حافظ على زاوية كوعك بـ 45-75 درجة مع الجذع وليس 90 درجة، وقم بسحب لوحي الكتف للخلف والأسفل (Scapular Retraction) قبل خفض البار.';
      } else {
        reply = 'سؤال ممتاز يا mr mostafa! الاستشفاء العضلي يعتمد بنسبة 80% على النوم العميق (7.5 - 8 ساعات) والحفاظ على توازن السوائل والإلكترولايت بعد جلسات الدفع المكثفة. يمكنك أيضاً استشارة الكوتش mostafa في صالة النادي لضبط زوايا الحركة.';
      }

      setState(() {
        _isLoading = false;
        messages.add({'role': 'ai', 'text': reply, 'time': 'الآن'});
      });

      _scrollToBottom();
    });
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.pitchBlack,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.auto_awesome, color: AppColors.neonGreen, size: 18),
            SizedBox(width: 8),
            Text(
              'كوتش الذكاء الاصطناعي (Gemini AI)',
              style: TextStyle(
                color: AppColors.textWhite,
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
          ],
        ),
        centerTitle: true,
      ),
      body: Column(
        children: [
          // Quick Chips Suggestions
          Container(
            height: 44,
            padding: const EdgeInsets.symmetric(horizontal: 14),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: quickSuggestions.length,
              itemBuilder: (ctx, idx) {
                final chip = quickSuggestions[idx];
                return Padding(
                  padding: const EdgeInsets.only(left: 8),
                  child: ActionChip(
                    backgroundColor: AppColors.surfaceDark,
                    side: const BorderSide(color: AppColors.cardBorder),
                    label: Text(
                      chip,
                      style: const TextStyle(color: AppColors.textMuted, fontSize: 11),
                    ),
                    onPressed: () => _sendMessage(chip),
                  ),
                );
              },
            ),
          ),

          const SizedBox(height: 6),

          // Messages List
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: messages.length,
              itemBuilder: (context, idx) {
                final m = messages[idx];
                final isUser = m['role'] == 'user';

                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Align(
                    alignment: isUser ? Alignment.centerLeft : Alignment.centerRight,
                    child: Container(
                      constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.82),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        color: isUser ? AppColors.neonGreen : AppColors.surfaceDark,
                        borderRadius: BorderRadius.only(
                          topLeft: const Radius.circular(18),
                          topRight: const Radius.circular(18),
                          bottomLeft: isUser ? const Radius.circular(4) : const Radius.circular(18),
                          bottomRight: isUser ? const Radius.circular(18) : const Radius.circular(4),
                        ),
                        border: isUser ? null : Border.all(color: AppColors.cardBorder),
                        boxShadow: [
                          if (isUser)
                            BoxShadow(
                              color: AppColors.neonGreen.withOpacity(0.2),
                              blurRadius: 10,
                            ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: isUser ? CrossAxisAlignment.start : CrossAxisAlignment.start,
                        children: [
                          Text(
                            m['text'] ?? '',
                            style: TextStyle(
                              color: isUser ? Colors.black : AppColors.textWhite,
                              fontSize: 13,
                              height: 1.45,
                              fontWeight: isUser ? FontWeight.w600 : FontWeight.normal,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            m['time'] ?? '',
                            style: TextStyle(
                              color: isUser ? Colors.black54 : AppColors.textSubtle,
                              fontSize: 9,
                              fontFamily: 'monospace',
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          if (_isLoading)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              child: Align(
                alignment: Alignment.centerRight,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceDark,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.neonGreen.withOpacity(0.3)),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      SizedBox(
                        width: 12,
                        height: 12,
                        child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.neonGreen),
                      ),
                      SizedBox(width: 8),
                      Text(
                        'الكوتش الذكي يحلل استفسارك التدريبي الآن...',
                        style: TextStyle(color: AppColors.neonGreen, fontSize: 11),
                      ),
                    ],
                  ),
                ),
              ),
            ),

          // Message Input Field
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: const BoxDecoration(
              color: AppColors.surfaceDark,
              border: Border(top: BorderSide(color: AppColors.cardBorder)),
            ),
            child: SafeArea(
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      textInputAction: TextInputAction.send,
                      onSubmitted: (_) => _sendMessage(),
                      style: const TextStyle(color: AppColors.textWhite, fontSize: 13),
                      decoration: InputDecoration(
                        hintText: 'اسأل عن التمارين، البروتين، المكملات أو الاستشفاء...',
                        hintStyle: const TextStyle(color: AppColors.textSubtle, fontSize: 12),
                        fillColor: AppColors.cardDark,
                        filled: true,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(20),
                          borderSide: const BorderSide(color: AppColors.cardBorder),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(20),
                          borderSide: const BorderSide(color: AppColors.cardBorder),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(20),
                          borderSide: const BorderSide(color: AppColors.neonGreen),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  InkWell(
                    onTap: () => _sendMessage(),
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      padding: const EdgeInsets.all(11),
                      decoration: const BoxDecoration(
                        color: AppColors.neonGreen,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.send_rounded, color: Colors.black, size: 18),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
