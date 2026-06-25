import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../controllers/shared/chat_controller.dart';
import '../../widgets/common/loaders/app_loader.dart';
import '../../widgets/common/empty_states/empty_state.dart';
import '../../widgets/common/conversation_tile.dart';

class ConversationsPage extends ConsumerWidget {
  const ConversationsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final conversations = ref.watch(chatProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Messages')),
      body: conversations.when(
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
                      const AppShimmerBox(width: 140, height: 14),
                      const SizedBox(height: 6),
                      const AppShimmerBox(width: double.infinity, height: 12),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        error: (e, _) => EmptyState.error(
          onRetry: () => ref.invalidate(chatProvider),
        ),
        data: (list) => list.isEmpty
            ? EmptyState.noMessages()
            : RefreshIndicator(
                onRefresh: () => ref.refresh(chatProvider.future),
                child: ListView.separated(
                  itemCount: list.length,
                  separatorBuilder: (_, __) => const Divider(height: 1),
                  itemBuilder: (_, i) => ConversationTile(
                    conversation: list[i],
                    onTap: () {
                      ref.read(chatProvider.notifier).markAsRead(list[i].id);
                      context.push('/messages/${list[i].id}');
                    },
                  ),
                ),
              ),
      ),
    );
  }
}
