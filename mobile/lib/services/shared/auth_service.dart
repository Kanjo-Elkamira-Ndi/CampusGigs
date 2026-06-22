import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';
import '../../api/api_client.dart';
import '../../api/api_endpoints.dart';
import '../../api/api_response_handler.dart';
import '../../dto/auth/login_request_dto.dart';
import '../../dto/auth/register_request_dto.dart';
import '../../dto/auth/password_reset_dto.dart';
import '../../dto/user/user_dto.dart';

class AuthService {
  final Dio _dio;

  AuthService(this._dio);

  Future<UserDto> login(LoginRequestDto dto) async {
    final response = await _dio.post(ApiEndpoints.login, data: dto.toJson());
    return parseResponse(response, (json) {
      final map = json as Map<String, dynamic>;
      final userData = map['user'] as Map<String, dynamic>? ?? map;
      final token = map['token'] as String?;
      final user = UserDto.fromJson(userData);
      return UserDto(
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        university: user.university,
        activeRole: user.activeRole,
        isVerified: user.isVerified,
        token: token,
        createdAt: user.createdAt,
      );
    });
  }

  Future<UserDto> register(RegisterRequestDto dto) async {
    final response = await _dio.post(ApiEndpoints.register, data: dto.toJson());
    return parseResponse(response, (json) {
      final map = json as Map<String, dynamic>;
      final userData = map['user'] as Map<String, dynamic>? ?? map;
      final token = map['token'] as String?;
      final user = UserDto.fromJson(userData);
      return UserDto(
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        university: user.university,
        activeRole: user.activeRole,
        isVerified: user.isVerified,
        token: token,
        createdAt: user.createdAt,
      );
    });
  }

  Future<void> forgotPassword(String email) async {
    final dto = ForgotPasswordDto(email: email);
    final response = await _dio.post(ApiEndpoints.forgotPassword, data: dto.toJson());
    parseResponse(response, (_) => null);
  }

  Future<void> resetPassword(String token, String newPassword) async {
    final dto = ResetPasswordDto(token: token, newPassword: newPassword);
    final response = await _dio.post(ApiEndpoints.resetPassword, data: dto.toJson());
    parseResponse(response, (_) => null);
  }

  Future<UserDto> me() async {
    final response = await _dio.get(ApiEndpoints.me);
    return parseResponse(response, (json) => UserDto.fromJson(json as Map<String, dynamic>));
  }
}

final authServiceProvider = Provider<AuthService>((ref) {
  final dio = ref.watch(apiClientProvider);
  return AuthService(dio);
});
