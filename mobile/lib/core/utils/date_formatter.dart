import 'package:intl/intl.dart';

class DateFormatter {
  DateFormatter._();

  static String relativeTime(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    if (diff.inDays < 7) return '${diff.inDays}d ago';
    return DateFormat('d MMM').format(date);
  }

  static String shortDate(DateTime date) => DateFormat('d MMM').format(date);

  static String fullDate(DateTime date) =>
      DateFormat('d MMM yyyy').format(date);
}
