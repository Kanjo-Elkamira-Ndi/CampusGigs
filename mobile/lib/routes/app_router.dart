import 'package:go_router/go_router.dart';
import '../middleware/auth_middleware.dart';
import 'route_names.dart';
import '../pages/splash/splash_page.dart';
import '../pages/onboarding/onboarding_page.dart';
import '../pages/auth/login_page.dart';
import '../pages/auth/register_page.dart';
import '../pages/auth/forgot_password_page.dart';
import '../pages/auth/role_selection_page.dart';
import '../pages/worker/worker_shell.dart';
import '../pages/poster/poster_shell.dart';

final GoRouter appRouter = GoRouter(
  initialLocation: RouteNames.splash,
  redirect: AuthMiddleware.instance.redirect,
  routes: [
    GoRoute(
      path: RouteNames.splash,
      name: 'splash',
      builder: (context, state) => const SplashPage(),
    ),
    GoRoute(
      path: RouteNames.onboarding,
      name: 'onboarding',
      builder: (context, state) => const OnboardingPage(),
    ),
    GoRoute(
      path: RouteNames.login,
      name: 'login',
      builder: (context, state) => const LoginPage(),
    ),
    GoRoute(
      path: RouteNames.register,
      name: 'register',
      builder: (context, state) => const RegisterPage(),
    ),
    GoRoute(
      path: RouteNames.forgotPassword,
      name: 'forgot-password',
      builder: (context, state) => const ForgotPasswordPage(),
    ),
    GoRoute(
      path: RouteNames.roleSelection,
      name: 'role-selection',
      builder: (context, state) => const RoleSelectionPage(),
    ),
    StatefulShellRoute.indexedStack(
      builder: (context, state, navigationShell) => WorkerShell(navigationShell: navigationShell),
      branches: [
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: RouteNames.workerHome,
              builder: (context, state) => const WorkerHomePage(),
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: RouteNames.workerSearch,
              builder: (context, state) => const WorkerSearchPage(),
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: RouteNames.workerApplications,
              builder: (context, state) => const WorkerApplicationsPage(),
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: RouteNames.workerMessages,
              builder: (context, state) => const WorkerMessagesPage(),
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: RouteNames.workerProfile,
              builder: (context, state) => const WorkerProfilePage(),
            ),
          ],
        ),
      ],
    ),
    StatefulShellRoute.indexedStack(
      builder: (context, state, navigationShell) => PosterShell(navigationShell: navigationShell),
      branches: [
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: RouteNames.posterDashboard,
              builder: (context, state) => const PosterDashboardPage(),
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: RouteNames.posterGigs,
              builder: (context, state) => const PosterGigsPage(),
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: RouteNames.posterPost,
              builder: (context, state) => const PosterCreateGigPage(),
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: RouteNames.posterMessages,
              builder: (context, state) => const PosterMessagesPage(),
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: RouteNames.posterProfile,
              builder: (context, state) => const PosterProfilePage(),
            ),
          ],
        ),
      ],
    ),
  ],
);
