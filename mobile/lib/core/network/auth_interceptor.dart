import 'package:dio/dio.dart';
import '../storage/secure_storage.dart';

class AuthInterceptor extends Interceptor {
  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await SecureStorage.instance.getToken();
    if (token != null && token.isNotEmpty) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (err.response?.statusCode == 401) {
      // Clear stored credentials so the splash redirect will send the user
      // to /login-screen on the next cold start or router refresh.
      SecureStorage.instance.clearAll();
      // Re-throw as a typed error so the UI layer can react (e.g. show a
      // "Session expired" message and navigate to login).
      handler.next(
        DioException(
          requestOptions: err.requestOptions,
          response: err.response,
          type: DioExceptionType.badResponse,
          error: 'Session expired. Please sign in again.',
        ),
      );
      return;
    }
    handler.next(err);
  }
}
