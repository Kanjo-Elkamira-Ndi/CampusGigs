import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_dimensions.dart';
import '../../core/theme/app_radius.dart';
import '../../core/mocks/mock_data.dart';

class ApplicationTile extends StatelessWidget {
  final MockApplication application;
  final VoidCallback? onTap;

  const ApplicationTile({
    super.key,
    required this.application,
    this.onTap,
  });

  Color _statusColor(String status) {
    switch (status) {
      case 'PENDING': return AppColors.warning;
      case 'ACCEPTED': return AppColors.success;
      case 'REJECTED': return AppColors.error;
      default: return AppColors.textMuted;
    }
  }

  Color _statusBgColor(String status) {
    switch (status) {
      case 'PENDING': return AppColors.warningLight;
      case 'ACCEPTED': return AppColors.successLight;
      case 'REJECTED': return AppColors.errorLight;
      default: return const Color(0xFFF3F4F6);
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(AppRadius.md),
        ),
        clipBehavior: Clip.antiAlias,
        child: Row(
          children: [
            Container(
              width: 4,
              height: double.infinity,
              color: _statusColor(application.status),
            ),
            const SizedBox(width: AppDimensions.md),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      application.gigTitle,
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Text(
                          MockData.formatXAF(application.proposedBudget),
                          style: Theme.of(context).textTheme.labelSmall?.copyWith(
                            color: AppColors.primary,
                          ),
                        ),
                        const SizedBox(width: AppDimensions.md),
                        Text(
                          'Applied ${MockData.relativeTime(application.appliedAt)}',
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
            Padding(
              padding: const EdgeInsets.only(right: AppDimensions.md),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: _statusBgColor(application.status),
                  borderRadius: BorderRadius.circular(AppRadius.full),
                ),
                child: Text(
                  MockData.statusLabel(application.status),
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: _statusColor(application.status),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
