class ConversationDto {
  final String id;
  final String otherUserId;
  final String otherUserName;
  final String? otherUserAvatar;
  final String otherUserRole;
  final String gigTitle;
  final String lastMessage;
  final String lastMessageAt;
  final int unreadCount;
  final String? applicationId;

  const ConversationDto({
    required this.id,
    required this.otherUserId,
    required this.otherUserName,
    this.otherUserAvatar,
    required this.otherUserRole,
    required this.gigTitle,
    required this.lastMessage,
    required this.lastMessageAt,
    this.unreadCount = 0,
    this.applicationId,
  });

  ConversationDto copyWith({
    String? id,
    String? otherUserId,
    String? otherUserName,
    String? otherUserAvatar,
    String? otherUserRole,
    String? gigTitle,
    String? lastMessage,
    String? lastMessageAt,
    int? unreadCount,
    String? applicationId,
  }) {
    return ConversationDto(
      id: id ?? this.id,
      otherUserId: otherUserId ?? this.otherUserId,
      otherUserName: otherUserName ?? this.otherUserName,
      otherUserAvatar: otherUserAvatar ?? this.otherUserAvatar,
      otherUserRole: otherUserRole ?? this.otherUserRole,
      gigTitle: gigTitle ?? this.gigTitle,
      lastMessage: lastMessage ?? this.lastMessage,
      lastMessageAt: lastMessageAt ?? this.lastMessageAt,
      unreadCount: unreadCount ?? this.unreadCount,
      applicationId: applicationId ?? this.applicationId,
    );
  }
}
