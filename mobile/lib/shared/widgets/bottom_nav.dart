import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';

// V4 Snake Indicator Bottom Navigation
class AppNavigation extends StatefulWidget {
  final StatefulNavigationShell navigationShell;

  const AppNavigation({required this.navigationShell, super.key});

  @override
  State<AppNavigation> createState() => _AppNavigationState();
}

class _AppNavigationState extends State<AppNavigation>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _capsuleX;
  int _prevIndex = 0;
  double _tabWidth = 0;

  static const List<_TabSpec> _tabs = [
    _TabSpec(
      label: 'Home',
      icon: Icons.home_outlined,
      selectedIcon: Icons.home_rounded,
      branchIndex: 0,
    ),
    _TabSpec(
      label: 'Search',
      icon: Icons.search_outlined,
      selectedIcon: Icons.search_rounded,
      branchIndex: null,
    ),
    _TabSpec(
      label: 'Gigs',
      icon: Icons.layers_outlined,
      selectedIcon: Icons.layers_rounded,
      branchIndex: null,
    ),
    _TabSpec(
      label: 'Messages',
      icon: Icons.chat_bubble_outline_rounded,
      selectedIcon: Icons.chat_bubble_rounded,
      branchIndex: null,
    ),
    _TabSpec(
      label: 'Profile',
      icon: Icons.person_outline_rounded,
      selectedIcon: Icons.person_rounded,
      branchIndex: null,
    ),
  ];

  int get _selectedVisualIndex => widget.navigationShell.currentIndex;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    _capsuleX = Tween<double>(begin: 0, end: 0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOutCubic),
    );
  }

  void _onTabTap(int visualIndex) {
    final spec = _tabs[visualIndex];
    if (spec.branchIndex == null) return; // stub tab

    if (visualIndex != _prevIndex) {
      final newX = visualIndex * _tabWidth;
      final oldX = _prevIndex * _tabWidth;
      _capsuleX = Tween<double>(begin: oldX, end: newX).animate(
        CurvedAnimation(parent: _controller, curve: Curves.easeInOutCubic),
      );
      _controller.forward(from: 0);
      _prevIndex = visualIndex;
    }

    widget.navigationShell.goBranch(
      spec.branchIndex!,
      initialLocation: spec.branchIndex == widget.navigationShell.currentIndex,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return LayoutBuilder(
      builder: (context, constraints) {
        _tabWidth = constraints.maxWidth / _tabs.length;
        return Container(
          height: 64 + MediaQuery.of(context).padding.bottom,
          decoration: BoxDecoration(
            color: theme.colorScheme.surface,
            border: Border(
              top: BorderSide(
                color: theme.colorScheme.outlineVariant,
                width: 1,
              ),
            ),
          ),
          child: Padding(
            padding: EdgeInsets.only(
              bottom: MediaQuery.of(context).padding.bottom,
            ),
            child: Stack(
              children: [
                // Snake capsule
                AnimatedBuilder(
                  animation: _capsuleX,
                  builder: (context, _) {
                    return Positioned(
                      left: _capsuleX.value + (_tabWidth - 56) / 2,
                      top: 6,
                      child: Container(
                        width: 56,
                        height: 32,
                        decoration: BoxDecoration(
                          color: AppColors.primaryContainer,
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                    );
                  },
                ),
                // Tab items
                Row(
                  children: List.generate(_tabs.length, (i) {
                    final tab = _tabs[i];
                    final isActive = i == _selectedVisualIndex;
                    final isStub = tab.branchIndex == null;
                    return GestureDetector(
                      onTap: () => _onTabTap(i),
                      behavior: HitTestBehavior.opaque,
                      child: Opacity(
                        opacity: isStub ? 0.4 : 1.0,
                        child: SizedBox(
                          width: _tabWidth,
                          height: 64,
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                isActive ? tab.selectedIcon : tab.icon,
                                size: 22,
                                color: isActive
                                    ? AppColors.primary
                                    : AppColors.textMuted,
                              ),
                              const SizedBox(height: 3),
                              Text(
                                tab.label,
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: isActive
                                      ? FontWeight.w700
                                      : FontWeight.w400,
                                  color: isActive
                                      ? AppColors.primary
                                      : AppColors.textMuted,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  }),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _TabSpec {
  final String label;
  final IconData icon;
  final IconData selectedIcon;
  final int? branchIndex;

  const _TabSpec({
    required this.label,
    required this.icon,
    required this.selectedIcon,
    required this.branchIndex,
  });
}

class AppScaffoldShell extends StatelessWidget {
  final StatefulNavigationShell navigationShell;

  const AppScaffoldShell({required this.navigationShell, super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: AppNavigation(navigationShell: navigationShell),
    );
  }
}
