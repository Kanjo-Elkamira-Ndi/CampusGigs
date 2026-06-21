import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/models/gig_model.dart';

// TODO: Replace with real API call via GigRepository for production
class GigFeedNotifier extends AsyncNotifier<List<GigModel>> {
  static final List<Map<String, dynamic>> _mockGigMaps = [
    {
      'id': 'g1',
      'title': 'Logo Design for Student Startup',
      'description':
          'We need a modern, clean logo for our agri-tech startup launching at UYI. The logo should reflect innovation and African identity. Deliverables: 3 concepts, final files in SVG and PNG.',
      'budget': 15000,
      'category': 'Design',
      'categoryColor': 'ec4899',
      'university': 'University of Yaoundé I',
      'posterName': 'Amara Nkeng',
      'posterAvatar':
          'https://img.rocket.new/generatedImages/rocket_gen_img_1d43cebe9-1777822529462.png',
      'posterRating': '4.8',
      'createdAt': '2026-06-19T14:30:00.000Z',
      'applicantCount': 7,
      'isSaved': false,
      'availability': 'Available Today',
      'duration': '2-3 days',
      'imageUrl':
          'https://img.rocket.new/generatedImages/rocket_gen_img_1d43cebe9-1777822529462.png',
      'semanticLabel':
          'Graphic designer working on a colorful logo concept on a computer screen',
    },
    {
      'id': 'g2',
      'title': 'Python Tutor — Data Science Basics',
      'description':
          'Looking for an experienced Python tutor to help me with data science fundamentals: pandas, matplotlib, and numpy. 5 sessions of 1.5 hours each. Flexible schedule.',
      'budget': 25000,
      'category': 'Tutoring',
      'categoryColor': 'f59e0b',
      'university': 'University of Buea',
      'posterName': 'Félicité Mbarga',
      'posterAvatar':
          'https://img.rocket.new/generatedImages/rocket_gen_img_11c4caf0f-1772667789434.png',
      'posterRating': '4.6',
      'createdAt': '2026-06-18T09:15:00.000Z',
      'applicantCount': 12,
      'isSaved': true,
      'availability': 'Available Today',
      'duration': '5 sessions',
      'imageUrl':
          'https://img.rocket.new/generatedImages/rocket_gen_img_11c4caf0f-1772667789434.png',
      'semanticLabel':
          'Student working on a laptop with Python code visible on screen',
    },
    {
      'id': 'g3',
      'title': 'Event Photography — Graduation Ceremony',
      'description':
          'Need a skilled photographer for our departmental graduation ceremony on 28 June. Must have own DSLR and editing software. Deliverables: 200+ edited photos within 72 hours.',
      'budget': 45000,
      'category': 'Events',
      'categoryColor': '8b5cf6',
      'university': 'ESSTIC Yaoundé',
      'posterName': 'Jean-Paul Fopa',
      'posterAvatar':
          'https://img.rocket.new/generatedImages/rocket_gen_img_11f264ca8-1772600585868.png',
      'posterRating': '4.9',
      'createdAt': '2026-06-17T16:00:00.000Z',
      'applicantCount': 3,
      'isSaved': false,
      'availability': 'Deadline: 27 Jun',
      'duration': '1 day',
      'imageUrl':
          'https://img.rocket.new/generatedImages/rocket_gen_img_11f264ca8-1772600585868.png',
      'semanticLabel':
          'Photographer capturing a graduation ceremony with students in academic gowns',
    },
    {
      'id': 'g4',
      'title': 'React Native Developer — Campus App Feature',
      'description':
          'Our team needs a React Native developer to build a push notification feature for our campus events app. Must know Expo and Firebase Cloud Messaging. Part-time, 2 weeks.',
      'budget': 60000,
      'category': 'Tech',
      'categoryColor': '3b82f6',
      'university': 'Polytechnic Yaoundé',
      'posterName': 'Rostand Tchinda',
      'posterAvatar':
          'https://images.unsplash.com/photo-1453060113865-968cea1ad53a',
      'posterRating': '4.7',
      'createdAt': '2026-06-16T11:00:00.000Z',
      'applicantCount': 18,
      'isSaved': false,
      'availability': 'Urgent',
      'duration': '2 weeks',
      'imageUrl':
          'https://images.unsplash.com/photo-1453060113865-968cea1ad53a',
      'semanticLabel':
          'Developer coding on a laptop showing mobile app development environment',
    },
    {
      'id': 'g5',
      'title': 'French-English Translation — Research Paper',
      'description':
          'Need a bilingual student to translate a 15-page research paper from French to English. Field: public health. Must have strong academic writing skills.',
      'budget': 12000,
      'category': 'Writing',
      'categoryColor': '10b981',
      'university': 'FMSB Yaoundé',
      'posterName': 'Carine Ateba',
      'posterAvatar':
          'https://images.unsplash.com/photo-1687840646889-58895b1b1d0a',
      'posterRating': '4.5',
      'createdAt': '2026-06-20T08:00:00.000Z',
      'applicantCount': 5,
      'isSaved': false,
      'availability': 'Available Today',
      'duration': '3 days',
      'imageUrl':
          'https://images.unsplash.com/photo-1687840646889-58895b1b1d0a',
      'semanticLabel':
          'Open notebook with pen and highlighted text representing translation work',
    },
    {
      'id': 'g6',
      'title': 'Campus Delivery — Pharmacy Runs',
      'description':
          'Looking for a reliable student with a motorcycle to make pharmacy runs within the UB campus area 3x per week. Morning shift preferred.',
      'budget': 8000,
      'category': 'Delivery',
      'categoryColor': 'ef4444',
      'university': 'University of Buea',
      'posterName': 'Ngozi Wepngong',
      'posterAvatar':
          'https://images.unsplash.com/photo-1682298079007-0b8d4adbbfe3',
      'posterRating': '4.3',
      'createdAt': '2026-06-19T07:30:00.000Z',
      'applicantCount': 2,
      'isSaved': false,
      'availability': 'Recurring',
      'duration': 'Weekly',
      'imageUrl':
          'https://images.unsplash.com/photo-1682298079007-0b8d4adbbfe3',
      'semanticLabel':
          'Delivery person on a motorcycle in an urban campus environment',
    },
  ];

  @override
  Future<List<GigModel>> build() async {
    return _mockGigMaps.map(GigModel.fromMap).toList();
  }

  Future<void> fetchGigs({
    String? search,
    String? categoryId,
    int? minBudget,
    int? maxBudget,
    String? sortBy,
  }) async {
    state = const AsyncLoading();
    // TODO: Replace with real API call: GET /gigs with query params
    await Future.delayed(const Duration(milliseconds: 600));
    var gigs = _mockGigMaps.map(GigModel.fromMap).toList();
    if (search != null && search.isNotEmpty) {
      gigs = gigs
          .where(
            (g) =>
                g.title.toLowerCase().contains(search.toLowerCase()) ||
                g.category.toLowerCase().contains(search.toLowerCase()),
          )
          .toList();
    }
    state = AsyncData(gigs);
  }

  void toggleSave(String gigId) {
    state.whenData((gigs) {
      state = AsyncData(
        gigs
            .map((g) => g.id == gigId ? g.copyWith(isSaved: !g.isSaved) : g)
            .toList(),
      );
    });
  }
}

final gigFeedNotifierProvider =
    AsyncNotifierProvider<GigFeedNotifier, List<GigModel>>(
      () => GigFeedNotifier(),
    );
