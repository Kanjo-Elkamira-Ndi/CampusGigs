import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_dimensions.dart';

class WorkerNotificationPreferencesPage extends StatefulWidget {
  const WorkerNotificationPreferencesPage({super.key});

  @override
  State<WorkerNotificationPreferencesPage> createState() => _WorkerNotificationPreferencesPageState();
}

class _WorkerNotificationPreferencesPageState extends State<WorkerNotificationPreferencesPage> {
  bool _newGigMatches = true;
  bool _appStatusUpdate = true;
  bool _messageFromPoster = true;
  bool _gigsNearUniversity = false;
  bool _savedGigUpdated = true;
  bool _paymentReceived = true;
  bool _payoutProcessed = true;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Notification Preferences')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppDimensions.base),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Applications', style: theme.textTheme.titleMedium?.copyWith(color: AppColors.textPrimary)),
            const SizedBox(height: AppDimensions.sm),
            _ToggleTile(title: 'New gig matches my skills', value: _newGigMatches, onChanged: (v) => setState(() => _newGigMatches = v), theme: theme),
            _ToggleTile(title: 'Application status update', value: _appStatusUpdate, onChanged: (v) => setState(() => _appStatusUpdate = v), theme: theme),
            _ToggleTile(title: 'Message from poster', value: _messageFromPoster, onChanged: (v) => setState(() => _messageFromPoster = v), theme: theme),
            const SizedBox(height: AppDimensions.xl),
            Text('Gigs', style: theme.textTheme.titleMedium?.copyWith(color: AppColors.textPrimary)),
            const SizedBox(height: AppDimensions.sm),
            _ToggleTile(title: 'Gigs near my university', value: _gigsNearUniversity, onChanged: (v) => setState(() => _gigsNearUniversity = v), theme: theme),
            _ToggleTile(title: 'Saved gig updated', value: _savedGigUpdated, onChanged: (v) => setState(() => _savedGigUpdated = v), theme: theme),
            const SizedBox(height: AppDimensions.xl),
            Text('Payments', style: theme.textTheme.titleMedium?.copyWith(color: AppColors.textPrimary)),
            const SizedBox(height: AppDimensions.sm),
            _ToggleTile(title: 'Payment received', value: _paymentReceived, onChanged: (v) => setState(() => _paymentReceived = v), theme: theme),
            _ToggleTile(title: 'Payout processed', value: _payoutProcessed, onChanged: (v) => setState(() => _payoutProcessed = v), theme: theme),
            const SizedBox(height: AppDimensions.xxl),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: FilledButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Preferences saved! (mock)')),
                  );
                },
                style: FilledButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('Save Preferences'),
              ),
            ),
            const SizedBox(height: AppDimensions.xxxl),
          ],
        ),
      ),
    );
  }
}

class _ToggleTile extends StatelessWidget {
  final String title;
  final bool value;
  final ValueChanged<bool> onChanged;
  final ThemeData theme;

  const _ToggleTile({
    required this.title,
    required this.value,
    required this.onChanged,
    required this.theme,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppDimensions.sm),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border, width: 0.8),
      ),
      child: Row(
        children: [
          Expanded(
            child: Text(title, style: theme.textTheme.bodyLarge?.copyWith(color: AppColors.textPrimary)),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeThumbColor: AppColors.primary,
          ),
        ],
      ),
    );
  }
}
