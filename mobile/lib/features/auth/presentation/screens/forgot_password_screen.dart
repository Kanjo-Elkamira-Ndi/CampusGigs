class CategoryModel {
  final String id;
  final String name;
  final String icon;
  final int gigCount;
  final String color;

  const CategoryModel({
    required this.id,
    required this.name,
    required this.icon,
    required this.gigCount,
    required this.color,
  });

  factory CategoryModel.fromMap(Map<String, dynamic> map) {
    return CategoryModel(
      id: map['id'] as String,
      name: map['name'] as String,
      icon: map['icon'] as String,
      gigCount: map['gigCount'] as int,
      color: map['color'] as String,
    );
  }

  Map<String, dynamic> toMap() => {
    'id': id,
    'name': name,
    'icon': icon,
    'gigCount': gigCount,
    'color': color,
  };
}
