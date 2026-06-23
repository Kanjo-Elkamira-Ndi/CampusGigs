import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_dimensions.dart';
import '../../core/theme/app_radius.dart';
import '../../core/storage/secure_storage.dart';
import '../../routes/route_names.dart';
import '../../widgets/common/buttons/app_button.dart';

class RoleSelectionPage extends StatefulWidget {
  const RoleSelectionPage({super.key});

  @override
  State<RoleSelectionPage> createState() => _RoleSelectionPageState();
}

class _RoleSelectionPageState extends State<RoleSelectionPage> {
  String? _selectedRole;

  static const _roles = [
    _RoleCardData(
      role: 'WORKER',
      title: 'Find & complete gigs',
      description: 'Browse gigs, apply, and earn money',
      icon: Icons.search_outlined,
    ),
    _RoleCardData(
      role: 'POSTER',
      title: 'Post & manage gigs',
      description: 'Hire students for your tasks',
      icon: Icons.post_add_outlined,
    ),
  ];

  Future<void> _continue() async {
    if (_selectedRole == null) return;
    await SecureStorage.instance.saveRole(_selectedRole!);
    if (mounted) {
      if (_selectedRole == 'POSTER') {
        context.go(RouteNames.posterDashboard);
      } else {
        context.go(RouteNames.workerHome);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppDimensions.xl),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Spacer(flex: 2),
              Text(
                'How will you use Campus Gigs?',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: AppDimensions.sm),
              Text(
                'You can switch roles anytime',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: AppDimensions.xxl),
              ..._roles.map((role) => Padding(
                padding: const EdgeInsets.only(bottom: AppDimensions.base),
                child: _RoleCard(
                  data: role,
                  isSelected: _selectedRole == role.role,
                  onTap: () => setState(() => _selectedRole = role.role),
                ),
              )),
              const Spacer(flex: 2),
              AppButton.primary(
                'Continue',
                onPressed: _selectedRole != null ? _continue : null,
              ),
              const SizedBox(height: AppDimensions.xxl),
            ],
          ),
        ),
      ),
    );
  }
}

class _RoleCard extends StatelessWidget {
  final _RoleCardData data;
  final bool isSelected;
  final VoidCallback onTap;

  const _RoleCard({
    required this.data,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(AppDimensions.lg),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(AppRadius.lg),
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.border,
            width: isSelected ? 1.5 : 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: const BoxDecoration(
                color: AppColors.primaryLight,
                shape: BoxShape.circle,
              ),
              child: Icon(data.icon, size: 24, color: AppColors.primary),
            ),
            const SizedBox(width: AppDimensions.base),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    data.title,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    data.description,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: AppDimensions.sm),
            Container(
              width: 22,
              height: 22,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isSelected ? AppColors.primary : AppColors.border,
                  width: isSelected ? 2 : 1.5,
                ),
                color: isSelected ? AppColors.primary : Colors.transparent,
              ),
              child: isSelected
                  ? const Icon(Icons.check, size: 14, color: Colors.white)
                  : null,
            ),
          ],
        ),
      ),
    );
  }
}

class _RoleCardData {
  final String role;
  final String title;
  final String description;
  final IconData icon;

  const _RoleCardData({
    required this.role,
    required this.title,
    required this.description,
    required this.icon,
  });
}
