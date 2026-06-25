import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/mocks/mock_data.dart';

class DashboardNotifier extends AsyncNotifier<Map<String, dynamic>> {
  @override
  Future<Map<String, dynamic>> build() async {
    await Future.delayed(const Duration(milliseconds: 400));
    return MockData.posterStats;
  }
}

final posterDashboardProvider = AsyncNotifierProvider<DashboardNotifier, Map<String, dynamic>>(
  DashboardNotifier.new,
);
