import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_dimensions.dart';
import '../../../core/theme/app_radius.dart';
import '../../../controllers/poster/gig_management_controller.dart';
import '../../../widgets/common/buttons/app_button.dart';
import '../../../dto/gig/gig_dto.dart';

class EditGigPage extends ConsumerStatefulWidget {
  final String gigId;

  const EditGigPage({super.key, required this.gigId});

  @override
  ConsumerState<EditGigPage> createState() => _EditGigPageState();
}

class _EditGigPageState extends ConsumerState<EditGigPage> {
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _budgetController = TextEditingController();
  final _skillController = TextEditingController();
  final _skills = <String>[];
  String _status = 'OPEN';
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final gigs = ref.read(gigManagementProvider).valueOrNull ?? [];
      final gig = gigs.where((g) => g.id == widget.gigId).firstOrNull;
      if (gig != null) _populate(gig);
    });
  }

  void _populate(GigDto gig) {
    _titleController.text = gig.title;
    _descriptionController.text = gig.description;
    _budgetController.text = gig.budget.toString();
    _skills.addAll(gig.skills);
    _status = gig.status;
    setState(() {});
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _budgetController.dispose();
    _skillController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
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
            title: const Text('Edit Gig'),
            titleTextStyle: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppDimensions.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _fieldLabel('Title'),
            const SizedBox(height: 6),
            TextField(controller: _titleController, decoration: _input()),
            const SizedBox(height: AppDimensions.lg),
            _fieldLabel('Description'),
            const SizedBox(height: 6),
            TextField(controller: _descriptionController, maxLines: 4, decoration: _input()),
            const SizedBox(height: AppDimensions.lg),
            _fieldLabel('Budget (XAF)'),
            const SizedBox(height: 6),
            TextField(controller: _budgetController, keyboardType: TextInputType.number, decoration: _input()),
            const SizedBox(height: AppDimensions.lg),
            _fieldLabel('Skills'),
            const SizedBox(height: 6),
            TextField(
              controller: _skillController,
              decoration: _input(hint: 'Add a skill'),
              onSubmitted: (v) {
                if (v.trim().isNotEmpty && !_skills.contains(v.trim())) {
                  setState(() => _skills.add(v.trim()));
                  _skillController.clear();
                }
              },
            ),
            if (_skills.isNotEmpty) ...[
              const SizedBox(height: AppDimensions.md),
              Wrap(
                spacing: 8, runSpacing: 8,
                children: _skills.map((s) => Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(color: AppColors.primaryLight, borderRadius: BorderRadius.circular(AppRadius.full)),
                  child: Row(mainAxisSize: MainAxisSize.min, children: [
                    Text(s, style: const TextStyle(fontSize: 13, color: AppColors.primary, fontWeight: FontWeight.w500)),
                    const SizedBox(width: 4),
                    GestureDetector(onTap: () => setState(() => _skills.remove(s)), child: const Icon(Icons.close, size: 14, color: AppColors.primary)),
                  ]),
                )).toList(),
              ),
            ],
            const SizedBox(height: AppDimensions.lg),
            _fieldLabel('Status'),
            const SizedBox(height: 6),
            DropdownButtonFormField<String>(
              value: _status,
              decoration: _input(),
              items: ['OPEN', 'PAUSED', 'COMPLETED'].map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
              onChanged: (v) => setState(() => _status = v ?? 'OPEN'),
            ),
            const SizedBox(height: AppDimensions.xxl),
            AppButton(
              label: 'Save Changes',
              isLoading: _isLoading,
              onPressed: () async {
                setState(() => _isLoading = true);
                await Future.delayed(const Duration(milliseconds: 600));
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: const Text('Changes saved! (mock)'),
                      backgroundColor: AppColors.success,
                      behavior: SnackBarBehavior.floating,
                    ),
                  );
                  context.pop();
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _fieldLabel(String label) => Text(label, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary));

  InputDecoration _input({String? hint}) => InputDecoration(
    hintText: hint,
    hintStyle: TextStyle(color: AppColors.textMuted),
    filled: true,
    fillColor: AppColors.surface,
    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
    border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md), borderSide: const BorderSide(color: AppColors.border, width: 0.8)),
    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md), borderSide: const BorderSide(color: AppColors.border, width: 0.8)),
    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md), borderSide: const BorderSide(color: AppColors.primary, width: 1.5)),
  );
}
