import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../core/storage/secure_storage.dart';
import '../core/constants/role_constants.dart';
import '../routes/route_names.dart';

class RoleGuardMiddleware extends ChangeNotifier {
  RoleGuardMiddleware._();
  static final RoleGuardMiddleware instance = RoleGuardMiddleware._();

  Future<String?> redirect(BuildContext context, GoRouterState state) async {
    final role = await SecureStorage.instance.getRole() ?? '';
    final location = state.matchedLocation;

    if (location.startsWith('/worker') && role != RoleConstants.worker) {
      return RouteNames.posterShell;
    }
    if (location.startsWith('/poster') && role != RoleConstants.poster) {
      return RouteNames.workerShell;
    }
    return null;
  }
}
