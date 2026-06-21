import 'package:dio/dio.dart';

class ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    String message;
    switch (err.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.receiveTimeout:
        message = 'Connection timed out. Check your internet.';
        break;
      case DioExceptionType.connectionError:
        message = 'No internet connection.';
        break;
      default:
        message =
            err.response?.data?['message'] as String? ??
            'Something went wrong. Please try again.';
    }
    handler.next(
      DioException(
        requestOptions: err.requestOptions,
        response: err.response,
        type: err.type,
        error: message,
      ),
    );
  }
}
