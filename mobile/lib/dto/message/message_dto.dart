class MessageDto {
  final String id;
  final String conversationId;
  final String senderId;
  final String content;
  final String sentAt;
  final bool isOwn;

  const MessageDto({
    required this.id,
    required this.conversationId,
    required this.senderId,
    required this.content,
    required this.sentAt,
    this.isOwn = false,
  });
}
