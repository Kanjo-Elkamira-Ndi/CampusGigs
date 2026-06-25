import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_dimensions.dart';
import '../../core/theme/app_radius.dart';
import '../../core/mocks/mock_data.dart';
import 'category_chip.dart';

class GigCard extends StatelessWidget {
  final MockGig gig;
  final VoidCallback? onBookmark;

  const GigCard({super.key, required this.gig, this.onBookmark});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.push('/worker/gig/${gig.id}'),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(AppDimensions.base),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(AppRadius.lg),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CategoryChip(
                  label: gig.categoryName,
                  isSelected: false,
                  onTap: () {},
                ),
                const Spacer(),
                GestureDetector(
                  onTap: onBookmark,
                  child: Icon(
                    gig.isSaved ? Icons.bookmark : Icons.bookmark_outline,
                    size: 20,
                    color: gig.isSaved ? AppColors.primary : AppColors.textMuted,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              gig.title,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: AppDimensions.sm),
            Row(
              children: [
                Row(
                  children: [
                    Icon(Icons.school_outlined, size: 12, color: AppColors.textMuted),
                    const SizedBox(width: 4),
                    Text(
                      gig.university,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppColors.textMuted,
                      ),
                    ),
                  ],
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.primaryLight,
                    borderRadius: BorderRadius.circular(AppRadius.full),
                  ),
                  child: Text(
                    MockData.formatXAF(gig.budget),
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: AppColors.primary,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Text(
                  gig.posterName,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
                const Spacer(),
                Text(
                  '${gig.applicantCount} applicants',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppColors.textMuted,
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  child: Container(
                    width: 3,
                    height: 3,
                    decoration: const BoxDecoration(
                      color: AppColors.textMuted,
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
                Text(
                  MockData.relativeTime(gig.postedAt),
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppColors.textMuted,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class FeaturedGigCard extends StatelessWidget {
  final MockGig gig;

  const FeaturedGigCard({super.key, required this.gig});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.push('/worker/gig/${gig.id}'),
      child: Container(
        width: 260,
        padding: const EdgeInsets.all(AppDimensions.base),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(AppRadius.lg),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CategoryChip(
                  label: gig.categoryName,
                  isSelected: false,
                  onTap: () {},
                ),
                const Spacer(),
                Icon(
                  gig.isSaved ? Icons.bookmark : Icons.bookmark_outline,
                  size: 18,
                  color: gig.isSaved ? AppColors.primary : AppColors.textMuted,
                ),
              ],
            ),
            const SizedBox(height: AppDimensions.md),
            Text(
              gig.title,
              style: Theme.of(context).textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: AppDimensions.sm),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.primaryLight,
                    borderRadius: BorderRadius.circular(AppRadius.full),
                  ),
                  child: Text(
                    MockData.formatXAF(gig.budget),
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      fontSize: 11,
                      color: AppColors.primary,
                    ),
                  ),
                ),
                const SizedBox(width: AppDimensions.sm),
                Expanded(
                  child: Row(
                    children: [
                      Icon(Icons.school_outlined, size: 10, color: AppColors.textMuted),
                      const SizedBox(width: 3),
                      Flexible(
                        child: Text(
                          gig.university,
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            fontSize: 11,
                            color: AppColors.textMuted,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
