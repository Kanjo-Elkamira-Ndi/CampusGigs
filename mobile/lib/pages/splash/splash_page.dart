import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/theme/app_colors.dart';
import '../../core/storage/secure_storage.dart';
import '../../routes/route_names.dart';

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _glowAnim;
  late final Animation<double> _entryAnim;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2600),
    );

    _glowAnim = Tween<double>(begin: 0.6, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.0, 0.5, curve: Curves.easeInOutSine),
      ),
    );

    _entryAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.0, 0.35, curve: Curves.easeOutCubic),
      ),
    );

    _controller.forward();
    _redirect();
  }

  Future<void> _redirect() async {
    await Future.delayed(const Duration(seconds: 2));
    if (!mounted) return;

    final token = await SecureStorage.instance.getToken();
    final prefs = await SharedPreferences.getInstance();
    final seenOnboarding = prefs.getBool('seen_onboarding') ?? false;

    if (!mounted) return;

    if (token != null && token.isNotEmpty) {
      final role = await SecureStorage.instance.getRole();
      if (!mounted) return;
      if (role == 'POSTER') {
        context.go(RouteNames.posterDashboard);
      } else {
        context.go(RouteNames.workerHome);
      }
    } else if (!seenOnboarding) {
      context.go(RouteNames.onboarding);
    } else {
      context.go(RouteNames.login);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF07080B),
      body: AnimatedBuilder(
        animation: _controller,
        builder: (context, _) => _SplashContent(
          glow: _glowAnim.value,
          entry: _entryAnim.value,
        ),
      ),
    );
  }
}

class _SplashContent extends StatelessWidget {
  final double glow;
  final double entry;

  const _SplashContent({required this.glow, required this.entry});

  @override
  Widget build(BuildContext context) {
    return Opacity(
      opacity: entry,
      child: Transform.translate(
        offset: Offset(0, 24 * (1 - entry)),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _GlowRing(glow: glow),
              const SizedBox(height: 20),
              const _BrandTitle(),
              const SizedBox(height: 8),
              const _Tagline(),
              const SizedBox(height: 48),
              _PulseDots(glow: glow),
            ],
          ),
        ),
      ),
    );
  }
}

class _GlowRing extends StatelessWidget {
  final double glow;
  const _GlowRing({required this.glow});

  @override
  Widget build(BuildContext context) {
    final glowAlpha = (0.5 * glow).clamp(0.0, 1.0);

    return SizedBox(
      width: 96,
      height: 96,
      child: Stack(
        alignment: Alignment.center,
        children: [
          for (int i = 3; i >= 0; i--)
            Container(
              width: 48.0 + i * 28.0 * glow,
              height: 48.0 + i * 28.0 * glow,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Color.fromARGB(
                  ((0.07 - i * 0.016) * glow * 255).round().clamp(0, 255),
                  15,
                  139,
                  255,
                ),
              ),
            ),
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: const Color(0xFF07080B),
              border: Border.all(
                color: AppColors.primary,
                width: 1.5,
              ),
              boxShadow: [
                BoxShadow(
                  color: Color.fromARGB(
                    (glowAlpha * 255).round(),
                    15,
                    139,
                    255,
                  ),
                  blurRadius: 20 * glow,
                  spreadRadius: 4 * glow,
                ),
              ],
            ),
            child: const Icon(
              Icons.work_outline,
              size: 34,
              color: AppColors.primary,
            ),
          ),
        ],
      ),
    );
  }
}

class _BrandTitle extends StatelessWidget {
  const _BrandTitle();

  @override
  Widget build(BuildContext context) {
    return const Text(
      'Campus Gigs',
      style: TextStyle(
        fontSize: 30,
        fontWeight: FontWeight.w700,
        letterSpacing: -0.3,
        height: 1.1,
        color: Colors.white,
      ),
    );
  }
}

class _Tagline extends StatelessWidget {
  const _Tagline();

  @override
  Widget build(BuildContext context) {
    return Text(
      'Student gig marketplace',
      style: TextStyle(
        fontSize: 13,
        fontWeight: FontWeight.w400,
        letterSpacing: 0.3,
        color: Colors.white.withAlpha(102),
      ),
    );
  }
}

class _PulseDots extends StatelessWidget {
  final double glow;
  const _PulseDots({required this.glow});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 36,
      height: 4,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: List.generate(3, (i) {
          final delay = i * 0.25;
          final adjusted = ((glow - delay) / (1 - delay)).clamp(0.0, 1.0);
          final alpha = (adjusted * 255 * 0.75 + 38).round().clamp(0, 255);
          final glowA = (adjusted * 255 * 0.3).round().clamp(0, 255);
          return Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Color.fromARGB(alpha, 15, 139, 255),
              boxShadow: [
                BoxShadow(
                  color: Color.fromARGB(glowA, 15, 139, 255),
                  blurRadius: 6 * adjusted,
                ),
              ],
            ),
          );
        }),
      ),
    );
  }
}
