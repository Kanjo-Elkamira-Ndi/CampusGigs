import 'package:flutter/material.dart';
import '../../../core/mocks/mock_data.dart';

class PosterProfilePage extends StatelessWidget {
  const PosterProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    final profile = MockData.posterProfile;
    final theme = Theme.of(context);
    final initials = (profile['name'] as String)
        .split(' ')
        .map((w) => w.isNotEmpty ? w[0] : '')
        .take(2)
        .join();

    return Scaffold(
      appBar: AppBar(title: const Text('My Profile')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Center(
            child: Column(
              children: [
                CircleAvatar(radius: 48, child: Text(initials, style: const TextStyle(fontSize: 28))),
                const SizedBox(height: 12),
                Text(profile['name'] as String, style: theme.textTheme.headlineSmall),
                Text(profile['company'] as String, style: theme.textTheme.bodyLarge),
              ],
            ),
          ),
          const SizedBox(height: 24),
          _Section(title: 'Contact', children: [
            _Row(icon: Icons.email_outlined, text: profile['email'] as String),
            _Row(icon: Icons.phone_outlined, text: profile['phone'] as String),
            _Row(icon: Icons.school_outlined, text: profile['university'] as String),
          ]),
          const SizedBox(height: 16),
          _Section(title: 'Bio', children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(profile['bio'] as String),
            ),
          ]),
          const SizedBox(height: 16),
          _Section(title: 'Stats', children: [
            _Row(icon: Icons.work_outline, text: '${profile['totalGigsPosted']} gigs posted'),
            _Row(icon: Icons.attach_money, text: '${profile['totalSpent']} XAF spent'),
            _Row(icon: Icons.star_outline, text: '${profile['rating']} (${profile['reviewCount']} reviews)'),
            _Row(icon: Icons.calendar_today, text: 'Member since ${profile['memberSince']}'),
          ]),
        ],
      ),
    );
  }
}

class _Section extends StatelessWidget {
  final String title;
  final List<Widget> children;
  const _Section({required this.title, required this.children});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Text(title, style: Theme.of(context).textTheme.titleMedium),
        ),
        ...children,
      ],
    );
  }
}

class _Row extends StatelessWidget {
  final IconData icon;
  final String text;
  const _Row({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Colors.grey[600]),
          const SizedBox(width: 12),
          Text(text),
        ],
      ),
    );
  }
}
