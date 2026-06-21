import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Unified storage wrapper.
/// - Mobile/desktop: flutter_secure_storage (encrypted)
/// - Web: shared_preferences (flutter_secure_storage is unsupported on web)
class SecureStorage {
  SecureStorage._();
  static final SecureStorage instance = SecureStorage._();

  static const FlutterSecureStorage _mobileStorage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
  );

  static const String _tokenKey = 'auth_token';
  static const String _userIdKey = 'user_id';
  static const String _activeRoleKey = 'active_role';
  static const String _userNameKey = 'user_name';

  // ── Low-level read/write ──────────────────────────────────────────────────

  Future<void> _write(String key, String value) async {
    if (kIsWeb) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(key, value);
    } else {
      await _mobileStorage.write(key: key, value: value);
    }
  }

  Future<String?> _read(String key) async {
    if (kIsWeb) {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getString(key);
    } else {
      return _mobileStorage.read(key: key);
    }
  }

  Future<void> _deleteAll() async {
    if (kIsWeb) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_tokenKey);
      await prefs.remove(_userIdKey);
      await prefs.remove(_activeRoleKey);
      await prefs.remove(_userNameKey);
    } else {
      await _mobileStorage.deleteAll();
    }
  }

  // ── Public API ────────────────────────────────────────────────────────────

  Future<void> saveToken(String token) => _write(_tokenKey, token);
  Future<String?> getToken() => _read(_tokenKey);

  Future<void> saveUserId(String userId) => _write(_userIdKey, userId);
  Future<String?> getUserId() => _read(_userIdKey);

  Future<void> saveRole(String role) => _write(_activeRoleKey, role);
  Future<String?> getRole() => _read(_activeRoleKey);

  Future<void> saveUserName(String name) => _write(_userNameKey, name);
  Future<String?> getUserName() => _read(_userNameKey);

  Future<void> clearAll() => _deleteAll();
}
