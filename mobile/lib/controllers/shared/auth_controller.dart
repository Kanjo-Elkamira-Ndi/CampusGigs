import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../dto/auth/login_request_dto.dart';
import '../../dto/auth/register_request_dto.dart';
import '../../dto/user/user_dto.dart';
import '../../core/storage/secure_storage.dart';
import '../../core/errors/exceptions.dart';
import '../../services/shared/auth_service.dart';

class AuthNotifier extends AsyncNotifier<UserDto?> {
  @override
  Future<UserDto?> build() async {
    final token = await SecureStorage.instance.getToken();
    if (token == null || token.isEmpty) return null;
    try {
      final authService = ref.read(authServiceProvider);
      return await authService.me();
    } on AppException {
      await SecureStorage.instance.clearAll();
      return null;
    }
  }

  Future<void> login(LoginRequestDto dto) async {
    state = const AsyncLoading();
    try {
      final authService = ref.read(authServiceProvider);
      final user = await authService.login(dto);
      if (user.token != null) {
        await SecureStorage.instance.saveToken(user.token!);
      }
      await SecureStorage.instance.saveUserId(user.id);
      await SecureStorage.instance.saveRole(user.activeRole);
      state = AsyncData(user);
    } catch (e, st) {
      state = AsyncError(e, st);
    }
  }

  Future<void> register(RegisterRequestDto dto) async {
    state = const AsyncLoading();
    try {
      final authService = ref.read(authServiceProvider);
      final user = await authService.register(dto);
      if (user.token != null) {
        await SecureStorage.instance.saveToken(user.token!);
      }
      await SecureStorage.instance.saveUserId(user.id);
      await SecureStorage.instance.saveRole(user.activeRole);
      state = AsyncData(user);
    } catch (e, st) {
      state = AsyncError(e, st);
    }
  }

  Future<void> forgotPassword(String email) async {
    try {
      final authService = ref.read(authServiceProvider);
      await authService.forgotPassword(email);
    } catch (e, st) {
      state = AsyncError(e, st);
      rethrow;
    }
  }

  Future<void> logout() async {
    await SecureStorage.instance.clearAll();
    state = const AsyncData(null);
  }
}

final authControllerProvider = AsyncNotifierProvider<AuthNotifier, UserDto?>(AuthNotifier.new);
