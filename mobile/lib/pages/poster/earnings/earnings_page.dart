import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../controllers/poster/earnings_controller.dart';
import '../../../widgets/common/loaders/app_loader.dart';
import '../../../widgets/common/empty_states/empty_state.dart';

class EarningsPage extends ConsumerWidget {
  const EarningsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final earningsAsync = ref.watch(earningsProvider);
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(kToolbarHeight),
        child: Container(
          decoration: const BoxDecoration(
            color: AppColors.surface,
            border: Border(bottom: BorderSide(color: AppColors.border, width: 0.8)),
          ),
          child: AppBar(
            backgroundColor: AppColors.surface,
            elevation: 0,
            scrolledUnderElevation: 0,
            title: const Text('Earnings'),
            titleTextStyle: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.w600, color: AppColors.textPrimary,
            ),
          ),
        ),
      ),
      body: earningsAsync.when(
        loading: () => ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const AppShimmerBox(width: double.infinity, height: 120, radius: 16),
            const SizedBox(height: 16),
            ...List.generate(4, (_) => const Padding(
              padding: EdgeInsets.only(bottom: 12),
              child: Row(
                children: [
                  AppShimmerBox(width: 44, height: 44, radius: 12),
                  SizedBox(width: 12),
                  Expanded(child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      AppShimmerBox(width: 160, height: 14),
                      SizedBox(height: 6),
                      AppShimmerBox(width: 100, height: 12),
                    ],
                  )),
                ],
              ),
            )),
          ],
        ),
        error: (e, _) => EmptyState.error(
          onRetry: () => ref.invalidate(earningsProvider),
        ),
        data: (data) {
          final breakdown = data['breakdown'] as List<dynamic>? ?? [];
          if (breakdown.isEmpty) {
            return const EmptyState(
              icon: Icons.account_balance_wallet_outlined,
              title: 'No earnings yet',
              subtitle: 'Earnings from completed gigs will appear here.',
            );
          }
          return ListView(
            padding: const EdgeInsets.all(16),
            children: breakdown.map<Widget>((item) {
              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.border, width: 0.8),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 44, height: 44,
                      decoration: BoxDecoration(
                        color: AppColors.successLight,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.attach_money, color: AppColors.success),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(item['title'] ?? '', style: theme.textTheme.titleSmall),
                          const SizedBox(height: 4),
                          Text(item['date'] ?? '', style: theme.textTheme.bodySmall?.copyWith(color: AppColors.textMuted)),
                        ],
                      ),
                    ),
                    Text(
                      '${item['amount'] ?? 0} XAF',
                      style: theme.textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.w600, color: AppColors.success,
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
          );
        },
      ),
    );
  }
}
