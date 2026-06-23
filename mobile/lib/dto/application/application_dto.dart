class ApplicationDto {
  final String id;
  final String gigId;
  final String gigTitle;
  final String applicantName;
  final String? applicantAvatar;
  final String applicantUniversity;
  final String status;
  final String coverLetter;
  final int proposedBudget;
  final String appliedAt;

  const ApplicationDto({
    required this.id,
    required this.gigId,
    required this.gigTitle,
    required this.applicantName,
    this.applicantAvatar,
    required this.applicantUniversity,
    this.status = 'PENDING',
    this.coverLetter = '',
    required this.proposedBudget,
    required this.appliedAt,
  });

  ApplicationDto copyWith({
    String? id,
    String? gigId,
    String? gigTitle,
    String? applicantName,
    String? applicantAvatar,
    String? applicantUniversity,
    String? status,
    String? coverLetter,
    int? proposedBudget,
    String? appliedAt,
  }) {
    return ApplicationDto(
      id: id ?? this.id,
      gigId: gigId ?? this.gigId,
      gigTitle: gigTitle ?? this.gigTitle,
      applicantName: applicantName ?? this.applicantName,
      applicantAvatar: applicantAvatar ?? this.applicantAvatar,
      applicantUniversity: applicantUniversity ?? this.applicantUniversity,
      status: status ?? this.status,
      coverLetter: coverLetter ?? this.coverLetter,
      proposedBudget: proposedBudget ?? this.proposedBudget,
      appliedAt: appliedAt ?? this.appliedAt,
    );
  }
}
