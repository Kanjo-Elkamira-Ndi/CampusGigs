import 'package:flutter/material.dart';

class FreelancerCard extends StatelessWidget {
  final Map<String, dynamic> freelancer;
  final VoidCallback onTap;

  const FreelancerCard({
    super.key,
    required this.freelancer,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final initials = (freelancer['name'] as String)
        .split(' ')
        .map((w) => w.isNotEmpty ? w[0] : '')
        .take(2)
        .join();
    final skills = freelancer['skills'] as List<dynamic>;

    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CircleAvatar(
                radius: 24,
                child: Text(initials),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(child: Text(freelancer['name'] as String, style: theme.textTheme.titleMedium)),
                        Row(
                          children: [
                            Icon(Icons.star, size: 16, color: Colors.amber[700]),
                            const SizedBox(width: 2),
                            Text('${freelancer['rating']}', style: theme.textTheme.bodySmall),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(freelancer['university'] as String, style: theme.textTheme.bodySmall),
                    const SizedBox(height: 8),
                    SizedBox(
                      height: 26,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: skills.length,
                        separatorBuilder: (_, __) => const SizedBox(width: 6),
                        itemBuilder: (_, i) => Chip(
                          label: Text(skills[i] as String, style: const TextStyle(fontSize: 11)),
                          materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          visualDensity: VisualDensity.compact,
                          padding: EdgeInsets.zero,
                          labelPadding: const EdgeInsets.symmetric(horizontal: 6),
                        ),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text('${freelancer['completedGigs']} gigs completed', style: theme.textTheme.bodySmall),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
