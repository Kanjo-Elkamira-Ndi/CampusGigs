import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/utils/currency_formatter.dart';

class GigAddonsWidget extends StatefulWidget {
  const GigAddonsWidget({super.key});

  @override
  State<GigAddonsWidget> createState() => _GigAddonsWidgetState();
}

class _GigAddonsWidgetState extends State<GigAddonsWidget> {
  // TODO: Replace with Riverpod state binding for production
  static final List<Map<String, dynamic>> _addonMaps = [
    {
      'id': 'a1',
      'label': 'Extra Revision Round',
      'price': 3000,
      'selected': false,
    },
    {
      'id': 'a2',
      'label': 'Rush Delivery (24h)',
      'price': 5000,
      'selected': false,
    },
    {
      'id': 'a3',
      'label': 'Animated Logo (GIF)',
      'price': 8000,
      'selected': false,
    },
    {
      'id': 'a4',
      'label': 'Business Card Design',
      'price': 4000,
      'selected': false,
    },
  ];

  late List<Map<String, dynamic>> _addons;

  @override
  void initState() {
    super.initState();
    _addons = _addonMaps.map((m) => Map<String, dynamic>.from(m)).toList();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Add-ons (Optional)',
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 10),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 8,
              mainAxisSpacing: 8,
              childAspectRatio: 3.2,
            ),
            itemCount: _addons.length,
            itemBuilder: (context, i) {
              final addon = _addons[i];
              final isSelected = addon['selected'] as bool;
              return GestureDetector(
                onTap: () {
                  setState(() {
                    _addons[i] = {...addon, 'selected': !isSelected};
                  });
                },
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 180),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppColors.primaryContainer
                        : AppColors.surface,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: isSelected
                          ? AppColors.primary
                          : AppColors.outline.withAlpha(128),
                    ),
                  ),
                  child: Row(
                    children: [
                      SizedBox(
                        width: 18,
                        height: 18,
                        child: Checkbox(
                          value: isSelected,
                          onChanged: (_) {
                            setState(() {
                              _addons[i] = {...addon, 'selected': !isSelected};
                            });
                          },
                          activeColor: AppColors.primary,
                          materialTapTargetSize:
                              MaterialTapTargetSize.shrinkWrap,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(4),
                          ),
                          side: BorderSide(
                            color: AppColors.outline,
                            width: 1.5,
                          ),
                        ),
                      ),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              addon['label'] as String,
                              style: theme.textTheme.bodySmall?.copyWith(
                                fontWeight: FontWeight.w600,
                                color: AppColors.textPrimary,
                                fontSize: 10,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            Text(
                              '+${CurrencyFormatter.formatXAF(addon['price'] as int)}',
                              style: theme.textTheme.bodySmall?.copyWith(
                                color: AppColors.primary,
                                fontWeight: FontWeight.w700,
                                fontSize: 10,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
