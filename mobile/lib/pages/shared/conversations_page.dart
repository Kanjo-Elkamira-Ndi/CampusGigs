import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../controllers/shared/chat_controller.dart';
import '../../widgets/common/conversation_tile.dart';

class ConversationsPage extends ConsumerWidget {
  const ConversationsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final conversations = ref.watch(chatProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Messages')),
      body: conversations.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('$e')),
        data: (list) => list.isEmpty
            ? const Center(child: Text('No conversations'))
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
