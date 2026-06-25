import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/mocks/mock_data.dart';
import '../../dto/notification/notification_dto.dart';

class NotificationNotifier extends AsyncNotifier<List<NotificationDto>> {
  @override
  Future<List<NotificationDto>> build() async {
    await Future.delayed(const Duration(milliseconds: 400));
    return List.from(MockData.notifications);
  }

  Future<void> markAllRead() async {
    final updated = state.value!.map((n) => n.copyWith(isRead: true)).toList();
    state = AsyncData(updated);
  }

  Future<void> markRead(String id) async {
    final updated = state.value!.map((n) {
      if (n.id != id) return n;
      return n.copyWith(isRead: true);
    }).toList();
    state = AsyncData(updated);
  }
}

final notificationProvider =
    AsyncNotifierProvider<NotificationNotifier, List<NotificationDto>>(
  NotificationNotifier.new,
);

final unreadCountProvider = Provider<int>((ref) {
  final notifications = ref.watch(notificationProvider);
  return notifications.valueOrNull?.where((n) => !n.isRead).length ?? 0;
});
