import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/constants/app_colors.dart';

class _DemoAccount {
  final String role;
  final String email;
  final String password;

  const _DemoAccount({
    required this.role,
    required this.email,
    required this.password,
  });
}

class LoginDemoBoxWidget extends StatelessWidget {
  final void Function(String email, String password) onFillCredentials;

  const LoginDemoBoxWidget({required this.onFillCredentials, super.key});

  static const List<_DemoAccount> _accounts = [
    _DemoAccount(
      role: 'Worker',
      email: 'kwame.asante@campusgigs.cm',
      password: 'worker2026',
    ),
    _DemoAccount(
      role: 'Poster',
      email: 'amara.nkeng@campusgigs.cm',
      password: 'poster2026',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.primaryContainer,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.primary.withAlpha(51)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.info_outline_rounded,
                size: 14,
                color: AppColors.primary,
              ),
              const SizedBox(width: 6),
              Text(
                'Demo Accounts',
                style: theme.textTheme.labelMedium?.copyWith(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          ..._accounts.map(
            (acc) => _DemoRow(
              account: acc,
              onUse: () => onFillCredentials(acc.email, acc.password),
            ),
          ),
        ],
      ),
    );
  }
}

class _DemoRow extends StatelessWidget {
  final _DemoAccount account;
  final VoidCallback onUse;

  const _DemoRow({required this.account, required this.onUse});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: AppColors.primary,
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text(
              account.role,
              style: theme.textTheme.labelSmall?.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              account.email,
              style: theme.textTheme.bodySmall?.copyWith(
                color: AppColors.textSecondary,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
          GestureDetector(
            onTap: () {
              Clipboard.setData(ClipboardData(text: account.email));
            },
            child: const Icon(
              Icons.copy_rounded,
              size: 14,
              color: AppColors.textMuted,
            ),
          ),
          const SizedBox(width: 8),
          GestureDetector(
            onTap: onUse,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(
                'Use',
                style: theme.textTheme.labelSmall?.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
