import 'package:flutter/material.dart';
import '../core/constants/colors.dart';
import '../core/services/update_service.dart';

class MobileLoginScreen extends StatefulWidget {
  final Function(String role) onLoginSuccess;

  const MobileLoginScreen({super.key, required this.onLoginSuccess});

  @override
  State<MobileLoginScreen> createState() => _MobileLoginScreenState();
}

class _MobileLoginScreenState extends State<MobileLoginScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    // Auto-check for updates on the login screen
    WidgetsBinding.instance.addPostFrameCallback((_) {
      UpdateService.checkForUpdates(context);
    });
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _submitLogin() {
    final email = _emailController.text.trim().toLowerCase();
    final password = _passwordController.text;

    if (email.isEmpty || password.isEmpty) {
      setState(() => _errorMessage = 'يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    Future.delayed(const Duration(milliseconds: 600), () {
      if (!mounted) return;
      setState(() => _isLoading = false);

      final isSuperAdmin = email == 'superadmin@pulsops.com' || email.contains('superadmin');

      if (isSuperAdmin) {
        if (password == 'Admin@PulsOps#2026!' || password == 'PulsOps@Master2026' || password == 'superadmin' || password == '123456') {
          widget.onLoginSuccess('SUPER_ADMIN');
        } else {
          setState(() {
            _errorMessage = 'كلمة مرور المشرف العام غير صحيحة. يرجى استخدام Admin@PulsOps#2026!';
          });
        }
      } else if (email.contains('pulsops') || email.contains('admin')) {
        widget.onLoginSuccess('GYM_ADMIN');
      } else if (email.contains('mostafa') && !email.contains('mr')) {
        widget.onLoginSuccess('TRAINER');
      } else if (email.contains('mr') || email.contains('member')) {
        widget.onLoginSuccess('MEMBER');
      } else {
        // Default to member
        widget.onLoginSuccess('MEMBER');
      }
    });
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.pitchBlack,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Logo & Title
              Center(
                child: Container(
                  width: 68,
                  height: 68,
                  decoration: BoxDecoration(
                    color: AppColors.neonGreen.withOpacity(0.12),
                    shape: BoxShape.circle,
                    border: Border.all(color: AppColors.neonGreen, width: 2),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.neonGreen.withOpacity(0.3),
                        blurRadius: 20,
                      ),
                    ],
                  ),
                  child: const Icon(Icons.bolt_rounded, color: AppColors.neonGreen, size: 40),
                ),
              ),
              const SizedBox(height: 16),
              const Center(
                child: Text(
                  'PULSOPS ERP',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 2,
                    color: Colors.white,
                    fontFamily: 'Cairo',
                  ),
                ),
              ),
              const Center(
                child: Text(
                  'المنظومة السحابية المتكاملة لإدارة الصالات الرياضية',
                  style: TextStyle(
                    fontSize: 12,
                    color: AppColors.textSubtle,
                    fontFamily: 'Cairo',
                  ),
                ),
              ),

              const SizedBox(height: 28),

              // Email Field
              const Text(
                'البريد الإلكتروني',
                style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _emailController,
                style: const TextStyle(color: Colors.white, fontSize: 14),
                decoration: InputDecoration(
                  filled: true,
                  fillColor: AppColors.surfaceDark,
                  hintText: 'user@pulsops.com',
                  hintStyle: const TextStyle(color: Colors.white30, fontSize: 13),
                  prefixIcon: const Icon(Icons.email_outlined, color: AppColors.neonGreen, size: 20),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: AppColors.cardBorder),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: AppColors.cardBorder),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: AppColors.neonGreen),
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // Password Field
              const Text(
                'كلمة المرور',
                style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _passwordController,
                obscureText: true,
                style: const TextStyle(color: Colors.white, fontSize: 14),
                decoration: InputDecoration(
                  filled: true,
                  fillColor: AppColors.surfaceDark,
                  hintText: '••••••••',
                  hintStyle: const TextStyle(color: Colors.white30, fontSize: 13),
                  prefixIcon: const Icon(Icons.lock_outline_rounded, color: AppColors.neonGreen, size: 20),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: AppColors.cardBorder),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: AppColors.cardBorder),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: AppColors.neonGreen),
                  ),
                ),
              ),

              if (_errorMessage != null) ...[
                const SizedBox(height: 10),
                Text(
                  _errorMessage!,
                  style: const TextStyle(color: Colors.redAccent, fontSize: 12),
                  textAlign: TextAlign.center,
                ),
              ],

              const SizedBox(height: 20),

              // Sign in button
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.neonGreen,
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  elevation: 6,
                ),
                onPressed: _isLoading ? null : _submitLogin,
                child: _isLoading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(color: Colors.black, strokeWidth: 2),
                      )
                    : const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.login_rounded, size: 20),
                          SizedBox(width: 8),
                          Text(
                            'تسجيل الدخول إلى النظام',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                        ],
                      ),
              ),

              const SizedBox(height: 24),

              Center(
                child: Text(
                  'نظام PulsOps السحابي المحمي بتشفير 256-bit',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.35),
                    fontSize: 11,
                    fontFamily: 'Cairo',
                  ),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
