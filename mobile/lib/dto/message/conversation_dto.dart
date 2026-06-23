class ConversationDto {
  final String id;
  final String participantId;
  final String participantName;
  final String? participantAvatar;
  final String gigId;
  final String gigTitle;
  final String lastMessage;
  final String lastMessageTime;
  final int unreadCount;

  const ConversationDto({
    required this.id,
    required this.participantId,
    required this.participantName,
    this.participantAvatar,
    required this.gigId,
    required this.gigTitle,
    required this.lastMessage,
    required this.lastMessageTime,
    this.unreadCount = 0,
  });

  ConversationDto copyWith({
    String? id,
    String? participantId,
    String? participantName,
    String? participantAvatar,
    String? gigId,
    String? gigTitle,
    String? lastMessage,
    String? lastMessageTime,
    int? unreadCount,
  }) {
    return ConversationDto(
      id: id ?? this.id,
      participantId: participantId ?? this.participantId,
      participantName: participantName ?? this.participantName,
      participantAvatar: participantAvatar ?? this.participantAvatar,
      gigId: gigId ?? this.gigId,
      gigTitle: gigTitle ?? this.gigTitle,
      lastMessage: lastMessage ?? this.lastMessage,
      lastMessageTime: lastMessageTime ?? this.lastMessageTime,
      unreadCount: unreadCount ?? this.unreadCount,
    );
  }
}
