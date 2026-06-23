class UserDto {
  final String id;
  final String name;
  final String email;
  final String? avatarUrl;
  final String? university;
  final String activeRole;
  final bool isVerified;
  final String? token;
  final String? createdAt;

  UserDto({
    required this.id,
    required this.name,
    required this.email,
    this.avatarUrl,
    this.university,
    required this.activeRole,
    this.isVerified = false,
    this.token,
    this.createdAt,
  });

  factory UserDto.fromJson(Map<String, dynamic> json) {
    return UserDto(
      id: json['id']?.toString() ?? '',
      name: json['name'] as String? ?? '',
      email: json['email'] as String? ?? '',
      avatarUrl: json['avatarUrl'] as String?,
      university: json['university'] as String?,
      activeRole: json['role'] as String? ?? 'WORKER',
      isVerified: json['isVerified'] as bool? ?? false,
      token: json['token'] as String?,
      createdAt: json['createdAt'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'email': email,
    'avatarUrl': avatarUrl,
    'university': university,
    'role': activeRole,
    'isVerified': isVerified,
    'createdAt': createdAt,
  };
}
