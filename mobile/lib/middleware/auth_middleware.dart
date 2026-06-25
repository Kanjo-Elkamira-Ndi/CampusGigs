import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../controllers/shared/auth_controller.dart';
import '../routes/route_names.dart';

class AuthMiddleware {
  static String? redirect(BuildContext context, GoRouterState state) {
    final authState = ProviderScope.containerOf(context).read(authControllerProvider);
    final location = state.matchedLocation;

    final publicRoutes = [
      RouteNames.splash,
      RouteNames.onboarding,
      RouteNames.login,
      RouteNames.register,
      RouteNames.forgotPassword,
      RouteNames.roleSelection,
    ];

    final isAuthRoute = publicRoutes.contains(location);

    return authState.when(
      loading: () => null,
      error: (_, __) => isAuthRoute ? null : RouteNames.login,
      data: (user) {
        if (user != null && isAuthRoute && location != RouteNames.splash) {
          return user.activeRole == 'POSTER' ? RouteNames.posterDashboard : RouteNames.workerHome;
        }
        if (user == null && !isAuthRoute) {
          return RouteNames.login;
        }
        return null;
      },
    );
  }
}
