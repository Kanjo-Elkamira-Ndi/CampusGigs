import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/mocks/mock_data.dart';
import '../../dto/message/conversation_dto.dart';
import '../../dto/message/message_dto.dart';

class WorkerChatNotifier extends AsyncNotifier<List<ConversationDto>> {
  List<MessageDto> _messages = [];

  @override
  Future<List<ConversationDto>> build() async {
    await Future.delayed(const Duration(milliseconds: 400));
    _messages = List.from(MockData.messageDtos);
    return List.from(MockData.workerConversations);
  }

  List<MessageDto> messagesFor(String conversationId) {
    return _messages.where((m) => m.conversationId == conversationId).toList();
  }

  Future<void> sendMessage(String conversationId, String content) async {
    final msg = MessageDto(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      conversationId: conversationId,
      senderId: '1',
      senderName: 'Kevin Nkeng',
      content: content,
      type: 'text',
      imageUrl: null,
      isRead: true,
      createdAt: DateTime.now().toIso8601String(),
    );
    _messages.add(msg);
    state = AsyncData(
      state.value!.map((c) {
        if (c.id != conversationId) return c;
        return c.copyWith(
          lastMessage: content,
          lastMessageTime: DateTime.now().toIso8601String(),
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

final workerChatProvider =
    AsyncNotifierProvider<WorkerChatNotifier, List<ConversationDto>>(
  WorkerChatNotifier.new,
);

class PosterChatNotifier extends AsyncNotifier<List<ConversationDto>> {
  List<MessageDto> _messages = [];

  @override
  Future<List<ConversationDto>> build() async {
    await Future.delayed(const Duration(milliseconds: 400));
    _messages = List.from(MockData.messageDtos);
    return List.from(MockData.posterConversations);
  }

  List<MessageDto> messagesFor(String conversationId) {
    return _messages.where((m) => m.conversationId == conversationId).toList();
  }

  Future<void> sendMessage(String conversationId, String content) async {
    final msg = MessageDto(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      conversationId: conversationId,
      senderId: '2',
      senderName: 'Marie Edima',
      content: content,
      type: 'text',
      imageUrl: null,
      isRead: true,
      createdAt: DateTime.now().toIso8601String(),
    );
    _messages.add(msg);
    state = AsyncData(
      state.value!.map((c) {
        if (c.id != conversationId) return c;
        return c.copyWith(
          lastMessage: content,
          lastMessageTime: DateTime.now().toIso8601String(),
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

final posterChatProvider =
    AsyncNotifierProvider<PosterChatNotifier, List<ConversationDto>>(
  PosterChatNotifier.new,
);
