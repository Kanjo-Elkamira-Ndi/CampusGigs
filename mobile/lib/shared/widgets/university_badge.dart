import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';

class UniversityBadge extends StatelessWidget {
  final String university;
  final bool compact;

  const UniversityBadge({
    required this.university,
    this.compact = false,
    super.key,
  });

  String get _shortName {
    if (university.length <= 20 || !compact) return university;
    // Abbreviate long university names
    return university
        .split(' ')
        .where((w) => w.length > 2)
        .map((w) => w[0].toUpperCase())
        .join('');
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: compact ? 6 : 8,
        vertical: compact ? 2 : 3,
      ),
      decoration: BoxDecoration(
        color: AppColors.primaryContainer,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.school_rounded,
            size: compact ? 10 : 11,
            color: AppColors.primary,
          ),
          const SizedBox(width: 3),
          Flexible(
            child: Text(
              _shortName,
              style: TextStyle(
                fontSize: compact ? 10 : 11,
                fontWeight: FontWeight.w600,
                color: AppColors.primary,
                letterSpacing: 0.1,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
