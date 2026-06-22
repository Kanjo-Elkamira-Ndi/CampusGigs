class ForgotPasswordDto {
  final String email;

  ForgotPasswordDto({required this.email});

  Map<String, dynamic> toJson() => {'email': email};
}

class ResetPasswordDto {
  final String token;
  final String newPassword;

  ResetPasswordDto({required this.token, required this.newPassword});

  Map<String, dynamic> toJson() => {
    'token': token,
    'newPassword': newPassword,
  };
}
