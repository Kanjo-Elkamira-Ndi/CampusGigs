import 'package:flutter/material.dart';
import '../../../core/mocks/mock_data.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_dimensions.dart';

class WorkerReviewsPage extends StatelessWidget {
  const WorkerReviewsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final reviews = MockData.workerReviews;
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: const Text('My Reviews')),
      body: reviews.isEmpty
          ? Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.star_outline_rounded, size: 48, color: AppColors.textMuted),
                  const SizedBox(height: AppDimensions.base),
                  Text('No reviews yet', style: theme.textTheme.titleMedium?.copyWith(color: AppColors.textMuted)),
                  const SizedBox(height: AppDimensions.sm),
                  Text('Complete gigs to receive reviews.', style: theme.textTheme.bodySmall?.copyWith(color: AppColors.textSecondary)),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(AppDimensions.base),
              itemCount: reviews.length,
              itemBuilder: (_, i) {
                final r = reviews[i];
                final rating = r['rating'] as int;
                final initials = (r['reviewerName'] as String)
                    .split(' ')
                    .map((w) => w.isNotEmpty ? w[0] : '')
                    .take(2)
                    .join();

                return Container(
                  margin: const EdgeInsets.only(bottom: AppDimensions.sm),
                  padding: const EdgeInsets.all(AppDimensions.base),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.border, width: 0.8),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          CircleAvatar(
                            radius: 20,
                            backgroundColor: AppColors.primaryLight,
                            child: Text(initials, style: theme.textTheme.bodyMedium?.copyWith(color: AppColors.primary)),
                          ),
                          const SizedBox(width: AppDimensions.md),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(r['reviewerName'] as String, style: theme.textTheme.titleSmall?.copyWith(color: AppColors.textPrimary)),
                                Text(r['gigTitle'] as String, style: theme.textTheme.labelSmall?.copyWith(color: AppColors.textMuted)),
                                Text(r['createdAt'] as String, style: theme.textTheme.labelSmall?.copyWith(color: AppColors.textMuted)),
                              ],
                            ),
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Row(
                                children: List.generate(5, (i) {
                                  return Icon(Icons.star_rounded, size: 14, color: i < rating ? AppColors.warning : AppColors.border);
                                }),
                              ),
                              const SizedBox(height: 2),
                              Text('$rating/5', style: theme.textTheme.labelSmall?.copyWith(color: AppColors.textMuted)),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: AppDimensions.sm),
                      Text(r['comment'] as String, style: theme.textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary)),
                    ],
                  ),
                );
              },
            ),
    );
  }
}
