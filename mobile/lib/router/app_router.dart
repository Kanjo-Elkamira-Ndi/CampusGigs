import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../core/constants/app_colors.dart';
import '../core/storage/secure_storage.dart';
import '../presentation/login_screen/login_screen.dart';
import '../presentation/home_tab_screen/home_tab_screen.dart';
import '../presentation/gig_detail_screen/gig_detail_screen.dart';
import '../shared/widgets/bottom_nav.dart';

class AppRoutes {
  AppRoutes._();

  static const String initial = '/';
  static const String loginScreen = '/login-screen';
  static const String homeTabScreen = '/home-tab-screen';
  static const String searchTabScreen = '/search-tab-screen';
  static const String gigsTabScreen = '/gigs-tab-screen';
  static const String messagesTabScreen = '/messages-tab-screen';
  static const String profileTabScreen = '/profile-tab-screen';
  static const String gigDetailScreen = '/gig-detail-screen';
}

final GoRouter appRouter = GoRouter(
  initialLocation: AppRoutes.initial,
  routes: [
    GoRoute(
      path: AppRoutes.initial,
      pageBuilder: (context, state) => CustomTransitionPage(
        key: state.pageKey,
        child: const _SplashRedirect(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(
            opacity: CurvedAnimation(
              parent: animation,
              curve: Curves.easeOutCubic,
            ),
            child: child,
          );
        },
        transitionDuration: const Duration(milliseconds: 280),
      ),
    ),
    GoRoute(
      path: AppRoutes.loginScreen,
      pageBuilder: (context, state) => CustomTransitionPage(
        key: state.pageKey,
        child: const LoginScreen(),
        transitionsBuilder: (context, animation, _, child) => FadeTransition(
          opacity: CurvedAnimation(
            parent: animation,
            curve: Curves.easeOutCubic,
          ),
          child: child,
        ),
        transitionDuration: const Duration(milliseconds: 280),
      ),
    ),
    StatefulShellRoute.indexedStack(
      builder: (context, state, navigationShell) =>
          AppScaffoldShell(navigationShell: navigationShell),
      branches: [
        // Branch 0 — Home
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: AppRoutes.homeTabScreen,
              pageBuilder: (context, state) =>
                  const NoTransitionPage(child: HomeTabScreen()),
            ),
          ],
        ),
        // Branch 1 — Search
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: AppRoutes.searchTabScreen,
              pageBuilder: (context, state) => const NoTransitionPage(
                child: _PlaceholderTab(label: 'Search'),
              ),
            ),
          ],
        ),
        // Branch 2 — Gigs / Applications
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: AppRoutes.gigsTabScreen,
              pageBuilder: (context, state) =>
                  const NoTransitionPage(child: _PlaceholderTab(label: 'Gigs')),
            ),
          ],
        ),
        // Branch 3 — Messages
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: AppRoutes.messagesTabScreen,
              pageBuilder: (context, state) => const NoTransitionPage(
                child: _PlaceholderTab(label: 'Messages'),
              ),
            ),
          ],
        ),
        // Branch 4 — Profile
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: AppRoutes.profileTabScreen,
              pageBuilder: (context, state) => const NoTransitionPage(
                child: _PlaceholderTab(label: 'Profile'),
              ),
            ),
          ],
        ),
      ],
    ),
    GoRoute(
      path: AppRoutes.gigDetailScreen,
      pageBuilder: (context, state) {
        final gig = state.extra;
        return CustomTransitionPage(
          key: state.pageKey,
          child: GigDetailScreen(gigExtra: gig),
          transitionsBuilder: (context, animation, _, child) => SlideTransition(
            position:
                Tween<Offset>(
                  begin: const Offset(0.04, 0),
                  end: Offset.zero,
                ).animate(
                  CurvedAnimation(
                    parent: animation,
                    curve: Curves.easeOutCubic,
                  ),
                ),
            child: FadeTransition(opacity: animation, child: child),
          ),
          transitionDuration: const Duration(milliseconds: 280),
        );
      },
    ),
  ],
);

// ── Splash / redirect ────────────────────────────────────────────────────────

class _SplashRedirect extends StatefulWidget {
  const _SplashRedirect();

  @override
  State<_SplashRedirect> createState() => _SplashRedirectState();
}

class _SplashRedirectState extends State<_SplashRedirect> {
  @override
  void initState() {
    super.initState();
    _redirect();
  }

  Future<void> _redirect() async {
    try {
      final token = await SecureStorage.instance.getToken();
      if (!mounted) return;
      if (token != null && token.isNotEmpty) {
        context.go(AppRoutes.homeTabScreen);
      } else {
        context.go(AppRoutes.loginScreen);
      }
    } catch (_) {
      // Storage read failed (e.g. first run on web before SharedPreferences
      // is initialised). Treat as unauthenticated and go to login.
      if (mounted) context.go(AppRoutes.loginScreen);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primary,
      body: const Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Campus Gigs',
              style: TextStyle(
                color: Colors.white,
                fontSize: 28,
                fontWeight: FontWeight.w800,
                letterSpacing: -0.5,
              ),
            ),
            SizedBox(height: 8),
            Text(
              'Student gig marketplace',
              style: TextStyle(
                color: Colors.white70,
                fontSize: 14,
                fontWeight: FontWeight.w400,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Placeholder tab screens ──────────────────────────────────────────────────

class _PlaceholderTab extends StatelessWidget {
  final String label;
  const _PlaceholderTab({required this.label});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: theme.colorScheme.surface,
      body: Center(
        child: Text(
          label,
          style: theme.textTheme.displaySmall?.copyWith(
            color: theme.colorScheme.onSurface.withAlpha(38),
            fontWeight: FontWeight.w800,
          ),
        ),
      ),
    );
  }
}
