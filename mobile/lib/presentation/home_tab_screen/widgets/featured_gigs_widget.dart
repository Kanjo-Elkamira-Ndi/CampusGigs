import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../features/gigs/data/models/gig_model.dart';
import '../../../features/gigs/domain/gig_feed_notifier.dart';
import '../../../router/app_router.dart';
import '../../../shared/widgets/loading_shimmer.dart';
import '../../../shared/widgets/university_badge.dart';
import '../../../core/utils/currency_formatter.dart';

class FeaturedGigsWidget extends StatelessWidget {
  final AsyncValue<List<GigModel>> gigsAsync;

  const FeaturedGigsWidget({required this.gigsAsync, super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 20, 16, 12),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Featured Gigs',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              GestureDetector(
                onTap: () {},
                child: Text(
                  'See all',
                  style: theme.textTheme.labelMedium?.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
        SizedBox(
          height: 200,
          child: gigsAsync.when(
            loading: () => ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: 3,
              separatorBuilder: (_, __) => const SizedBox(width: 12),
              itemBuilder: (_, __) =>
                  const ShimmerBox(width: 260, height: 200, radius: 16),
            ),
            error: (_, __) => const SizedBox.shrink(),
            data: (gigs) => ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: gigs.take(5).length,
              separatorBuilder: (_, __) => const SizedBox(width: 12),
              itemBuilder: (context, i) {
                final gig = gigs[i];
                return _CompactGigCard(gig: gig)
                    .animate(delay: Duration(milliseconds: i * 50))
                    .fadeIn(duration: 350.ms)
                    .slideY(
                      begin: 0.1,
                      end: 0,
                      duration: 350.ms,
                      curve: Curves.easeOutCubic,
                    );
              },
            ),
          ),
        ),
      ],
    );
  }
}

class _CompactGigCard extends ConsumerWidget {
  final GigModel gig;

  const _CompactGigCard({required this.gig});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final categoryColor = Color(int.parse('FF${gig.categoryColor}', radix: 16));

    return GestureDetector(
      onTap: () => context.push(AppRoutes.gigDetailScreen, extra: gig),
      child: Hero(
        tag: 'gig-compact-${gig.id}',
        child: Container(
          width: 260,
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.outline.withAlpha(128)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Image area
              ClipRRect(
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(16),
                ),
                child: Container(
                  height: 100,
                  color: categoryColor.withAlpha(31),
                  child: Stack(
                    children: [
                      Center(
                        child: Icon(
                          Icons.work_outline_rounded,
                          size: 40,
                          color: categoryColor.withAlpha(128),
                        ),
                      ),
                      // Availability badge
                      Positioned(
                        top: 8,
                        right: 8,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 3,
                          ),
                          decoration: BoxDecoration(
                            color:
                                gig.availability.contains('Today') ||
                                    gig.availability.contains('Available')
                                ? AppColors.success
                                : gig.availability.contains('Urgent')
                                ? AppColors.error
                                : AppColors.warning,
                            borderRadius: BorderRadius.circular(999),
                          ),
                          child: Text(
                            gig.availability,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 9,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ),
                      // Save button
                      Positioned(
                        top: 6,
                        left: 8,
                        child: GestureDetector(
                          onTap: () => ref
                              .read(gigFeedNotifierProvider.notifier)
                              .toggleSave(gig.id),
                          child: Container(
                            width: 28,
                            height: 28,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withAlpha(26),
                                  blurRadius: 4,
                                ),
                              ],
                            ),
                            child: Icon(
                              gig.isSaved
                                  ? Icons.bookmark_rounded
                                  : Icons.bookmark_border_rounded,
                              size: 14,
                              color: gig.isSaved
                                  ? AppColors.primary
                                  : AppColors.textMuted,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      gig.title,
                      style: theme.textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.w700,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    UniversityBadge(university: gig.university, compact: true),
                    const SizedBox(height: 6),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          CurrencyFormatter.formatXAF(gig.budget),
                          style: theme.textTheme.titleSmall?.copyWith(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        Text(
                          '${gig.applicantCount} applied',
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: AppColors.textMuted,
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
    );
  }
}
