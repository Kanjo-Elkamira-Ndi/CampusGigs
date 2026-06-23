class MessageDto {
  final String id;
  final String conversationId;
  final String senderId;
  final String senderName;
  final String content;
  final String type;
  final String? imageUrl;
  final bool isRead;
  final String createdAt;

  const MessageDto({
    required this.id,
    required this.conversationId,
    required this.senderId,
    required this.senderName,
    required this.content,
    this.type = 'text',
    this.imageUrl,
    this.isRead = false,
    required this.createdAt,
  });
}
