import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/constants/app_colors.dart';
import '../../core/storage/secure_storage.dart';
import '../../core/utils/currency_formatter.dart';
import '../../features/gigs/data/models/gig_model.dart';
import '../../features/gigs/domain/gig_feed_notifier.dart';
import './widgets/gig_addons_widget.dart';
import './widgets/gig_datetime_widget.dart';
import './widgets/gig_detail_hero_widget.dart';
import './widgets/gig_included_widget.dart';
import './widgets/gig_plan_selector_widget.dart';
import './widgets/gig_provider_card_widget.dart';
import './widgets/gig_reviews_widget.dart';
import './widgets/gig_sticky_bottom_widget.dart';

class GigDetailScreen extends ConsumerStatefulWidget {
  final dynamic gigExtra;

  const GigDetailScreen({this.gigExtra, super.key});

  @override
  ConsumerState<GigDetailScreen> createState() => _GigDetailScreenState();
}

class _GigDetailScreenState extends ConsumerState<GigDetailScreen> {
  GigModel? _gig;
  String _selectedPlan = 'Classic';
  String _selectedDate = '';
  String _selectedTime = '';
  bool _isWorker = true;

  // TODO: Replace with real API fetch via GigDetailNotifier for production
  @override
  void initState() {
    super.initState();
    if (widget.gigExtra is GigModel) {
      _gig = widget.gigExtra as GigModel;
    } else {
      // Fallback: load first gig from feed
      WidgetsBinding.instance.addPostFrameCallback((_) {
        final gigsState = ref.read(gigFeedNotifierProvider);
        gigsState.whenData((gigs) {
          if (gigs.isNotEmpty && mounted) {
            setState(() => _gig = gigs.first);
          }
        });
      });
    }
    _loadRole();
  }

  Future<void> _loadRole() async {
    final role = await SecureStorage.instance.getRole();
    if (mounted) setState(() => _isWorker = role != 'POSTER');
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    if (_gig == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final gig = _gig!;
    final planPrices = {
      'Classic': gig.budget,
      'Premium': (gig.budget * 1.16).round(),
      'Platinum': (gig.budget * 1.24).round(),
    };
    final selectedPrice = planPrices[_selectedPlan] ?? gig.budget;

    return Scaffold(
      backgroundColor: AppColors.background,
      extendBodyBehindAppBar: true,
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              // Hero image```dart
              SliverToBoxAdapter(child: GigDetailHeroWidget(gig: gig)),
              // Scrollable content
              SliverToBoxAdapter(
                child: Container(
                  decoration: const BoxDecoration(
                    color: AppColors.background,
                    borderRadius: BorderRadius.vertical(
                      top: Radius.circular(24),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 20),
                      // Title + discount badge
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Expanded(
                              child: Text(
                                gig.title,
                                style: Theme.of(context).textTheme.headlineSmall
                                    ?.copyWith(
                                      fontWeight: FontWeight.w800,
                                      color: AppColors.textPrimary,
                                      height: 1.2,
                                    ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 6,
                              ),
                              decoration: BoxDecoration(
                                color: AppColors.success,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Column(
                                children: [
                                  const Text(
                                    'Up to',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 9,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  const Text(
                                    '20%',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 14,
                                      fontWeight: FontWeight.w800,
                                    ),
                                  ),
                                  const Text(
                                    'Off',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 9,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 8),
                      // Subtitle + university + time
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Text(
                          gig.description.length > 80
                              ? '${gig.description.substring(0, 80)}…'
                              : gig.description,
                          style: Theme.of(context).textTheme.bodyMedium
                              ?.copyWith(
                                color: AppColors.textSecondary,
                                height: 1.5,
                              ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      // Price row
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Row(
                          children: [
                            Text(
                              CurrencyFormatter.formatXAF(selectedPrice),
                              style: Theme.of(context).textTheme.headlineSmall
                                  ?.copyWith(
                                    fontWeight: FontWeight.w800,
                                    color: AppColors.textPrimary,
                                  ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              CurrencyFormatter.formatXAF(
                                (selectedPrice * 1.2).round(),
                              ),
                              style: Theme.of(context).textTheme.bodyMedium
                                  ?.copyWith(
                                    color: AppColors.textMuted,
                                    decoration: TextDecoration.lineThrough,
                                  ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      // Plan selector
                      GigPlanSelectorWidget(
                        selectedPlan: _selectedPlan,
                        baseBudget: gig.budget,
                        onPlanSelected: (plan) =>
                            setState(() => _selectedPlan = plan),
                      ),
                      const SizedBox(height: 16),
                      // Provider card
                      GigProviderCardWidget(gig: gig),
                      const SizedBox(height: 16),
                      // About section
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'About this Gig',
                              style: Theme.of(context).textTheme.titleMedium
                                  ?.copyWith(
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.textPrimary,
                                  ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              gig.description,
                              style: Theme.of(context).textTheme.bodyMedium
                                  ?.copyWith(
                                    color: AppColors.textSecondary,
                                    height: 1.6,
                                  ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      // What's included
                      const GigIncludedWidget(),
                      const SizedBox(height: 16),
                      // Add-ons
                      const GigAddonsWidget(),
                      const SizedBox(height: 16),
                      // Reviews
                      const GigReviewsWidget(),
                      const SizedBox(height: 16),
                      // Date & time selector
                      GigDateTimeWidget(
                        selectedDate: _selectedDate,
                        selectedTime: _selectedTime,
                        onDateSelected: (d) =>
                            setState(() => _selectedDate = d),
                        onTimeSelected: (t) =>
                            setState(() => _selectedTime = t),
                      ),
                      // Bottom padding for sticky bar
                      const SizedBox(height: 100),
                    ],
                  ),
                ),
              ),
            ],
          ),
          // Sticky bottom bar
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: GigStickyBottomWidget(
              price: selectedPrice,
              isWorker: _isWorker,
              isOwnGig: false,
              onAction: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      _isWorker
                          ? 'Application submitted!'
                          : 'Opening gig editor…',
                    ),
                    backgroundColor: AppColors.success,
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
