import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorage {
  SecureStorage._();
  static final SecureStorage instance = SecureStorage._();

  static const FlutterSecureStorage _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
  );

  static const String tokenKey = 'auth_token';
  static const String userIdKey = 'user_id';
  static const String roleKey = 'active_role';

  Future<void> saveToken(String token) => _storage.write(key: tokenKey, value: token);
  Future<String?> getToken() => _storage.read(key: tokenKey);
  Future<void> deleteToken() => _storage.delete(key: tokenKey);

  Future<void> saveUserId(String userId) => _storage.write(key: userIdKey, value: userId);
  Future<String?> getUserId() => _storage.read(key: userIdKey);

  Future<void> saveRole(String role) => _storage.write(key: roleKey, value: role);
  Future<String?> getRole() => _storage.read(key: roleKey);

  Future<void> clearAll() => _storage.deleteAll();
}

final secureStorageProvider = Provider<SecureStorage>((ref) => SecureStorage.instance);
