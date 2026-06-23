class MockGig {
  final String id;
  final String title;
  final String description;
  final String categoryId;
  final String categoryName;
  final String university;
  final String posterName;
  final int budget;
  final int applicantCount;
  final String postedAt;
  final bool isSaved;
  final List<String> skills;
  final String deadline;
  final String location;

  const MockGig({
    required this.id,
    required this.title,
    required this.description,
    required this.categoryId,
    required this.categoryName,
    required this.university,
    required this.posterName,
    required this.budget,
    required this.applicantCount,
    required this.postedAt,
    this.isSaved = false,
    this.skills = const [],
    this.deadline = '',
    this.location = '',
  });
}

class MockCategory {
  final String id;
  final String name;
  final String icon;

  const MockCategory({
    required this.id,
    required this.name,
    required this.icon,
  });
}

class MockApplication {
  final String id;
  final String gigTitle;
  final String status;
  final String appliedAt;
  final int proposedBudget;
  final String coverLetter;

  const MockApplication({
    required this.id,
    required this.gigTitle,
    required this.status,
    required this.appliedAt,
    required this.proposedBudget,
    this.coverLetter = '',
  });
}

class MockWorkerStats {
  final int totalApplications;
  final int pendingApplications;
  final int acceptedApplications;
  final int profileCompleteness;
  final List<int> weeklyActivity;

  const MockWorkerStats({
    required this.totalApplications,
    required this.pendingApplications,
    required this.acceptedApplications,
    required this.profileCompleteness,
    required this.weeklyActivity,
  });
}

class MockData {
  MockData._();

  static const List<MockGig> gigs = [
    MockGig(
      id: '1',
      title: 'Graphic Design for Student Association Poster',
      description: 'We need a creative student to design a promotional poster for our upcoming student association event. The poster should be A4 format, include event details, sponsor logos, and a QR code for registration. Must be proficient in Canva or Adobe Illustrator. Previous experience with event posters is a plus.',
      categoryId: '1',
      categoryName: 'Design',
      university: 'University of Buea',
      posterName: 'Marie Edima',
      budget: 15000,
      applicantCount: 3,
      postedAt: '2026-06-20',
      isSaved: false,
      skills: ['Canva', 'Illustrator', 'Typography'],
      deadline: '2026-07-15',
      location: 'Buea',
    ),
    MockGig(
      id: '2',
      title: 'Photography for Graduation Ceremony',
      description: 'Looking for a student photographer to cover the upcoming graduation ceremony. Need to capture candid moments, group photos, and individual portraits. Must have your own camera and basic editing skills. The event runs from 8 AM to 2 PM. Previous event photography experience required.',
      categoryId: '1',
      categoryName: 'Design',
      university: 'University of Douala',
      posterName: 'Jean-Pierre Ndi',
      budget: 40000,
      applicantCount: 7,
      postedAt: '2026-06-18',
      isSaved: true,
      skills: ['Photography', 'Photo Editing', 'Lightroom'],
      deadline: '2026-07-10',
      location: 'Douala',
    ),
    MockGig(
      id: '3',
      title: 'Web Scraping Script in Python',
      description: 'I need a computer science student to write a Python script that scrapes product data from an e-commerce website. The script should extract product names, prices, descriptions, and image URLs into a CSV file. Must handle pagination and rate limiting. Well-documented code required.',
      categoryId: '3',
      categoryName: 'Tech',
      university: 'University of Yaoundé I',
      posterName: 'Esther Mbah',
      budget: 30000,
      applicantCount: 5,
      postedAt: '2026-06-15',
      isSaved: false,
      skills: ['Python', 'BeautifulSoup', 'Selenium', 'CSV'],
      deadline: '2026-07-20',
      location: 'Yaoundé',
    ),
    MockGig(
      id: '4',
      title: 'Tutoring in Advanced Mathematics',
      description: 'Seeking a math student to provide one-on-one tutoring sessions for Advanced Calculus and Linear Algebra. Sessions will be held twice a week for 1.5 hours each on campus. Must have excellent academic record (GPA 3.5+) and prior tutoring experience. Teaching materials provided.',
      categoryId: '4',
      categoryName: 'Teaching',
      university: 'University of Bamenda',
      posterName: 'Prof. Michael Tata',
      budget: 25000,
      applicantCount: 4,
      postedAt: '2026-06-22',
      isSaved: false,
      skills: ['Calculus', 'Linear Algebra', 'Teaching', 'Patience'],
      deadline: '2026-08-01',
      location: 'Bamenda',
    ),
    MockGig(
      id: '5',
      title: 'Video Editing for YouTube Channel',
      description: 'Looking for a video editor to help edit weekly YouTube videos for a campus vlog channel. Tasks include trimming footage, adding transitions, captions, background music, and end screens. Each video is 10-15 minutes long. Must have experience with CapCut or Premiere Pro.',
      categoryId: '3',
      categoryName: 'Tech',
      university: 'University of Douala',
      posterName: 'Kevin Nkeng',
      budget: 20000,
      applicantCount: 2,
      postedAt: '2026-06-25',
      isSaved: false,
      skills: ['Premiere Pro', 'CapCut', 'Color Grading', 'Audio Mixing'],
      deadline: '2026-07-05',
      location: 'Douala',
    ),
  ];

  static const List<MockCategory> categories = [
    MockCategory(id: '1', name: 'Design', icon: 'palette'),
    MockCategory(id: '2', name: 'Writing', icon: 'edit_note'),
    MockCategory(id: '3', name: 'Tech', icon: 'code'),
    MockCategory(id: '4', name: 'Teaching', icon: 'school'),
  ];

  static const List<MockApplication> applications = [
    MockApplication(
      id: '1',
      gigTitle: 'Graphic Design for Student Association Poster',
      status: 'PENDING',
      appliedAt: '2026-06-21',
      proposedBudget: 14000,
      coverLetter: 'I am a third-year Graphic Design student with 2 years of experience creating posters and flyers for campus events. I am proficient in Canva, Adobe Illustrator, and Photoshop. I have attached samples of my previous work for your review. I am confident I can deliver a high-quality design within 3 days of being selected.',
    ),
    MockApplication(
      id: '2',
      gigTitle: 'Photography for Graduation Ceremony',
      status: 'ACCEPTED',
      appliedAt: '2026-06-19',
      proposedBudget: 38000,
      coverLetter: 'I have been doing event photography for over 3 years and have covered 5+ graduation ceremonies. I own a Canon EOS R6 with multiple lenses and professional editing software. I will deliver 100+ edited photos within 48 hours of the event. References available upon request.',
    ),
    MockApplication(
      id: '3',
      gigTitle: 'Web Scraping Script in Python',
      status: 'REJECTED',
      appliedAt: '2026-06-16',
      proposedBudget: 28000,
      coverLetter: 'I am a computer science student specializing in data engineering. I have built similar scraping scripts for research projects. I will deliver a well-documented, reusable script with error handling and logging within 5 days.',
    ),
  ];

  static const MockWorkerStats workerStats = MockWorkerStats(
    totalApplications: 12,
    pendingApplications: 3,
    acceptedApplications: 2,
    profileCompleteness: 72,
    weeklyActivity: [2, 0, 3, 1, 4, 2, 1],
  );

  static String formatXAF(int amount) {
    if (amount >= 1000) {
      return '${(amount / 1000).toStringAsFixed(0)} 000 XAF';
    }
    return '$amount XAF';
  }

  static String relativeTime(String dateStr) {
    return '${DateTime.now().difference(DateTime.parse(dateStr)).inDays}d ago';
  }

  static String statusLabel(String status) {
    switch (status) {
      case 'PENDING': return 'Pending';
      case 'ACCEPTED': return 'Accepted';
      case 'REJECTED': return 'Rejected';
      default: return status;
    }
  }
}
