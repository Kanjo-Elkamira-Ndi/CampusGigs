import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/constants/app_colors.dart';
import '../../core/storage/secure_storage.dart';
import '../../features/gigs/domain/gig_feed_notifier.dart';
import './widgets/category_chips_widget.dart';
import './widgets/featured_banner_widget.dart';
import './widgets/featured_gigs_widget.dart';
import './widgets/home_app_bar_widget.dart';
import './widgets/recent_gigs_widget.dart';

class HomeTabScreen extends ConsumerStatefulWidget {
  const HomeTabScreen({super.key});

  @override
  ConsumerState<HomeTabScreen> createState() => _HomeTabScreenState();
}

class _HomeTabScreenState extends ConsumerState<HomeTabScreen> {
  String _userName = 'Student';
  String _selectedCategoryId = 'all';

  // TODO: Replace with Riverpod state binding for production
  @override
  void initState() {
    super.initState();
    _loadUserName();
  }

  Future<void> _loadUserName() async {
    final name = await SecureStorage.instance.getUserName();
    if (mounted && name != null) {
      setState(() => _userName = name.split(' ').first);
    } else if (mounted) {
      setState(() => _userName = 'Kwame'); // demo fallback
    }
  }

  Future<void> _onRefresh() async {
    await ref
        .read(gigFeedNotifierProvider.notifier)
        .fetchGigs(
          categoryId: _selectedCategoryId == 'all' ? null : _selectedCategoryId,
        );
  }

  void _onCategorySelected(String categoryId) {
    setState(() => _selectedCategoryId = categoryId);
    ref
        .read(gigFeedNotifierProvider.notifier)
        .fetchGigs(categoryId: categoryId == 'all' ? null : categoryId);
  }

  @override
  Widget build(BuildContext context) {
    final gigsAsync = ref.watch(gigFeedNotifierProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _onRefresh,
          color: AppColors.primary,
          child: CustomScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            slivers: [
              // Fixed app bar
              SliverToBoxAdapter(child: HomeAppBarWidget(userName: _userName)),
              // Category chips
              SliverToBoxAdapter(
                child: CategoryChipsWidget(
                  selectedId: _selectedCategoryId,
                  onSelected: _onCategorySelected,
                ),
              ),
              // Featured banner
              const SliverToBoxAdapter(child: FeaturedBannerWidget()),
              // Featured gigs horizontal scroll
              SliverToBoxAdapter(
                child: FeaturedGigsWidget(gigsAsync: gigsAsync),
              ),
              // Recent gigs vertical list
              SliverToBoxAdapter(child: RecentGigsWidget(gigsAsync: gigsAsync)),
              const SliverToBoxAdapter(child: SizedBox(height: 24)),
            ],
          ),
        ),
      ),
    );
  }
}
