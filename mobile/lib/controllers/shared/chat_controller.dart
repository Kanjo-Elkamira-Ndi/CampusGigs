import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/mocks/mock_data.dart';
import '../../dto/message/conversation_dto.dart';
import '../../dto/message/message_dto.dart';

class ChatNotifier extends AsyncNotifier<List<ConversationDto>> {
  @override
  Future<List<ConversationDto>> build() async {
    await Future.delayed(const Duration(milliseconds: 400));
    return List.from(MockData.conversations);
  }

  List<MessageDto> getMessages(String conversationId) {
    return MockData.messages[conversationId] ?? [];
  }

  Future<void> sendMessage(String conversationId, String content) async {
    final msg = MessageDto(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      conversationId: conversationId,
      senderId: 'currentUser',
      content: content,
      sentAt: DateTime.now().toIso8601String(),
      isOwn: true,
    );
    MockData.messages[conversationId] = [
      ...?MockData.messages[conversationId],
      msg,
    ];
    state = AsyncData(
      state.value!.map((c) {
        if (c.id != conversationId) return c;
        return c.copyWith(
          lastMessage: content,
          lastMessageAt: DateTime.now().toIso8601String(),
          unreadCount: 0,
        );
      }).toList(),
    );
  }

  Future<void> markAsRead(String conversationId) async {
    state = AsyncData(
      state.value!.map((c) {
        if (c.id != conversationId) return c;
        return c.copyWith(unreadCount: 0);
      }).toList(),
    );
  }
}

final chatProvider = AsyncNotifierProvider<ChatNotifier, List<ConversationDto>>(
  ChatNotifier.new,
);
