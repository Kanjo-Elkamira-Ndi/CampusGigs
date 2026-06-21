import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../shared/widgets/star_rating.dart';

class GigReviewsWidget extends StatelessWidget {
  const GigReviewsWidget({super.key});

  static final List<Map<String, dynamic>> _reviewMaps = [
    {
      'id': 'r1',
      'name': 'Sarah Mboumba',
      'rating': 5.0,
      'comment':
          'Excellent work! Delivered before the deadline and the quality was outstanding.',
      'timeAgo': '2 days ago',
      'avatarInitial': 'S',
    },
    {
      'id': 'r2',
      'name': 'David Tchatchoua',
      'rating': 4.0,
      'comment':
          'Very professional and responsive. Highly recommended for any design work.',
      'timeAgo': '1 week ago',
      'avatarInitial': 'D',
    },
    {
      'id': 'r3',
      'name': 'Olivia Ngo',
      'rating': 5.0,
      'comment':
          'Amazing results! Understood my vision immediately and executed perfectly.',
      'timeAgo': '2 weeks ago',
      'avatarInitial': 'O',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final avgRating =
        _reviewMaps.fold<double>(0, (sum, r) => sum + (r['rating'] as double)) /
        _reviewMaps.length;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Ratings & Reviews',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              GestureDetector(
                onTap: () {},
                child: Text(
                  'See All',
                  style: theme.textTheme.labelMedium?.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        // Aggregate score + review cards in horizontal scroll
        SizedBox(
          height: 120,
          child: ListView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            children: [
              // Aggregate score card
              Container(
                width: 110,
                margin: const EdgeInsets.only(right: 12),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.outline.withAlpha(128)),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      avgRating.toStringAsFixed(1),
                      style: theme.textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(
                        5,
                        (i) => Icon(
                          i < avgRating.round()
                              ? Icons.star_rounded
                              : Icons.star_outline_rounded,
                          size: 13,
                          color: AppColors.warning,
                        ),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${_reviewMaps.length * 72} reviews',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: AppColors.textMuted,
                        fontSize: 10,
                      ),
                    ),
                  ],
                ),
              ),
              // Individual review cards
              ..._reviewMaps.map((r) => _ReviewCard(review: r)),
            ],
          ),
        ),
      ],
    );
  }
}

class _ReviewCard extends StatelessWidget {
  final Map<String, dynamic> review;

  const _ReviewCard({required this.review});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      width: 200,
      margin: const EdgeInsets.only(right: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.outline.withAlpha(128)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.primaryContainer,
                ),
                child: Center(
                  child: Text(
                    review['avatarInitial'] as String,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: AppColors.primary,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      review['name'] as String,
                      style: theme.textTheme.labelSmall?.copyWith(
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    StarRating(
                      rating: review['rating'] as double,
                      showCount: false,
                      size: 11,
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Expanded(
            child: Text(
              review['comment'] as String,
              style: theme.textTheme.bodySmall?.copyWith(
                color: AppColors.textSecondary,
                height: 1.4,
                fontSize: 11,
              ),
              maxLines: 3,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            review['timeAgo'] as String,
            style: theme.textTheme.bodySmall?.copyWith(
              color: AppColors.textMuted,
              fontSize: 10,
            ),
          ),
        ],
      ),
    );
  }
}
