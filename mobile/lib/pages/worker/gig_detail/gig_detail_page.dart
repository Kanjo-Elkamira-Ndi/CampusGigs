import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_dimensions.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/mocks/mock_data.dart';
import '../../../widgets/common/buttons/app_button.dart';

class GigDetailPage extends StatefulWidget {
  final String gigId;

  const GigDetailPage({super.key, required this.gigId});

  @override
  State<GigDetailPage> createState() => _GigDetailPageState();
}

class _GigDetailPageState extends State<GigDetailPage> {
  MockGig? get _gig {
    try {
      return MockData.gigs.firstWhere((g) => g.id == widget.gigId);
    } catch (_) {
      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    final gig = _gig;
    if (gig == null) {
      return Scaffold(
        backgroundColor: AppColors.background,
        body: Center(child: Text('Gig not found', style: Theme.of(context).textTheme.bodyMedium)),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              SliverAppBar(
                expandedHeight: 200,
                pinned: true,
                backgroundColor: AppColors.surface,
                surfaceTintColor: Colors.transparent,
                flexibleSpace: FlexibleSpaceBar(
                  background: Container(
                    color: AppColors.primaryLight,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(_categoryIcon(gig.categoryName), size: 48, color: AppColors.primary),
                        const SizedBox(height: AppDimensions.sm),
                        Text(
                          gig.categoryName,
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                  title: Text(
                    gig.title,
                    style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ),
                leading: IconButton(
                  icon: const Icon(Icons.arrow_back),
                  onPressed: () => context.pop(),
                ),
              ),
              SliverToBoxAdapter(
                child: Container(
                  color: AppColors.surface,
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(AppDimensions.lg, AppDimensions.xl, AppDimensions.lg, 100),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          gig.title,
                          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: AppDimensions.base),
                        Row(
                          children: [
                            _UniversityBadge(university: gig.university),
                            const Spacer(),
                            _BudgetChip(amount: gig.budget),
                          ],
                        ),
                        const SizedBox(height: AppDimensions.base),
                        const Divider(height: 1, color: AppColors.border),
                        const SizedBox(height: AppDimensions.base),
                        Text(
                          'About this gig',
                          style: Theme.of(context).textTheme.titleSmall?.copyWith(
                            fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: AppDimensions.sm),
                        Text(
                          gig.description,
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: AppColors.textSecondary,
                            height: 1.5,
                          ),
                        ),
                        const SizedBox(height: AppDimensions.lg),
                        Text(
                          'Skills required',
                          style: Theme.of(context).textTheme.titleSmall?.copyWith(
                            fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 10),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: gig.skills.map((s) => Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: AppColors.primaryLight,
                              borderRadius: BorderRadius.circular(AppRadius.full),
                            ),
                            child: Text(
                              s,
                              style: Theme.of(context).textTheme.labelSmall?.copyWith(
                                fontSize: 12,
                                color: AppColors.primary,
                              ),
                            ),
                          )).toList(),
                        ),
                        const SizedBox(height: AppDimensions.lg),
                        Text(
                          'Posted by',
                          style: Theme.of(context).textTheme.titleSmall?.copyWith(
                            fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 10),
                        Container(
                          padding: const EdgeInsets.all(AppDimensions.base),
                          decoration: BoxDecoration(
                            color: AppColors.surface,
                            borderRadius: BorderRadius.circular(AppRadius.md),
                          ),
                          child: Row(
                            children: [
                              CircleAvatar(
                                radius: 22,
                                backgroundColor: AppColors.primaryLight,
                                child: const Icon(Icons.person, size: 20, color: AppColors.primary),
                              ),
                              const SizedBox(width: AppDimensions.md),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    gig.posterName,
                                    style: Theme.of(context).textTheme.titleSmall?.copyWith(
                                      fontWeight: FontWeight.w600,
                                      color: AppColors.textPrimary,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    'Poster',
                                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                      color: AppColors.textMuted,
                                    ),
                                  ),
                                ],
                              ),
                              const Spacer(),
                              const Row(
                                children: [
                                  Icon(Icons.star, size: 16, color: AppColors.amber),
                                  SizedBox(width: 2),
                                  Text('4.8', style: TextStyle(fontSize: 13, color: AppColors.textMuted)),
                                ],
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: AppDimensions.lg),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF3F4F6),
                                borderRadius: BorderRadius.circular(AppRadius.full),
                              ),
                              child: Text(
                                '${gig.applicantCount} applicants',
                                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                  color: AppColors.textMuted,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                            const Padding(
                              padding: EdgeInsets.symmetric(horizontal: AppDimensions.sm),
                              child: Text('\u00B7', style: TextStyle(color: AppColors.textMuted)),
                            ),
                            Text(
                              'Deadline: ${gig.deadline}',
                              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: AppColors.textMuted,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              decoration: const BoxDecoration(
                color: AppColors.surface,
                border: Border(
                  top: BorderSide(color: AppColors.border, width: 0.8),
                ),
              ),
              padding: const EdgeInsets.fromLTRB(AppDimensions.lg, AppDimensions.md, AppDimensions.lg, AppDimensions.lg),
              child: Row(
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Budget',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppColors.textMuted,
                        ),
                      ),
                      Text(
                        MockData.formatXAF(gig.budget),
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w600,
                          color: AppColors.primary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(width: AppDimensions.md),
                  Expanded(
                    child: AppButton(
                      label: 'Apply Now',
                      onPressed: () => _showApplySheet(context, gig),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  IconData _categoryIcon(String name) {
    switch (name) {
      case 'Design': return Icons.palette;
      case 'Writing': return Icons.edit_note;
      case 'Tech': return Icons.code;
      case 'Teaching': return Icons.school;
      default: return Icons.work;
    }
  }

  void _showApplySheet(BuildContext context, MockGig gig) {
    final coverLetterController = TextEditingController();
    final budgetController = TextEditingController();
    String availability = 'Immediately';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.xl)),
      ),
      builder: (sheetContext) {
        return Padding(
          padding: EdgeInsets.only(
            left: AppDimensions.lg,
            right: AppDimensions.lg,
            top: AppDimensions.base,
            bottom: MediaQuery.of(sheetContext).viewInsets.bottom + AppDimensions.lg,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 36,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppColors.border,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: AppDimensions.base),
              Text(
                'Apply for this gig',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: AppDimensions.base),
              TextField(
                controller: coverLetterController,
                maxLines: 4,
                decoration: InputDecoration(
                  labelText: 'Cover letter',
                  hintText: 'Describe your experience...',
                  labelStyle: TextStyle(color: AppColors.textMuted),
                  hintStyle: TextStyle(color: AppColors.textMuted.withValues(alpha: 0.6)),
                  filled: true,
                  fillColor: AppColors.background,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppRadius.md),
                    borderSide: const BorderSide(color: AppColors.border),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppRadius.md),
                    borderSide: const BorderSide(color: AppColors.border),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppRadius.md),
                    borderSide: const BorderSide(color: AppColors.primary),
                  ),
                ),
              ),
              const SizedBox(height: AppDimensions.base),
              TextField(
                controller: budgetController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText: 'Proposed budget (XAF)',
                  labelStyle: TextStyle(color: AppColors.textMuted),
                  filled: true,
                  fillColor: AppColors.background,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppRadius.md),
                    borderSide: const BorderSide(color: AppColors.border),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppRadius.md),
                    borderSide: const BorderSide(color: AppColors.border),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppRadius.md),
                    borderSide: const BorderSide(color: AppColors.primary),
                  ),
                ),
              ),
              const SizedBox(height: AppDimensions.base),
              DropdownButtonFormField<String>(
                initialValue: availability,
                decoration: InputDecoration(
                  labelText: 'Availability',
                  labelStyle: TextStyle(color: AppColors.textMuted),
                  filled: true,
                  fillColor: AppColors.background,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppRadius.md),
                    borderSide: const BorderSide(color: AppColors.border),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppRadius.md),
                    borderSide: const BorderSide(color: AppColors.border),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppRadius.md),
                    borderSide: const BorderSide(color: AppColors.primary),
                  ),
                ),
                items: ['Immediately', 'Within 3 days', 'Within a week'].map((a) => DropdownMenuItem(value: a, child: Text(a))).toList(),
                onChanged: (v) => availability = v ?? 'Immediately',
              ),
              const SizedBox(height: AppDimensions.xl),
              AppButton(
                label: 'Submit application',
                onPressed: () {
                  Navigator.of(sheetContext).pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: const Text('Application submitted!'),
                      backgroundColor: AppColors.success,
                      behavior: SnackBarBehavior.floating,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.sm)),
                    ),
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }
}

class _UniversityBadge extends StatelessWidget {
  final String university;

  const _UniversityBadge({required this.university});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Icon(Icons.school_outlined, size: 12, color: AppColors.textMuted),
        const SizedBox(width: 4),
        Text(university, style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppColors.textMuted)),
      ],
    );
  }
}

class _BudgetChip extends StatelessWidget {
  final int amount;

  const _BudgetChip({required this.amount});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.primaryLight,
        borderRadius: BorderRadius.circular(AppRadius.full),
      ),
      child: Text(
        MockData.formatXAF(amount),
        style: TextStyle(
          fontSize: 13,
          fontWeight: FontWeight.w600,
          color: AppColors.primary,
        ),
      ),
    );
  }
}
