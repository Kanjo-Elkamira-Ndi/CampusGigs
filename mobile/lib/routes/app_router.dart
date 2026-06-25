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
import '../pages/worker/gig_detail/gig_detail_page.dart';
import '../pages/worker/search/filter_page.dart';
import '../pages/worker/saved/saved_gigs_page.dart';
import '../pages/worker/dashboard/worker_dashboard_page.dart';
import '../pages/poster/poster_shell.dart';
import '../pages/shared/notifications_page.dart';
import '../pages/shared/messages_page.dart';
import '../pages/shared/freelancer_directory_page.dart';
import '../pages/shared/freelancer_detail_page.dart';
import '../pages/worker/profile/edit_profile_page.dart';
import '../pages/worker/profile/reviews_page.dart';
import '../pages/worker/settings/notification_preferences_page.dart';
import '../pages/shared/error/not_found_page.dart';
import '../middleware/role_guard_middleware.dart';

final GoRouter appRouter = GoRouter(
  initialLocation: RouteNames.splash,
  errorBuilder: (context, state) => const NotFoundPage(),
  redirect: (context, state) {
    final authRedirect = AuthMiddleware.redirect(context, state);
    if (authRedirect != null) return authRedirect;
    return RoleGuardMiddleware.redirect(context, state);
  },
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
    GoRoute(
      path: RouteNames.workerGigDetail,
      builder: (context, state) {
        final gigId = state.pathParameters['id']!;
        return GigDetailPage(gigId: gigId);
      },
    ),
    GoRoute(
      path: RouteNames.workerSearchFilter,
      builder: (context, state) => const FilterPage(),
    ),
    GoRoute(
      path: RouteNames.workerSaved,
      builder: (context, state) => const SavedGigsPage(),
    ),
    GoRoute(
      path: RouteNames.workerDashboard,
      builder: (context, state) => const WorkerDashboardPage(),
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
    GoRoute(
      path: RouteNames.workerNotifications,
      builder: (context, state) => const NotificationsPage(),
    ),
    GoRoute(
      path: RouteNames.workerMessagesDetail,
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return MessagesPage(conversationId: id);
      },
    ),
    GoRoute(
      path: RouteNames.workerFreelancers,
      builder: (context, state) => const FreelancerDirectoryPage(),
    ),
    GoRoute(
      path: RouteNames.workerFreelancerDetail,
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return FreelancerDetailPage(freelancerId: id);
      },
    ),
    GoRoute(
      path: RouteNames.posterNotifications,
      builder: (context, state) => const NotificationsPage(),
    ),
    GoRoute(
      path: RouteNames.posterMessagesDetail,
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return MessagesPage(conversationId: id);
      },
    ),
    GoRoute(
      path: RouteNames.posterSettings,
      builder: (context, state) => const PosterSettingsPage(),
    ),
    GoRoute(
      path: RouteNames.workerEditProfile,
      builder: (context, state) => const WorkerEditProfilePage(),
    ),
    GoRoute(
      path: RouteNames.workerReviews,
      builder: (context, state) => const WorkerReviewsPage(),
    ),
    GoRoute(
      path: RouteNames.workerNotificationPrefs,
      builder: (context, state) => const WorkerNotificationPreferencesPage(),
    ),
  ],
);
