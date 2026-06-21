import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/utils/currency_formatter.dart';

class GigPlanSelectorWidget extends StatelessWidget {
  final String selectedPlan;
  final int baseBudget;
  final void Function(String plan) onPlanSelected;

  const GigPlanSelectorWidget({
    required this.selectedPlan,
    required this.baseBudget,
    required this.onPlanSelected,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final plans = [
      _PlanData(
        name: 'Classic',
        price: baseBudget,
        strikePrice: (baseBudget * 1.15).round(),
      ),
      _PlanData(
        name: 'Premium',
        price: (baseBudget * 1.16).round(),
        strikePrice: (baseBudget * 1.35).round(),
      ),
      _PlanData(
        name: 'Platinum',
        price: (baseBudget * 1.24).round(),
        strikePrice: (baseBudget * 1.45).round(),
      ),
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: plans.map((plan) {
          final isSelected = plan.name == selectedPlan;
          return Expanded(
            child: GestureDetector(
              onTap: () => onPlanSelected(plan.name),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                curve: Curves.easeOutCubic,
                margin: EdgeInsets.only(right: plan.name != 'Platinum' ? 8 : 0),
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 10,
                ),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.textPrimary : AppColors.surface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: isSelected
                        ? AppColors.textPrimary
                        : AppColors.outline.withAlpha(128),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      plan.name,
                      style: theme.textTheme.labelSmall?.copyWith(
                        color: isSelected
                            ? Colors.white
                            : AppColors.textSecondary,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      CurrencyFormatter.formatXAF(plan.price),
                      style: theme.textTheme.labelMedium?.copyWith(
                        color: isSelected
                            ? Colors.white
                            : AppColors.textPrimary,
                        fontWeight: FontWeight.w800,
                        fontSize: 11,
                      ),
                    ),
                    Text(
                      CurrencyFormatter.formatXAF(plan.strikePrice),
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: isSelected
                            ? Colors.white.withAlpha(153)
                            : AppColors.textMuted,
                        decoration: TextDecoration.lineThrough,
                        fontSize: 10,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

class _PlanData {
  final String name;
  final int price;
  final int strikePrice;

  const _PlanData({
    required this.name,
    required this.price,
    required this.strikePrice,
  });
}
