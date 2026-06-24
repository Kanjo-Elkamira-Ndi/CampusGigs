import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../controllers/shared/chat_controller.dart';


class MessagesPage extends ConsumerWidget {
  final String conversationId;

  const MessagesPage({super.key, required this.conversationId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final chatNotifier = ref.read(chatProvider.notifier);
    final messages = chatNotifier.getMessages(conversationId);
    final conversations = ref.watch(chatProvider);
    final conv = conversations.valueOrNull?.firstWhere((c) => c.id == conversationId);

    return Scaffold(
      appBar: AppBar(title: Text(conv?.otherUserName ?? 'Chat')),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              reverse: true,
              padding: const EdgeInsets.all(16),
              itemCount: messages.length,
              itemBuilder: (_, i) {
                final m = messages[messages.length - 1 - i];
                final isOwn = m.isOwn;
                return Align(
                  alignment: isOwn ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    decoration: BoxDecoration(
                      color: isOwn ? Theme.of(context).colorScheme.primary : Colors.grey[200],
                      borderRadius: BorderRadius.only(
                        topLeft: const Radius.circular(16),
                        topRight: const Radius.circular(16),
                        bottomLeft: isOwn ? const Radius.circular(16) : Radius.zero,
                        bottomRight: isOwn ? Radius.zero : const Radius.circular(16),
                      ),
                    ),
                    child: Text(
                      m.content,
                      style: TextStyle(color: isOwn ? Colors.white : Colors.black87),
                    ),
                  ),
                );
              },
            ),
          ),
          _MessageInput(conversationId: conversationId),
        ],
      ),
    );
  }
}

class _MessageInput extends ConsumerStatefulWidget {
  final String conversationId;
  const _MessageInput({required this.conversationId});

  @override
  ConsumerState<_MessageInput> createState() => _MessageInputState();
}

class _MessageInputState extends ConsumerState<_MessageInput> {
  final _controller = TextEditingController();

  void _send() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    ref.read(chatProvider.notifier).sendMessage(widget.conversationId, text);
    _controller.clear();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: 12, right: 12, top: 8,
        bottom: MediaQuery.of(context).padding.bottom + 8,
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _controller,
              decoration: const InputDecoration(
                hintText: 'Type a message...',
                border: OutlineInputBorder(),
                contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
              onSubmitted: (_) => _send(),
            ),
          ),
          const SizedBox(width: 8),
          IconButton.filled(
            onPressed: _send,
            icon: const Icon(Icons.send),
          ),
        ],
      ),
    );
  }
}
