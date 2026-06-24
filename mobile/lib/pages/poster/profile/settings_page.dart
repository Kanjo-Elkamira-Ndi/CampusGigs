import 'package:flutter/material.dart';

class PosterSettingsPage extends StatelessWidget {
  const PosterSettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        children: [
          _SettingTile(icon: Icons.person_outline, title: 'Edit Profile', onTap: () {}),
          _SettingTile(icon: Icons.notifications_outlined, title: 'Notifications', onTap: () {}),
          _SettingTile(icon: Icons.lock_outline, title: 'Privacy', onTap: () {}),
          _SettingTile(icon: Icons.help_outline, title: 'Help & Support', onTap: () {}),
          _SettingTile(icon: Icons.info_outline, title: 'About', onTap: () {}),
          const Divider(),
          _SettingTile(icon: Icons.logout, title: 'Log Out', onTap: () {}, isDestructive: true),
        ],
      ),
    );
  }
}

class _SettingTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;
  final bool isDestructive;

  const _SettingTile({
    required this.icon,
    required this.title,
    required this.onTap,
    this.isDestructive = false,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: isDestructive ? Colors.red : null),
      title: Text(title, style: isDestructive ? TextStyle(color: Colors.red) : null),
      trailing: const Icon(Icons.chevron_right),
      onTap: onTap,
    );
  }
}
