import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/utils/currency_formatter.dart';
import '../../../features/gigs/data/models/gig_model.dart';
import '../../../features/gigs/domain/gig_feed_notifier.dart';
import '../../../router/app_router.dart';
import '../../../shared/widgets/university_badge.dart';
import '../../../shared/widgets/star_rating.dart';

/// Full-width GigCard — horizontal layout per skeleton extraction
/// LEFT: square image (~90px) | RIGHT: badge, title, university, rating, duration, price, Book Now
class GigCardWidget extends ConsumerWidget {
  final GigModel gig;
  final int index;

  const GigCardWidget({required this.gig, required this.index, super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final categoryColor = Color(int.parse('FF${gig.categoryColor}', radix: 16));

    final availabilityColor =
        gig.availability.contains('Today') ||
            gig.availability.contains('Available')
        ? AppColors.success
        : gig.availability.contains('Urgent')
        ? AppColors.error
        : AppColors.warning;

    return GestureDetector(
      onTap: () => context.push(AppRoutes.gigDetailScreen, extra: gig),
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.outline.withAlpha(128)),
        ),
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          splashColor: AppColors.primaryContainer,
          onTap: () => context.push(AppRoutes.gigDetailScreen, extra: gig),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // LEFT: square image
                Hero(
                  tag: 'gig-${gig.id}',
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      width: 90,
                      height: 90,
                      color: categoryColor.withAlpha(31),
                      child: Center(
                        child: Icon(
                          _categoryIcon(gig.category),
                          size: 36,
                          color: categoryColor.withAlpha(153),
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                // RIGHT: content
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Top row: availability badge + save icon
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 3,
                            ),
                            decoration: BoxDecoration(
                              color: availabilityColor.withAlpha(26),
                              borderRadius: BorderRadius.circular(999),
                              border: Border.all(
                                color: availabilityColor.withAlpha(102),
                              ),
                            ),
                            child: Text(
                              gig.availability,
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w700,
                                color: availabilityColor,
                              ),
                            ),
                          ),
                          GestureDetector(
                            onTap: () => ref
                                .read(gigFeedNotifierProvider.notifier)
                                .toggleSave(gig.id),
                            child: Icon(
                              gig.isSaved
                                  ? Icons.bookmark_rounded
                                  : Icons.bookmark_border_rounded,
                              size: 18,
                              color: gig.isSaved
                                  ? AppColors.primary
                                  : AppColors.textMuted,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      // Title
                      Text(
                        gig.title,
                        style: theme.textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      // University
                      UniversityBadge(
                        university: gig.university,
                        compact: true,
                      ),
                      const SizedBox(height: 6),
                      // Rating + duration row
                      Row(
                        children: [
                          StarRating(
                            rating: double.parse(gig.posterRating),
                            showCount: false,
                            size: 12,
                          ),
                          const SizedBox(width: 8),
                          const Icon(
                            Icons.access_time_rounded,
                            size: 11,
                            color: AppColors.textMuted,
                          ),
                          const SizedBox(width: 3),
                          Text(
                            gig.duration,
                            style: theme.textTheme.bodySmall?.copyWith(
                              color: AppColors.textMuted,
                              fontSize: 11,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      // Price + Book Now row
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Starts from',
                                style: theme.textTheme.bodySmall?.copyWith(
                                  color: AppColors.textMuted,
                                  fontSize: 10,
                                ),
                              ),
                              Text(
                                CurrencyFormatter.formatXAF(gig.budget),
                                style: theme.textTheme.titleSmall?.copyWith(
                                  color: AppColors.primary,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ],
                          ),
                          GestureDetector(
                            onTap: () => context.push(
                              AppRoutes.gigDetailScreen,
                              extra: gig,
                            ),
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 14,
                                vertical: 7,
                              ),
                              decoration: BoxDecoration(
                                color: AppColors.primary,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                'View Gig',
                                style: theme.textTheme.labelSmall?.copyWith(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  IconData _categoryIcon(String category) {
    switch (category.toLowerCase()) {
      case 'tech':
        return Icons.code_rounded;
      case 'design':
        return Icons.palette_outlined;
      case 'writing':
        return Icons.edit_note_rounded;
      case 'tutoring':
        return Icons.school_outlined;
      case 'delivery':
        return Icons.delivery_dining_rounded;
      case 'events':
        return Icons.event_outlined;
      default:
        return Icons.work_outline_rounded;
    }
  }
}
