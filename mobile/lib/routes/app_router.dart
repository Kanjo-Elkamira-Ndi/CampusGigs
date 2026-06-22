import 'package:flutter/material.dart';
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
    GoRoute(
      path: RouteNames.workerShell,
      name: 'worker-shell',
      builder: (context, state) => const WorkerShell(child: Center(child: Text('Worker shell'))),
    ),
    GoRoute(
      path: RouteNames.posterShell,
      name: 'poster-shell',
      builder: (context, state) => const PosterShell(child: Center(child: Text('Poster shell'))),
    ),
  ],
);
