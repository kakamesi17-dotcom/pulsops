import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/colors.dart';

class AppTheme {
  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.pitchBlack,
      primaryColor: AppColors.neonGreen,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.neonGreen,
        secondary: AppColors.neonLime,
        surface: AppColors.cardDark,
      ),
      textTheme: GoogleFonts.cairoTextTheme(
        ThemeData.dark().textTheme,
      ).apply(
        bodyColor: AppColors.textWhite,
        displayColor: AppColors.textWhite,
      ),
      cardTheme: CardTheme(
        color: AppColors.cardDark,
        elevation: 0,
        shape: RoundedRectangleBorder(
          side: const BorderSide(color: AppColors.cardBorder, width: 1),
          borderRadius: BorderRadius.circular(16),
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.surfaceDark,
        selectedItemColor: AppColors.neonGreen,
        unselectedItemColor: AppColors.textSubtle,
        type: BottomNavigationBarType.fixed,
        showUnselectedLabels: true,
      ),
    );
  }
}
