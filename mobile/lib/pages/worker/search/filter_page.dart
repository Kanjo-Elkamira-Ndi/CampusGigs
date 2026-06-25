import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_dimensions.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/mocks/mock_data.dart';
import '../../../widgets/worker/category_chip.dart';
import '../../../widgets/common/buttons/app_button.dart';

class FilterPage extends StatefulWidget {
  const FilterPage({super.key});

  @override
  State<FilterPage> createState() => _FilterPageState();
}

class _FilterPageState extends State<FilterPage> {
  String _selectedCategory = 'All';
  final _minBudgetController = TextEditingController();
  final _maxBudgetController = TextEditingController();
  final _universityController = TextEditingController();
  String _sortBy = 'Latest first';

  final _sortOptions = ['Latest first', 'Budget: High to low', 'Budget: Low to high', 'Most applicants'];

  @override
  void dispose() {
    _minBudgetController.dispose();
    _maxBudgetController.dispose();
    _universityController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(kToolbarHeight),
        child: Container(
          decoration: const BoxDecoration(
            color: AppColors.surface,
            border: Border(
              bottom: BorderSide(color: AppColors.border, width: 0.8),
            ),
          ),
          child: AppBar(
            backgroundColor: AppColors.surface,
            elevation: 0,
            scrolledUnderElevation: 0,
            title: const Text('Filters'),
            titleTextStyle: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
            leading: IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: () => context.pop(),
            ),
            actions: [
              TextButton(
                onPressed: () {
                  setState(() {
                    _selectedCategory = 'All';
                    _minBudgetController.clear();
                    _maxBudgetController.clear();
                    _universityController.clear();
                    _sortBy = 'Latest first';
                  });
                },
                child: const Text('Reset'),
              ),
            ],
          ),
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(AppDimensions.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Category',
                    style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: AppDimensions.md),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      'All',
                      ...MockData.categories.map((c) => c.name),
                    ].map((label) => CategoryChip(
                      label: label,
                      isSelected: _selectedCategory == label,
                      onTap: () => setState(() => _selectedCategory = label),
                    )).toList(),
                  ),
                  const SizedBox(height: AppDimensions.xxl),
                  Text(
                    'Budget range',
                    style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: AppDimensions.md),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _minBudgetController,
                          keyboardType: TextInputType.number,
                          decoration: _inputDecoration('Min'),
                        ),
                      ),
                      const SizedBox(width: AppDimensions.md),
                      Expanded(
                        child: TextField(
                          controller: _maxBudgetController,
                          keyboardType: TextInputType.number,
                          decoration: _inputDecoration('Max'),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppDimensions.xxl),
                  Text(
                    'Sort by',
                    style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: AppDimensions.sm),
                  ..._sortOptions.map((option) => InkWell(
                    onTap: () => setState(() => _sortBy = option),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: Row(
                        children: [
                          Icon(
                            _sortBy == option
                                ? Icons.radio_button_checked
                                : Icons.radio_button_unchecked,
                            color: _sortBy == option ? AppColors.primary : AppColors.textMuted,
                            size: 20,
                          ),
                          const SizedBox(width: AppDimensions.md),
                          Text(
                            option,
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ],
                      ),
                    ),
                  )),
                  const SizedBox(height: AppDimensions.xxl),
                  Text(
                    'University',
                    style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: AppDimensions.md),
                  TextField(
                    controller: _universityController,
                    decoration: _inputDecoration('Filter by university'),
                  ),
                ],
              ),
            ),
          ),
          Container(
            decoration: const BoxDecoration(
              color: AppColors.surface,
              border: Border(
                top: BorderSide(color: AppColors.border, width: 0.8),
              ),
            ),
            padding: const EdgeInsets.fromLTRB(AppDimensions.lg, AppDimensions.md, AppDimensions.lg, AppDimensions.lg),
            child: AppButton(
              label: 'Apply filters',
              onPressed: () => context.pop(),
            ),
          ),
        ],
      ),
    );
  }

  InputDecoration _inputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      hintStyle: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.textMuted),
      filled: true,
      fillColor: AppColors.surface,
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppRadius.md),
        borderSide: const BorderSide(color: AppColors.border),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppRadius.md),
        borderSide: const BorderSide(color: AppColors.border),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppRadius.md),
        borderSide: const BorderSide(color: AppColors.primary),
      ),
    );
  }
}
