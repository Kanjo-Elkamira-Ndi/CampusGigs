import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_dimensions.dart';
import '../../../core/theme/app_radius.dart';
import '../../../controllers/poster/applicant_controller.dart';
import '../../../widgets/poster/gig_status_badge.dart';
import '../../../widgets/common/buttons/app_button.dart';

class ApplicantDetailPage extends ConsumerWidget {
  final String applicationId;

  const ApplicantDetailPage({super.key, required this.applicationId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
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
            title: Text(appsAsync.valueOrNull?.where((a) => a.id == applicationId).firstOrNull?.applicantName ?? 'Applicant'),
            titleTextStyle: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.w600, color: AppColors.textPrimary,
            ),
          ),
        ),
      ),
      body: appsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (apps) {
          final app = apps.where((a) => a.id == applicationId).firstOrNull;
          if (app == null) return const Center(child: Text('Application not found'));

          return SingleChildScrollView(
            padding: const EdgeInsets.all(AppDimensions.base),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(AppDimensions.xl),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(AppRadius.lg),
                    border: Border.all(color: AppColors.border, width: 0.8),
                  ),
                  child: Column(
                    children: [
                      CircleAvatar(
                        radius: 40,
                        backgroundColor: AppColors.primaryLight,
                        child: Text(
                          _initials(app.applicantName),
                          style: Theme.of(context).textTheme.headlineSmall?.copyWith(color: AppColors.primary, fontWeight: FontWeight.w600),
                        ),
                      ),
                      const SizedBox(height: AppDimensions.md),
                      Text(app.applicantName, style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                      const SizedBox(height: 4),
                      Text(app.applicantUniversity, style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary)),
                      const SizedBox(height: AppDimensions.md),
                      GigStatusBadge(status: app.status),
                    ],
                  ),
                ),
                const SizedBox(height: AppDimensions.base),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(AppDimensions.base),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(AppRadius.lg),
                    border: Border.all(color: AppColors.border, width: 0.8),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Cover Letter', style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                      const SizedBox(height: AppDimensions.sm),
                      Text(app.coverLetter, style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary, height: 1.5)),
                      const SizedBox(height: AppDimensions.md),
                      Row(
                        children: [
                          Text('Proposed budget', style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppColors.textMuted)),
                          const Spacer(),
                          Text('${app.proposedBudget} XAF', style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600, color: AppColors.primary)),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppDimensions.base),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(AppDimensions.base),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(AppRadius.lg),
                    border: Border.all(color: AppColors.border, width: 0.8),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Applied For', style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppColors.textMuted)),
                      const SizedBox(height: AppDimensions.sm),
                      InkWell(
                        onTap: () => context.push('/poster/gigs/${app.gigId}'),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          decoration: BoxDecoration(
                            color: AppColors.primaryLight,
                            borderRadius: BorderRadius.circular(AppRadius.full),
                          ),
                          child: Text(app.gigTitle, style: const TextStyle(fontSize: 13, color: AppColors.primary, fontWeight: FontWeight.w500)),
                        ),
                      ),
                    ],
                  ),
                ),
                if (app.status == 'PENDING') ...[
                  const SizedBox(height: AppDimensions.xxl),
                  Row(
                    children: [
                      Expanded(
                        child: AppButton(
                          label: 'Reject',
                          variant: AppButtonVariant.destructive,
                          onPressed: () async {
                            await ref.read(applicantProvider.notifier).rejectApplicant(app.id);
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Applicant rejected'), backgroundColor: AppColors.error, behavior: SnackBarBehavior.floating));
                              context.pop();
                            }
                          },
                        ),
                      ),
                      const SizedBox(width: AppDimensions.md),
                      Expanded(
                        child: AppButton(
                          label: 'Accept',
                          onPressed: () async {
                            await ref.read(applicantProvider.notifier).acceptApplicant(app.id);
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Applicant accepted!'), backgroundColor: AppColors.success, behavior: SnackBarBehavior.floating));
                              context.pop();
                            }
                          },
                        ),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          );
        },
      ),
    );
  }

  String _initials(String name) {
    final parts = name.split(' ');
    if (parts.length >= 2) return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
    return name.isNotEmpty ? name[0].toUpperCase() : '?';
  }
}
