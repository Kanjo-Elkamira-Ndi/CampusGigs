import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../widgets/common/offline_banner.dart';
import 'chat/chat_list_page.dart';
import 'profile/profile_page.dart' as profile;
import 'profile/settings_page.dart' as settings;
import '../shared/notifications_page.dart';

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
      body: Column(
        children: [
          const OfflineBanner(),
          Expanded(child: navigationShell),
        ],
      ),
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
    return const Center(child: Text('Dashboard - coming soon'));
  }
}

class PosterGigsPage extends StatelessWidget {
  const PosterGigsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(child: Text('My Gigs - coming soon'));
  }
}

class PosterCreateGigPage extends StatelessWidget {
  const PosterCreateGigPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(child: Text('Post a Gig - coming soon'));
  }
}

class PosterMessagesPage extends StatelessWidget {
  const PosterMessagesPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const PosterChatListPage();
  }
}

class PosterNotificationsPage extends StatelessWidget {
  const PosterNotificationsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const NotificationsPage();
  }
}

class PosterProfilePage extends StatelessWidget {
  const PosterProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return const profile.PosterProfilePage();
  }
}

class PosterSettingsPage extends StatelessWidget {
  const PosterSettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const settings.PosterSettingsPage();
  }
}

