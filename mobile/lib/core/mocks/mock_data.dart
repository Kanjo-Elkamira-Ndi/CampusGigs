import '../../dto/gig/gig_dto.dart';
import '../../dto/application/application_dto.dart';
import '../../dto/message/conversation_dto.dart';
import '../../dto/message/message_dto.dart';
import '../../dto/notification/notification_dto.dart';

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

  // ── Notifications ──
  static final List<NotificationDto> notifications = [
    NotificationDto(id:'n1', title:'New applicant', body:'Amara Nkosi applied to your Design gig.',
      type:'APPLICATION', isRead:false, createdAt:'2025-07-05T09:12:00Z', referenceId:'pg1'),
    NotificationDto(id:'n2', title:'Application accepted', body:'Your application for "Logo Design" was accepted.',
      type:'APPLICATION', isRead:false, createdAt:'2025-07-04T16:40:00Z', referenceId:'a1'),
    NotificationDto(id:'n3', title:'New message', body:'Blessing Eze sent you a message.',
      type:'MESSAGE', isRead:true, createdAt:'2025-07-04T11:00:00Z', referenceId:'conv1'),
    NotificationDto(id:'n4', title:'Gig completed', body:'Build Landing Page has been marked complete.',
      type:'GIG', isRead:true, createdAt:'2025-07-03T08:30:00Z', referenceId:'pg2'),
    NotificationDto(id:'n5', title:'Review received', body:'You received a 5-star review from TechCo.',
      type:'REVIEW', isRead:true, createdAt:'2025-07-02T14:00:00Z', referenceId:'r1'),
  ];

  // ── Conversations ──
  static final List<ConversationDto> conversations = [
    ConversationDto(id:'conv1', otherUserId:'u2', otherUserName:'Blessing Eze',
      otherUserAvatar:null, otherUserRole:'WORKER', gigTitle:'Design Social Media Graphics',
      lastMessage:'Sure, I can start Monday.', lastMessageAt:'2025-07-05T10:30:00Z',
      unreadCount:2, applicationId:'pa2'),
    ConversationDto(id:'conv2', otherUserId:'u3', otherUserName:'Chidi Okafor',
      otherUserAvatar:null, otherUserRole:'WORKER', gigTitle:'Build Landing Page in React',
      lastMessage:'I have sent the first draft.', lastMessageAt:'2025-07-04T18:00:00Z',
      unreadCount:0, applicationId:'pa3'),
    ConversationDto(id:'conv3', otherUserId:'u4', otherUserName:'TechCo Solutions',
      otherUserAvatar:null, otherUserRole:'POSTER', gigTitle:'Logo Design for Startup',
      lastMessage:'When can you deliver?', lastMessageAt:'2025-07-03T09:15:00Z',
      unreadCount:1, applicationId:'a1'),
  ];

  // ── Messages (keyed by conversationId) ──
  static final Map<String, List<MessageDto>> messages = {
    'conv1': [
      MessageDto(id:'m1', conversationId:'conv1', senderId:'currentUser',
        content:'Hi! I saw your application, looks great.', sentAt:'2025-07-05T09:00:00Z', isOwn:true),
      MessageDto(id:'m2', conversationId:'conv1', senderId:'u2',
        content:'Thank you! I am very excited about this project.', sentAt:'2025-07-05T09:05:00Z', isOwn:false),
      MessageDto(id:'m3', conversationId:'conv1', senderId:'currentUser',
        content:'Can you start on Monday?', sentAt:'2025-07-05T10:25:00Z', isOwn:true),
      MessageDto(id:'m4', conversationId:'conv1', senderId:'u2',
        content:'Sure, I can start Monday.', sentAt:'2025-07-05T10:30:00Z', isOwn:false),
    ],
    'conv2': [
      MessageDto(id:'m5', conversationId:'conv2', senderId:'u3',
        content:'I have sent the first draft.', sentAt:'2025-07-04T18:00:00Z', isOwn:false),
    ],
    'conv3': [
      MessageDto(id:'m6', conversationId:'conv3', senderId:'u4',
        content:'When can you deliver?', sentAt:'2025-07-03T09:15:00Z', isOwn:false),
    ],
  };

  // ── Freelancer Directory ──
  static final List<Map<String, dynamic>> freelancers = [
    {'id':'f1','name':'Amara Nkosi','university':'YIBS','skills':['Figma','Canva','Branding'],
     'rating':4.8,'reviewCount':12,'completedGigs':9,'avatar':null,'bio':'Graphic designer with 2 years experience in brand identity.'},
    {'id':'f2','name':'Blessing Eze','university':'UY1','skills':['React','JavaScript','Tailwind'],
     'rating':4.9,'reviewCount':20,'completedGigs':15,'avatar':null,'bio':'Frontend dev building clean, fast web apps.'},
    {'id':'f3','name':'Chidi Okafor','university':'YIBS','skills':['React','Node.js','PostgreSQL'],
     'rating':4.7,'reviewCount':8,'completedGigs':6,'avatar':null,'bio':'Full-stack developer specialising in PERN stack.'},
    {'id':'f4','name':'Diana Fon','university':'UB','skills':['Writing','SEO','Research'],
     'rating':4.6,'reviewCount':15,'completedGigs':11,'avatar':null,'bio':'Content writer crafting SEO articles that rank.'},
    {'id':'f5','name':'Eric Manga','university':'UDS','skills':['Python','Data Analysis','Excel'],
     'rating':4.5,'reviewCount':6,'completedGigs':4,'avatar':null,'bio':'Data analyst turning raw numbers into insights.'},
  ];

  // ── Poster Profile ──
  static final Map<String, dynamic> posterProfile = {
    'id':'currentPoster','name':'Alex Tchamba','email':'alex@techco.cm',
    'phone':'+237 670 000 000','company':'TechCo Solutions','university':'YIBS',
    'bio':'We build digital products for Cameroonian businesses.','avatar':null,
    'totalGigsPosted':4,'totalSpent':73000,'memberSince':'2025-01-15',
    'rating':4.7,'reviewCount':9,
  };

  // ── Worker Profile ──
  static final Map<String, dynamic> workerProfile = {
    'id': 'currentWorker',
    'name': 'Amara Nkosi',
    'email': 'amara@student.yibs.cm',
    'phone': '+237 655 000 000',
    'university': 'YIBS',
    'degree': 'BSc Computer Science',
    'yearOfStudy': '3rd Year',
    'bio': 'Passionate graphic designer and frontend developer. I love crafting clean, purposeful digital experiences.',
    'avatar': null,
    'skills': ['Figma', 'Canva', 'React', 'Flutter', 'Branding'],
    'rating': 4.8,
    'reviewCount': 12,
    'completedGigs': 9,
    'totalEarned': 87000,
    'memberSince': '2025-02-10',
    'profileStrength': 0.78,
  };

  // ── Worker Reviews (received) ──
  static final List<Map<String, dynamic>> workerReviews = [
    {
      'id': 'wr1',
      'reviewerName': 'TechCo Solutions',
      'rating': 5,
      'comment': 'Amara delivered exceptional work. Very professional and on time.',
      'gigTitle': 'Design Social Media Graphics',
      'createdAt': '2025-07-01',
    },
    {
      'id': 'wr2',
      'reviewerName': 'StartHub Cameroon',
      'rating': 5,
      'comment': 'Great attention to detail. Will definitely hire again.',
      'gigTitle': 'Create Brand Identity Kit',
      'createdAt': '2025-06-15',
    },
    {
      'id': 'wr3',
      'reviewerName': 'DevAgency YDE',
      'rating': 4,
      'comment': 'Good work overall. Minor revision needed but handled quickly.',
      'gigTitle': 'Design App Icons',
      'createdAt': '2025-06-01',
    },
  ];

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
