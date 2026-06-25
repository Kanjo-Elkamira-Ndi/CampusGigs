import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_dimensions.dart';
import '../buttons/app_button.dart';

class EmptyState extends StatelessWidget {
  final IconData icon;
  final Color? iconColor;
  final String title;
  final String? subtitle;
  final Widget? action;

  const EmptyState({
    super.key,
    required this.icon,
    this.iconColor,
    required this.title,
    this.subtitle,
    this.action,
  });

  factory EmptyState.error({VoidCallback? onRetry}) {
    return EmptyState(
      icon: Icons.error_outline_rounded,
      iconColor: AppColors.error,
      title: 'Something went wrong',
      subtitle: 'An error occurred. Please try again.',
      action: onRetry != null
          ? AppButton.primary('Try Again', onPressed: onRetry)
          : null,
    );
  }

  factory EmptyState.noInternet({VoidCallback? onRetry}) {
    return EmptyState(
      icon: Icons.wifi_off_rounded,
      iconColor: AppColors.textMuted,
      title: 'No Internet',
      subtitle: 'Check your connection and try again.',
      action: onRetry != null
          ? AppButton.primary('Retry', onPressed: onRetry)
          : null,
    );
  }

  factory EmptyState.noResults() {
    return EmptyState(
      icon: Icons.search_off_rounded,
      iconColor: AppColors.textMuted,
      title: 'No results found',
      subtitle: 'Try adjusting your search or filters.',
    );
  }

  factory EmptyState.noGigs() => const EmptyState(
    icon: Icons.work_outline,
    title: 'No gigs found',
    subtitle: 'Check back later for new opportunities',
  );

  factory EmptyState.noApplications() => const EmptyState(
    icon: Icons.layers_outlined,
    title: 'No applications yet',
    subtitle: 'Start applying to gigs that interest you',
  );

  factory EmptyState.noSavedGigs() => const EmptyState(
    icon: Icons.bookmark_outline,
    title: 'No saved gigs',
    subtitle: 'Save gigs you like to find them later',
  );

  factory EmptyState.noMessages() => const EmptyState(
    icon: Icons.chat_bubble_outline,
    title: 'No messages yet',
    subtitle: 'Messages from gig posters will appear here',
  );

  factory EmptyState.noNotifications() => const EmptyState(
    icon: Icons.notifications_outlined,
    title: 'No notifications',
    subtitle: 'We will let you know when something happens',
  );

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final effectiveIconColor = iconColor ?? AppColors.primary;

    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: AppDimensions.xxl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: effectiveIconColor.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(icon, size: 28, color: effectiveIconColor),
            ),
            const SizedBox(height: AppDimensions.lg),
            Text(
              title,
              style: theme.textTheme.titleMedium?.copyWith(color: AppColors.textPrimary),
              textAlign: TextAlign.center,
            ),
            if (subtitle != null) ...[
              const SizedBox(height: AppDimensions.sm),
              Text(
                subtitle!,
                style: theme.textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary),
                textAlign: TextAlign.center,
              ),
            ],
            if (action != null) ...[
              const SizedBox(height: AppDimensions.xl),
              action!,
            ],
          ],
        ),
      ),
    );
  }
}
