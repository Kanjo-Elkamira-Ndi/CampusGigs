import 'package:flutter/material.dart';
import '../../core/utils/date_helpers.dart';
import '../../dto/notification/notification_dto.dart';

class NotificationTile extends StatelessWidget {
  final NotificationDto notification;
  final VoidCallback onTap;

  const NotificationTile({
    super.key,
    required this.notification,
    required this.onTap,
  });

  Color _iconColor(String type) {
    switch (type) {
      case 'APPLICATION': return Colors.blue;
      case 'MESSAGE':     return Colors.green;
      case 'GIG':         return Colors.orange;
      case 'REVIEW':      return Colors.purple;
      default:            return Colors.grey;
    }
  }

  IconData _icon(String type) {
    switch (type) {
      case 'APPLICATION': return Icons.person_add_outlined;
      case 'MESSAGE':     return Icons.chat_bubble_outline;
      case 'GIG':         return Icons.work_outline;
      case 'REVIEW':      return Icons.star_outline;
      default:            return Icons.notifications_outlined;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return ListTile(
      leading: CircleAvatar(
        backgroundColor: _iconColor(notification.type).withValues(alpha: 0.12),
        child: Icon(_icon(notification.type), color: _iconColor(notification.type)),
      ),
      title: Text(
        notification.title,
        style: theme.textTheme.bodyMedium!.copyWith(
          fontWeight: notification.isRead ? FontWeight.normal : FontWeight.w600,
        ),
      ),
      subtitle: Text(notification.body, maxLines: 2, overflow: TextOverflow.ellipsis),
      trailing: Text(
        formatTimestamp(notification.createdAt),
        style: theme.textTheme.bodySmall,
      ),
      onTap: onTap,
    );
  }
}
