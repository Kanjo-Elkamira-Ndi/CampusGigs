import 'package:dio/dio.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/storage/secure_storage.dart';
import '../models/user_model.dart';

class AuthRepository {
  final Dio _dio = ApiClient.instance.dio;

  Future<UserModel> login(String email, String password) async {
    final response = await _dio.post(
      ApiConstants.login,
      data: {'email': email, 'password': password},
    );
    final data = response.data['data'] as Map<String, dynamic>;
    final token = data['token'] as String;
    final user = UserModel.fromMap(data['user'] as Map<String, dynamic>);
    await SecureStorage.instance.saveToken(token);
    await SecureStorage.instance.saveUserId(user.id);
    await SecureStorage.instance.saveRole(user.role);
    await SecureStorage.instance.saveUserName(user.name);
    return user;
  }

  Future<UserModel> register({
    required String name,
    required String email,
    required String password,
    required String role,
    required String university,
  }) async {
    final response = await _dio.post(
      ApiConstants.register,
      data: {
        'name': name,
        'email': email,
        'password': password,
        'role': role,
        'university': university,
      },
    );
    final data = response.data['data'] as Map<String, dynamic>;
    final token = data['token'] as String;
    final user = UserModel.fromMap(data['user'] as Map<String, dynamic>);
    await SecureStorage.instance.saveToken(token);
    await SecureStorage.instance.saveUserId(user.id);
    await SecureStorage.instance.saveRole(user.role);
    await SecureStorage.instance.saveUserName(user.name);
    return user;
  }

  Future<void> forgotPassword(String email) async {
    await _dio.post(ApiConstants.forgotPassword, data: {'email': email});
  }

  Future<void> resetPassword(String token, String password) async {
    await _dio.post(
      ApiConstants.resetPassword,
      data: {'token': token, 'password': password},
    );
  }

  Future<void> logout() async {
    await SecureStorage.instance.clearAll();
  }
}
