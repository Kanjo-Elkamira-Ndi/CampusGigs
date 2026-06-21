import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

class _CategoryItem {
  final String id;
  final String name;
  final IconData icon;
  final Color color;

  const _CategoryItem({
    required this.id,
    required this.name,
    required this.icon,
    required this.color,
  });
}

class CategoryChipsWidget extends StatelessWidget {
  final String selectedId;
  final void Function(String id) onSelected;

  const CategoryChipsWidget({
    required this.selectedId,
    required this.onSelected,
    super.key,
  });

  static const List<_CategoryItem> _categories = [
    _CategoryItem(
      id: 'all',
      name: 'All',
      icon: Icons.apps_rounded,
      color: AppColors.primary,
    ),
    _CategoryItem(
      id: 'tech',
      name: 'Tech',
      icon: Icons.code_rounded,
      color: AppColors.catTech,
    ),
    _CategoryItem(
      id: 'design',
      name: 'Design',
      icon: Icons.palette_outlined,
      color: AppColors.catDesign,
    ),
    _CategoryItem(
      id: 'writing',
      name: 'Writing',
      icon: Icons.edit_note_rounded,
      color: AppColors.catWriting,
    ),
    _CategoryItem(
      id: 'tutoring',
      name: 'Tutoring',
      icon: Icons.school_outlined,
      color: AppColors.catTutoring,
    ),
    _CategoryItem(
      id: 'delivery',
      name: 'Delivery',
      icon: Icons.delivery_dining_rounded,
      color: AppColors.catDelivery,
    ),
    _CategoryItem(
      id: 'events',
      name: 'Events',
      icon: Icons.event_outlined,
      color: AppColors.catEvents,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return SizedBox(
      height: 48,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: _categories.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, i) {
          final cat = _categories[i];
          final isSelected = cat.id == selectedId;
          return GestureDetector(
            onTap: () => onSelected(cat.id),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              curve: Curves.easeOutCubic,
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: isSelected ? cat.color : AppColors.surface,
                borderRadius: BorderRadius.circular(999),
                border: Border.all(
                  color: isSelected
                      ? cat.color
                      : AppColors.outline.withAlpha(128),
                ),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    cat.icon,
                    size: 14,
                    color: isSelected ? Colors.white : cat.color,
                  ),
                  const SizedBox(width: 5),
                  Text(
                    cat.name,
                    style: theme.textTheme.labelMedium?.copyWith(
                      color: isSelected
                          ? Colors.white
                          : AppColors.textSecondary,
                      fontWeight: isSelected
                          ? FontWeight.w700
                          : FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
