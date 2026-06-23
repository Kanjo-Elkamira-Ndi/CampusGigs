import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../dto/auth/login_request_dto.dart';
import '../../dto/auth/register_request_dto.dart';
import '../../dto/user/user_dto.dart';
import '../../data/mock_data.dart';
import '../../core/errors/exceptions.dart';

class AuthService {
  Future<UserDto> login(LoginRequestDto dto) async {
    await Future.delayed(const Duration(milliseconds: 800));

    final user = MockData.mockUsers[dto.email];
    if (user == null || dto.password != MockData.validPassword) {
      throw AppException('Invalid email or password', statusCode: 401);
    }
    return user;
  }

  Future<UserDto> register(RegisterRequestDto dto) async {
    await Future.delayed(const Duration(milliseconds: 800));

    if (MockData.mockUsers.containsKey(dto.email) || MockData.registeredUsers.containsKey(dto.email)) {
      throw AppException('An account with this email already exists', statusCode: 409);
    }

    final newUser = UserDto(
      id: '${MockData.registeredUsers.length + 10}',
      name: dto.name,
      email: dto.email,
      avatarUrl: null,
      university: dto.university,
      activeRole: dto.role,
      isVerified: false,
      token: MockData.defaultToken,
      createdAt: DateTime.now().toIso8601String(),
    );
    MockData.registeredUsers[dto.email] = newUser;
    return newUser;
  }

  Future<void> forgotPassword(String email) async {
    await Future.delayed(const Duration(milliseconds: 500));
    final exists = MockData.mockUsers.containsKey(email) || MockData.registeredUsers.containsKey(email);
    if (!exists) {
      throw AppException('No account found with this email', statusCode: 404);
    }
  }

  Future<void> resetPassword(String token, String newPassword) async {
    await Future.delayed(const Duration(milliseconds: 500));
    if (token != MockData.defaultToken) {
      throw AppException('Invalid or expired reset token', statusCode: 400);
    }
  }

  Future<UserDto> me() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return MockData.mockUsers.values.first;
  }
}

final authServiceProvider = Provider<AuthService>((ref) => AuthService());
