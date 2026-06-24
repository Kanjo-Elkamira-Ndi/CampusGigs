import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/mocks/mock_data.dart';

class WorkerProfileNotifier extends AsyncNotifier<Map<String, dynamic>> {
  @override
  Future<Map<String, dynamic>> build() async {
    await Future.delayed(const Duration(milliseconds: 400));
    return Map<String, dynamic>.from(MockData.workerProfile);
  }

  Future<void> updateProfile(Map<String, dynamic> updates) async {
    final current = state.value!;
    state = AsyncData({...current, ...updates});
  }
}

final workerProfileProvider =
    AsyncNotifierProvider<WorkerProfileNotifier, Map<String, dynamic>>(
  WorkerProfileNotifier.new,
);
