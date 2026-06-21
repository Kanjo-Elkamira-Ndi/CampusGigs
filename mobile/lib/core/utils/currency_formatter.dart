class CurrencyFormatter {
  CurrencyFormatter._();

  /// Formats an integer XAF amount → "5 000 XAF"
  static String formatXAF(int amount) {
    final s = amount.toString();
    final buffer = StringBuffer();
    int count = 0;
    for (int i = s.length - 1; i >= 0; i--) {
      if (count > 0 && count % 3 == 0) buffer.write('\\u00A0');
      buffer.write(s[i]);
      count++;
    }
    return '${buffer.toString().split('').reversed.join()} XAF';
  }
}
