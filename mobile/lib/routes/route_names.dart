class RouteNames {
  RouteNames._();

  static const String splash = '/splash';
  static const String onboarding = '/onboarding';
  static const String login = '/login';
  static const String register = '/register';
  static const String forgotPassword = '/forgot-password';
  static const String roleSelection = '/role-selection';

  // Worker shell
  static const String workerShell = '/worker';
  static const String workerHome = '/worker/home';
  static const String workerSearch = '/worker/search';
  static const String workerApplications = '/worker/applications';
  static const String workerMessages = '/worker/messages';
  static const String workerProfile = '/worker/profile';

  // Worker sub-routes
  static const String workerGigDetail = '/worker/gig/:id';
  static const String workerSearchFilter = '/worker/search/filter';
  static const String workerSaved = '/worker/saved';
  static const String workerDashboard = '/worker/dashboard';
  static const String workerNotifications = '/worker/notifications';
  static const String workerMessagesDetail = '/worker/messages/:id';
  static const String workerFreelancers = '/worker/freelancers';
  static const String workerFreelancerDetail = '/worker/freelancers/:id';
  static const String workerEditProfile = '/worker/profile/edit';
  static const String workerReviews = '/worker/profile/reviews';
  static const String workerNotificationPrefs = '/worker/settings/notifications';

  // Poster shell
  static const String posterShell = '/poster';
  static const String posterDashboard = '/poster/dashboard';
  static const String posterGigs = '/poster/gigs';
  static const String posterPost = '/poster/post';
  static const String posterMessages = '/poster/messages';
  static const String posterProfile = '/poster/profile';
  static const String posterNotifications = '/poster/notifications';
  static const String posterMessagesDetail = '/poster/messages/:id';
  static const String posterSettings = '/poster/settings';
}
