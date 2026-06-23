import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_dimensions.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/mocks/mock_data.dart';
import '../../../controllers/poster/dashboard_controller.dart';
import '../../../controllers/poster/gig_management_controller.dart';
import '../../../widgets/poster/poster_gig_card.dart';

class PosterDashboardPage extends ConsumerWidget {
  const PosterDashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final statsAsync = ref.watch(posterDashboardProvider);
    final gigsAsync = ref.watch(gigManagementProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: statsAsync.when(
        loading: () => const _DashboardShimmer(),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (stats) {
          final recentGigs = gigsAsync.valueOrNull ?? MockData.posterGigs;
          final monthly = (stats['monthlySpend'] as List<dynamic>).cast<double>();

          return CustomScrollView(
            slivers: [
              SliverAppBar(
                pinned: false,
                floating: true,
                expandedHeight: 120,
                backgroundColor: AppColors.surface,
                surfaceTintColor: Colors.transparent,
                flexibleSpace: FlexibleSpaceBar(
                  background: Padding(
                    padding: const EdgeInsets.fromLTRB(AppDimensions.base, 60, AppDimensions.base, 0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Good morning, Alex \u{1F44B}',
                          style: Theme.of(context).textTheme.displaySmall?.copyWith(
                            fontSize: 28,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'You have ${stats['pendingReviews']} pending review${stats['pendingReviews'] == 1 ? '' : 's'}',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(AppDimensions.base),
                  child: GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    mainAxisSpacing: AppDimensions.md,
                    crossAxisSpacing: AppDimensions.md,
                    childAspectRatio: 1.6,
                    children: [
                      _StatCard(
                        icon: Icons.work_rounded,
                        value: '${stats['totalGigs']}',
                        label: 'Total Gigs',
                      ),
                      _StatCard(
                        icon: Icons.trending_up_rounded,
                        value: '${stats['activeGigs']}',
                        label: 'Active Gigs',
                      ),
                      _StatCard(
                        icon: Icons.people_rounded,
                        value: '${stats['totalApplicants']}',
                        label: 'Total Applicants',
                      ),
                      _StatCard(
                        icon: Icons.check_circle_rounded,
                        value: '${stats['completedGigs']}',
                        label: 'Completed',
                      ),
                    ],
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: AppDimensions.base),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Spend Overview',
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: AppDimensions.md),
                      Container(
                        height: 160,
                        padding: const EdgeInsets.all(AppDimensions.base),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(AppRadius.lg),
                          border: Border.all(color: AppColors.border, width: 0.8),
                        ),
                        child: _SpendChart(data: monthly),
                      ),
                    ],
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(
                    AppDimensions.base, AppDimensions.xl,
                    AppDimensions.base, AppDimensions.sm,
                  ),
                  child: Row(
                    children: [
                      Text(
                        'Recent Gigs',
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const Spacer(),
                      TextButton(
                        onPressed: () => context.go('/poster/gigs'),
                        child: const Text('View all', style: TextStyle(fontSize: 13, color: AppColors.primary)),
                      ),
                    ],
                  ),
                ),
              ),
              SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    if (index >= recentGigs.length) return null;
                    return Padding(
                      padding: const EdgeInsets.symmetric(horizontal: AppDimensions.base, vertical: 6),
                      child: PosterGigCard(
                        gig: recentGigs[index],
                        animationDelay: index,
                      ),
                    );
                  },
                  childCount: recentGigs.length,
                ),
              ),
              const SliverToBoxAdapter(child: SizedBox(height: AppDimensions.xxl)),
            ],
          );
        },
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;

  const _StatCard({required this.icon, required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppDimensions.base),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.border, width: 0.8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: const BoxDecoration(
              color: AppColors.primaryLight,
              shape: BoxShape.circle,
            ),
            child: Icon(icon, size: 22, color: AppColors.primary),
          ),
          const Spacer(),
          Text(
            value,
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          Text(
            label,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}

class _SpendChart extends StatelessWidget {
  final List<double> data;

  const _SpendChart({required this.data});

  @override
  Widget build(BuildContext context) {
    return BarChart(
      BarChartData(
        alignment: BarChartAlignment.spaceAround,
        maxY: data.reduce((a, b) => a > b ? a : b) * 1.2,
        barGroups: data.asMap().entries.map((e) => BarChartGroupData(
          x: e.key,
          barRods: [
            BarChartRodData(
              toY: e.value,
              color: AppColors.primary,
              width: 18,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(4)),
            ),
          ],
        )).toList(),
        gridData: FlGridData(
          show: true,
          drawVerticalLine: false,
          horizontalInterval: (data.reduce((a, b) => a > b ? a : b) / 4).ceilToDouble(),
          getDrawingHorizontalLine: (value) => FlLine(color: AppColors.border, strokeWidth: 0.5),
        ),
        borderData: FlBorderData(show: false),
        titlesData: FlTitlesData(
          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              getTitlesWidget: (value, meta) {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
                if (value >= 0 && value < months.length) {
                  return Padding(
                    padding: const EdgeInsets.only(top: 8),
                    child: Text(months[value.toInt()], style: const TextStyle(fontSize: 10, color: AppColors.textMuted)),
                  );
                }
                return const SizedBox.shrink();
              },
            ),
          ),
        ),
      ),
    );
  }
}

class _DashboardShimmer extends StatelessWidget {
  const _DashboardShimmer();

  @override
  Widget build(BuildContext context) {
    return const Center(child: CircularProgressIndicator());
  }
}
