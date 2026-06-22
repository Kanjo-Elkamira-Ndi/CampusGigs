import 'package:flutter/material.dart';

class PosterShell extends StatelessWidget {
  final Widget child;

  const PosterShell({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: child,
    );
  }
}
