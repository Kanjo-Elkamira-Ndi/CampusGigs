require('dotenv').config()
const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const uid = () => crypto.randomUUID()
const GEN = { p1: uid(), p2: uid(), p3: uid(), p4: uid(), p5: uid() }
const GEN_W = {}
for (let i = 1; i <= 15; i++) GEN_W['w' + i] = uid()

const CATEGORY_SLUGS = [
  'tutoring-academic', 'admin-errands', 'tech-dev', 'events-hospitality',
  'design-creative', 'moving-labour', 'photography-video', 'writing-translation',
]

const daysFromNow = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString() }
const hoursAgo = (h) => { const d = new Date(); d.setHours(d.getHours() - h); return d.toISOString() }
const pick = (...a) => a[Math.floor(Math.random() * a.length)]

const POSTER_USERS = [
  { id: GEN.p1, short: 'p1', email: 'marie@campus.cm', fullName: 'Marie Fofana', universityId: 'yibs', bio: 'Student council president. I post events, design, and errands gigs.' },
  { id: GEN.p2, short: 'p2', email: 'jules@campus.cm', fullName: 'Jules Biya', universityId: 'udla', bio: 'Engineering club lead, often need tech help and event muscle.' },
  { id: GEN.p3, short: 'p3', email: 'fatima@campus.cm', fullName: 'Fatima Oumarou', universityId: 'un', bio: 'Med student. I post tutoring and errand gigs.' },
  { id: GEN.p4, short: 'p4', email: 'elise@campus.cm', fullName: 'Elise Ngo', universityId: 'ub', bio: 'Department rep. Organising study groups and class events.' },
  { id: GEN.p5, short: 'p5', email: 'pauln@campus.cm', fullName: 'Paul Ndongo', universityId: 'ensp', bio: 'Lab assistant. Need help with maintenance and admin tasks.' },
]
const postMap = Object.fromEntries(POSTER_USERS.map(u => [u.short, u.id]))

const WORKER_USERS = [
  { id: GEN_W.w1, short: 'w1', email: 'kofi@campus.cm', fullName: 'Kofi Asante', universityId: 'ub', skills: ['Python', 'Algorithms', 'Math'], avgRating: 4.9, reviewCount: 12, hiredCount: 8, hourlyRate: 5000, availability: 'Immediately', experienceLevel: 'Intermediate', remoteAvailable: true, verified: true, responseTime: 'within 1 hour' },
  { id: GEN_W.w2, short: 'w2', email: 'ama@campus.cm', fullName: 'Ama Mensah', universityId: 'uy1', skills: ['Graphic design', 'Canva', 'Illustrator'], avgRating: 5.0, reviewCount: 7, hiredCount: 5, hourlyRate: 4000, availability: 'Immediately', experienceLevel: 'Intermediate', remoteAvailable: true, verified: true, responseTime: 'within 2 hours' },
  { id: GEN_W.w3, short: 'w3', email: 'sara@campus.cm', fullName: 'Sara Ndongo', universityId: 'udschang', skills: ['Events', 'Catering', 'Errands'], avgRating: 4.7, reviewCount: 15, hiredCount: 12, hourlyRate: 3500, availability: 'Immediately', experienceLevel: 'Expert', remoteAvailable: false, verified: true, responseTime: 'within 30 minutes' },
  { id: GEN_W.w4, short: 'w4', email: 'paulm@campus.cm', fullName: 'Paul Mbarga', universityId: 'ensp', skills: ['Electrician', 'Repairs', 'Tech help'], avgRating: 4.8, reviewCount: 9, hiredCount: 6, hourlyRate: 3000, availability: 'This Week', experienceLevel: 'Intermediate', remoteAvailable: false, verified: true, responseTime: 'within 2 hours' },
  { id: GEN_W.w5, short: 'w5', email: 'lionel@campus.cm', fullName: 'Lionel Tchoupo', universityId: 'ubam', skills: ['Photography', 'Video editing', 'Lightroom'], avgRating: 4.6, reviewCount: 11, hiredCount: 9, hourlyRate: 8000, availability: 'This Week', experienceLevel: 'Intermediate', remoteAvailable: false, verified: true, responseTime: 'within 3 hours' },
  { id: GEN_W.w6, short: 'w6', email: 'danielle@campus.cm', fullName: 'Danielle Nkwi', universityId: 'catholic', skills: ['Mathematics', 'Physics', 'Calculus', 'Statistics'], avgRating: 4.9, reviewCount: 18, hiredCount: 15, hourlyRate: 5500, availability: 'Immediately', experienceLevel: 'Expert', remoteAvailable: true, verified: true, responseTime: 'within 1 hour' },
  { id: GEN_W.w7, short: 'w7', email: 'emmanuel@campus.cm', fullName: 'Emmanuel Tala', universityId: 'esstic', skills: ['React', 'Laravel', 'Tailwind CSS', 'JavaScript', 'PHP'], avgRating: 4.8, reviewCount: 14, hiredCount: 11, hourlyRate: 7000, availability: 'This Week', experienceLevel: 'Intermediate', remoteAvailable: true, verified: true, responseTime: 'within 2 hours' },
  { id: GEN_W.w8, short: 'w8', email: 'prisca@campus.cm', fullName: 'Prisca Ewolo', universityId: 'uy2', skills: ['Translation', 'English', 'French', 'Proofreading'], avgRating: 5.0, reviewCount: 10, hiredCount: 7, hourlyRate: 4500, availability: 'Immediately', experienceLevel: 'Expert', remoteAvailable: true, verified: true, responseTime: 'within 1 hour' },
  { id: GEN_W.w9, short: 'w9', email: 'brice@campus.cm', fullName: 'Brice Mvondo', universityId: 'udla', skills: ['Python', 'Django', 'React', 'PostgreSQL', 'REST APIs'], avgRating: 4.7, reviewCount: 8, hiredCount: 6, hourlyRate: 6500, availability: 'Next Week', experienceLevel: 'Intermediate', remoteAvailable: true, verified: false, responseTime: 'within 4 hours' },
  { id: GEN_W.w10, short: 'w10', email: 'chantal@campus.cm', fullName: 'Chantal Ebongue', universityId: 'ub', skills: ['Cleaning', 'Organization', 'Laundry', 'Cooking'], avgRating: 4.8, reviewCount: 22, hiredCount: 18, hourlyRate: 2500, availability: 'Immediately', experienceLevel: 'Expert', remoteAvailable: false, verified: true, responseTime: 'within 30 minutes' },
  { id: GEN_W.w11, short: 'w11', email: 'rodrigue@campus.cm', fullName: 'Rodrigue Ngué', universityId: 'ensp', skills: ['Sound Engineering', 'Event Setup', 'MC', 'Audio Editing'], avgRating: 4.9, reviewCount: 16, hiredCount: 14, hourlyRate: 9000, availability: 'Immediately', experienceLevel: 'Expert', remoteAvailable: false, verified: true, responseTime: 'within 1 hour' },
  { id: GEN_W.w12, short: 'w12', email: 'nadia@campus.cm', fullName: 'Nadia Beyala', universityId: 'yibs', skills: ['Social Media', 'Content Creation', 'Canva', 'Copywriting'], avgRating: 4.6, reviewCount: 6, hiredCount: 4, hourlyRate: 3500, availability: 'This Week', experienceLevel: 'Entry', remoteAvailable: true, verified: false, responseTime: 'within 2 hours' },
  { id: GEN_W.w13, short: 'w13', email: 'samuel@campus.cm', fullName: 'Samuel Ndifor', universityId: 'ubam', skills: ['Delivery', 'Bike Riding', 'City Navigation', 'Customer Service'], avgRating: 4.5, reviewCount: 20, hiredCount: 25, hourlyRate: 2000, availability: 'Immediately', experienceLevel: 'Expert', remoteAvailable: false, verified: true, responseTime: 'within 15 minutes' },
  { id: GEN_W.w14, short: 'w14', email: 'alain@campus.cm', fullName: 'Alain Eyango', universityId: 'uy1', skills: ['French', 'English', 'Tutoring', 'Writing'], avgRating: 4.7, reviewCount: 13, hiredCount: 10, hourlyRate: 4000, availability: 'Immediately', experienceLevel: 'Intermediate', remoteAvailable: true, verified: true, responseTime: 'within 1 hour' },
  { id: GEN_W.w15, short: 'w15', email: 'esther@campus.cm', fullName: 'Esther Kemajou', universityId: 'udschang', skills: ['Photography', 'Portraits', 'Lightroom', 'Photoshop'], avgRating: 4.8, reviewCount: 9, hiredCount: 7, hourlyRate: 7000, availability: 'Next Week', experienceLevel: 'Intermediate', remoteAvailable: false, verified: true, responseTime: 'within 3 hours' },
]

const GIGS_BY_CATEGORY = {
  'tutoring-academic': [
    { title: 'Python tutor for data structures exam', description: 'Need help reviewing trees, hashmaps and Big-O before Friday\'s exam. 2-hour session. Must know Python basics.', budget: 5000, location: 'Library Ground Floor, UB', tags: ['Python', 'Exam prep'], poster: 'p3' },
    { title: 'Maths tutor for calculus finals', description: '1-on-1 sessions, 3 evenings before finals. Topics: limits, integrals, differential equations.', budget: 4500, location: 'Library Wing B, UN', tags: ['Calculus', 'Exam prep'], poster: 'p3' },
    { title: 'French oral exam practice', description: '3 sessions of 1 hour each. Conversational practice with feedback on pronunciation and grammar.', budget: 6000, location: 'Cafeteria, UN', tags: ['French', 'Oral'], poster: 'p3' },
    { title: 'Physics tutor for mechanics midterm', description: 'Need help with Newtonian mechanics, torque, and rotational dynamics. 3 sessions before the exam.', budget: 5500, location: 'Science Block, UY1', tags: ['Physics', 'Mechanics', 'Exam prep'], poster: 'p1' },
    { title: 'Statistics tutor for research project', description: 'Need help with SPSS, hypothesis testing and regression analysis for my final year project.', budget: 7000, location: 'Library, UBuea', tags: ['Statistics', 'SPSS', 'Research'], poster: 'p4' },
    { title: 'English essay writing coach', description: 'Need a tutor to review my essays and help improve academic writing style. Weekly sessions for 1 month.', budget: 8000, location: 'Remote', tags: ['Writing', 'Academic English'], poster: 'p4' },
    { title: 'Chemistry tutor for organic chem exam', description: 'Struggling with reaction mechanisms and spectroscopy. Need 2 crash sessions before finals.', budget: 4000, location: 'Chem Lab, UDschang', tags: ['Chemistry', 'Organic', 'Exam prep'], poster: 'p5' },
  ],
  'admin-errands': [
    { title: 'Help move furniture to new dorm', description: 'Two desks and a mattress to move from Block A to Block C. Should take about 1 hour. Need 2 people.', budget: 3500, location: 'Block C Dormitory, YIBS', tags: ['Moving', 'Heavy lifting'], poster: 'p1' },
    { title: 'Print and bind 3 thesis copies', description: 'Take USB to print shop, bind 3 copies in hardcover, deliver to admin office before Friday 4pm.', budget: 2000, location: 'Admin Block, UDla', tags: ['Printing'], poster: 'p2' },
    { title: 'Queue at the treasury all morning', description: 'Just need someone to stand in line and pay my semester fees when they get to the window.', budget: 2500, location: 'Treasury Building, UY1', tags: ['Queuing', 'Admin'], poster: 'p1' },
    { title: 'Organise department filing cabinet', description: 'The filing cabinet is a mess. Need someone to sort and label 4 drawers of student files alphabetically.', budget: 4000, location: 'Admin Office, ENSP', tags: ['Organisation', 'Filing'], poster: 'p5' },
    { title: 'Pick up and deliver lab coats', description: 'Pick up 20 lab coats from the laundry, deliver to the science lab. Must be done before Monday 8am.', budget: 3000, location: 'Laundry to Science Block, UB', tags: ['Delivery', 'Lab'], poster: 'p4' },
    { title: 'Assist with registration desk setup', description: 'Help set up tables, arrange welcome packs, and direct new students on orientation day.', budget: 3500, location: 'Main Hall, UDschang', tags: ['Setup', 'Orientation'], poster: 'p3' },
  ],
  'tech-dev': [
    { title: 'Fix WiFi on Ubuntu laptop', description: 'WiFi card not detected after kernel update. Need someone who knows Linux networking and driver management.', budget: 2500, location: 'Amphi 200, ENSP', tags: ['Linux', 'Networking'], poster: 'p5' },
    { title: 'Install printer + Office on laptop', description: 'Windows 11 laptop, network printer setup, Office 2021 license provided. Should take under an hour.', budget: 3000, location: 'Lab 4, ESSTIC', tags: ['Windows', 'Setup'], poster: 'p1' },
    { title: 'Build simple portfolio website', description: 'Personal portfolio with 4 pages: home, projects, about, contact. Must be mobile-friendly.', budget: 15000, location: 'Remote', tags: ['Web Dev', 'Portfolio'], poster: 'p2' },
    { title: 'Fix broken laptop charging port', description: 'DC jack is loose, laptop only charges at a specific angle. Need soldering skills. HP Pavilion.', budget: 5000, location: 'Dorm 8, UDla', tags: ['Repair', 'Hardware'], poster: 'p2' },
    { title: 'Set up MySQL database for class project', description: 'Need help designing schema, setting up a local MySQL instance, and writing 10 complex queries.', budget: 6000, location: 'Library, UN', tags: ['Database', 'SQL'], poster: 'p3' },
    { title: 'Troubleshoot projector + audio system', description: 'Conference room projector not syncing with laptop, audio cuts out. AV equipment experience needed.', budget: 3500, location: 'Conference Room, UBam', tags: ['AV', 'Troubleshooting'], poster: 'p4' },
    { title: 'Build a club membership form app', description: 'Simple web app for student club registration. Collect name, email, department. Export to CSV.', budget: 12000, location: 'Remote', tags: ['React', 'Web App'], poster: 'p1' },
  ],
  'events-hospitality': [
    { title: 'Help set up graduation dinner', description: 'Set up tables, lights, and sound system for a 60-person dinner. Take down afterwards. 4-hour commitment.', budget: 6000, location: 'Faculty Hall, UDla', tags: ['Setup', 'Evening'], poster: 'p2' },
    { title: 'Set up sound system for cultural night', description: 'Bring or rent speakers and mixer. Run sound during the 3-hour event. Must have experience.', budget: 12000, location: 'Open Quad, YIBS', tags: ['Sound', 'Live Event'], poster: 'p1' },
    { title: 'MC + sound runner for engineering night', description: 'Bilingual MC needed. Manage sound cues and keep the programme running on time.', budget: 10000, location: 'Auditorium, UDla', tags: ['MC', 'Bilingual'], poster: 'p2' },
    { title: 'Serve food at department barbecue', description: 'Help grill and serve 100 students. 3-hour shift including cleanup. Free meal included.', budget: 3000, location: 'Sports Field, UBuea', tags: ['Catering', 'Serving'], poster: 'p4' },
    { title: 'Usher for faculty lecture series', description: 'Greet attendees, hand out programmes, guide people to seats. 2 sessions of 2 hours each.', budget: 2500, location: 'Main Auditorium, UY1', tags: ['Ushering', 'Formal'], poster: 'p1' },
    { title: 'Photobooth attendant for freshers week', description: 'Run the photobooth, manage props, ensure guests get their prints. Fun 5-hour shift.', budget: 4000, location: 'Student Centre, YIBS', tags: ['Photobooth', 'Freshers'], poster: 'p1' },
  ],
  'design-creative': [
    { title: 'Design poster for student council event', description: 'Need a punchy A2 poster for Culture Week. Brand colours and logo provided. Must deliver in 48 hours.', budget: 4000, location: 'Remote', tags: ['Poster', 'Branding'], poster: 'p1' },
    { title: 'Video editing for student club recap', description: '5-minute recap video from 30 minutes of raw footage. Add music, lower thirds, and transitions.', budget: 7000, location: 'Remote', tags: ['Premiere', 'Recap'], poster: 'p1' },
    { title: 'Design Instagram template pack (5 posts)', description: 'Create 5 editable Instagram post templates in Canva for the department club.', budget: 5000, location: 'Remote', tags: ['Canva', 'Social Media'], poster: 'p4' },
    { title: 'Illustrate school magazine cover', description: 'Need an A4 cover illustration for the annual school magazine. Theme: "Innovation in Cameroon".', budget: 8000, location: 'Remote', tags: ['Illustration', 'Magazine'], poster: 'p2' },
    { title: 'Design flyer for charity run', description: 'A5 flyer, front and back. Include route map, date, registration link. Must be print-ready.', budget: 3500, location: 'Remote', tags: ['Flyer', 'Charity'], poster: 'p3' },
    { title: 'Animate 30-second intro video', description: 'Motion graphics intro for the engineering club YouTube channel. After Effects or similar.', budget: 10000, location: 'Remote', tags: ['Animation', 'Motion Graphics'], poster: 'p2' },
    { title: 'Redesign club website homepage', description: 'Current site looks outdated. Need a fresh, modern homepage design. Figma or HTML/CSS.', budget: 9000, location: 'Remote', tags: ['Web Design', 'Figma'], poster: 'p5' },
  ],
  'moving-labour': [
    { title: 'Help move library books to new wing', description: 'Move boxes of books from old library to the new wing. Trolleys provided. 3-hour shift.', budget: 4000, location: 'Library, UB', tags: ['Moving', 'Heavy'], poster: 'p4' },
    { title: 'Clear out storage room in admin block', description: 'Sort items into keep/discard/donate bins. Move furniture to designated rooms.', budget: 5000, location: 'Admin Block, UDschang', tags: ['Clearing', 'Organisation'], poster: 'p3' },
    { title: 'Assemble 10 new desks in lecture hall', description: 'Flat-pack desks need assembly with tools provided. Work in pairs. Estimated 4 hours.', budget: 6000, location: 'Lecture Hall B, ENSP', tags: ['Assembly', 'Furniture'], poster: 'p5' },
    { title: 'Load and unload sports equipment truck', description: 'Help load gym equipment onto a truck and unload at the new sports centre. Gloves provided.', budget: 3500, location: 'Old Gym, UDla', tags: ['Loading', 'Sports'], poster: 'p2' },
    { title: 'Move lab equipment between buildings', description: 'Carefully move sensitive lab equipment from Block A to the new science building. Fragile items.', budget: 5500, location: 'Science Block to New Lab, UY1', tags: ['Lab', 'Fragile'], poster: 'p5' },
    { title: 'Garden cleanup after campus event', description: 'Pick up trash, fold and store tents and chairs, sweep the quad area after the open day event.', budget: 3000, location: 'Main Quad, YIBS', tags: ['Cleanup', 'Grounds'], poster: 'p1' },
  ],
  'photography-video': [
    { title: 'Photographer for graduation ceremony', description: 'Full-day shoot from 8am to 5pm. Edited gallery within a week. Must bring own gear.', budget: 15000, location: 'Main Hall, UDschang', tags: ['Event', 'Portraits'], poster: 'p3' },
    { title: 'Wedding-style portraits for class photo day', description: 'Half-day shoot, classic posed shots for 30 students. Outdoor location. Edited within 5 days.', budget: 18000, location: 'Botanical Garden, UDschang', tags: ['Portraits', 'Outdoor'], poster: 'p2' },
    { title: 'Product photos for campus business', description: '30 photos of handmade crafts for an online store. Clean background, consistent lighting.', budget: 8000, location: 'Arts Building, UB', tags: ['Product', 'E-commerce'], poster: 'p4' },
    { title: 'Documentary-style video for project showcase', description: 'Record and edit a 3-minute documentary about the engineering final year project showcase.', budget: 12000, location: 'Engineering Block, UDla', tags: ['Documentary', 'Video'], poster: 'p2' },
    { title: 'Headshots for student club executives', description: 'Individual and group headshots for 15 club exec members. Plain background. Quick turnaround.', budget: 6000, location: 'Student Centre, YIBS', tags: ['Headshots', 'Corporate'], poster: 'p1' },
    { title: 'Drone aerial footage of campus', description: 'Need 2 minutes of drone footage covering the entire campus for a promo video. Must have own drone.', budget: 20000, location: 'Campus Wide, UN', tags: ['Drone', 'Aerial'], poster: 'p3' },
    { title: 'Live stream graduation ceremony', description: 'Set up and manage a YouTube live stream of the graduation ceremony. 2 cameras, 4-hour event.', budget: 25000, location: 'Amphi 3000, UB', tags: ['Live Stream', 'Ceremony'], poster: 'p4' },
  ],
  'writing-translation': [
    { title: 'English-French report translation (10 pages)', description: 'Academic report on public health. Needs accurate translation with technical terminology.', budget: 8000, location: 'Remote', tags: ['Academic', 'EN-FR'], poster: 'p3' },
    { title: 'Translate club bylaws EN->FR', description: '8 pages of club constitution and bylaws. Formal legal tone. Need clean bilingual document.', budget: 5500, location: 'Remote', tags: ['Legal', 'Bylaws'], poster: 'p1' },
    { title: 'Proofread master\'s thesis abstract', description: '300-word abstract needs proofreading for grammar, clarity and academic tone. English native preferred.', budget: 2000, location: 'Remote', tags: ['Proofreading', 'Academic'], poster: 'p2' },
    { title: 'Write grant proposal for research club', description: 'Draft a 5-page grant proposal for a student research initiative. Must follow university template.', budget: 10000, location: 'Remote', tags: ['Grant Writing', 'Research'], poster: 'p5' },
    { title: 'French to English translation of medical notes', description: '4 pages of medical lecture notes. Accurate terminology required. Medical background a plus.', budget: 6000, location: 'Remote', tags: ['Medical', 'FR-EN'], poster: 'p3' },
    { title: 'Write blog posts for campus magazine (3 articles)', description: 'Three 800-word articles on campus life, tech trends, and student spotlights.', budget: 7500, location: 'Remote', tags: ['Blog', 'Writing'], poster: 'p1' },
    { title: 'Create bilingual event programme', description: 'Design and translate a 12-page event programme for International Week. English and French side-by-side.', budget: 9000, location: 'Remote', tags: ['Bilingual', 'Layout'], poster: 'p4' },
  ],
}

async function seed() {
  const client = await pool.connect()
  try {
    console.log('\n🌱 Seeding demo users...')
    const hash = await bcrypt.hash('password123', 12)

    for (const u of [...POSTER_USERS, ...WORKER_USERS]) {
      const isWorker = u.short?.startsWith('w')
      await client.query(`
        INSERT INTO users (id, email, full_name, role, university_id, bio, skills, avg_rating, review_count, hired_count, hourly_rate, availability, experience_level, remote_available, verified, response_time, password_hash, name)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $3)
        ON CONFLICT (id) DO NOTHING
      `, [
        u.id, u.email, u.fullName,
        isWorker ? 'WORKER' : 'POSTER',
        u.universityId, u.bio || null,
        u.skills || [], u.avgRating || 0, u.reviewCount || 0, u.hiredCount || 0,
        u.hourlyRate || null, u.availability || null, u.experienceLevel || null,
        u.remoteAvailable ?? false, u.verified ?? false, u.responseTime || null,
        hash,
      ])
    }
    console.log(`✅ ${POSTER_USERS.length + WORKER_USERS.length} users seeded`)

    console.log('\n🌱 Seeding gigs...')
    const catResult = await client.query('SELECT id, slug FROM categories')
    const catMap = {}
    for (const row of catResult.rows) catMap[row.slug] = row.id

    const uniForPoster = { p1: 'yibs', p2: 'udla', p3: 'un', p4: 'ub', p5: 'ensp' }
    let totalGigs = 0
    const gigIds = []

    for (const slug of CATEGORY_SLUGS) {
      const catId = catMap[slug]
      if (!catId) { console.log(`  ⚠️  Category "${slug}" not found`); continue }
      const gigs = GIGS_BY_CATEGORY[slug]
      if (!gigs) continue

      for (const g of gigs) {
        const hoursBack = Math.floor(Math.random() * 168) + 1
        const daysAhead = Math.floor(Math.random() * 14) + 1
        const status = pick('OPEN', 'OPEN', 'OPEN', 'OPEN', 'IN_PROGRESS', 'COMPLETED')
        const res = await client.query(`
          INSERT INTO gigs (poster_id, category_id, title, description, budget, location, slots, deadline, status, created_at, university_id, tags, is_easy_apply)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          RETURNING id
        `, [
          postMap[g.poster], catId, g.title, g.description, g.budget, g.location,
          Math.floor(Math.random() * 3) + 1,
          daysFromNow(daysAhead), status, hoursAgo(hoursBack),
          uniForPoster[g.poster], g.tags, Math.random() > 0.3,
        ])
        gigIds.push({ id: res.rows[0].id, poster: g.poster })
        totalGigs++
      }
    }
    console.log(`✅ ${totalGigs} gigs seeded`)

    console.log('\n🌱 Seeding applications...')
    const workerIds = WORKER_USERS.map(u => u.id)
    const coverNotes = [
      'I have experience in this exact type of work and can start immediately. I am reliable and detail-oriented.',
      'I would love to help with this! I have done similar work before and my availability is flexible.',
      'This sounds perfect for my skills. I can deliver high quality work within your timeline.',
      'I am a hardworking student looking for opportunities. I will give this my full attention and effort.',
      'I have strong qualifications for this role and references available upon request.',
      'I have done this many times before and can handle it efficiently. Available any time this week.',
    ]
    let appCount = 0

    for (const gig of gigIds) {
      const count = Math.floor(Math.random() * 3) + 1
      const shuffled = [...workerIds].sort(() => Math.random() - 0.5).slice(0, count)

      for (const workerId of shuffled) {
        const existing = await client.query(
          'SELECT id FROM applications WHERE gig_id = $1 AND worker_id = $2',
          [gig.id, workerId]
        )
        if (existing.rows.length > 0) continue

        await client.query(`
          INSERT INTO applications (gig_id, worker_id, cover_note, status, applied_at)
          VALUES ($1, $2, $3, $4, $5)
        `, [
          gig.id, workerId,
          coverNotes[Math.floor(Math.random() * coverNotes.length)],
          Math.random() > 0.7 ? 'ACCEPTED' : 'PENDING',
          hoursAgo(Math.floor(Math.random() * 72) + 1),
        ])
        appCount++
      }
    }
    console.log(`✅ ${appCount} applications seeded`)

    console.log('\n🎉 Demo data seed complete!')
    console.log('   Posters:     marie@campus.cm, jules@campus.cm, fatima@campus.cm, elise@campus.cm, pauln@campus.cm')
    console.log('   Workers:     kofi@campus.cm, ama@campus.cm, sara@campus.cm, paulm@campus.cm, lionel@campus.cm, etc.')
    console.log('   Password:    password123 (all users)')
    console.log(`   Gigs:        ${totalGigs} total across ${CATEGORY_SLUGS.length} categories`)
    console.log(`   Applications: ${appCount} total`)
  } finally {
    client.release()
    await pool.end()
  }
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
