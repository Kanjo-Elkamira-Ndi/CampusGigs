import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../controllers/worker/profile_controller.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_dimensions.dart';
import '../../../core/mocks/mock_data.dart';

class WorkerProfilePage extends ConsumerWidget {
  const WorkerProfilePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profileAsync = ref.watch(workerProfileProvider);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit_outlined),
            onPressed: () => context.push('/worker/profile/edit'),
          ),
        ],
      ),
      body: profileAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('$e')),
        data: (profile) {
          final initials = (profile['name'] as String)
              .split(' ')
              .map((w) => w.isNotEmpty ? w[0] : '')
              .take(2)
              .join();
          final skills = profile['skills'] as List<dynamic>;
          final reviews = MockData.workerReviews;
          final rating = (profile['rating'] as num).toDouble();
          final reviewCount = profile['reviewCount'] as int;
          final profileStrength = (profile['profileStrength'] as num).toDouble();

          return CustomScrollView(
            slivers: [
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.only(top: AppDimensions.xl),
                  child: Column(
                    children: [
                      CircleAvatar(
                        radius: 48,
                        backgroundColor: AppColors.primaryLight,
                        child: Text(
                          initials,
                          style: theme.textTheme.displaySmall?.copyWith(color: AppColors.primary),
                        ),
                      ),
                      const SizedBox(height: AppDimensions.md),
                      Text(profile['name'] as String, style: theme.textTheme.headlineSmall?.copyWith(color: AppColors.textPrimary)),
                      const SizedBox(height: AppDimensions.xs),
                      Text(
                        '${profile['university']} · ${profile['degree']}',
                        style: theme.textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary),
                      ),
                      const SizedBox(height: AppDimensions.sm),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.primaryLight,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          profile['yearOfStudy'] as String,
                          style: theme.textTheme.labelSmall?.copyWith(color: AppColors.primary),
                        ),
                      ),
                      const SizedBox(height: AppDimensions.md),
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.star_rounded, size: 18, color: AppColors.warning),
                          const SizedBox(width: AppDimensions.xs),
                          Text(rating.toStringAsFixed(1), style: theme.textTheme.bodyMedium?.copyWith(color: AppColors.textPrimary)),
                          const SizedBox(width: AppDimensions.xs),
                          Text('($reviewCount reviews)', style: theme.textTheme.bodySmall?.copyWith(color: AppColors.textMuted)),
                        ],
                      ),
                      const SizedBox(height: AppDimensions.sm),
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            'Profile ${(profileStrength * 100).round()}% complete',
                            style: theme.textTheme.bodySmall?.copyWith(color: AppColors.textSecondary),
                          ),
                          const SizedBox(width: AppDimensions.sm),
                          SizedBox(
                            width: 200,
                            child: LinearProgressIndicator(
                              value: profileStrength,
                              color: AppColors.primary,
                              backgroundColor: AppColors.primaryLight,
                              borderRadius: BorderRadius.circular(4),
                              minHeight: 6,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppDimensions.xl),
                    ],
                  ),
                ),
              ),
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: AppDimensions.base),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    Row(
                      children: [
                        Expanded(child: _StatCard(label: 'Completed Gigs', value: '${profile['completedGigs']}', theme: theme)),
                        const SizedBox(width: AppDimensions.sm),
                        Expanded(child: _StatCard(label: 'Total Earned', value: _formatXaf(profile['totalEarned'] as int), theme: theme)),
                        const SizedBox(width: AppDimensions.sm),
                        Expanded(child: _StatCard(label: 'Member Since', value: (profile['memberSince'] as String).split('-')[0], theme: theme)),
                      ],
                    ),
                    const SizedBox(height: AppDimensions.xl),
                    Text('About', style: theme.textTheme.titleMedium?.copyWith(color: AppColors.textPrimary)),
                    const SizedBox(height: AppDimensions.sm),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(AppDimensions.base),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.border, width: 0.8),
                      ),
                      child: Text(profile['bio'] as String, style: theme.textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary)),
                    ),
                    const SizedBox(height: AppDimensions.xl),
                    Text('Skills', style: theme.textTheme.titleMedium?.copyWith(color: AppColors.textPrimary)),
                    const SizedBox(height: AppDimensions.sm),
                    Wrap(
                      spacing: AppDimensions.sm,
                      runSpacing: AppDimensions.sm,
                      children: skills.map((s) {
                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: AppColors.primaryLight,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(s as String, style: theme.textTheme.labelMedium?.copyWith(color: AppColors.primary)),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: AppDimensions.xl),
                    Row(
                      children: [
                        Text('Reviews (${reviews.length})', style: theme.textTheme.titleMedium?.copyWith(color: AppColors.textPrimary)),
                        const Spacer(),
                        TextButton(
                          onPressed: () => context.push('/worker/profile/reviews'),
                          child: const Text('See all'),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppDimensions.sm),
                    ...reviews.take(2).map((r) => _ReviewTile(review: r, theme: theme)),
                    const SizedBox(height: AppDimensions.xxxl),
                  ]),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  String _formatXaf(int amount) {
    if (amount >= 1000) {
      return '${(amount / 1000).toStringAsFixed(0)}K';
    }
    return '$amount';
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final ThemeData theme;
  const _StatCard({required this.label, required this.value, required this.theme});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border, width: 0.8),
      ),
      child: Column(
        children: [
          Text(value, style: theme.textTheme.titleLarge?.copyWith(color: AppColors.primary)),
          const SizedBox(height: AppDimensions.xs),
          Text(label, style: theme.textTheme.labelSmall?.copyWith(color: AppColors.textMuted)),
        ],
      ),
    );
  }
}

class _ReviewTile extends StatelessWidget {
  final Map<String, dynamic> review;
  final ThemeData theme;
  const _ReviewTile({required this.review, required this.theme});

  @override
  Widget build(BuildContext context) {
    final rating = review['rating'] as int;
    final initials = (review['reviewerName'] as String)
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
            children: [
              CircleAvatar(
                radius: 16,
                backgroundColor: AppColors.primaryLight,
                child: Text(initials, style: theme.textTheme.bodySmall?.copyWith(color: AppColors.primary)),
              ),
              const SizedBox(width: AppDimensions.sm),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(review['reviewerName'] as String, style: theme.textTheme.titleSmall?.copyWith(color: AppColors.textPrimary)),
                    Text(review['gigTitle'] as String, style: theme.textTheme.labelSmall?.copyWith(color: AppColors.textMuted)),
                  ],
                ),
              ),
              Row(
                children: List.generate(5, (i) {
                  return Icon(
                    Icons.star_rounded,
                    size: 14,
                    color: i < rating ? AppColors.warning : AppColors.border,
                  );
                }),
              ),
            ],
          ),
          const SizedBox(height: AppDimensions.sm),
          Text(
            review['comment'] as String,
            style: theme.textTheme.bodySmall?.copyWith(color: AppColors.textSecondary),
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
