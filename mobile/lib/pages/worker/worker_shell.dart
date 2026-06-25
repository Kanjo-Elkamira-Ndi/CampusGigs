import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../widgets/common/offline_banner.dart';
import 'home/home_page.dart';
import 'search/search_page.dart';
import 'applications/my_applications_page.dart';
import 'chat/chat_list_page.dart';
import 'profile/profile_page.dart' as profile;
import 'settings/settings_page.dart' as settings;

class WorkerShell extends StatelessWidget {
  final StatefulNavigationShell navigationShell;

  const WorkerShell({super.key, required this.navigationShell});

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
                icon: const Icon(Icons.home_outlined),
                selectedIcon: const Icon(Icons.home),
                label: 'Home',
              ),
              NavigationDestination(
                icon: const Icon(Icons.search),
                selectedIcon: const Icon(Icons.search),
                label: 'Search',
              ),
              NavigationDestination(
                icon: const Icon(Icons.layers_outlined),
                selectedIcon: const Icon(Icons.layers),
                label: 'Applications',
              ),
              NavigationDestination(
                icon: Stack(
                  clipBehavior: Clip.none,
                  children: [
                    const Icon(Icons.chat_bubble_outline),
                    Positioned(
                      top: -2,
                      right: -4,
                      child: Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: AppColors.error,
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                  ],
                ),
                selectedIcon: Stack(
                  clipBehavior: Clip.none,
                  children: [
                    const Icon(Icons.chat_bubble),
                    Positioned(
                      top: -2,
                      right: -4,
                      child: Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: AppColors.error,
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                  ],
                ),
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

class WorkerHomePage extends StatelessWidget {
  const WorkerHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return const HomePage();
  }
}

class WorkerSearchPage extends StatelessWidget {
  const WorkerSearchPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const SearchPage();
  }
}

class WorkerApplicationsPage extends StatelessWidget {
  const WorkerApplicationsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const MyApplicationsPage();
  }
}

class WorkerMessagesPage extends StatelessWidget {
  const WorkerMessagesPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const WorkerChatListPage();
  }
}

class WorkerProfilePage extends StatelessWidget {
  const WorkerProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return const profile.WorkerProfilePage();
  }
}

class WorkerSettingsPage extends StatelessWidget {
  const WorkerSettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const settings.WorkerSettingsPage();
  }
}

