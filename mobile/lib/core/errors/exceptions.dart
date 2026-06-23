class AppException implements Exception {
  final String message;
  final int? statusCode;

  AppException(this.message, {this.statusCode});

  @override
  String toString() => message;
}

class NetworkException extends AppException {
  NetworkException() : super('No internet connection');
}

class AuthException extends AppException {
  AuthException(String message, {int? statusCode}) : super(message, statusCode: statusCode);
}

class ServerException extends AppException {
  ServerException([String message = 'Server error', int? statusCode]) : super(message, statusCode: statusCode);
}
