import '../../dto/gig/gig_dto.dart';
import '../../dto/application/application_dto.dart';
import '../../dto/message/conversation_dto.dart';
import '../../dto/message/message_dto.dart';

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

class MockConversation {
  final String id;
  final String participantId;
  final String participantName;
  final String? participantAvatar;
  final String gigId;
  final String gigTitle;
  final String lastMessage;
  final String lastMessageTime;
  final int unreadCount;

  const MockConversation({
    required this.id,
    required this.participantId,
    required this.participantName,
    this.participantAvatar,
    required this.gigId,
    required this.gigTitle,
    required this.lastMessage,
    required this.lastMessageTime,
    this.unreadCount = 0,
  });
}

class MockMessage {
  final String id;
  final String conversationId;
  final String senderId;
  final String senderName;
  final String content;
  final String type;
  final String? imageUrl;
  final bool isRead;
  final String createdAt;

  const MockMessage({
    required this.id,
    required this.conversationId,
    required this.senderId,
    required this.senderName,
    required this.content,
    this.type = 'text',
    this.imageUrl,
    this.isRead = false,
    required this.createdAt,
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

  // ── Poster: Posted Gigs ──
  static final List<GigDto> posterGigs = [
    GigDto(
      id: 'pg1',
      title: 'Design Social Media Graphics',
      description: 'Create 10 branded posts for Instagram and Facebook for our tech startup. Must be familiar with current design trends and able to maintain brand consistency across all posts.',
      budget: 25000,
      budgetType: 'FIXED',
      status: 'OPEN',
      category: {'id': '1', 'name': 'Design', 'icon': 'palette'},
      university: 'YIBS',
      posterName: 'TechCo Solutions',
      posterAvatar: null,
      applicantCount: 4,
      viewCount: 38,
      createdAt: '2025-07-01',
      skills: ['Figma', 'Canva', 'Branding'],
    ),
    GigDto(
      id: 'pg2',
      title: 'Build Landing Page in React',
      description: 'Single-page landing site with smooth animations. Must be fully responsive and cross-browser compatible. Design assets will be provided in Figma.',
      budget: 50000,
      budgetType: 'FIXED',
      status: 'IN_PROGRESS',
      category: {'id': '3', 'name': 'Tech', 'icon': 'code'},
      university: 'UY1',
      posterName: 'TechCo Solutions',
      posterAvatar: null,
      applicantCount: 7,
      viewCount: 92,
      createdAt: '2025-06-20',
      skills: ['React', 'Tailwind', 'JavaScript'],
    ),
    GigDto(
      id: 'pg3',
      title: 'Write 5 Blog Articles on AI',
      description: 'SEO-optimised articles, ~800 words each, covering AI trends, tools, and tutorials. Must include proper citations and meta descriptions.',
      budget: 15000,
      budgetType: 'FIXED',
      status: 'COMPLETED',
      category: {'id': '2', 'name': 'Writing', 'icon': 'edit_note'},
      university: 'UB',
      posterName: 'TechCo Solutions',
      posterAvatar: null,
      applicantCount: 12,
      viewCount: 145,
      createdAt: '2025-06-01',
      skills: ['Writing', 'SEO', 'Research'],
    ),
    GigDto(
      id: 'pg4',
      title: 'Transcribe 3 Audio Interviews',
      description: 'Accurate transcription of three 30-minute audio recordings in English. Clean formatted output with speaker labels and timestamps required.',
      budget: 8000,
      budgetType: 'FIXED',
      status: 'OPEN',
      category: {'id': '2', 'name': 'Writing', 'icon': 'edit_note'},
      university: 'YIBS',
      posterName: 'TechCo Solutions',
      posterAvatar: null,
      applicantCount: 2,
      viewCount: 17,
      createdAt: '2025-07-05',
      skills: ['Typing', 'English', 'Attention to detail'],
    ),
  ];

  // ── Poster: Applicants ──
  static final List<ApplicationDto> posterApplicants = [
    ApplicationDto(
      id: 'pa1',
      gigId: 'pg1',
      gigTitle: 'Design Social Media Graphics',
      applicantName: 'Amara Nkosi',
      applicantAvatar: null,
      applicantUniversity: 'YIBS',
      status: 'PENDING',
      coverLetter: 'I have 2 years of experience in social media design and have worked with 3 local brands. My portfolio includes Instagram carousels, Facebook ads, and branded templates.',
      proposedBudget: 24000,
      appliedAt: '2025-07-02',
    ),
    ApplicationDto(
      id: 'pa2',
      gigId: 'pg1',
      gigTitle: 'Design Social Media Graphics',
      applicantName: 'Blessing Eze',
      applicantAvatar: null,
      applicantUniversity: 'UY1',
      status: 'ACCEPTED',
      coverLetter: 'Top-rated Canva designer with a portfolio of 50+ social posts. I specialise in brand-consistent content that drives engagement.',
      proposedBudget: 25000,
      appliedAt: '2025-07-02',
    ),
    ApplicationDto(
      id: 'pa3',
      gigId: 'pg2',
      gigTitle: 'Build Landing Page in React',
      applicantName: 'Chidi Okafor',
      applicantAvatar: null,
      applicantUniversity: 'YIBS',
      status: 'PENDING',
      coverLetter: 'React dev with 1.5 years experience, published 4 live sites. Proficient with Tailwind, Framer Motion, and responsive design.',
      proposedBudget: 48000,
      appliedAt: '2025-06-21',
    ),
    ApplicationDto(
      id: 'pa4',
      gigId: 'pg2',
      gigTitle: 'Build Landing Page in React',
      applicantName: 'Diana Fon',
      applicantAvatar: null,
      applicantUniversity: 'UB',
      status: 'REJECTED',
      coverLetter: 'Full-stack developer specialising in React and Next.js. I have built landing pages for 3 startups.',
      proposedBudget: 52000,
      appliedAt: '2025-06-22',
    ),
  ];

  // ── Poster: Dashboard Stats ──
  static final Map<String, dynamic> posterStats = {
    'totalGigs': 4,
    'activeGigs': 2,
    'totalApplicants': 25,
    'pendingReviews': 3,
    'totalSpent': 73000,
    'completedGigs': 1,
    'monthlySpend': [5000.0, 12000.0, 0.0, 25000.0, 15000.0, 8000.0, 0.0],
  };

  // ── Poster: Earnings / Spend breakdown ──
  static final List<Map<String, dynamic>> earningsBreakdown = [
    {'label': 'Design', 'amount': 25000, 'color': 0xFF4F46E5},
    {'label': 'Development', 'amount': 50000, 'color': 0xFF10B981},
    {'label': 'Writing', 'amount': 23000, 'color': 0xFFF59E0B},
    {'label': 'Other', 'amount': 8000, 'color': 0xFF9CA3AF},
  ];

  // ── Worker Conversations ──
  static const List<MockConversation> workerMockConversations = [
    MockConversation(
      id: '1',
      participantId: '2',
      participantName: 'Marie Edima',
      participantAvatar: null,
      gigId: '1',
      gigTitle: 'Graphic Design for Student Association Poster',
      lastMessage: 'I can start working on it tomorrow',
      lastMessageTime: '2026-06-23T14:30:00.000Z',
      unreadCount: 2,
    ),
    MockConversation(
      id: '2',
      participantId: '3',
      participantName: 'Jean-Pierre Ndi',
      participantAvatar: null,
      gigId: '3',
      gigTitle: 'Build a simple portfolio website',
      lastMessage: 'Here is the first draft of the homepage',
      lastMessageTime: '2026-06-22T09:15:00.000Z',
      unreadCount: 0,
    ),
  ];

  // ── Poster Conversations ──
  static const List<MockConversation> posterMockConversations = [
    MockConversation(
      id: '1',
      participantId: '1',
      participantName: 'Kevin Nkeng',
      participantAvatar: null,
      gigId: '1',
      gigTitle: 'Graphic Design for Student Association Poster',
      lastMessage: 'I can start working on it tomorrow',
      lastMessageTime: '2026-06-23T14:30:00.000Z',
      unreadCount: 0,
    ),
  ];

  // ── Messages ──
  static const List<MockMessage> mockMessages = [
    MockMessage(
      id: '1', conversationId: '1', senderId: '2',
      senderName: 'Marie Edima',
      content: 'Hi! I saw your application for the flyer design gig.',
      isRead: true,
      createdAt: '2026-06-22T10:00:00.000Z',
    ),
    MockMessage(
      id: '2', conversationId: '1', senderId: '1',
      senderName: 'Kevin Nkeng',
      content: 'Hello! Yes, I am very interested in this project.',
      isRead: true,
      createdAt: '2026-06-22T10:05:00.000Z',
    ),
    MockMessage(
      id: '3', conversationId: '1', senderId: '2',
      senderName: 'Marie Edima',
      content: 'Great! Do you have any sample work I can see?',
      isRead: true,
      createdAt: '2026-06-22T10:10:00.000Z',
    ),
    MockMessage(
      id: '4', conversationId: '1', senderId: '1',
      senderName: 'Kevin Nkeng',
      content: 'Yes, I can share my portfolio link with you.',
      isRead: false,
      createdAt: '2026-06-23T14:25:00.000Z',
    ),
    MockMessage(
      id: '5', conversationId: '1', senderId: '1',
      senderName: 'Kevin Nkeng',
      content: 'I can start working on it tomorrow',
      isRead: false,
      createdAt: '2026-06-23T14:30:00.000Z',
    ),
    MockMessage(
      id: '6', conversationId: '2', senderId: '3',
      senderName: 'Jean-Pierre Ndi',
      content: 'Hi Kevin, I need a portfolio website built. I have the design ready in Figma and need it coded in HTML, CSS, and JavaScript.',
      isRead: true,
      createdAt: '2026-06-20T09:00:00.000Z',
    ),
    MockMessage(
      id: '7', conversationId: '2', senderId: '1',
      senderName: 'Kevin Nkeng',
      content: 'Hello Jean-Pierre! I can definitely help with that. I have built several responsive websites using HTML/CSS/JS. Could you share the Figma link so I can review it?',
      isRead: true,
      createdAt: '2026-06-20T09:30:00.000Z',
    ),
    MockMessage(
      id: '8', conversationId: '2', senderId: '3',
      senderName: 'Jean-Pierre Ndi',
      content: 'Here is the first draft of the homepage',
      isRead: true,
      createdAt: '2026-06-22T09:15:00.000Z',
    ),
  ];

  // ── Typed DTO Lists ──
  static final List<ConversationDto> workerConversations =
      workerMockConversations
          .map((c) => ConversationDto(
                id: c.id,
                participantId: c.participantId,
                participantName: c.participantName,
                participantAvatar: c.participantAvatar,
                gigId: c.gigId,
                gigTitle: c.gigTitle,
                lastMessage: c.lastMessage,
                lastMessageTime: c.lastMessageTime,
                unreadCount: c.unreadCount,
              ))
          .toList();

  static final List<ConversationDto> posterConversations =
      posterMockConversations
          .map((c) => ConversationDto(
                id: c.id,
                participantId: c.participantId,
                participantName: c.participantName,
                participantAvatar: c.participantAvatar,
                gigId: c.gigId,
                gigTitle: c.gigTitle,
                lastMessage: c.lastMessage,
                lastMessageTime: c.lastMessageTime,
                unreadCount: c.unreadCount,
              ))
          .toList();

  static final List<MessageDto> messageDtos = mockMessages
      .map((m) => MessageDto(
            id: m.id,
            conversationId: m.conversationId,
            senderId: m.senderId,
            senderName: m.senderName,
            content: m.content,
            type: m.type,
            imageUrl: m.imageUrl,
            isRead: m.isRead,
            createdAt: m.createdAt,
          ))
      .toList();

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
