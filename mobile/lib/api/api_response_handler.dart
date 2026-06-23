import 'package:dio/dio.dart';
import '../core/errors/exceptions.dart';

T parseResponse<T>(Response response, T Function(dynamic json) fromJson) {
  if (response.statusCode != null && response.statusCode! >= 200 && response.statusCode! < 300) {
    final body = response.data as Map<String, dynamic>?;
    if (body != null && body['success'] == true) {
      final data = body['data'];
      if (data != null) {
        return fromJson(data);
      }
      return fromJson(body);
    }
    if (body != null && body['success'] == false) {
      throw AppException(
        body['message']?.toString() ?? 'Request failed',
        statusCode: response.statusCode,
      );
    }
    return fromJson(body ?? response.data);
  }
  throw AppException(
    'Request failed with status ${response.statusCode}',
    statusCode: response.statusCode,
  );
}
