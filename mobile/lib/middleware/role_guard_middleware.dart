import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../controllers/shared/auth_controller.dart';
import '../routes/route_names.dart';

class RoleGuardMiddleware {
  static String? redirect(BuildContext context, GoRouterState state) {
    final authState = ProviderScope.containerOf(context).read(authControllerProvider);
    final location = state.matchedLocation;

    return authState.when(
      loading: () => null,
      error: (_, __) => null,
      data: (user) {
        if (user == null) return null;
        final role = user.activeRole;
        if (location.startsWith('/worker') && role != 'WORKER') {
          return RouteNames.posterDashboard;
        }
        if (location.startsWith('/poster') && role != 'POSTER') {
          return RouteNames.workerHome;
        }
        return null;
      },
    );
  }
}
