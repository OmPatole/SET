import { useState, useEffect } from 'react';
import { FiAlertCircle, FiPaperclip, FiChevronRight, FiBell, FiChevronDown } from 'react-icons/fi';

const CATEGORIES = ['All', 'Exam', 'Academic', 'Event', 'Scholarship', 'Placement', 'Holiday', 'General'];
const PROGRAMS = ['All', 'B.Tech', 'M.Tech', 'PhD'];
const CAT_COLORS = {
  General: 'bg-gray-100 text-gray-700',
  Exam: 'bg-red-50 text-red-700 border border-red-200',
  Academic: 'bg-blue-50 text-blue-700 border border-blue-200',
  Event: 'bg-purple-50 text-purple-700 border border-purple-200',
  Scholarship: 'bg-green-50 text-green-700 border border-green-200',
  Placement: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  Holiday: 'bg-orange-50 text-orange-700 border border-orange-200',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [activeProgram, setActiveProgram] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/notices`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setNotices(data);
        }
      } catch {
        // silently fall back to static data
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const catFiltered = activeTab === 'All' ? notices : notices.filter(n => n.category === activeTab);
  const filtered = activeProgram === 'All'
    ? catFiltered
    : catFiltered.filter(n => !n.program || n.program === 'All' || n.program === activeProgram);
  const important = filtered.filter(n => n.isImportant);
  const regular = filtered.filter(n => !n.isImportant);
  const sorted = [...important, ...regular];

  return (
    <section id="noticeboard" className="py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-8 h-0.5 bg-[#1e3a5f]" />
            <span className="text-sm font-semibold text-[#1e3a5f] uppercase tracking-widest">Student Section</span>
            <span className="w-8 h-0.5 bg-[#1e3a5f]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3a5f] flex items-center justify-center gap-3">
            <FiBell className="text-2xl md:text-3xl" />
            Notice Board
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">Stay updated with the latest announcements, exam schedules, and important notices from the institute.</p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${activeTab === cat ? 'bg-[#1e3a5f] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1e3a5f] hover:text-[#1e3a5f]'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Program filter dropdown */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <select
              value={activeProgram}
              onChange={e => setActiveProgram(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2 rounded-full border border-gray-300 bg-white text-sm font-semibold text-[#1e3a5f] focus:outline-none focus:border-[#1e3a5f] cursor-pointer hover:border-[#1e3a5f] transition-colors shadow-sm"
            >
              {PROGRAMS.map(p => (
                <option key={p} value={p}>{p === 'All' ? 'All Programs' : p}</option>
              ))}
            </select>
            <FiChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1e3a5f] pointer-events-none" />
          </div>
        </div>

        {/* Notices list */}
        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-white rounded-xl border border-gray-200 animate-pulse" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No notices in this category.</div>
        ) : (
          <div className="grid gap-3">
            {sorted.map(notice => (
              <div
                key={notice._id}
                className={`bg-white rounded-xl border p-4 flex items-start gap-4 hover:shadow-md transition-shadow group ${notice.isImportant ? 'border-red-200 bg-red-50/30' : 'border-gray-200'}`}
              >
                {/* Category dot */}
                <div className="mt-0.5 shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-[#1e3a5f]/5">
                  {notice.isImportant ? (
                    <FiAlertCircle size={18} className="text-red-500" />
                  ) : (
                    <div className={`w-2.5 h-2.5 rounded-full ${notice.category === 'Exam' ? 'bg-red-500' : notice.category === 'Placement' ? 'bg-yellow-500' : notice.category === 'Scholarship' ? 'bg-green-500' : notice.category === 'Academic' ? 'bg-blue-500' : notice.category === 'Event' ? 'bg-purple-500' : notice.category === 'Holiday' ? 'bg-orange-500' : 'bg-gray-400'}`} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${CAT_COLORS[notice.category] || 'bg-gray-100 text-gray-700'}`}>{notice.category}</span>
                    {notice.program && notice.program !== 'All' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 uppercase tracking-wide">{notice.program}</span>
                    )}
                    {notice.isImportant && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white uppercase tracking-wide">Important</span>}
                    <span className="text-xs text-gray-400 ml-auto">{formatDate(notice.publishedAt)}</span>
                  </div>
                  <h4 className={`font-semibold text-sm leading-snug ${notice.isImportant ? 'text-red-800' : 'text-gray-800'}`}>{notice.title}</h4>
                  {notice.content && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notice.content}</p>}
                  {notice.attachmentUrl && (
                    <a href={notice.attachmentUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#1e3a5f] hover:underline">
                      <FiPaperclip size={11} /> View Attachment
                    </a>
                  )}
                </div>

                <FiChevronRight size={16} className="text-gray-300 group-hover:text-[#1e3a5f] shrink-0 mt-2 transition-colors" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
