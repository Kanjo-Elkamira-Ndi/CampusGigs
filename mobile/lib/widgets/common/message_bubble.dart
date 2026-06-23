import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_dimensions.dart';
import '../../dto/message/message_dto.dart';

class MessageBubble extends StatelessWidget {
  final MessageDto message;
  final bool isSentByCurrentUser;

  const MessageBubble({
    super.key,
    required this.message,
    required this.isSentByCurrentUser,
  });

  String _timeStr(String createdAt) {
    final dt = DateTime.tryParse(createdAt);
    if (dt == null) return '';
    final hour = dt.hour.toString().padLeft(2, '0');
    final minute = dt.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppDimensions.base,
        vertical: 4,
      ),
      child: Column(
        crossAxisAlignment:
            isSentByCurrentUser ? CrossAxisAlignment.end : CrossAxisAlignment.start,
        children: [
          if (!isSentByCurrentUser)
            Padding(
              padding: const EdgeInsets.only(bottom: 4, left: 4),
              child: Text(
                message.senderName,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppColors.primary,
                ),
              ),
            ),
          Container(
            constraints: BoxConstraints(
              maxWidth: MediaQuery.of(context).size.width * 0.75,
            ),
            padding: const EdgeInsets.symmetric(
              horizontal: AppDimensions.md,
              vertical: 10,
            ),
            decoration: BoxDecoration(
              color: isSentByCurrentUser
                  ? AppColors.primary
                  : AppColors.surface,
              borderRadius: BorderRadius.only(
                topLeft: const Radius.circular(16),
                topRight: const Radius.circular(16),
                bottomLeft: Radius.circular(
                  isSentByCurrentUser ? 16 : 4,
                ),
                bottomRight: Radius.circular(
                  isSentByCurrentUser ? 4 : 16,
                ),
              ),
            ),
            child: Column(
              crossAxisAlignment: isSentByCurrentUser
                  ? CrossAxisAlignment.end
                  : CrossAxisAlignment.start,
              children: [
                Text(
                  message.content,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w400,
                    color: isSentByCurrentUser
                        ? Colors.white
                        : AppColors.textPrimary,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  _timeStr(message.createdAt),
                  style: TextStyle(
                    fontSize: 11,
                    color: isSentByCurrentUser
                        ? Colors.white.withValues(alpha: 0.7)
                        : AppColors.textMuted,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
