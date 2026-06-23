import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_dimensions.dart';
import '../../../core/mocks/mock_data.dart';
import '../../../widgets/worker/category_chip.dart';
import '../../../widgets/worker/application_tile.dart';
import '../../../widgets/common/empty_states/empty_state.dart';

class MyApplicationsPage extends StatefulWidget {
  const MyApplicationsPage({super.key});

  @override
  State<MyApplicationsPage> createState() => _MyApplicationsPageState();
}

class _MyApplicationsPageState extends State<MyApplicationsPage> {
  String _selectedFilter = 'All';

  final _filters = ['All', 'Pending', 'Accepted', 'Rejected'];

  List<MockApplication> get _filteredApps {
    if (_selectedFilter == 'All') return MockData.applications;
    return MockData.applications.where((a) => a.status == _selectedFilter).toList();
  }

  @override
  Widget build(BuildContext context) {
    final apps = _filteredApps;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(kToolbarHeight),
        child: Container(
          decoration: const BoxDecoration(
            color: AppColors.surface,
            border: Border(
              bottom: BorderSide(color: AppColors.border, width: 0.8),
            ),
          ),
          child: AppBar(
            backgroundColor: AppColors.surface,
            elevation: 0,
            scrolledUnderElevation: 0,
            title: const Text('My Applications'),
            titleTextStyle: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
        ),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(
              AppDimensions.base,
              AppDimensions.md,
              AppDimensions.base,
              AppDimensions.sm,
            ),
            child: SizedBox(
              height: 36,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _filters.length,
                separatorBuilder: (_, _) => const SizedBox(width: 8),
                itemBuilder: (context, index) => CategoryChip(
                  label: _filters[index],
                  isSelected: _selectedFilter == _filters[index],
                  onTap: () => setState(() => _selectedFilter = _filters[index]),
                ),
              ),
            ),
          ),
          Expanded(
            child: apps.isEmpty
                ? EmptyState.noApplications()
                : ListView.separated(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppDimensions.base,
                      vertical: AppDimensions.sm,
                    ),
                    itemCount: apps.length,
                    separatorBuilder: (_, _) => const SizedBox(height: 10),
                    itemBuilder: (context, index) => ApplicationTile(
                      application: apps[index],
                      onTap: () => Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => _ApplicationDetailPage(application: apps[index]),
                        ),
                      ),
                    ).animate()
                        .fadeIn(duration: 250.ms)
                        .slideY(begin: 0.04, end: 0, duration: 280.ms, delay: (40 * index).ms),
                  ),
          ),
        ],
      ),
    );
  }
}

class _ApplicationDetailPage extends StatelessWidget {
  final MockApplication application;

  const _ApplicationDetailPage({required this.application});

  Color _statusColor(String status) {
    switch (status) {
      case 'PENDING': return AppColors.warning;
      case 'ACCEPTED': return AppColors.success;
      case 'REJECTED': return AppColors.error;
      default: return AppColors.textMuted;
    }
  }

  Color _statusBgColor(String status) {
    switch (status) {
      case 'PENDING': return AppColors.warningLight;
      case 'ACCEPTED': return AppColors.successLight;
      case 'REJECTED': return AppColors.errorLight;
      default: return const Color(0xFFF3F4F6);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(kToolbarHeight),
        child: Container(
          decoration: const BoxDecoration(
            color: AppColors.surface,
            border: Border(
              bottom: BorderSide(color: AppColors.border, width: 0.8),
            ),
          ),
          child: AppBar(
            backgroundColor: AppColors.surface,
            elevation: 0,
            scrolledUnderElevation: 0,
            title: const Text('Application'),
            titleTextStyle: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppDimensions.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(AppDimensions.base),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'GIG',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: AppColors.textMuted,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    application.gigTitle,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: AppDimensions.base),
                  const Divider(height: 1, color: AppColors.border),
                  const SizedBox(height: AppDimensions.base),
                  Row(
                    children: [
                      Text(
                        'Status',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppColors.textMuted,
                        ),
                      ),
                      const Spacer(),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: _statusBgColor(application.status),
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Text(
                          MockData.statusLabel(application.status),
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: _statusColor(application.status),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppDimensions.md),
                  Row(
                    children: [
                      Text(
                        'Applied',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppColors.textMuted,
                        ),
                      ),
                      const Spacer(),
                      Text(
                        MockData.relativeTime(application.appliedAt),
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppDimensions.md),
                  Row(
                    children: [
                      Text(
                        'Proposed budget',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppColors.textMuted,
                        ),
                      ),
                      const Spacer(),
                      Text(
                        MockData.formatXAF(application.proposedBudget),
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppDimensions.lg),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(AppDimensions.base),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'COVER LETTER',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: AppColors.textMuted,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: AppDimensions.sm),
                  Text(
                    application.coverLetter,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppColors.textSecondary,
                      height: 1.5,
                    ),
                  ),
                ],
              ),
            ),
            if (application.status == 'PENDING') ...[
              const SizedBox(height: AppDimensions.xxl),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: FilledButton(
                  onPressed: () async {
                    final confirmed = await showDialog<bool>(
                      context: context,
                      builder: (ctx) => AlertDialog(
                        backgroundColor: AppColors.surface,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                        title: Text(
                          'Withdraw application?',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        content: Text(
                          'Are you sure you want to withdraw your application for "${application.gigTitle}"? This action cannot be undone.',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: AppColors.textSecondary,
                          ),
                        ),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.of(ctx).pop(false),
                            child: Text('Cancel', style: TextStyle(color: AppColors.textSecondary)),
                          ),
                          FilledButton(
                            onPressed: () => Navigator.of(ctx).pop(true),
                            style: FilledButton.styleFrom(
                              backgroundColor: AppColors.error,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            child: const Text('Withdraw'),
                          ),
                        ],
                      ),
                    );
                    if (confirmed == true && context.mounted) {
                      Navigator.of(context).pop();
                    }
                  },
                  style: FilledButton.styleFrom(
                    backgroundColor: AppColors.error,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text('Withdraw application'),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
