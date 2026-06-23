import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SecureStorage {
  SecureStorage._();
  static final SecureStorage instance = SecureStorage._();

  static const FlutterSecureStorage _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
  );

  static const String tokenKey = 'auth_token';
  static const String userIdKey = 'user_id';
  static const String roleKey = 'active_role';

  Future<void> _write(String key, String value) async {
    try {
      if (kIsWeb) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(key, value);
      } else {
        await _storage.write(key: key, value: value);
      }
    } catch (_) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(key, value);
    }
  }

  Future<String?> _read(String key) async {
    try {
      if (kIsWeb) {
        final prefs = await SharedPreferences.getInstance();
        return prefs.getString(key);
      }
      return await _storage.read(key: key);
    } catch (_) {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getString(key);
    }
  }

  Future<void> _deleteAll() async {
    try {
      if (kIsWeb) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.remove(tokenKey);
        await prefs.remove(userIdKey);
        await prefs.remove(roleKey);
      } else {
        await _storage.deleteAll();
      }
    } catch (_) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(tokenKey);
      await prefs.remove(userIdKey);
      await prefs.remove(roleKey);
    }
  }

  Future<void> saveToken(String token) => _write(tokenKey, token);
  Future<String?> getToken() => _read(tokenKey);
  Future<void> deleteToken() => _write(tokenKey, '');

  Future<void> saveUserId(String userId) => _write(userIdKey, userId);
  Future<String?> getUserId() => _read(userIdKey);

  Future<void> saveRole(String role) => _write(roleKey, role);
  Future<String?> getRole() => _read(roleKey);

  Future<void> clearAll() => _deleteAll();
}

final secureStorageProvider = Provider<SecureStorage>((ref) => SecureStorage.instance);
