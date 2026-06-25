import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_dimensions.dart';
import '../../../core/theme/app_radius.dart';
import '../../../controllers/poster/gig_management_controller.dart';
import '../../../controllers/poster/applicant_controller.dart';
import '../../../widgets/poster/gig_status_badge.dart';
import '../../../widgets/poster/applicant_card.dart';
import '../../../widgets/common/empty_states/empty_state.dart';

class PosterGigDetailPage extends ConsumerWidget {
  final String gigId;

  const PosterGigDetailPage({super.key, required this.gigId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final gigsAsync = ref.watch(gigManagementProvider);
    final applicantsAsync = ref.watch(applicantProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: gigsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (gigs) {
          final gig = gigs.where((g) => g.id == gigId).firstOrNull;
          if (gig == null) {
            return const Center(child: Text('Gig not found'));
          }

          final gigApplicants = applicantsAsync.valueOrNull?.where((a) => a.gigId == gigId).toList() ?? [];
          final catName = gig.category['name'] as String? ?? '';
          final iconData = catName == 'Design' ? Icons.palette : catName == 'Tech' ? Icons.code : catName == 'Writing' ? Icons.edit_note : Icons.work;

          return CustomScrollView(
            slivers: [
              SliverAppBar(
                pinned: true,
                expandedHeight: 200,
                backgroundColor: AppColors.surface,
                surfaceTintColor: Colors.transparent,
                flexibleSpace: FlexibleSpaceBar(
                  background: Container(
                    color: AppColors.primaryLight,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(iconData, size: 48, color: AppColors.primary),
                        const SizedBox(height: AppDimensions.sm),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: AppDimensions.base),
                          child: Text(
                            gig.title,
                            textAlign: TextAlign.center,
                            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                              fontWeight: FontWeight.w700,
                              color: AppColors.textPrimary,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(height: AppDimensions.sm),
                        GigStatusBadge(status: gig.status),
                      ],
                    ),
                  ),
                ),
                leading: IconButton(
                  icon: const Icon(Icons.arrow_back),
                  onPressed: () => context.pop(),
                ),
                actions: [
                  IconButton(
                    icon: const Icon(Icons.edit_outlined, color: AppColors.primary),
                    onPressed: () => context.push('/poster/gigs/$gigId/edit'),
                  ),
                ],
              ),
              SliverToBoxAdapter(
                child: Container(
                  color: AppColors.surface,
                  child: Padding(
                    padding: const EdgeInsets.all(AppDimensions.lg),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(AppDimensions.base),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(AppRadius.md),
                            border: Border.all(color: AppColors.border, width: 0.8),
                          ),
                          child: Row(
                            children: [
                              _infoCell(context, 'Budget', '${gig.budget} XAF'),
                              Container(width: 1, height: 40, color: AppColors.border),
                              _infoCell(context, 'Deadline', gig.deadline ?? 'Flexible'),
                              Container(width: 1, height: 40, color: AppColors.border),
                              _infoCell(context, 'Cat.', catName),
                              Container(width: 1, height: 40, color: AppColors.border),
                              _infoCell(context, 'Uni.', gig.university),
                            ],
                          ),
                        ),
                        const SizedBox(height: AppDimensions.lg),
                        Text('About this Gig', style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                        const SizedBox(height: AppDimensions.sm),
                        Text(gig.description, style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary, height: 1.5)),
                        if (gig.skills.isNotEmpty) ...[
                          const SizedBox(height: AppDimensions.lg),
                          Text('Skills', style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                          const SizedBox(height: 10),
                          Wrap(spacing: 8, runSpacing: 8, children: gig.skills.map((s) => Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(color: AppColors.primaryLight, borderRadius: BorderRadius.circular(AppRadius.full)),
                            child: Text(s, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: AppColors.primary)),
                          )).toList()),
                        ],
                        const SizedBox(height: AppDimensions.xl),
                        Text('Applicants (${gigApplicants.length})', style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                        const SizedBox(height: AppDimensions.md),
                      ],
                    ),
                  ),
                ),
              ),
              SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    if (index >= gigApplicants.length) return null;
                    return Padding(
                      padding: const EdgeInsets.symmetric(horizontal: AppDimensions.base, vertical: 6),
                      child: ApplicantCard(
                        app: gigApplicants[index],
                        onAccept: () async {
                          await ref.read(applicantProvider.notifier).acceptApplicant(gigApplicants[index].id);
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                              content: Text('${gigApplicants[index].applicantName} accepted'),
                              backgroundColor: AppColors.success, behavior: SnackBarBehavior.floating,
                            ));
                          }
                        },
                        onReject: () async {
                          await ref.read(applicantProvider.notifier).rejectApplicant(gigApplicants[index].id);
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                              content: Text('${gigApplicants[index].applicantName} rejected'),
                              backgroundColor: AppColors.error, behavior: SnackBarBehavior.floating,
                            ));
                          }
                        },
                      ),
                    );
                  },
                  childCount: gigApplicants.length,
                ),
              ),
              if (gigApplicants.isEmpty)
                SliverToBoxAdapter(
                  child: Container(
                    color: AppColors.surface,
                    padding: const EdgeInsets.only(bottom: AppDimensions.xxl),
                    child: const EmptyState(
                      icon: Icons.people_outline,
                      title: 'No applicants yet',
                      subtitle: 'Applicants will appear once the gig is posted',
                    ),
                  ),
                ),
              const SliverToBoxAdapter(child: SizedBox(height: AppDimensions.xxl)),
            ],
          );
        },
      ),
    );
  }

  Widget _infoCell(BuildContext context, String label, String value) {
    return Expanded(
      child: Column(
        children: [
          Text(value, style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
          const SizedBox(height: 2),
          Text(label, style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppColors.textMuted)),
        ],
      ),
    );
  }
}
