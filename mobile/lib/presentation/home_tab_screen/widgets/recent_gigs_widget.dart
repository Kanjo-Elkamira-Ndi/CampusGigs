import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/constants/app_colors.dart';
import '../../../features/gigs/data/models/gig_model.dart';
import '../../../shared/widgets/loading_shimmer.dart';
import './gig_card_widget.dart';

class RecentGigsWidget extends StatelessWidget {
  final AsyncValue<List<GigModel>> gigsAsync;

  const RecentGigsWidget({required this.gigsAsync, super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 20, 16, 4),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Recent Gigs',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              GestureDetector(
                onTap: () {},
                child: Text(
                  'See all',
                  style: theme.textTheme.labelMedium?.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
        gigsAsync.when(
          loading: () =>
              Column(children: List.generate(4, (i) => const GigCardShimmer())),
          error: (err, _) => Padding(
            padding: const EdgeInsets.all(16),
            child: Text(
              'Failed to load gigs. Pull down to retry.',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: AppColors.textMuted,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          data: (gigs) => Column(
            children: List.generate(
              gigs.length,
              (i) => GigCardWidget(gig: gigs[i], index: i)
                  .animate(delay: Duration(milliseconds: i * 50))
                  .fadeIn(duration: 350.ms)
                  .slideY(
                    begin: 0.08,
                    end: 0,
                    duration: 350.ms,
                    curve: Curves.easeOutCubic,
                  ),
            ),
          ),
        ),
      ],
    );
  }
}
