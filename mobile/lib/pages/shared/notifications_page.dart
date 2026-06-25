import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../controllers/shared/notification_controller.dart';
import '../../widgets/common/loaders/app_loader.dart';
import '../../widgets/common/empty_states/empty_state.dart';
import '../../widgets/common/notification_tile.dart';

class NotificationsPage extends ConsumerWidget {
  const NotificationsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notifications = ref.watch(notificationProvider);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          TextButton(
            onPressed: () => ref.read(notificationProvider.notifier).markAllRead(),
            child: const Text('Mark all read'),
          ),
        ],
      ),
      body: notifications.when(
        loading: () => ListView.builder(
          itemCount: 4,
          itemBuilder: (_, __) => Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              children: [
                const AppShimmerBox(width: 40, height: 40, radius: 20),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const AppShimmerBox(width: double.infinity, height: 14),
                      const SizedBox(height: 6),
                      const AppShimmerBox(width: 200, height: 12),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        error: (e, _) => EmptyState.error(
          onRetry: () => ref.invalidate(notificationProvider),
        ),
        data: (list) => list.isEmpty
            ? EmptyState.noNotifications()
            : RefreshIndicator(
                onRefresh: () => ref.refresh(notificationProvider.future),
                child: ListView.separated(
                  itemCount: list.length,
                  separatorBuilder: (_, __) => const Divider(height: 1),
                  itemBuilder: (_, i) => NotificationTile(
                    notification: list[i],
                    onTap: () {
                      ref.read(notificationProvider.notifier).markRead(list[i].id);
                    },
                  ),
                ),
              ),
      ),
    );
  }
}
