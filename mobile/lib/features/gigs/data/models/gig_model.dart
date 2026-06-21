class GigModel {
  final String id;
  final String title;
  final String description;
  final int budget;
  final String category;
  final String categoryColor;
  final String university;
  final String posterName;
  final String posterAvatar;
  final String posterRating;
  final DateTime createdAt;
  final int applicantCount;
  final bool isSaved;
  final String availability;
  final String duration;
  final String imageUrl;
  final String semanticLabel;

  const GigModel({
    required this.id,
    required this.title,
    required this.description,
    required this.budget,
    required this.category,
    required this.categoryColor,
    required this.university,
    required this.posterName,
    required this.posterAvatar,
    required this.posterRating,
    required this.createdAt,
    required this.applicantCount,
    required this.isSaved,
    required this.availability,
    required this.duration,
    required this.imageUrl,
    required this.semanticLabel,
  });

  GigModel copyWith({bool? isSaved}) => GigModel(
    id: id,
    title: title,
    description: description,
    budget: budget,
    category: category,
    categoryColor: categoryColor,
    university: university,
    posterName: posterName,
    posterAvatar: posterAvatar,
    posterRating: posterRating,
    createdAt: createdAt,
    applicantCount: applicantCount,
    isSaved: isSaved ?? this.isSaved,
    availability: availability,
    duration: duration,
    imageUrl: imageUrl,
    semanticLabel: semanticLabel,
  );

  factory GigModel.fromMap(Map<String, dynamic> map) {
    return GigModel(
      id: map['id'] as String,
      title: map['title'] as String,
      description: map['description'] as String,
      budget: map['budget'] as int,
      category: map['category'] as String,
      categoryColor: map['categoryColor'] as String,
      university: map['university'] as String,
      posterName: map['posterName'] as String,
      posterAvatar: map['posterAvatar'] as String,
      posterRating: map['posterRating'] as String,
      createdAt: DateTime.parse(map['createdAt'] as String),
      applicantCount: map['applicantCount'] as int,
      isSaved: map['isSaved'] as bool,
      availability: map['availability'] as String,
      duration: map['duration'] as String,
      imageUrl: map['imageUrl'] as String,
      semanticLabel: map['semanticLabel'] as String,
    );
  }

  Map<String, dynamic> toMap() => {
    'id': id,
    'title': title,
    'description': description,
    'budget': budget,
    'category': category,
    'categoryColor': categoryColor,
    'university': university,
    'posterName': posterName,
    'posterAvatar': posterAvatar,
    'posterRating': posterRating,
    'createdAt': createdAt.toIso8601String(),
    'applicantCount': applicantCount,
    'isSaved': isSaved,
    'availability': availability,
    'duration': duration,
    'imageUrl': imageUrl,
    'semanticLabel': semanticLabel,
  };
}
