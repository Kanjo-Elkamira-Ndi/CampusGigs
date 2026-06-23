class CreateGigDto {
  final String title;
  final String categoryId;
  final String description;
  final int budget;
  final String budgetType;
  final List<String> skills;
  final String university;
  final String? deadline;
  final String? additionalNotes;

  const CreateGigDto({
    required this.title,
    required this.categoryId,
    required this.description,
    required this.budget,
    this.budgetType = 'FIXED',
    this.skills = const [],
    this.university = '',
    this.deadline,
    this.additionalNotes,
  });
}
