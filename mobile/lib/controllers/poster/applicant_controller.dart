import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/mocks/mock_data.dart';
import '../../dto/application/application_dto.dart';

class ApplicantNotifier extends AsyncNotifier<List<ApplicationDto>> {
  @override
  Future<List<ApplicationDto>> build() async {
    await Future.delayed(const Duration(milliseconds: 400));
    return List.from(MockData.posterApplicants);
  }

  Future<void> acceptApplicant(String id) async {
    final updated = state.value!.map((a) {
      if (a.id != id) return a;
      return a.copyWith(status: 'ACCEPTED');
    }).toList();
    state = AsyncData(updated);
  }

  Future<void> rejectApplicant(String id) async {
    final updated = state.value!.map((a) {
      if (a.id != id) return a;
      return a.copyWith(status: 'REJECTED');
    }).toList();
    state = AsyncData(updated);
  }

  List<ApplicationDto> byGigId(String gigId) {
    final list = state.valueOrNull ?? [];
    return list.where((a) => a.gigId == gigId).toList();
  }
}

final applicantProvider = AsyncNotifierProvider<ApplicantNotifier, List<ApplicationDto>>(
  ApplicantNotifier.new,
);
