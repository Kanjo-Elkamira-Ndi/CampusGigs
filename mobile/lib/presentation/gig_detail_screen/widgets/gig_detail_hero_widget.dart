import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../features/gigs/data/models/gig_model.dart';
import '../../../features/gigs/domain/gig_feed_notifier.dart';

class GigDetailHeroWidget extends ConsumerWidget {
  final GigModel gig;

  const GigDetailHeroWidget({required this.gig, super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final categoryColor = Color(int.parse('FF${gig.categoryColor}', radix: 16));
    final statusBarHeight = MediaQuery.of(context).padding.top;

    return Hero(
      tag: 'gig-${gig.id}',
      child: Container(
        height: 280 + statusBarHeight,
        width: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [categoryColor.withAlpha(77), categoryColor.withAlpha(153)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Stack(
          children: [
            // Background pattern
            Positioned(
              right: -30,
              bottom: -30,
              child: Container(
                width: 160,
                height: 160,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withAlpha(20),
                ),
              ),
            ),
            Positioned(
              left: -20,
              top: statusBarHeight + 20,
              child: Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withAlpha(15),
                ),
              ),
            ),
            // Center illustration
            Center(
              child: Padding(
                padding: EdgeInsets.only(top: statusBarHeight),
                child: Icon(
                  _categoryIcon(gig.category),
                  size: 100,
                  color: Colors.white.withAlpha(102),
                ),
              ),
            ),
            // Overlaid action buttons
            Positioned(
              top: statusBarHeight + 8,
              left: 8,
              child: _HeroIconButton(
                icon: Icons.arrow_back_ios_new_rounded,
                onTap: () => context.pop(),
              ),
            ),
            Positioned(
              top: statusBarHeight + 8,
              right: 56,
              child: _HeroIconButton(
                icon: Icons.shopping_cart_outlined,
                onTap: () {},
              ),
            ),
            Positioned(
              top: statusBarHeight + 8,
              right: 8,
              child: _HeroIconButton(
                icon: gig.isSaved
                    ? Icons.favorite_rounded
                    : Icons.favorite_border_rounded,
                onTap: () => ref
                    .read(gigFeedNotifierProvider.notifier)
                    .toggleSave(gig.id),
                activeColor: gig.isSaved ? AppColors.error : null,
              ),
            ),
            // Category label
            Positioned(
              bottom: 16,
              left: 16,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 5,
                ),
                decoration: BoxDecoration(
                  color: Colors.white.withAlpha(230),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  gig.category,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: categoryColor,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  IconData _categoryIcon(String category) {
    switch (category.toLowerCase()) {
      case 'tech':
        return Icons.code_rounded;
      case 'design':
        return Icons.palette_outlined;
      case 'writing':
        return Icons.edit_note_rounded;
      case 'tutoring':
        return Icons.school_outlined;
      case 'delivery':
        return Icons.delivery_dining_rounded;
      case 'events':
        return Icons.event_outlined;
      default:
        return Icons.work_outline_rounded;
    }
  }
}

class _HeroIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  final Color? activeColor;

  const _HeroIconButton({
    required this.icon,
    required this.onTap,
    this.activeColor,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withAlpha(26),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Icon(
          icon,
          size: 18,
          color: activeColor ?? AppColors.textPrimary,
        ),
      ),
    );
  }
}
