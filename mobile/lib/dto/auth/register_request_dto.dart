class RegisterRequestDto {
  final String name;
  final String email;
  final String password;
  final String role;
  final String? university;

  RegisterRequestDto({
    required this.name,
    required this.email,
    required this.password,
    required this.role,
    this.university,
  });

  Map<String, dynamic> toJson() => {
    'name': name,
    'email': email,
    'password': password,
    'role': role,
    if (university != null && university!.isNotEmpty) 'university': university,
  };
}
