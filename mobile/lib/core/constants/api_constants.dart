class ApiConstants {
  ApiConstants._();

  static const String baseUrl = 'http://localhost:5000/api/v1';

  // Auth endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String forgotPassword = '/auth/forgot-password';
  static const String resetPassword = '/auth/reset-password';

  // Gig endpoints
  static const String gigs = '/gigs';
  static const String categories = '/categories';
}
