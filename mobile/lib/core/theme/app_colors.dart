import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // Primary brand — #0F8BFF (matches frontend --primary / --brand)
  static const Color primary = Color(0xFF0F8BFF);
  static const Color primaryDark = Color(0xFF0A7AE6);
  static const Color primaryLight = Color(0x1A0F8BFF);
  static const Color primaryMuted = Color(0x0D0F8BFF);

  // Surfaces
  static const Color background = Color(0xFFF5F7FA);
  static const Color surface = Color(0xFFFFFFFF);

  // Borders
  static const Color border = Color(0x14000000);
  static const Color inputBorder = Color(0x1F000000);

  // Text
  static const Color textPrimary = Color(0xFF1A1A2E);
  static const Color textSecondary = Color(0xFF4B5563);
  static const Color textMuted = Color(0xFF6B7280);

  // Semantic
  static const Color success = Color(0xFF10B981);
  static const Color successLight = Color(0xFFD1FAE5);
  static const Color warning = Color(0xFFF59E0B);
  static const Color warningLight = Color(0xFFFEF3C7);
  static const Color error = Color(0xFFEF4444);
  static const Color errorLight = Color(0xFFFEE2E2);
  static const Color offlineBg = Color(0xFF1F2937);

  // Backward compat
  static const Color amber = warning;
}
