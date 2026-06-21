import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../../core/constants/app_colors.dart';

class ShimmerBox extends StatelessWidget {
  final double width;
  final double height;
  final double radius;

  const ShimmerBox({
    required this.width,
    required this.height,
    this.radius = 8,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: AppColors.outlineVariant,
      highlightColor: AppColors.surface,
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: AppColors.outlineVariant,
          borderRadius: BorderRadius.circular(radius),
        ),
      ),
    );
  }
}

class GigCardShimmer extends StatelessWidget {
  const GigCardShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.outline.withAlpha(128)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ShimmerBox(width: 90, height: 90, radius: 12),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ShimmerBox(width: 120, height: 14, radius: 4),
                const SizedBox(height: 8),
                ShimmerBox(width: double.infinity, height: 12, radius: 4),
                const SizedBox(height: 6),
                ShimmerBox(width: 180, height: 12, radius: 4),
                const SizedBox(height: 10),
                Row(
                  children: [
                    ShimmerBox(width: 60, height: 20, radius: 10),
                    const SizedBox(width: 8),
                    ShimmerBox(width: 80, height: 20, radius: 10),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class CategoryChipShimmer extends StatelessWidget {
  const CategoryChipShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: AppColors.outlineVariant,
      highlightColor: AppColors.surface,
      child: Container(
        width: 90,
        height: 36,
        margin: const EdgeInsets.only(right: 8),
        decoration: BoxDecoration(
          color: AppColors.outlineVariant,
          borderRadius: BorderRadius.circular(999),
        ),
      ),
    );
  }
}

class FeaturedBannerShimmer extends StatelessWidget {
  const FeaturedBannerShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: AppColors.outlineVariant,
      highlightColor: AppColors.surface,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16),
        height: 140,
        decoration: BoxDecoration(
          color: AppColors.outlineVariant,
          borderRadius: BorderRadius.circular(16),
        ),
      ),
    );
  }
}
