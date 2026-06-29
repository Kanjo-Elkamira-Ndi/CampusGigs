import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme/app_colors.dart';
import '../../routes/route_names.dart';

class OnboardingPage extends StatefulWidget {
  const OnboardingPage({super.key});

  @override
  State<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends State<OnboardingPage> {
  final _controller = PageController();
  int _page = 0;

  static const _slides = [
    _SlideData(
      image: 'assets/images/onboarding_illustration_1.png',
      title: 'Find gigs at your university',
      desc: 'Browse hundreds of student-friendly gigs posted by fellow students and local businesses',
    ),
    _SlideData(
      image: 'assets/images/onboarding_illustration_2.png',
      title: 'Apply in seconds',
      desc: 'Send your application with a single tap. No lengthy forms, no waiting rooms',
    ),
    _SlideData(
      image: 'assets/images/onboarding_illustration_3.jpg',
      title: 'Get paid for your skills',
      desc: 'Complete gigs, earn XAF, and build your student portfolio',
    ),
  ];

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _complete() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('seen_onboarding', true);
    if (mounted) context.go(RouteNames.login);
  }

  bool get _isLast => _page == _slides.length;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0B1426),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: PageView.builder(
                controller: _controller,
                itemCount: _slides.length + 1,
                onPageChanged: (i) => setState(() => _page = i),
                itemBuilder: (context, index) {
                  if (index == _slides.length) {
                    return _LastSlide();
                  }
                  return _ContentSlide(slide: _slides[index]);
                },
              ),
            ),
            _BottomBar(
              page: _page,
              total: _slides.length + 1,
              isLast: _isLast,
              onSkip: _complete,
              onNext: () {
                if (_isLast) {
                  _complete();
                } else {
                  _controller.nextPage(
                    duration: 350.ms,
                    curve: Curves.easeOutCubic,
                  );
                }
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _ContentSlide extends StatelessWidget {
  final _SlideData slide;
  const _ContentSlide({required this.slide});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32),
      child: Column(
        children: [
          const Spacer(flex: 2),
          ClipRRect(
            borderRadius: BorderRadius.circular(20),
            child: Image.asset(
              slide.image,
              width: 280,
              height: 280,
              fit: BoxFit.contain,
              filterQuality: FilterQuality.medium,
            ),
          ),
          const Spacer(flex: 1),
          Text(
            slide.title,
            style: const TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.w700,
              color: Colors.white,
              height: 1.15,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 12),
          Text(
            slide.desc,
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w400,
              color: Colors.white.withAlpha(153),
              height: 1.45,
            ),
            textAlign: TextAlign.center,
          ),
          const Spacer(flex: 3),
        ],
      ),
    );
  }
}

class _LastSlide extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32),
      child: Column(
        children: [
          const Spacer(flex: 2),
          ClipRRect(
            borderRadius: BorderRadius.circular(20),
            child: Image.asset(
              'assets/images/last_onboarding.jpg',
              width: 280,
              height: 280,
              fit: BoxFit.contain,
              filterQuality: FilterQuality.medium,
            ),
          ),
          const Spacer(flex: 1),
          const Text(
            "You're all set",
            style: TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.w700,
              color: Colors.white,
              height: 1.15,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 12),
          Text(
            'Start exploring gigs near you and earn on your own terms',
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w400,
              color: Colors.white.withAlpha(153),
              height: 1.45,
            ),
            textAlign: TextAlign.center,
          ),
          const Spacer(flex: 3),
        ],
      ),
    );
  }
}

class _BottomBar extends StatelessWidget {
  final int page;
  final int total;
  final bool isLast;
  final VoidCallback onSkip;
  final VoidCallback onNext;

  const _BottomBar({
    required this.page,
    required this.total,
    required this.isLast,
    required this.onSkip,
    required this.onNext,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 16, 24, 32),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Dot indicators
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(total, (i) {
              final active = i == page;
              return AnimatedContainer(
                duration: 300.ms,
                curve: Curves.easeOutCubic,
                width: active ? 24 : 8,
                height: 8,
                margin: const EdgeInsets.symmetric(horizontal: 4),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(4),
                  color: active
                      ? AppColors.primary
                      : AppColors.primary.withAlpha(40),
                ),
              );
            }),
          ),
          const SizedBox(height: 28),
          Row(
            children: [
              // Skip button (hidden on last page)
              if (!isLast)
                TextButton(
                  onPressed: onSkip,
                  child: Text(
                    'Skip',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w500,
                      color: Colors.white.withAlpha(128),
                    ),
                  ),
                )
              else
                const Spacer(),
              const Spacer(),
              // Next / Get Started button
              SizedBox(
                width: 140,
                height: 50,
                child: FilledButton(
                  onPressed: onNext,
                  style: FilledButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  child: Text(
                    isLast ? 'Get Started' : 'Next',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _SlideData {
  final String image;
  final String title;
  final String desc;
  const _SlideData({required this.image, required this.title, required this.desc});
}
