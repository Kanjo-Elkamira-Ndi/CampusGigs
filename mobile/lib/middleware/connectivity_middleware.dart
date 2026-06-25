import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

enum ConnectivityStatus { online, offline }

final connectivityStatusProvider = StreamProvider<ConnectivityStatus>((ref) {
  return Connectivity().onConnectivityChanged.map((results) {
    final hasConnection = results.any((r) => r != ConnectivityResult.none);
    return hasConnection ? ConnectivityStatus.online : ConnectivityStatus.offline;
  });
});

final isOfflineProvider = Provider<bool>((ref) {
  final status = ref.watch(connectivityStatusProvider);
  return status.maybeWhen(
    data: (s) => s == ConnectivityStatus.offline,
    orElse: () => false,
  );
});
