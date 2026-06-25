import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_dimensions.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/mocks/mock_data.dart';
import '../../../widgets/common/buttons/app_button.dart';

class CreateGigPage extends StatefulWidget {
  const CreateGigPage({super.key});

  @override
  State<CreateGigPage> createState() => _CreateGigPageState();
}

class _CreateGigPageState extends State<CreateGigPage> {
  final _formKey = GlobalKey<FormState>();
  int _currentStep = 0;

  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _budgetController = TextEditingController();
  final _universityController = TextEditingController();
  final _notesController = TextEditingController();

  String _selectedCategoryId = '1';
  String _budgetType = 'FIXED';
  final _skills = <String>[];
  final _skillController = TextEditingController();
  DateTime? _deadline;

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _budgetController.dispose();
    _universityController.dispose();
    _notesController.dispose();
    _skillController.dispose();
    super.dispose();
  }

  void _nextStep() {
    if (_currentStep == 0 && _titleController.text.trim().isEmpty) return;
    if (_currentStep < 3) setState(() => _currentStep++);
  }

  void _prevStep() {
    if (_currentStep > 0) setState(() => _currentStep--);
  }

  Future<void> _submit() async {
    final scaffold = ScaffoldMessenger.of(context);
    scaffold.showSnackBar(
      SnackBar(
        content: const Text('Gig posted! (mock)'),
        backgroundColor: AppColors.success,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.sm)),
      ),
    );
    await Future.delayed(const Duration(milliseconds: 600));
    if (context.mounted) context.pop();
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
            title: const Text('Post a Gig'),
            titleTextStyle: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
        ),
      ),
      body: Column(
        children: [
          _StepIndicator(currentStep: _currentStep),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(AppDimensions.lg),
              child: _buildStepContent(),
            ),
          ),
          _buildBottomBar(),
        ],
      ),
    );
  }

  Widget _buildStepContent() {
    switch (_currentStep) {
      case 0: return _stepBasics();
      case 1: return _stepBudget();
      case 2: return _stepRequirements();
      case 3: return _stepReview();
      default: return const SizedBox.shrink();
    }
  }

  Widget _stepBasics() {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _fieldLabel('Title'),
          const SizedBox(height: 6),
          TextField(
            controller: _titleController,
            decoration: _inputDecoration('Enter gig title'),
          ),
          const SizedBox(height: AppDimensions.lg),
          _fieldLabel('Category'),
          const SizedBox(height: 6),
          DropdownButtonFormField<String>(
            value: _selectedCategoryId,
            decoration: _inputDecoration(''),
            items: MockData.categories.map((c) => DropdownMenuItem(
              value: c.id,
              child: Text(c.name),
            )).toList(),
            onChanged: (v) => setState(() => _selectedCategoryId = v ?? '1'),
          ),
          const SizedBox(height: AppDimensions.lg),
          _fieldLabel('Description'),
          const SizedBox(height: 6),
          TextField(
            controller: _descriptionController,
            maxLines: 5,
            minLines: 3,
            decoration: _inputDecoration('Describe the gig in detail'),
          ),
        ],
      ),
    );
  }

  Widget _stepBudget() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _fieldLabel('Budget Type'),
        const SizedBox(height: 6),
        Row(
          children: [
            Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _budgetType = 'FIXED'),
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  decoration: BoxDecoration(
                    border: Border.all(
                      color: _budgetType == 'FIXED' ? AppColors.primary : AppColors.border,
                      width: _budgetType == 'FIXED' ? 1.5 : 0.8,
                    ),
                    borderRadius: BorderRadius.circular(AppRadius.md),
                    color: _budgetType == 'FIXED' ? AppColors.primaryLight : Colors.transparent,
                  ),
                  child: Text(
                    'Fixed Price',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      color: _budgetType == 'FIXED' ? AppColors.primary : AppColors.textPrimary,
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(width: AppDimensions.md),
            Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _budgetType = 'HOURLY'),
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  decoration: BoxDecoration(
                    border: Border.all(
                      color: _budgetType == 'HOURLY' ? AppColors.primary : AppColors.border,
                      width: _budgetType == 'HOURLY' ? 1.5 : 0.8,
                    ),
                    borderRadius: BorderRadius.circular(AppRadius.md),
                    color: _budgetType == 'HOURLY' ? AppColors.primaryLight : Colors.transparent,
                  ),
                  child: Text(
                    'Hourly Rate',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      color: _budgetType == 'HOURLY' ? AppColors.primary : AppColors.textPrimary,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: AppDimensions.lg),
        _fieldLabel('Budget Amount'),
        const SizedBox(height: 6),
        TextField(
          controller: _budgetController,
          keyboardType: TextInputType.number,
          decoration: _inputDecoration('XAF').copyWith(
            prefixText: 'XAF ',
          ),
        ),
        const SizedBox(height: AppDimensions.lg),
        _fieldLabel('Skills'),
        const SizedBox(height: 6),
        TextField(
          controller: _skillController,
          decoration: _inputDecoration('Type a skill and press enter'),
          onSubmitted: (value) {
            if (value.trim().isNotEmpty && !_skills.contains(value.trim())) {
              setState(() => _skills.add(value.trim()));
              _skillController.clear();
            }
          },
        ),
        if (_skills.isNotEmpty) ...[
          const SizedBox(height: AppDimensions.md),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _skills.map((s) => Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.primaryLight,
                borderRadius: BorderRadius.circular(AppRadius.full),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(s, style: const TextStyle(fontSize: 13, color: AppColors.primary, fontWeight: FontWeight.w500)),
                  const SizedBox(width: 4),
                  GestureDetector(
                    onTap: () => setState(() => _skills.remove(s)),
                    child: const Icon(Icons.close, size: 14, color: AppColors.primary),
                  ),
                ],
              ),
            )).toList(),
          ),
        ],
      ],
    );
  }

  Widget _stepRequirements() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _fieldLabel('University'),
        const SizedBox(height: 6),
        TextField(
          controller: _universityController,
          decoration: _inputDecoration('e.g. YIBS, UY1, All'),
        ),
        const SizedBox(height: AppDimensions.lg),
        _fieldLabel('Deadline'),
        const SizedBox(height: 6),
        TextField(
          readOnly: true,
          decoration: _inputDecoration(_deadline != null ? _formatDate(_deadline!) : 'Select deadline'),
          onTap: () async {
            final picked = await showDatePicker(
              context: context,
              initialDate: DateTime.now().add(const Duration(days: 7)),
              firstDate: DateTime.now(),
              lastDate: DateTime.now().add(const Duration(days: 365)),
            );
            if (picked != null) setState(() => _deadline = picked);
          },
        ),
        const SizedBox(height: AppDimensions.lg),
        _fieldLabel('Additional Notes (optional)'),
        const SizedBox(height: 6),
        TextField(
          controller: _notesController,
          maxLines: 4,
          decoration: _inputDecoration('Any extra information'),
        ),
      ],
    );
  }

  Widget _stepReview() {
    return Column(
      children: [
        _reviewRow('Title', _titleController.text),
        _reviewRow('Category', MockData.categories.firstWhere((c) => c.id == _selectedCategoryId).name),
        _reviewRow('Description', _descriptionController.text),
        _reviewRow('Budget Type', _budgetType == 'FIXED' ? 'Fixed Price' : 'Hourly Rate'),
        _reviewRow('Budget', '${_budgetController.text} XAF'),
        _reviewRow('Skills', _skills.isEmpty ? 'None' : _skills.join(', ')),
        _reviewRow('University', _universityController.text.isEmpty ? 'Any' : _universityController.text),
        _reviewRow('Deadline', _deadline != null ? _formatDate(_deadline!) : 'Not set'),
        if (_notesController.text.isNotEmpty)
          _reviewRow('Notes', _notesController.text),
      ],
    );
  }

  Widget _reviewRow(String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: AppDimensions.md),
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: AppColors.border, width: 0.8)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
          const SizedBox(height: 4),
          Text(value, style: const TextStyle(fontSize: 14, color: AppColors.textPrimary)),
        ],
      ),
    );
  }

  Widget _buildBottomBar() {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(top: BorderSide(color: AppColors.border, width: 0.8)),
      ),
      padding: const EdgeInsets.fromLTRB(AppDimensions.lg, AppDimensions.md, AppDimensions.lg, AppDimensions.lg),
      child: SafeArea(
        child: _currentStep == 3
            ? Row(
                children: [
                  Expanded(child: AppButton.secondary('Back', onPressed: _prevStep)),
                  const SizedBox(width: AppDimensions.md),
                  Expanded(child: AppButton.primary('Post Gig', onPressed: _submit)),
                ],
              )
            : Row(
                children: [
                  if (_currentStep > 0)
                    Expanded(child: AppButton.secondary('Back', onPressed: _prevStep)),
                  if (_currentStep > 0) const SizedBox(width: AppDimensions.md),
                  Expanded(child: AppButton.primary('Next', onPressed: _nextStep)),
                ],
              ),
      ),
    );
  }

  String _formatDate(DateTime d) {
    return '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';
  }

  Widget _fieldLabel(String label) {
    return Text(label, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary));
  }

  InputDecoration _inputDecoration(String hint) {
    return InputDecoration(
      hintText: hint.isEmpty ? null : hint,
      hintStyle: TextStyle(color: AppColors.textMuted),
      filled: true,
      fillColor: AppColors.surface,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppRadius.md),
        borderSide: const BorderSide(color: AppColors.border, width: 0.8),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppRadius.md),
        borderSide: const BorderSide(color: AppColors.border, width: 0.8),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppRadius.md),
        borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
      ),
    );
  }
}

class _StepIndicator extends StatelessWidget {
  final int currentStep;

  const _StepIndicator({required this.currentStep});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: AppDimensions.base, horizontal: AppDimensions.xxl),
      color: AppColors.surface,
      child: Row(
        children: List.generate(4, (i) {
          final isActive = i == currentStep;
          final isCompleted = i < currentStep;
          return Expanded(
            child: Row(
              children: [
                if (i > 0)
                  Expanded(
                    child: Container(
                      height: 2,
                      color: isCompleted ? AppColors.success : AppColors.border,
                    ),
                  ),
                Container(
                  width: 28,
                  height: 28,
                  decoration: BoxDecoration(
                    color: isCompleted ? AppColors.successLight : isActive ? AppColors.primary : Colors.transparent,
                    shape: BoxShape.circle,
                    border: isActive || isCompleted ? null : Border.all(color: AppColors.border),
                  ),
                  child: Center(
                    child: isCompleted
                        ? const Icon(Icons.check, size: 16, color: AppColors.success)
                        : Text(
                            '${i + 1}',
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: isActive ? Colors.white : AppColors.textMuted,
                            ),
                          ),
                  ),
                ),
              ],
            ),
          );
        }),
      ),
    );
  }
}
