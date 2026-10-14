import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'core/theme/app_theme.dart';
import 'screens/login_screen.dart';
import 'screens/main_navigation_screen.dart';
import 'screens/gym_admin_screen.dart';
import 'screens/trainer_screen.dart';
import 'screens/super_admin_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const PulsOpsApp());
}

class PulsOpsApp extends StatefulWidget {
  const PulsOpsApp({super.key});

  @override
  State<PulsOpsApp> createState() => _PulsOpsAppState();
}

class _PulsOpsAppState extends State<PulsOpsApp> {
  // Current active role: null means show LoginScreen
  String? _currentUserRole;

  void _handleLogin(String role) {
    setState(() {
      _currentUserRole = role;
    });
  }

  void _handleLogout() {
    setState(() {
      _currentUserRole = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    Widget activeHome;

    if (_currentUserRole == 'SUPER_ADMIN') {
      activeHome = SuperAdminScreen(onLogout: _handleLogout);
    } else if (_currentUserRole == 'GYM_ADMIN') {
      activeHome = GymAdminScreen(onLogout: _handleLogout);
    } else if (_currentUserRole == 'TRAINER') {
      activeHome = TrainerScreen(onLogout: _handleLogout);
    } else if (_currentUserRole == 'MEMBER') {
      activeHome = MainNavigationScreen(onLogout: _handleLogout);
    } else {
      activeHome = MobileLoginScreen(onLoginSuccess: _handleLogin);
    }

    return MaterialApp(
      title: 'بولس أوبس — المنظومة الذكية لإدارة الصالات الرياضية',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      locale: const Locale('ar', 'EG'),
      supportedLocales: const [
        Locale('ar', 'EG'),
        Locale('en', 'US'),
      ],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      home: activeHome,
    );
  }
}
