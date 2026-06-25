import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_dimensions.dart';
import '../../../core/mocks/mock_data.dart';
import '../../../widgets/worker/category_chip.dart';
import '../../../widgets/worker/gig_card.dart';

class _SectionHeader extends StatelessWidget {
  final String title;

  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppDimensions.base,
        vertical: AppDimensions.sm,
      ),
      child: Text(
        title,
        style: Theme.of(context).textTheme.titleSmall?.copyWith(
          fontWeight: FontWeight.w600,
          color: AppColors.textPrimary,
        ),
      ),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String _selectedCategory = 'All';

  List<MockGig> get _filteredGigs {
    if (_selectedCategory == 'All') return MockData.gigs;
    return MockData.gigs.where((g) => g.categoryName == _selectedCategory).toList();
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _filteredGigs;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(
                AppDimensions.base,
                AppDimensions.xl,
                0,
                AppDimensions.base,
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Hey, Jordan \u{1F44B}',
                          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Find your next gig',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: () {},
                    icon: const Icon(Icons.notifications_outlined),
                    color: AppColors.textPrimary,
                  ),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: AppDimensions.base,
                vertical: AppDimensions.sm,
              ),
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
          ),
          const SliverToBoxAdapter(
            child: _SectionHeader(title: 'Featured Gigs'),
          ),
          SliverToBoxAdapter(
            child: SizedBox(
              height: 200,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: AppDimensions.base),
                itemCount: filtered.length,
                separatorBuilder: (_, _) => const SizedBox(width: AppDimensions.md),
                itemBuilder: (context, index) => FeaturedGigCard(gig: filtered[index]),
              ),
            ),
          ),
          const SliverToBoxAdapter(
            child: _SectionHeader(title: 'Recent Gigs'),
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) {
                return Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppDimensions.base,
                    vertical: 6,
                  ),
                  child: GigCard(gig: filtered[index]).animate().fadeIn(
                    duration: 250.ms,
                  ).slideY(
                    begin: 0.04,
                    end: 0,
                    duration: 280.ms,
                    delay: (40 * index).ms,
                    curve: Curves.easeOut,
                  ),
                );
              },
              childCount: filtered.length,
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: AppDimensions.xxl)),
        ],
      ),
    );
  }
}
