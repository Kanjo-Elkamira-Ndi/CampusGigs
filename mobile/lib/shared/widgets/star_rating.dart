import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';

class StarRating extends StatelessWidget {
  final double rating;
  final int reviewCount;
  final double size;
  final bool showCount;

  const StarRating({
    required this.rating,
    this.reviewCount = 0,
    this.size = 13,
    this.showCount = true,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(Icons.star_rounded, size: size, color: AppColors.warning),
        const SizedBox(width: 2),
        Text(
          rating.toStringAsFixed(1),
          style: TextStyle(
            fontSize: size - 1,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
        if (showCount && reviewCount > 0) ...[
          const SizedBox(width: 3),
          Text(
            '(${_formatCount(reviewCount)})',
            style: TextStyle(fontSize: size - 2, color: AppColors.textMuted),
          ),
        ],
      ],
    );
  }

  String _formatCount(int count) {
    if (count >= 1000) return '${(count / 1000).toStringAsFixed(1)}k';
    return count.toString();
  }
}
