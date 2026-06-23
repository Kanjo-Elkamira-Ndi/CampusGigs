import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_dimensions.dart';
import '../../../core/mocks/mock_data.dart';
import '../../../widgets/worker/category_chip.dart';
import '../../../widgets/worker/gig_list_tile.dart';
import '../../../widgets/common/empty_states/empty_state.dart';

class SearchPage extends StatefulWidget {
  const SearchPage({super.key});

  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  final _searchController = TextEditingController();
  String _query = '';
  String _selectedCategory = 'All';

  List<MockGig> get _results {
    var filtered = MockData.gigs;
    if (_selectedCategory != 'All') {
      filtered = filtered.where((g) => g.categoryName == _selectedCategory).toList();
    }
    if (_query.isNotEmpty) {
      filtered = filtered
          .where((g) => g.title.toLowerCase().contains(_query.toLowerCase()))
          .toList();
    }
    return filtered;
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final results = _results;

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
            title: const Text('Search'),
            titleTextStyle: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
            actions: [
              IconButton(
                onPressed: () => context.push('/worker/search/filter'),
                icon: const Icon(Icons.filter_list),
                color: AppColors.primary,
              ),
            ],
          ),
        ),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(AppDimensions.base),
            child: TextField(
              controller: _searchController,
              onChanged: (v) => setState(() => _query = v),
              decoration: InputDecoration(
                hintText: 'Search gigs...',
                hintStyle: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: AppColors.textMuted,
                ),
                prefixIcon: const Icon(Icons.search, color: AppColors.textMuted),
                filled: true,
                fillColor: AppColors.surface,
                contentPadding: const EdgeInsets.symmetric(vertical: 12),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppColors.border),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppColors.border),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppColors.primary),
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppDimensions.base),
            child: SizedBox(
              height: 36,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: MockData.categories.length + 1,
                separatorBuilder: (_, _) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final label = index == 0 ? 'All' : MockData.categories[index - 1].name;
                  return CategoryChip(
                    label: label,
                    isSelected: _selectedCategory == label,
                    onTap: () => setState(() => _selectedCategory = label),
                  );
                },
              ),
            ),
          ),
          const SizedBox(height: AppDimensions.md),
          Expanded(
            child: _query.isEmpty && _selectedCategory == 'All'
                ? _buildDefaultView(context)
                : results.isEmpty
                    ? EmptyState.noResults()
                    : ListView.separated(
                        padding: const EdgeInsets.symmetric(horizontal: AppDimensions.base),
                        itemCount: results.length,
                        separatorBuilder: (_, _) => const SizedBox(height: AppDimensions.sm),
                        itemBuilder: (context, index) => GigListTile(gig: results[index])
                            .animate()
                            .fadeIn(duration: 250.ms)
                            .slideY(begin: 0.04, end: 0, duration: 280.ms, delay: (40 * index).ms),
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildDefaultView(BuildContext context) {
    final recentSearches = ['Graphic design', 'Programming', 'Photography', 'Tutoring'];
    final trending = MockData.gigs.take(3).toList();

    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: AppDimensions.base),
      children: [
        const SizedBox(height: AppDimensions.sm),
        Text(
          'Recent searches',
          style: Theme.of(context).textTheme.titleSmall?.copyWith(
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: AppDimensions.sm),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: recentSearches.map((s) => ActionChip(
            label: Text(s, style: const TextStyle(fontSize: 13, color: AppColors.textSecondary)),
            backgroundColor: AppColors.surface,
            side: const BorderSide(color: AppColors.border),
            onPressed: () {
              _searchController.text = s;
              setState(() => _query = s);
            },
          )).toList(),
        ),
        const SizedBox(height: AppDimensions.xl),
        Text(
          'Trending gigs',
          style: Theme.of(context).textTheme.titleSmall?.copyWith(
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: AppDimensions.sm),
        ...trending.map((g) => Padding(
          padding: const EdgeInsets.only(bottom: AppDimensions.sm),
          child: GigListTile(gig: g),
        )),
      ],
    );
  }
}
