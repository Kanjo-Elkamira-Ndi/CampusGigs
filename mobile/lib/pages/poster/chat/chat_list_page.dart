import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../shared/conversations_page.dart';

class PosterChatListPage extends StatelessWidget {
  const PosterChatListPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Messages'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () => context.push('/poster/notifications'),
          ),
        ],
      ),
      body: const ConversationsPage(),
    );
  }
}
