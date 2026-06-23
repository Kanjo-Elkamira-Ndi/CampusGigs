import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/mocks/mock_data.dart';

class EarningsNotifier extends AsyncNotifier<Map<String, dynamic>> {
  @override
  Future<Map<String, dynamic>> build() async {
    await Future.delayed(const Duration(milliseconds: 400));
    return {
      'stats': MockData.posterStats,
      'breakdown': MockData.earningsBreakdown,
    };
  }
}

final earningsProvider = AsyncNotifierProvider<EarningsNotifier, Map<String, dynamic>>(
  EarningsNotifier.new,
);
