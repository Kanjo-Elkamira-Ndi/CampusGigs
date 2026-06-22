import 'package:flutter/material.dart';

class WorkerShell extends StatelessWidget {
  final Widget child;

  const WorkerShell({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: child,
    );
  }
}
