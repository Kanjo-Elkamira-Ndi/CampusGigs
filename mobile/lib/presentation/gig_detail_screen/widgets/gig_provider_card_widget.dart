import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../features/gigs/data/models/gig_model.dart';
import '../../../shared/widgets/star_rating.dart';

class GigProviderCardWidget extends StatelessWidget {
  final GigModel gig;

  const GigProviderCardWidget({required this.gig, super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.outline.withAlpha(128)),
      ),
      child: Row(
        children: [
          // Avatar
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: AppColors.primaryContainer,
            ),
            child: Center(
              child: Text(
                gig.posterName.isNotEmpty
                    ? gig.posterName[0].toUpperCase()
                    : 'P',
                style: const TextStyle(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w800,
                  fontSize: 18,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          // Name + role + rating
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  gig.posterName,
                  style: theme.textTheme.titleSmall?.copyWith(
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Gig Poster',
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: AppColors.textMuted,
                  ),
                ),
                const SizedBox(height: 3),
                StarRating(
                  rating: double.parse(gig.posterRating),
                  reviewCount: 128,
                  size: 12,
                ),
              ],
            ),
          ),
          // Action buttons: call + chat
          Row(
            children: [
              _ActionCircle(icon: Icons.phone_outlined, onTap: () {}),
              const SizedBox(width: 8),
              _ActionCircle(
                icon: Icons.chat_bubble_outline_rounded,
                onTap: () {},
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ActionCircle extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _ActionCircle({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 38,
        height: 38,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: AppColors.primaryContainer,
          border: Border.all(color: AppColors.outline.withAlpha(128)),
        ),
        child: Icon(icon, size: 16, color: AppColors.primary),
      ),
    );
  }
}
