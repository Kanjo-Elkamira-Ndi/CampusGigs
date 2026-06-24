import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/mocks/mock_data.dart';

final freelancerDetailProvider = Provider.family<Map<String, dynamic>?, String>(
  (ref, id) {
    try {
      return MockData.freelancers.firstWhere((f) => f['id'] == id);
    } catch (_) {
      return null;
    }
  },
);

class FreelancerDetailPage extends ConsumerWidget {
  final String freelancerId;
  const FreelancerDetailPage({super.key, required this.freelancerId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final freelancer = ref.watch(freelancerDetailProvider(freelancerId));
    if (freelancer == null) return Scaffold(appBar: AppBar(), body: const Center(child: Text('Not found')));

    final theme = Theme.of(context);
    final initials = (freelancer['name'] as String)
        .split(' ')
        .map((w) => w.isNotEmpty ? w[0] : '')
        .take(2)
        .join();
    final skills = freelancer['skills'] as List<dynamic>;

    return Scaffold(
      appBar: AppBar(title: Text(freelancer['name'] as String)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Center(
            child: Column(
              children: [
                CircleAvatar(radius: 40, child: Text(initials, style: const TextStyle(fontSize: 24))),
                const SizedBox(height: 12),
                Text(freelancer['name'] as String, style: theme.textTheme.headlineSmall),
                Text(freelancer['university'] as String, style: theme.textTheme.bodyLarge),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Text('Bio', style: theme.textTheme.titleMedium),
          const SizedBox(height: 4),
          Text(freelancer['bio'] as String),
          const SizedBox(height: 16),
          Text('Skills', style: theme.textTheme.titleMedium),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 4,
            children: skills.map((s) => Chip(label: Text(s as String))).toList(),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              _Stat(label: 'Rating', value: '${freelancer['rating']}'),
              const SizedBox(width: 24),
              _Stat(label: 'Reviews', value: '${freelancer['reviewCount']}'),
              const SizedBox(width: 24),
              _Stat(label: 'Gigs', value: '${freelancer['completedGigs']}'),
            ],
          ),
        ],
      ),
    );
  }
}

class _Stat extends StatelessWidget {
  final String label;
  final String value;
  const _Stat({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(value, style: Theme.of(context).textTheme.headlineSmall),
        Text(label, style: Theme.of(context).textTheme.bodySmall),
      ],
    );
  }
}
