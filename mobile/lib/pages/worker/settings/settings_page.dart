import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_dimensions.dart';
import '../../../widgets/common/dialogs/confirm_dialog.dart';

class WorkerSettingsPage extends StatefulWidget {
  const WorkerSettingsPage({super.key});

  @override
  State<WorkerSettingsPage> createState() => _WorkerSettingsPageState();
}

class _WorkerSettingsPageState extends State<WorkerSettingsPage> {
  bool _notificationsEnabled = true;
  bool _emailAlerts = true;

  Future<void> _switchRole() async {
    final confirmed = await showConfirmDialog(
      context,
      title: 'Switch Role?',
      message: 'You will be taken to the Poster dashboard. You can switch back anytime.',
    );
    if (confirmed == true && context.mounted) {
      GoRouter.of(context).go('/poster/dashboard');
    }
  }

  Future<void> _deleteAccount() async {
    final confirmed = await showConfirmDialog(
      context,
      title: 'Delete Account?',
      message: 'All your data will be permanently removed. This cannot be undone.',
    );
    if (confirmed == true && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Account deletion coming soon')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppDimensions.base),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Account', style: theme.textTheme.titleMedium?.copyWith(color: AppColors.textPrimary)),
            const SizedBox(height: AppDimensions.sm),
            _SettingsTile(
              leading: Icons.person_outline,
              title: 'Edit Profile',
              onTap: () => context.push('/worker/profile/edit'),
              theme: theme,
            ),
            _SettingsTile(
              leading: Icons.lock_outline,
              title: 'Change Password',
              onTap: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Coming soon'))),
              theme: theme,
            ),
            _SettingsTile(
              leading: Icons.swap_horiz,
              title: 'Switch to Poster',
              subtitle: 'Access the poster dashboard',
              onTap: _switchRole,
              theme: theme,
            ),
            const SizedBox(height: AppDimensions.xl),
            Text('Preferences', style: theme.textTheme.titleMedium?.copyWith(color: AppColors.textPrimary)),
            const SizedBox(height: AppDimensions.sm),
            _SettingsTile(
              leading: Icons.language,
              title: 'Language',
              onTap: () => context.push('/language-settings'),
              theme: theme,
            ),
            _SettingsTile(
              leading: Icons.notifications_outlined,
              title: 'Push Notifications',
              trailing: Switch(
                value: _notificationsEnabled,
                onChanged: (v) => setState(() => _notificationsEnabled = v),
                activeThumbColor: AppColors.primary,
              ),
              theme: theme,
            ),
            _SettingsTile(
              leading: Icons.email_outlined,
              title: 'Email Alerts',
              trailing: Switch(
                value: _emailAlerts,
                onChanged: (v) => setState(() => _emailAlerts = v),
                activeThumbColor: AppColors.primary,
              ),
              theme: theme,
            ),
            const SizedBox(height: AppDimensions.xl),
            Text('My Activity', style: theme.textTheme.titleMedium?.copyWith(color: AppColors.textPrimary)),
            const SizedBox(height: AppDimensions.sm),
            _SettingsTile(
              leading: Icons.bookmark_outline,
              title: 'Saved Gigs',
              onTap: () => context.push('/worker/saved'),
              theme: theme,
            ),
            _SettingsTile(
              leading: Icons.layers_outlined,
              title: 'My Applications',
              onTap: () => context.push('/worker/applications'),
              theme: theme,
            ),
            _SettingsTile(
              leading: Icons.school_outlined,
              title: 'Request University',
              onTap: () => context.push('/university-request'),
              theme: theme,
            ),
            const SizedBox(height: AppDimensions.xl),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(AppDimensions.base),
              decoration: BoxDecoration(
                color: AppColors.errorLight,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Danger Zone', style: theme.textTheme.titleMedium?.copyWith(color: AppColors.error)),
                  const SizedBox(height: AppDimensions.sm),
                  SizedBox(
                    width: double.infinity,
                    child: TextButton(
                      onPressed: _deleteAccount,
                      style: TextButton.styleFrom(foregroundColor: AppColors.error),
                      child: const Text('Delete Account'),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppDimensions.xxxl),
          ],
        ),
      ),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  final IconData leading;
  final String title;
  final String? subtitle;
  final VoidCallback? onTap;
  final Widget? trailing;
  final ThemeData theme;

  const _SettingsTile({
    required this.leading,
    required this.title,
    this.subtitle,
    this.onTap,
    this.trailing,
    required this.theme,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: AppDimensions.sm),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border, width: 0.8),
        ),
        child: Row(
          children: [
            Icon(leading, size: 22, color: AppColors.textSecondary),
            const SizedBox(width: AppDimensions.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: theme.textTheme.bodyLarge?.copyWith(color: AppColors.textPrimary)),
                  if (subtitle != null)
                    Text(subtitle!, style: theme.textTheme.bodySmall?.copyWith(color: AppColors.textSecondary)),
                ],
              ),
            ),
            if (trailing != null)
              trailing!
            else
              const Icon(Icons.chevron_right, color: AppColors.textMuted),
          ],
        ),
      ),
    );
  }
}
