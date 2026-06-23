import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../controllers/shared/chat_controller.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_dimensions.dart';
import '../../../widgets/common/chat_tile.dart';
import '../../../widgets/common/empty_states/empty_state.dart';
import 'chat_page.dart';

class WorkerChatListPage extends ConsumerWidget {
  const WorkerChatListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final conversationsAsync = ref.watch(workerChatProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(kToolbarHeight),
        child: Container(
          decoration: const BoxDecoration(
            color: AppColors.surface,
            border: Border(
              bottom: BorderSide(color: AppColors.border, width: 0.8),
            ),
          ),
          child: AppBar(
            backgroundColor: AppColors.surface,
            elevation: 0,
            scrolledUnderElevation: 0,
            title: Text(
              'Messages',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
            ),
          ),
        ),
      ),
      body: conversationsAsync.when(
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppColors.primary),
        ),
        error: (_, _) => const Center(
          child: Text('Something went wrong'),
        ),
        data: (conversations) {
          if (conversations.isEmpty) {
            return EmptyState.noMessages();
          }
          return ListView.separated(
            padding: const EdgeInsets.symmetric(vertical: AppDimensions.sm),
            itemCount: conversations.length,
            separatorBuilder: (_, _) => Container(
              height: 0.8,
              color: AppColors.border,
              margin: const EdgeInsets.only(left: 72),
            ),
            itemBuilder: (context, index) => ChatTile(
              conversation: conversations[index],
              onTap: () {
                ref.read(workerChatProvider.notifier).markAsRead(
                      conversations[index].id,
                    );
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (_) => WorkerConversationPage(
                      conversation: conversations[index],
                    ),
                  ),
                );
              },
            )
                .animate()
                .fadeIn(duration: 250.ms)
                .slideY(
                  begin: 0.04,
                  end: 0,
                  duration: 280.ms,
                  delay: (40 * index).ms,
                ),
          );
        },
      ),
    );
  }
}
