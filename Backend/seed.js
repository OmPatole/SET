/**
 * Seed script — populates database with data from the existing frontend.
 * Run: npm run seed
 */

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Admin from './models/Admin.js';
import NavItem from './models/NavItem.js';
import HeroSlide from './models/HeroSlide.js';
import Stat from './models/Stat.js';
import Department from './models/Department.js';
import News from './models/News.js';
import Event from './models/Event.js';
import Facility from './models/Facility.js';
import Alumni from './models/Alumni.js';
import Notice from './models/Notice.js';
import SiteSetting from './models/SiteSetting.js';

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/set_university');
  console.log('✅ Connected to MongoDB');

  // ─── Admin ───────────────────────────────────────────────────────────────
  const existing = await Admin.findOne({ username: 'admin' });
  if (!existing) {
    await Admin.create({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin@SET2025',
      email: 'admin@set.shivajiuniversity.ac.in',
      role: 'admin',
    });
    console.log('✅ Admin user created  →  username: admin  |  password: admin@SET2025');
  } else {
    console.log('ℹ️  Admin already exists, skipping');
  }

  // ─── Navbar ──────────────────────────────────────────────────────────────
  await NavItem.deleteMany({});
  const navData = [
    {
      label: 'About',
      href: '#',
      order: 0,
      dropdown: [
        { label: 'About SET', href: '#' },
        { label: 'Vision & Mission', href: '#' },
        { label: 'Leadership', href: '#' },
        { label: 'Accreditations', href: '#accreditations' },
        { label: 'Committees', href: '#' },
        { label: 'Policy Documents', href: '#' },
      ],
    },
    {
      label: 'Academics',
      href: '#',
      order: 1,
      dropdown: [
        { label: 'Departments', href: '#departments' },
        { label: 'Programs Offered', href: '#departments' },
        { label: 'Syllabus', href: '#' },
        { label: 'Academic Calendar', href: '#' },
        { label: 'Examinations', href: '#' },
      ],
    },
    {
      label: 'Research',
      href: '#',
      order: 2,
      dropdown: [
        { label: 'Research Centers', href: '#' },
        { label: 'Publications', href: '#' },
        { label: 'Projects', href: '#' },
        { label: 'Patents', href: '#' },
        { label: 'PhD Program', href: '#' },
      ],
    },
    {
      label: 'Admissions',
      href: '#',
      order: 3,
      dropdown: [
        { label: 'How to Apply', href: '#' },
        { label: 'Eligibility', href: '#' },
        { label: 'Fee Structure', href: '#' },
        { label: 'Scholarships', href: '#' },
        { label: 'Foreign Students', href: '#' },
      ],
    },
    {
      label: 'Campus Life',
      href: '#',
      order: 4,
      dropdown: [
        { label: 'Facilities', href: '#facilities' },
        { label: 'Library', href: '#' },
        { label: 'Sports', href: '#' },
        { label: 'Hostel', href: '#' },
        { label: 'Clubs & Activities', href: '#' },
      ],
    },
    {
      label: 'Placements',
      href: '#',
      order: 5,
      dropdown: [
        { label: 'Placement Cell', href: '#' },
        { label: 'Top Recruiters', href: '#' },
        { label: 'Internships', href: '#' },
        { label: 'Alumni', href: '#alumni' },
        { label: 'Statistics', href: '#' },
      ],
    },
    { label: 'Notices', href: '#notices', order: 6, dropdown: [] },
    { label: 'Contact', href: '#', order: 7, dropdown: [] },
  ];
  await NavItem.insertMany(navData);
  console.log('✅ Navbar items seeded');

  // ─── Hero Slides ─────────────────────────────────────────────────────────
  await HeroSlide.deleteMany({});
  await HeroSlide.insertMany([
    {
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1400&q=80',
      tag: 'Welcome to SET',
      title: 'Shaping Engineers,\nBuilding Futures',
      subtitle:
        'Department of Technology, Shivaji University — AICTE approved, TEQIP funded, offering B.Tech & M.Tech programs since 2006.',
      cta1: { label: 'Explore Programs', href: '#departments' },
      cta2: { label: 'Apply for 2025–26', href: '#admissions' },
      order: 0,
      active: true,
    },
    {
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1400&q=80',
      tag: 'World-Class Research',
      title: 'Innovation That\nDrives Tomorrow',
      subtitle:
        'Home to cutting-edge research centers, patents, and international collaborations that solve real-world challenges.',
      cta1: { label: 'Research Centers', href: '#research' },
      cta2: { label: 'View Publications', href: '#publications' },
      order: 1,
      active: true,
    },
    {
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80',
      tag: 'Campus Life',
      title: 'A Vibrant Academic\nCommunity',
      subtitle:
        'Experience a holistic education with state-of-the-art facilities, sports, cultural activities, and industry partnerships.',
      cta1: { label: 'Campus Life', href: '#campus' },
      cta2: { label: 'Virtual Tour', href: '#tour' },
      order: 2,
      active: true,
    },
  ]);
  console.log('✅ Hero slides seeded');

  // ─── Stats ───────────────────────────────────────────────────────────────
  await Stat.deleteMany({});
  await Stat.insertMany([
    { icon: 'FiUsers', value: 6000, suffix: '+', label: 'Students Enrolled', sublabel: 'UG, PG & PhD', order: 0 },
    { icon: 'FiBook', value: 12, suffix: '', label: 'Departments', sublabel: 'Engineering & Technology', order: 1 },
    { icon: 'FiAward', value: 300, suffix: '+', label: 'Faculty Members', sublabel: 'PhD & Industry Experts', order: 2 },
    { icon: 'FiTrendingUp', value: 95, suffix: '%', label: 'Placement Rate', sublabel: 'Average across branches', order: 3 },
    { icon: 'FiGlobe', value: 50, suffix: '+', label: 'Industry Partners', sublabel: 'MoUs & Collaborations', order: 4 },
    { icon: 'FiBriefcase', value: 40, suffix: '+', label: 'Years of Excellence', sublabel: 'Est. 1983', order: 5 },
  ]);
  console.log('✅ Stats seeded');

  // ─── Departments ─────────────────────────────────────────────────────────
  await Department.deleteMany({});
  await Department.insertMany([
    { slug: 'cse', name: 'Computer Science & Engineering', type: 'B.Tech', duration: '4 Years', intake: 120, image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=70', desc: 'Offers cutting-edge curriculum in algorithms, data structures, OS, networks, AI, and software engineering. NBA accredited with Shivaji University recognition.', tags: ['AI & ML', 'Data Science', 'Cloud Computing'], color: 'bg-blue-500', order: 0 },
    { slug: 'cse-aiml', name: 'CSE – Artificial Intelligence & ML', type: 'B.Tech', duration: '4 Years', intake: 60, image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=70', desc: 'Specialized program focused on machine learning, deep learning, computer vision, NLP, and AI-driven application development.', tags: ['Deep Learning', 'Computer Vision', 'NLP'], color: 'bg-violet-500', order: 1 },
    { slug: 'etc', name: 'Electronics & Telecom Engineering', type: 'B.Tech', duration: '4 Years', intake: 120, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=70', desc: 'Covers electronic circuits, embedded systems, VLSI, signal processing, wireless communication, and IoT technologies.', tags: ['VLSI', 'Embedded Systems', 'IoT'], color: 'bg-green-500', order: 2 },
    { slug: 'mech', name: 'Mechanical Engineering', type: 'B.Tech', duration: '4 Years', intake: 120, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=70', desc: 'Focuses on design, manufacturing, thermodynamics, fluid mechanics, automation, and CAD/CAM with industry-aligned workshops.', tags: ['CAD/CAM', 'Automation', 'Manufacturing'], color: 'bg-blue-500', order: 3 },
    { slug: 'civil', name: 'Civil Engineering', type: 'B.Tech', duration: '4 Years', intake: 120, image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=70', desc: 'Covers structural, geotechnical, transportation, environmental, and water resources engineering with field exposure.', tags: ['Structural', 'GIS', 'Construction Mgmt'], color: 'bg-yellow-500', order: 4 },
    { slug: 'electrical', name: 'Electrical Engineering', type: 'B.Tech', duration: '4 Years', intake: 60, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=70', desc: 'Comprehensive study of power systems, control systems, machines, energy management, and smart grid technologies.', tags: ['Power Systems', 'Smart Grid', 'Control'], color: 'bg-red-500', order: 5 },
    { slug: 'cse-ds', name: 'CSE – Data Science', type: 'B.Tech', duration: '4 Years', intake: 60, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=70', desc: 'Data-driven program covering statistics, big data analytics, data visualization, databases, and business intelligence.', tags: ['Big Data', 'Analytics', 'Python/R'], color: 'bg-teal-500', order: 6 },
    { slug: 'mtech-cse', name: 'M.Tech – Computer Science', type: 'M.Tech', duration: '2 Years', intake: 18, image: 'https://images.unsplash.com/photo-1497493292307-31c376b6e479?w=600&q=70', desc: 'Advanced postgraduate program in computer science with research focus areas in AI, cybersecurity, and distributed systems.', tags: ['Research', 'Cybersecurity', 'Distributed Systems'], color: 'bg-indigo-500', order: 7 },
    { slug: 'mtech-vlsi', name: 'M.Tech – VLSI Design', type: 'M.Tech', duration: '2 Years', intake: 18, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=70', desc: 'Specialized postgraduate program in VLSI design, semiconductor technology, FPGA programming, and microelectronics.', tags: ['FPGA', 'Semiconductor', 'HDL'], color: 'bg-pink-500', order: 8 },
    { slug: 'phd', name: 'Ph.D. Program', type: 'PhD', duration: '3–5 Years', intake: 20, image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=70', desc: 'Doctoral program affiliated with Shivaji University with research centers in Computer Science, E&TC, Mechanical, and Civil Engineering.', tags: ['Full-time', 'Part-time', 'External'], color: 'bg-gray-700', order: 9 },
  ]);
  console.log('✅ Departments seeded');

  // ─── News ────────────────────────────────────────────────────────────────
  await News.deleteMany({});
  await News.insertMany([
    { tag: 'Notice', date: 'Dec 9, 2025', author: 'Exam Cell, SET', read: '1 min', title: 'Revaluation Notice — December 2025', excerpt: 'Students of School of Engineering & Technology are informed about the revaluation process for the recently concluded semester examinations.', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=70', href: 'https://apps.unishivaji.ac.in/uploads/news/Letter%20School%20of%20Engg.%20&%20Tech.%20.pdf', active: true },
    { tag: 'Workshop', date: 'Mar 2026', author: 'Civil Engineering Dept.', read: '2 min', title: 'One-Day Workshop on "Seismic Design of Buildings"', excerpt: 'The Department of Civil Engineering is organising a one-day workshop on Seismic Design of Buildings.', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=70', href: 'https://apps.unishivaji.ac.in/uploads/news/WORKSHOP.pdf', active: true },
    { tag: 'Notice', date: 'Mar 2026', author: 'Exam Cell, SET', read: '1 min', title: 'Exam Form Submission — Extended Date Notice', excerpt: 'The last date for submission of examination forms has been extended. Students are advised to submit their forms before the revised deadline.', image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&q=70', href: 'https://apps.unishivaji.ac.in/uploads/news/Exam%20form%20extended%20date%20Notice.pdf', active: true },
  ]);
  console.log('✅ News seeded');

  // ─── Events ──────────────────────────────────────────────────────────────
  await Event.deleteMany({});
  await Event.insertMany([
    { tag: 'Technical', date: { day: '15', month: 'Mar' }, title: 'TechFest 2026 – National Level Hackathon', location: 'SET Auditorium, Kolhapur', desc: 'A 36-hour hackathon bringing together students from across Maharashtra to solve real-world problems with technology.', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=70', active: true, eventDate: new Date('2026-03-15') },
    { tag: 'Academic', date: { day: '22', month: 'Mar' }, title: 'International Conference on Computing Sciences (ICCS-2026)', location: 'SET Conference Hall', desc: 'Annual international conference featuring leading researchers, industry experts, and academicians sharing innovations.', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=70', active: true, eventDate: new Date('2026-03-22') },
    { tag: 'Cultural', date: { day: '05', month: 'Apr' }, title: 'Srijan 2026 – Annual Cultural Festival', location: 'SET Campus Grounds', desc: 'A vibrant three-day cultural fiesta celebrating talent in music, dance, drama, fine arts, and literary events.', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=70', active: true, eventDate: new Date('2026-04-05') },
  ]);
  console.log('✅ Events seeded');

  // ─── Facilities ──────────────────────────────────────────────────────────
  await Facility.deleteMany({});
  await Facility.insertMany([
    { label: 'Central Library', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=75', desc: 'Over 1,00,000 volumes, e-journals, digital resources, and 24×7 reading halls.', order: 0 },
    { label: 'Computing Labs', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=75', desc: 'State-of-the-art computer labs with latest software tools, 24×7 internet access.', order: 1 },
    { label: 'Research Labs', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=75', desc: 'Dedicated advanced research laboratories for innovative project work and R&D.', order: 2 },
    { label: 'Sports Complex', image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&q=75', desc: 'Multi-sport facilities including cricket ground, basketball, volleyball, and gym.', order: 3 },
    { label: 'Auditorium', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=75', desc: '1200-seat air-conditioned auditorium for convocations, seminars, and cultural events.', order: 4 },
    { label: 'Hostel', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=75', desc: 'Separate well-furnished hostels for boys and girls with all modern amenities.', order: 5 },
  ]);
  console.log('✅ Facilities seeded');

  // ─── Alumni ──────────────────────────────────────────────────────────────
  await Alumni.deleteMany({});
  await Alumni.insertMany([
    { name: 'Dr. Rajeev Patil', role: 'Chief Scientist, ISRO', batch: 'CSE 2002', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=75', order: 0 },
    { name: 'Priya Desai', role: 'CTO, Infosys Digital', batch: 'IT 2006', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=75', order: 1 },
    { name: 'Suresh Kadam', role: 'VP Engineering, Wipro', batch: 'Mech 2000', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=75', order: 2 },
    { name: 'Anita Jadhav', role: 'Director, Tata Consultancy', batch: 'E&TC 2005', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=75', order: 3 },
    { name: 'Vikram Shinde', role: 'Founder & CEO, TechVentures', batch: 'CSE 2009', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=75', order: 4 },
    { name: 'Meera Kulkarni', role: 'Research Lead, Google AI', batch: 'CSE 2012', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=75', order: 5 },
  ]);
  console.log('✅ Alumni seeded');

  // ─── Notices (Noticeboard) ────────────────────────────────────────────────
  await Notice.deleteMany({});
  await Notice.insertMany([
    { title: 'Revaluation Form Submission Open — Winter 2025', content: 'Students wishing to apply for revaluation of Winter 2025 semester examination papers may submit forms online via the examination portal. Last date: December 20, 2025.', category: 'Exam', isImportant: true, attachmentUrl: 'https://apps.unishivaji.ac.in/uploads/news/Letter%20School%20of%20Engg.%20&%20Tech.%20.pdf', active: true, publishedAt: new Date('2025-12-09') },
    { title: 'Exam Form Submission — Extended Date', content: 'The last date for submission of examination forms has been extended to March 20, 2026. Students are advised to complete the process before the deadline to avoid late fees.', category: 'Exam', isImportant: true, attachmentUrl: 'https://apps.unishivaji.ac.in/uploads/news/Exam%20form%20extended%20date%20Notice.pdf', active: true, publishedAt: new Date('2026-03-05') },
    { title: 'One-Day Workshop on Seismic Design of Buildings', content: 'The Civil Engineering Department is organising a one-day workshop. Registration is free for all students. Report to Civil Dept. seminar hall at 9:00 AM.', category: 'Academic', isImportant: false, attachmentUrl: '', active: true, publishedAt: new Date('2026-03-08') },
    { title: 'TechFest 2026 — Registration Open', content: 'Registrations are now open for TechFest 2026 – National Level Hackathon on March 15, 2026. Register via the official portal before March 12.', category: 'Event', isImportant: false, attachmentUrl: '', active: true, publishedAt: new Date('2026-03-01') },
    { title: 'Merit Scholarship Applications — 2025-26', content: 'Students with CGPA above 8.0 are eligible to apply for the merit scholarship for the academic year 2025-26. Applications available at the admin office.', category: 'Scholarship', isImportant: false, attachmentUrl: '', active: true, publishedAt: new Date('2026-02-15') },
    { title: 'Holi Holiday Notice — March 14, 2026', content: 'The institute will remain closed on March 14, 2026 (Friday) on account of Holi. Regular classes resume on March 16, 2026 (Monday).', category: 'Holiday', isImportant: false, attachmentUrl: '', active: true, publishedAt: new Date('2026-03-10') },
    { title: 'Campus Placement Drive — Infosys', content: 'Infosys will be conducting a campus placement drive on March 25, 2026 for final year B.Tech students. Eligible students must register with the Placement Cell.', category: 'Placement', isImportant: true, attachmentUrl: '', active: true, publishedAt: new Date('2026-03-10') },
  ]);
  console.log('✅ Notices (Noticeboard) seeded');

  // ─── Site Settings ────────────────────────────────────────────────────────
  await SiteSetting.deleteMany({});
  await SiteSetting.insertMany([
    { key: 'institute_name', value: 'School of Engineering & Technology', group: 'general', label: 'Institute Name' },
    { key: 'institute_tagline', value: 'Department of Technology, Shivaji University', group: 'general', label: 'Tagline' },
    { key: 'site_logo_url', value: '', group: 'general', label: 'Site Logo URL' },
    { key: 'phone', value: '+91 231 2609424', group: 'contact', label: 'Phone' },
    { key: 'email', value: 'info@set.shivajiuniversity.ac.in', group: 'contact', label: 'Email' },
    { key: 'address', value: 'Vidyanagar, Kolhapur – 416004, Maharashtra, India', group: 'contact', label: 'Address' },
    { key: 'facebook', value: 'https://facebook.com', group: 'social', label: 'Facebook URL' },
    { key: 'twitter', value: 'https://twitter.com', group: 'social', label: 'Twitter URL' },
    { key: 'instagram', value: 'https://instagram.com', group: 'social', label: 'Instagram URL' },
    { key: 'linkedin', value: 'https://linkedin.com', group: 'social', label: 'LinkedIn URL' },
    { key: 'youtube', value: 'https://youtube.com', group: 'social', label: 'YouTube URL' },
    { key: 'apply_now_url', value: '#', group: 'general', label: 'Apply Now Link' },
    { key: 'student_portal_url', value: '#', group: 'general', label: 'Student Portal URL' },
    { key: 'staff_login_url', value: '#', group: 'general', label: 'Staff Login URL' },
    { key: 'maps_embed_url', value: 'https://maps.google.com/maps?q=Shivaji+University+Kolhapur&output=embed', group: 'contact', label: 'Google Maps Embed URL' },
    { key: 'footer_description', value: 'Shivaji University School of Engineering & Technology, established in 1983, is a premier engineering institution in Kolhapur, Maharashtra known for academic excellence and industry-ready graduates.', group: 'general', label: 'Footer Description' },
  ]);
  console.log('✅ Site settings seeded');

  console.log('\n🎉 Seed complete! Admin credentials:');
  console.log('   Username: admin');
  console.log('   Password: admin@SET2025\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
