import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_dimensions.dart';

class EmptyState extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Widget? action;

  const EmptyState({
    super.key,
    required this.icon,
    required this.title,
    required this.subtitle,
    this.action,
  });

  factory EmptyState.noGigs() => EmptyState(
    icon: Icons.work_outline,
    title: 'No gigs found',
    subtitle: 'Check back later for new opportunities',
  );

  factory EmptyState.noApplications() => EmptyState(
    icon: Icons.layers_outlined,
    title: 'No applications yet',
    subtitle: 'Start applying to gigs that interest you',
  );

  factory EmptyState.noSavedGigs() => EmptyState(
    icon: Icons.bookmark_outline,
    title: 'No saved gigs',
    subtitle: 'Save gigs you like to find them later',
  );

  factory EmptyState.noResults() => EmptyState(
    icon: Icons.search_off,
    title: 'No results found',
    subtitle: 'Try adjusting your search or filters',
  );

  factory EmptyState.noMessages() => EmptyState(
    icon: Icons.chat_bubble_outline,
    title: 'No messages yet',
    subtitle: 'Messages from gig posters will appear here',
  );

  factory EmptyState.noNotifications() => EmptyState(
    icon: Icons.notifications_outlined,
    title: 'No notifications',
    subtitle: 'We will let you know when something happens',
  );

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: AppDimensions.xxl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: const BoxDecoration(
                color: AppColors.primaryLight,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 26, color: AppColors.primary),
            ),
            const SizedBox(height: AppDimensions.base),
            Text(
              title,
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              subtitle,
              textAlign: TextAlign.center,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            if (action != null) ...[
              const SizedBox(height: AppDimensions.lg),
              action!,
            ],
          ],
        ),
      ),
    );
  }
}
