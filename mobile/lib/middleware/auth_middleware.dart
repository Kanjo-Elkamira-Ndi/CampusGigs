import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../core/storage/secure_storage.dart';
import '../core/constants/role_constants.dart';
import '../routes/route_names.dart';

class AuthMiddleware extends ChangeNotifier {
  AuthMiddleware._();
  static final AuthMiddleware instance = AuthMiddleware._();

  Future<String?> redirect(BuildContext context, GoRouterState state) async {
    final token = await SecureStorage.instance.getToken();
    final isLoggedIn = token != null && token.isNotEmpty;
    final location = state.matchedLocation;

    final authRoutes = [RouteNames.splash, RouteNames.onboarding, RouteNames.login,
      RouteNames.register, RouteNames.forgotPassword, RouteNames.roleSelection];

    if (!isLoggedIn && !authRoutes.contains(location)) {
      return RouteNames.login;
    }

    if (isLoggedIn && authRoutes.contains(location) && location != RouteNames.splash) {
      final role = await SecureStorage.instance.getRole() ?? RoleConstants.worker;
      if (role == RoleConstants.poster) return RouteNames.posterDashboard;
      return RouteNames.workerHome;
    }

    return null;
  }
}
