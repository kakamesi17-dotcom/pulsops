import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../core/constants/colors.dart';
import '../core/services/update_service.dart';

class PassScreen extends StatefulWidget {
  final VoidCallback? onLogout;

  const PassScreen({super.key, this.onLogout});

  @override
  State<PassScreen> createState() => _PassScreenState();
}

class _PassScreenState extends State<PassScreen> {
  bool _isCopied = false;
  bool _isScannedSim = false;

  final String memberQrPayload =
      '{"gym":"PulsOps Athletic Club","member":"mr mostafa","id":"#8491-PULSOPS","tier":"VIP GOLD","validUntil":"2027-11-30","gatePass":"AUTH_TOKEN_ENCRYPTED_2026"}';

  @override
  void initState() {
    super.initState();
    // Check for updates automatically when the app/screen loads
    WidgetsBinding.instance.addPostFrameCallback((_) {
      UpdateService.checkForUpdates(context);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.pitchBlack,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          'نادي PulsOps الرياضي',
          style: TextStyle(
            color: AppColors.textWhite,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        centerTitle: true,
        actions: [
          if (widget.onLogout != null)
            IconButton(
              icon: const Icon(Icons.logout_rounded, color: Colors.redAccent),
              tooltip: 'تسجيل الخروج',
              onPressed: widget.onLogout,
            ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
          child: Column(
            children: [
              // ─── Digital Turnstile Pass Card ───
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24.0),
                decoration: BoxDecoration(
                  color: AppColors.surfaceDark,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                    color: AppColors.neonGreen.withOpacity(0.4),
                    width: 1.5,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.neonGreen.withOpacity(0.12),
                      blurRadius: 30,
                      spreadRadius: 2,
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    // Pass Header
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Container(
                              width: 32,
                              height: 32,
                              decoration: BoxDecoration(
                                color: AppColors.neonGreen,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Center(
                                child: Text(
                                  'P',
                                  style: TextStyle(
                                    color: Colors.black,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 18,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 10),
                            const Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'كارت الدخول الذكي',
                                  style: TextStyle(
                                    color: AppColors.textWhite,
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  'بوابات Turnstile الإلكترونية',
                                  style: TextStyle(
                                    color: AppColors.textMuted,
                                    fontSize: 10,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.neonGreen.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: AppColors.neonGreen.withOpacity(0.4)),
                          ),
                          child: const Text(
                            'عضو VIP ذهبي ✅',
                            style: TextStyle(
                              color: AppColors.neonGreen,
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),

                    // QR Code Frame
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.black,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppColors.neonGreen, width: 2),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.neonGreen.withOpacity(0.3),
                            blurRadius: 25,
                            spreadRadius: 1,
                          ),
                        ],
                      ),
                      child: QrImageView(
                        data: memberQrPayload,
                        version: QrVersions.auto,
                        size: 190.0,
                        backgroundColor: Colors.black,
                        eyeStyle: const QrEyeStyle(
                          eyeShape: QrEyeShape.square,
                          color: AppColors.neonGreen,
                        ),
                        dataModuleStyle: const QrDataModuleStyle(
                          dataModuleShape: QrDataModuleShape.square,
                          color: AppColors.neonGreen,
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Member Name & Code
                    const Text(
                      'mr mostafa',
                      style: TextStyle(
                        color: AppColors.textWhite,
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'الباقة الذهبية السنوية VIP • صالحة حتى نوفمبر 2027',
                      style: TextStyle(
                        color: AppColors.textMuted,
                        fontSize: 11,
                      ),
                      textAlign: TextAlign.center,
                    ),

                    const SizedBox(height: 16),

                    // Member Code Pill
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppColors.cardDark,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.cardBorder),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Text(
                            'كود العضوية: ',
                            style: TextStyle(color: AppColors.textMuted, fontSize: 11),
                          ),
                          const Text(
                            '#8491-PULSOPS',
                            style: TextStyle(
                              color: AppColors.neonGreen,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                              fontFamily: 'monospace',
                            ),
                          ),
                          const SizedBox(width: 8),
                          InkWell(
                            onTap: () {
                              setState(() => _isCopied = true);
                              Future.delayed(const Duration(seconds: 2), () {
                                if (mounted) setState(() => _isCopied = false);
                              });
                            },
                            child: Icon(
                              _isCopied ? Icons.check : Icons.copy,
                              size: 14,
                              color: _isCopied ? AppColors.neonGreen : AppColors.textMuted,
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),
                    const Divider(color: AppColors.cardBorder, height: 1),
                    const SizedBox(height: 16),

                    // Card Stats Grid
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildPassStat('المدرب المخصص', 'الكوتش mostafa', Icons.person_outline),
                        _buildPassStat('حضور الشهر', '22 زيارة', Icons.calendar_today_outlined),
                        _buildPassStat('نقاط الولاء', '1,450 🪙', Icons.stars_outlined),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // Simulation Scan Button
              InkWell(
                onTap: () {
                  setState(() => _isScannedSim = true);
                  Future.delayed(const Duration(seconds: 4), () {
                    if (mounted) setState(() => _isScannedSim = false);
                  });
                },
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  decoration: BoxDecoration(
                    color: _isScannedSim ? AppColors.neonGreen.withOpacity(0.2) : AppColors.cardDark,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: _isScannedSim ? AppColors.neonGreen : AppColors.cardBorder,
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        _isScannedSim ? Icons.check_circle : Icons.qr_code_scanner,
                        color: AppColors.neonGreen,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        _isScannedSim
                          ? '✅ تم فتح البوابة الذكية Turnstile A بنجاح!'
                          : 'محاكاة تمرير الكود على البوابة الذكية',
                        style: TextStyle(
                          color: _isScannedSim ? AppColors.neonGreen : AppColors.textWhite,
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 14),

              // Bottom NFC / Apple Wallet Notice
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.cardDark,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.cardBorder),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.nfc, color: AppColors.neonGreen, size: 20),
                    SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'يدعم التطبيق الدخول اللاتلامسي عبر NFC و Apple Wallet و Google Wallet بمجرد تقريب الهاتف من حساس البوابة.',
                        style: TextStyle(color: AppColors.textMuted, fontSize: 11, height: 1.4),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPassStat(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, size: 16, color: AppColors.neonGreen),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(color: AppColors.textSubtle, fontSize: 10),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: const TextStyle(color: AppColors.textWhite, fontSize: 12, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }
}
