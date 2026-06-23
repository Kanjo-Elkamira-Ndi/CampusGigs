import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_dimensions.dart';

class PosterShell extends StatelessWidget {
  final StatefulNavigationShell navigationShell;

  const PosterShell({super.key, required this.navigationShell});

  void _onTap(int index) {
    navigationShell.goBranch(
      index,
      initialLocation: index == navigationShell.currentIndex,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: Stack(
        children: [
          NavigationBar(
            selectedIndex: navigationShell.currentIndex,
            onDestinationSelected: _onTap,
            backgroundColor: AppColors.surface,
            elevation: 0,
            surfaceTintColor: Colors.transparent,
            indicatorColor: AppColors.primaryLight,
            height: 64,
            labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
            destinations: [
              NavigationDestination(
                icon: const Icon(Icons.dashboard_outlined),
                selectedIcon: const Icon(Icons.dashboard),
                label: 'Dashboard',
              ),
              NavigationDestination(
                icon: const Icon(Icons.work_outline),
                selectedIcon: const Icon(Icons.work),
                label: 'My Gigs',
              ),
              NavigationDestination(
                icon: Container(
                  width: 40,
                  height: 40,
                  decoration: const BoxDecoration(
                    color: AppColors.primary,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.add,
                    color: Colors.white,
                    size: 22,
                  ),
                ),
                selectedIcon: Container(
                  width: 40,
                  height: 40,
                  decoration: const BoxDecoration(
                    color: AppColors.primary,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.add,
                    color: Colors.white,
                    size: 22,
                  ),
                ),
                label: 'Post',
              ),
              NavigationDestination(
                icon: const Icon(Icons.chat_bubble_outline),
                selectedIcon: const Icon(Icons.chat_bubble),
                label: 'Messages',
              ),
              NavigationDestination(
                icon: const Icon(Icons.person_outline),
                selectedIcon: const Icon(Icons.person),
                label: 'Profile',
              ),
            ],
          ),
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: Container(
              height: 0.8,
              color: AppColors.border,
            ),
          ),
        ],
      ),
    );
  }
}

class PosterDashboardPage extends StatelessWidget {
  const PosterDashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return _PlaceholderPage(title: 'Dashboard');
  }
}

class PosterGigsPage extends StatelessWidget {
  const PosterGigsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return _PlaceholderPage(title: 'My Gigs');
  }
}

class PosterCreateGigPage extends StatelessWidget {
  const PosterCreateGigPage({super.key});

  @override
  Widget build(BuildContext context) {
    return _PlaceholderPage(title: 'Post a Gig');
  }
}

class PosterMessagesPage extends StatelessWidget {
  const PosterMessagesPage({super.key});

  @override
  Widget build(BuildContext context) {
    return _PlaceholderPage(title: 'Messages');
  }
}

class PosterProfilePage extends StatelessWidget {
  const PosterProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return _PlaceholderPage(title: 'Profile');
  }
}

class _PlaceholderPage extends StatelessWidget {
  final String title;

  const _PlaceholderPage({required this.title});

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
            title: Text(
              title,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
          ),
        ),
      ),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.construction_outlined,
              size: 48,
              color: AppColors.textMuted,
            ),
            const SizedBox(height: AppDimensions.md),
            Text(
              title,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                color: AppColors.textMuted,
              ),
            ),
            const SizedBox(height: AppDimensions.sm),
            Text(
              'Coming in next phase',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: AppColors.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
