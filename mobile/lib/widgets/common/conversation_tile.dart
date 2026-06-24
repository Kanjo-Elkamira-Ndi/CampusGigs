import 'package:flutter/material.dart';
import '../../core/utils/date_helpers.dart';
import '../../dto/message/conversation_dto.dart';

class ConversationTile extends StatelessWidget {
  final ConversationDto conversation;
  final VoidCallback onTap;

  const ConversationTile({
    super.key,
    required this.conversation,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final initials = conversation.otherUserName
        .split(' ')
        .map((w) => w.isNotEmpty ? w[0] : '')
        .take(2)
        .join();
    return ListTile(
      leading: CircleAvatar(
        child: Text(initials),
      ),
      title: Text(conversation.otherUserName),
      subtitle: Text(
        conversation.lastMessage,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
      ),
      trailing: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Text(
            formatTimestamp(conversation.lastMessageAt),
            style: theme.textTheme.bodySmall,
          ),
          if (conversation.unreadCount > 0)
            Container(
              margin: const EdgeInsets.only(top: 4),
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
              decoration: BoxDecoration(
                color: theme.colorScheme.primary,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                '${conversation.unreadCount}',
                style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600),
              ),
            ),
        ],
      ),
      onTap: onTap,
    );
  }
}
