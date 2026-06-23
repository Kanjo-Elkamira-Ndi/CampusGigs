import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_dimensions.dart';
import '../../../core/mocks/mock_data.dart';
import '../../../widgets/worker/saved_gig_tile.dart';
import '../../../widgets/common/empty_states/empty_state.dart';

class SavedGigsPage extends StatefulWidget {
  const SavedGigsPage({super.key});

  @override
  State<SavedGigsPage> createState() => _SavedGigsPageState();
}

class _SavedGigsPageState extends State<SavedGigsPage> {
  final List<MockGig> _savedGigs = MockData.gigs.where((g) => g.isSaved).toList();

  void _unsave(MockGig gig) {
    final removedIndex = _savedGigs.indexWhere((g) => g.id == gig.id);
    if (removedIndex == -1) return;

    setState(() => _savedGigs.removeAt(removedIndex));

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Gig removed from saved'),
        backgroundColor: AppColors.textSecondary,
        behavior: SnackBarBehavior.floating,
        action: SnackBarAction(
          label: 'Undo',
          textColor: Colors.white,
          onPressed: () {
            setState(() {
              _savedGigs.insert(removedIndex, gig);
            });
          },
        ),
      ),
    );
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
            title: const Text('Saved Gigs'),
            titleTextStyle: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
        ),
      ),
      body: _savedGigs.isEmpty
          ? EmptyState.noSavedGigs()
          : ListView.separated(
              padding: const EdgeInsets.all(AppDimensions.base),
              itemCount: _savedGigs.length,
              separatorBuilder: (_, _) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final gig = _savedGigs[index];
                return SavedGigTile(
                  gig: gig,
                  onTap: () => context.push('/worker/gig/${gig.id}'),
                  onUnsave: () => _unsave(gig),
                ).animate()
                    .fadeIn(duration: 250.ms)
                    .slideY(begin: 0.04, end: 0, duration: 280.ms, delay: (40 * index).ms);
              },
            ),
    );
  }
}
