import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../controllers/worker/profile_controller.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_dimensions.dart';

class WorkerEditProfilePage extends ConsumerStatefulWidget {
  const WorkerEditProfilePage({super.key});

  @override
  ConsumerState<WorkerEditProfilePage> createState() => _WorkerEditProfilePageState();
}

class _WorkerEditProfilePageState extends ConsumerState<WorkerEditProfilePage> {
  final _nameController = TextEditingController();
  final _universityController = TextEditingController();
  final _degreeController = TextEditingController();
  final _yearController = TextEditingController();
  final _phoneController = TextEditingController();
  final _bioController = TextEditingController();
  final _skillController = TextEditingController();
  List<String> _skills = [];

  @override
  void initState() {
    super.initState();
    final profile = ref.read(workerProfileProvider).valueOrNull;
    if (profile != null) {
      _nameController.text = profile['name'] as String? ?? '';
      _universityController.text = profile['university'] as String? ?? '';
      _degreeController.text = profile['degree'] as String? ?? '';
      _yearController.text = profile['yearOfStudy'] as String? ?? '';
      _phoneController.text = profile['phone'] as String? ?? '';
      _bioController.text = profile['bio'] as String? ?? '';
      _skills = List<String>.from(profile['skills'] as List? ?? []);
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _universityController.dispose();
    _degreeController.dispose();
    _yearController.dispose();
    _phoneController.dispose();
    _bioController.dispose();
    _skillController.dispose();
    super.dispose();
  }

  void _save() {
    ref.read(workerProfileProvider.notifier).updateProfile({
      'name': _nameController.text.trim(),
      'university': _universityController.text.trim(),
      'degree': _degreeController.text.trim(),
      'yearOfStudy': _yearController.text.trim(),
      'phone': _phoneController.text.trim(),
      'bio': _bioController.text.trim(),
      'skills': List.from(_skills),
    });
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Profile updated! (mock)')));
    context.pop();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final profile = ref.watch(workerProfileProvider).valueOrNull;
    final initials = profile != null
        ? (profile['name'] as String).split(' ').map((w) => w.isNotEmpty ? w[0] : '').take(2).join()
        : '';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Profile'),
        actions: [
          TextButton(
            onPressed: _save,
            child: const Text('Save'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppDimensions.base),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: GestureDetector(
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Photo upload coming soon')),
                  );
                },
                child: Stack(
                  children: [
                    CircleAvatar(
                      radius: 48,
                      backgroundColor: AppColors.primaryLight,
                      child: Text(initials, style: theme.textTheme.displaySmall?.copyWith(color: AppColors.primary)),
                    ),
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          color: AppColors.primary,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.camera_alt_outlined, color: Colors.white, size: 16),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: AppDimensions.xl),
            _FieldLabel(text: 'Full Name', theme: theme),
            _AppField(controller: _nameController, theme: theme),
            const SizedBox(height: AppDimensions.base),
            _FieldLabel(text: 'University', theme: theme),
            _AppField(controller: _universityController, theme: theme),
            const SizedBox(height: AppDimensions.base),
            _FieldLabel(text: 'Degree', theme: theme),
            _AppField(controller: _degreeController, hint: 'e.g. BSc Computer Science', theme: theme),
            const SizedBox(height: AppDimensions.base),
            _FieldLabel(text: 'Year of Study', theme: theme),
            _AppField(controller: _yearController, hint: 'e.g. 3rd Year', theme: theme),
            const SizedBox(height: AppDimensions.base),
            _FieldLabel(text: 'Phone', theme: theme),
            _AppField(controller: _phoneController, keyboardType: TextInputType.phone, theme: theme),
            const SizedBox(height: AppDimensions.base),
            _FieldLabel(text: 'Bio', theme: theme),
            TextField(
              controller: _bioController,
              maxLines: 4,
              minLines: 3,
              decoration: InputDecoration(
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              ),
            ),
            const SizedBox(height: AppDimensions.xl),
            _FieldLabel(text: 'Skills', theme: theme),
            Wrap(
              spacing: AppDimensions.sm,
              runSpacing: AppDimensions.sm,
              children: [
                ..._skills.map((s) => Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.primaryLight,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(s, style: theme.textTheme.labelSmall?.copyWith(color: AppColors.primary)),
                      const SizedBox(width: AppDimensions.xs),
                      GestureDetector(
                        onTap: () => setState(() => _skills.remove(s)),
                        child: const Icon(Icons.close_rounded, color: AppColors.primary, size: 14),
                      ),
                    ],
                  ),
                )),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _skillController,
                        decoration: InputDecoration(
                          hintText: 'Add a skill…',
                          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: AppDimensions.sm),
                    GestureDetector(
                      onTap: () {
                        final text = _skillController.text.trim();
                        if (text.isNotEmpty) {
                          setState(() {
                            _skills.add(text);
                            _skillController.clear();
                          });
                        }
                      },
                      child: Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: AppColors.primary,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.add_rounded, color: Colors.white, size: 20),
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: AppDimensions.xxl),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: FilledButton(
                onPressed: _save,
                style: FilledButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('Save Changes'),
              ),
            ),
            const SizedBox(height: AppDimensions.xxxl),
          ],
        ),
      ),
    );
  }
}

class _FieldLabel extends StatelessWidget {
  final String text;
  final ThemeData theme;
  const _FieldLabel({required this.text, required this.theme});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Text(text, style: theme.textTheme.titleSmall),
    );
  }
}

class _AppField extends StatelessWidget {
  final TextEditingController controller;
  final String? hint;
  final TextInputType? keyboardType;
  final ThemeData theme;
  const _AppField({required this.controller, this.hint, this.keyboardType, required this.theme});

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      decoration: InputDecoration(
        hintText: hint,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.border, width: 0.8),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      ),
    );
  }
}
