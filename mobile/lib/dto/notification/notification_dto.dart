class NotificationDto {
  final String id;
  final String title;
  final String body;
  final String type;
  final bool isRead;
  final String createdAt;
  final String? referenceId;

  const NotificationDto({
    required this.id,
    required this.title,
    required this.body,
    required this.type,
    this.isRead = false,
    required this.createdAt,
    this.referenceId,
  });

  NotificationDto copyWith({bool? isRead}) {
    return NotificationDto(
      id: id,
      title: title,
      body: body,
      type: type,
      isRead: isRead ?? this.isRead,
      createdAt: createdAt,
      referenceId: referenceId,
    );
  }
}
