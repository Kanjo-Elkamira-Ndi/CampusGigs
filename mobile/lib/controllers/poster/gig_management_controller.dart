import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/mocks/mock_data.dart';
import '../../dto/gig/gig_dto.dart';

class GigManagementNotifier extends AsyncNotifier<List<GigDto>> {
  @override
  Future<List<GigDto>> build() async {
    await Future.delayed(const Duration(milliseconds: 400));
    return List.from(MockData.posterGigs);
  }

  Future<void> deleteGig(String id) async {
    state = AsyncData(state.value!.where((g) => g.id != id).toList());
  }

  Future<void> toggleGigStatus(String id) async {
    final updated = state.value!.map((g) {
      if (g.id != id) return g;
      return g.copyWith(
        status: g.status == 'OPEN' ? 'PAUSED' : 'OPEN',
      );
    }).toList();
    state = AsyncData(updated);
  }
}

final gigManagementProvider = AsyncNotifierProvider<GigManagementNotifier, List<GigDto>>(
  GigManagementNotifier.new,
);
