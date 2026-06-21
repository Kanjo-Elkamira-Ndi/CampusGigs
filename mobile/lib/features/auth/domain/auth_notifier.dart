import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/models/user_model.dart';
import '../data/repositories/auth_repository.dart';

// TODO: Replace with Riverpod code generation (@riverpod annotation) for production
class AuthNotifier extends AsyncNotifier<UserModel?> {
  final _repo = AuthRepository();

  @override
  Future<UserModel?> build() async {
    return null;
  }

  Future<void> login(String email, String password) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => _repo.login(email, password));
  }

  Future<void> register({
    required String name,
    required String email,
    required String password,
    required String role,
    required String university,
  }) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => _repo.register(
        name: name,
        email: email,
        password: password,
        role: role,
        university: university,
      ),
    );
  }

  Future<void> forgotPassword(String email) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      await _repo.forgotPassword(email);
      return null;
    });
  }

  Future<void> logout() async {
    await _repo.logout();
    state = const AsyncData(null);
  }
}

final authNotifierProvider = AsyncNotifierProvider<AuthNotifier, UserModel?>(
  () => AuthNotifier(),
);
