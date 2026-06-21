class UserModel {
  final String id;
  final String name;
  final String email;
  final String role;
  final String? university;
  final String? avatarUrl;

  const UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.university,
    this.avatarUrl,
  });

  String get firstName => name.split(' ').first;

  factory UserModel.fromMap(Map<String, dynamic> map) {
    return UserModel(
      id: map['id'] as String? ?? '',
      name: map['name'] as String? ?? '',
      email: map['email'] as String? ?? '',
      role: map['role'] as String? ?? 'WORKER',
      university: map['university'] as String?,
      avatarUrl: map['avatarUrl'] as String?,
    );
  }

  Map<String, dynamic> toMap() => {
    'id': id,
    'name': name,
    'email': email,
    'role': role,
    'university': university,
    'avatarUrl': avatarUrl,
  };
}
