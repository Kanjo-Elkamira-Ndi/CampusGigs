class GigDto {
  final String id;
  final String title;
  final String description;
  final int budget;
  final String budgetType;
  final String status;
  final Map<String, dynamic> category;
  final String university;
  final String posterName;
  final String? posterAvatar;
  final int applicantCount;
  final int viewCount;
  final String createdAt;
  final List<String> skills;
  final String? deadline;

  const GigDto({
    required this.id,
    required this.title,
    required this.description,
    required this.budget,
    this.budgetType = 'FIXED',
    this.status = 'OPEN',
    required this.category,
    required this.university,
    required this.posterName,
    this.posterAvatar,
    this.applicantCount = 0,
    this.viewCount = 0,
    required this.createdAt,
    this.skills = const [],
    this.deadline,
  });

  GigDto copyWith({
    String? id,
    String? title,
    String? description,
    int? budget,
    String? budgetType,
    String? status,
    Map<String, dynamic>? category,
    String? university,
    String? posterName,
    String? posterAvatar,
    int? applicantCount,
    int? viewCount,
    String? createdAt,
    List<String>? skills,
    String? deadline,
  }) {
    return GigDto(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      budget: budget ?? this.budget,
      budgetType: budgetType ?? this.budgetType,
      status: status ?? this.status,
      category: category ?? this.category,
      university: university ?? this.university,
      posterName: posterName ?? this.posterName,
      posterAvatar: posterAvatar ?? this.posterAvatar,
      applicantCount: applicantCount ?? this.applicantCount,
      viewCount: viewCount ?? this.viewCount,
      createdAt: createdAt ?? this.createdAt,
      skills: skills ?? this.skills,
      deadline: deadline ?? this.deadline,
    );
  }
}
