import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_dimensions.dart';
import '../../../controllers/poster/gig_management_controller.dart';
import '../../../widgets/poster/poster_gig_card.dart';
import '../../../widgets/worker/category_chip.dart';
import '../../../widgets/common/empty_states/empty_state.dart';
import '../../../widgets/common/dialogs/confirm_dialog.dart';
import '../../../widgets/common/buttons/app_button.dart';

class ManageGigsPage extends ConsumerStatefulWidget {
  const ManageGigsPage({super.key});

  @override
  ConsumerState<ManageGigsPage> createState() => _ManageGigsPageState();
}

class _ManageGigsPageState extends ConsumerState<ManageGigsPage> {
  String _selectedStatus = 'ALL';

  final _statuses = ['ALL', 'OPEN', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'CANCELLED'];

  @override
  Widget build(BuildContext context) {
    final gigsAsync = ref.watch(gigManagementProvider);

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
            title: const Text('My Gigs'),
            titleTextStyle: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
            actions: [
              IconButton(
                onPressed: () => context.push('/poster/gigs/create'),
                icon: const Icon(Icons.add_rounded, color: AppColors.primary),
              ),
            ],
          ),
        ),
      ),
      body: gigsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (gigs) {
          final filtered = _selectedStatus == 'ALL'
              ? gigs
              : gigs.where((g) => g.status == _selectedStatus).toList();

          return Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(
                  AppDimensions.base, AppDimensions.md,
                  AppDimensions.base, AppDimensions.sm,
                ),
                child: SizedBox(
                  height: 36,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: _statuses.length,
                    separatorBuilder: (_, _) => const SizedBox(width: 8),
                    itemBuilder: (context, index) {
                      final label = _statuses[index] == 'ALL' ? 'All' : _statusLabel(_statuses[index]);
                      return CategoryChip(
                        label: label,
                        isSelected: _selectedStatus == _statuses[index],
                        onTap: () => setState(() => _selectedStatus = _statuses[index]),
                      );
                    },
                  ),
                ),
              ),
              Expanded(
                child: filtered.isEmpty
                    ? EmptyState(
                        icon: Icons.work_off_outlined,
                        title: 'No gigs yet',
                        subtitle: 'Post your first gig to find talent',
                        action: AppButton(
                          label: 'Post a Gig',
                          onPressed: () => context.push('/poster/gigs/create'),
                        ),
                      )
                    : ListView.separated(
                        padding: const EdgeInsets.symmetric(horizontal: AppDimensions.base),
                        itemCount: filtered.length,
                        separatorBuilder: (_, _) => const SizedBox(height: 10),
                        itemBuilder: (context, index) => PosterGigCard(
                          gig: filtered[index],
                          onTap: () => context.push('/poster/gigs/${filtered[index].id}'),
                          onEdit: () => context.push('/poster/gigs/${filtered[index].id}/edit'),
                          onDelete: () async {
                            final confirmed = await showConfirmDialog(
                              context,
                              title: 'Delete Gig?',
                              message: 'This cannot be undone.',
                              confirmLabel: 'Delete',
                              isDestructive: true,
                            );
                            if (confirmed == true) {
                              ref.read(gigManagementProvider.notifier).deleteGig(filtered[index].id);
                            }
                          },
                          animationDelay: index,
                        ),
                      ),
              ),
            ],
          );
        },
      ),
    );
  }

  String _statusLabel(String status) {
    switch (status) {
      case 'OPEN': return 'Open';
      case 'IN_PROGRESS': return 'In Progress';
      case 'PAUSED': return 'Paused';
      case 'COMPLETED': return 'Completed';
      case 'CANCELLED': return 'Cancelled';
      default: return status;
    }
  }
}
