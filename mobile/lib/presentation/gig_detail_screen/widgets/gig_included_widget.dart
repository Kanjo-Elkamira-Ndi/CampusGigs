import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

class GigIncludedWidget extends StatelessWidget {
  const GigIncludedWidget({super.key});

  static const List<_IncludedItem> _items = [
    _IncludedItem(label: 'Concept Development', included: true),
    _IncludedItem(label: 'Source Files (SVG/PNG)', included: true),
    _IncludedItem(label: 'Revision Rounds (3x)', included: true),
    _IncludedItem(label: 'Commercial License', included: true),
    _IncludedItem(label: 'Brand Guidelines', included: false),
    _IncludedItem(label: 'Rush Delivery (<24h)', included: false),
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "What's Included",
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 12),
          // 2-column grid
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 8,
              mainAxisSpacing: 6,
              childAspectRatio: 4.5,
            ),
            itemCount: _items.length,
            itemBuilder: (context, i) {
              final item = _items[i];
              return Row(
                children: [
                  Container(
                    width: 18,
                    height: 18,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: item.included
                          ? AppColors.success.withAlpha(31)
                          : AppColors.error.withAlpha(31),
                    ),
                    child: Icon(
                      item.included ? Icons.check_rounded : Icons.close_rounded,
                      size: 11,
                      color: item.included
                          ? AppColors.success
                          : AppColors.error,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      item.label,
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: item.included
                            ? AppColors.textPrimary
                            : AppColors.textMuted,
                        fontWeight: FontWeight.w500,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}

class _IncludedItem {
  final String label;
  final bool included;

  const _IncludedItem({required this.label, required this.included});
}
