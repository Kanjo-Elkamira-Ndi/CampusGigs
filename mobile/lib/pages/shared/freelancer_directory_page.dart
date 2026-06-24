import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/mocks/mock_data.dart';
import '../../widgets/common/freelancer_card.dart';

final freelancerProvider = Provider<List<Map<String, dynamic>>>((ref) => MockData.freelancers);

class FreelancerDirectoryPage extends ConsumerWidget {
  const FreelancerDirectoryPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final freelancers = ref.watch(freelancerProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Freelancers')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: freelancers.length,
        itemBuilder: (_, i) => FreelancerCard(
          freelancer: freelancers[i],
          onTap: () => context.push('/freelancers/${freelancers[i]['id']}'),
        ),
      ),
    );
  }
}
