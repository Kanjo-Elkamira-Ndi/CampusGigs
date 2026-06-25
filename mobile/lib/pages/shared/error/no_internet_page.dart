import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_dimensions.dart';
import '../../../widgets/common/buttons/app_button.dart';

class NoInternetPage extends StatelessWidget {
  const NoInternetPage({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppDimensions.base),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const Icon(Icons.wifi_off_rounded, size: 72, color: AppColors.textMuted),
              const SizedBox(height: AppDimensions.xl),
              Text(
                'No Internet Connection',
                style: theme.textTheme.headlineSmall?.copyWith(color: AppColors.textPrimary),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: AppDimensions.sm),
              Text(
                'Check your connection and try again.',
                style: theme.textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: AppDimensions.xxl),
              AppButton.primary('Try Again', onPressed: () => GoRouter.of(context).refresh()),
              const SizedBox(height: AppDimensions.sm),
              AppButton.secondary('Go to Login', onPressed: () => GoRouter.of(context).go('/login')),
            ],
          ),
        ),
      ),
    );
  }
}
