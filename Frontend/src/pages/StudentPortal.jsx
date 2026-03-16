import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import NoticeBoard from '../components/NoticeBoard';
import Footer from '../components/Footer';
import { FiBookOpen, FiCalendar, FiFileText, FiAward, FiBell, FiExternalLink, FiGrid } from 'react-icons/fi';

const defaultQuickLinks = [
  { id: 'sp_exam_results_url', icon: FiFileText, label: 'Exam Results', desc: 'Check semester results & transcripts', href: '#' },
  { id: 'sp_academic_calendar_url', icon: FiCalendar, label: 'Academic Calendar', desc: 'Important dates & schedules', href: '#' },
  { id: 'sp_library_portal_url', icon: FiBookOpen, label: 'Library Portal', desc: 'Access digital library resources', href: '#' },
  { id: 'sp_scholarships_url', icon: FiAward, label: 'Scholarships', desc: 'Apply for merit & need-based aid', href: '#' },
  { id: 'sp_suk_apps_url', icon: FiGrid, label: 'SUK Apps', desc: 'University app portal & services', href: '#' },
];

export default function StudentPortal() {
  const [quickLinks, setQuickLinks] = useState(defaultQuickLinks);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || '/api'}/settings`)
      .then(r => r.json())
      .then(data => {
        setQuickLinks(prev => prev.map(link => ({
          ...link,
          href: data[link.id] || '#'
        })));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="font-sans antialiased">
      <Navbar />

      {/* Hero banner */}
      <div className="pt-48 pb-12 bg-[#1e3a5f]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest mb-2">Welcome</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">Student Portal</h1>
          <p className="text-blue-200 text-base md:text-lg max-w-xl mx-auto">
            Your one-stop hub for notices, results, resources, and everything campus life.
          </p>
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-lg font-bold text-[#1e3a5f] mb-6 flex items-center gap-2">
            <FiBell size={18} /> Quick Links
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickLinks.map(({ icon: Icon, label, desc, href }) => (
              <a
                key={label}
                href={href}
                className="group flex flex-col items-start gap-2 p-4 rounded-xl border border-gray-200 hover:border-[#1e3a5f] hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center group-hover:bg-[#1e3a5f] transition-colors">
                  <Icon size={18} className="text-[#1e3a5f] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-800 flex items-center gap-1">
                    {label} <FiExternalLink size={11} className="text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Notice Board */}
      <NoticeBoard />

      <Footer />
    </div>
  );
}
