import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_dimensions.dart';
import '../../../controllers/poster/applicant_controller.dart';
import '../../../widgets/poster/applicant_card.dart';
import '../../../widgets/worker/category_chip.dart';
import '../../../widgets/common/loaders/app_loader.dart';
import '../../../widgets/common/empty_states/empty_state.dart';

class ApplicantsPage extends ConsumerStatefulWidget {
  const ApplicantsPage({super.key});

  @override
  ConsumerState<ApplicantsPage> createState() => _ApplicantsPageState();
}

class _ApplicantsPageState extends ConsumerState<ApplicantsPage> {
  String _selectedFilter = 'All';
  final _filters = ['All', 'Pending', 'Accepted', 'Rejected'];

  @override
  Widget build(BuildContext context) {
    final appsAsync = ref.watch(applicantProvider);

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
            title: const Text('All Applicants'),
            titleTextStyle: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
        ),
      ),
      body: appsAsync.when(
        loading: () => ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: 4,
          itemBuilder: (_, __) => Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const AppShimmerBox(width: 48, height: 48, radius: 24),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const AppShimmerBox(width: 160, height: 16),
                      const SizedBox(height: 6),
                      const AppShimmerBox(width: double.infinity, height: 14),
                      const SizedBox(height: 6),
                      const AppShimmerBox(width: 200, height: 32, radius: 16),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        error: (e, _) => EmptyState.error(
          onRetry: () => ref.invalidate(applicantProvider),
        ),
        data: (apps) {
          final filtered = _selectedFilter == 'All'
              ? apps
              : apps.where((a) => a.status == _selectedFilter.toUpperCase()).toList();

          return Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(AppDimensions.base, AppDimensions.md, AppDimensions.base, AppDimensions.sm),
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
                child: filtered.isEmpty
                    ? const EmptyState(
                        icon: Icons.people_outline_rounded,
                        title: 'No applicants yet',
                        subtitle: 'Applicants will appear here once you post a gig.',
                      )
                    : ListView.separated(
                        padding: const EdgeInsets.all(AppDimensions.base),
                        itemCount: filtered.length,
                        separatorBuilder: (_, _) => const SizedBox(height: 10),
                        itemBuilder: (context, index) => ApplicantCard(
                          app: filtered[index],
                          onTap: () => context.push('/poster/applicants/${filtered[index].id}'),
                          onAccept: () async {
                            await ref.read(applicantProvider.notifier).acceptApplicant(filtered[index].id);
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                                content: Text('${filtered[index].applicantName} accepted'),
                                backgroundColor: AppColors.success, behavior: SnackBarBehavior.floating,
                              ));
                            }
                          },
                          onReject: () async {
                            await ref.read(applicantProvider.notifier).rejectApplicant(filtered[index].id);
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                                content: Text('${filtered[index].applicantName} rejected'),
                                backgroundColor: AppColors.error, behavior: SnackBarBehavior.floating,
                              ));
                            }
                          },
                        ).animate().fadeIn(duration: 250.ms).slideY(begin: 0.04, end: 0, duration: 280.ms, delay: (40 * index).ms),
                      ),
              ),
            ],
          );
        },
      ),
    );
  }
}
