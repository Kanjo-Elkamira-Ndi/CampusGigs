import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_radius.dart';

class GigStatusBadge extends StatelessWidget {
  final String status;

  const GigStatusBadge({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    final pair = _statusConfig(status);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: pair.$2,
        borderRadius: BorderRadius.circular(AppRadius.full),
      ),
      child: Text(
        pair.$1,
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: pair.$3,
        ),
      ),
    );
  }

  (String, Color, Color) _statusConfig(String status) {
    switch (status) {
      case 'OPEN':
        return ('Open', AppColors.successLight, AppColors.success);
      case 'IN_PROGRESS':
        return ('In Progress', AppColors.primaryLight, AppColors.primary);
      case 'PAUSED':
        return ('Paused', AppColors.warningLight, AppColors.warning);
      case 'COMPLETED':
        return ('Completed', const Color(0xFFF3F4F6), AppColors.textSecondary);
      case 'CANCELLED':
        return ('Cancelled', AppColors.errorLight, AppColors.error);
      case 'PENDING':
        return ('Pending', AppColors.warningLight, AppColors.warning);
      case 'ACCEPTED':
        return ('Accepted', AppColors.successLight, AppColors.success);
      case 'REJECTED':
        return ('Rejected', AppColors.errorLight, AppColors.error);
      default:
        return (status, const Color(0xFFF3F4F6), AppColors.textMuted);
    }
  }
}
