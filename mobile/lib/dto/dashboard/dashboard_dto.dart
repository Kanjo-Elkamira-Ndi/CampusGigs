class DashboardDto {
  final int totalGigs;
  final int activeGigs;
  final int totalApplicants;
  final int pendingReviews;
  final int totalSpent;
  final int completedGigs;
  final List<double> monthlySpend;

  const DashboardDto({
    required this.totalGigs,
    required this.activeGigs,
    required this.totalApplicants,
    required this.pendingReviews,
    required this.totalSpent,
    required this.completedGigs,
    required this.monthlySpend,
  });
}
