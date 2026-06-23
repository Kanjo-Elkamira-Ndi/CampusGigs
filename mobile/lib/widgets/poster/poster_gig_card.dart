import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_dimensions.dart';
import '../../core/theme/app_radius.dart';
import '../../dto/gig/gig_dto.dart';
import 'gig_status_badge.dart';

String _formatXAF(int amount) {
  if (amount >= 1000) {
    return 'XAF ${(amount / 1000).toStringAsFixed(0)},000';
  }
  return 'XAF $amount';
}

class PosterGigCard extends StatelessWidget {
  final GigDto gig;
  final VoidCallback? onTap;
  final VoidCallback? onEdit;
  final VoidCallback? onDelete;
  final int? animationDelay;

  const PosterGigCard({
    super.key,
    required this.gig,
    this.onTap,
    this.onEdit,
    this.onDelete,
    this.animationDelay,
  });

  @override
  Widget build(BuildContext context) {
    Widget card = GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(AppDimensions.base),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(AppRadius.lg),
          border: Border.all(color: AppColors.border, width: 0.8),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Text(
                    gig.title,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                const SizedBox(width: AppDimensions.sm),
                GigStatusBadge(status: gig.status),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              '${gig.category['name'] ?? ''} \u00B7 ${_formatXAF(gig.budget)}',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: AppDimensions.md),
            Row(
              children: [
                Row(
                  children: [
                    const Icon(Icons.people_outline_rounded, size: 14, color: AppColors.textMuted),
                    const SizedBox(width: 4),
                    Text(
                      '${gig.applicantCount}',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
                const SizedBox(width: AppDimensions.base),
                Row(
                  children: [
                    const Icon(Icons.remove_red_eye_outlined, size: 14, color: AppColors.textMuted),
                    const SizedBox(width: 4),
                    Text(
                      '${gig.viewCount}',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
                const Spacer(),
                if (onEdit != null)
                  IconButton(
                    onPressed: onEdit,
                    icon: const Icon(Icons.edit_outlined, size: 20, color: AppColors.primary),
                    constraints: const BoxConstraints(),
                    padding: EdgeInsets.zero,
                    splashRadius: 18,
                  ),
                if (onDelete != null) const SizedBox(width: 8),
                if (onDelete != null)
                  IconButton(
                    onPressed: onDelete,
                    icon: const Icon(Icons.delete_outline_rounded, size: 20, color: AppColors.error),
                    constraints: const BoxConstraints(),
                    padding: EdgeInsets.zero,
                    splashRadius: 18,
                  ),
              ],
            ),
          ],
        ),
      ),
    );

    if (animationDelay != null) {
      card = card.animate().fadeIn(duration: 250.ms).slideY(
        begin: 0.04,
        end: 0,
        duration: 280.ms,
        delay: (animationDelay! * 40).ms,
      );
    }

    return card;
  }
}
