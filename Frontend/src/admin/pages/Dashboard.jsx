import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout.jsx';
import API from '../api/index.js';
import {
  FiNavigation, FiImage, FiBarChart2, FiBook, FiFileText,
  FiCalendar, FiBell, FiHome, FiUsers, FiArrowRight,
} from 'react-icons/fi';

const sections = [
  { label: 'Navbar Items', key: 'navbar', icon: FiNavigation, to: '/admin/navbar', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { label: 'Hero Slides', key: 'hero', icon: FiImage, to: '/admin/hero', color: 'bg-violet-50 text-violet-600 border-violet-100' },
  { label: 'Departments', key: 'departments', icon: FiBook, to: '/admin/departments', color: 'bg-green-50 text-green-600 border-green-100' },
  { label: 'News Articles', key: 'news', icon: FiFileText, to: '/admin/news', color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
  { label: 'Events', key: 'events', icon: FiCalendar, to: '/admin/events', color: 'bg-orange-50 text-orange-600 border-orange-100' },
  { label: 'Notices', key: 'notices', icon: FiBell, to: '/admin/notices', color: 'bg-red-50 text-red-600 border-red-100' },
  { label: 'Facilities', key: 'facilities', icon: FiHome, to: '/admin/facilities', color: 'bg-teal-50 text-teal-600 border-teal-100' },
  { label: 'Alumni', key: 'alumni', icon: FiUsers, to: '/admin/alumni', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  { label: 'Stats', key: 'stats', icon: FiBarChart2, to: '/admin/stats', color: 'bg-pink-50 text-pink-600 border-pink-100' },
];

const quickLinks = [
  { label: 'Edit Navbar', to: '/admin/navbar', desc: 'Add, edit or reorder navigation items' },
  { label: 'Manage Noticeboard', to: '/admin/notices', desc: 'Post new notices for students' },
  { label: 'Add News Article', to: '/admin/news', desc: 'Publish latest news and updates' },
  { label: 'Edit Footer', to: '/admin/footer', desc: 'Update all footer text, links and social icons' },
  { label: 'Site Settings', to: '/admin/settings', desc: 'Update contact info and social links' },
];

export default function Dashboard() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const endpoints = [
          { key: 'navbar', url: '/navbar/all' },
          { key: 'hero', url: '/hero/all' },
          { key: 'departments', url: '/departments/all' },
          { key: 'news', url: '/news/all' },
          { key: 'events', url: '/events/all' },
          { key: 'notices', url: '/notices/all' },
          { key: 'facilities', url: '/facilities/all' },
          { key: 'alumni', url: '/alumni/all' },
          { key: 'stats', url: '/stats' },
        ];

        const results = await Promise.allSettled(endpoints.map((e) => API.get(e.url)));
        const newCounts = {};
        results.forEach((r, i) => {
          newCounts[endpoints[i].key] = r.status === 'fulfilled' ? r.value.data.length : '—';
        });
        setCounts(newCounts);
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5380] rounded-2xl p-6 text-white">
          <h2 className="text-xl font-bold">Welcome back!</h2>
          <p className="text-white/70 text-sm mt-1">
            Manage all content for the SET Shivaji University website from here.
          </p>
        </div>

        {/* Counts grid */}
        <div>
          <h3 className="text-gray-700 font-semibold text-sm uppercase tracking-wider mb-4">
            Content Overview
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sections.map(({ label, key, icon: Icon, to, color }) => (
              <Link
                key={key}
                to={to}
                className={`rounded-xl border p-4 flex flex-col gap-3 hover:shadow-md transition-all hover:-translate-y-0.5 ${color} bg-opacity-50`}
              >
                <div className="flex items-center justify-between">
                  <Icon size={20} />
                  <FiArrowRight size={14} className="opacity-50" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {loading ? <div className="w-8 h-6 bg-current opacity-20 rounded animate-pulse" /> : (counts[key] ?? '—')}
                  </div>
                  <div className="text-xs font-medium opacity-70 mt-0.5">{label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h3 className="text-gray-700 font-semibold text-sm uppercase tracking-wider mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickLinks.map(({ label, to, desc }) => (
              <Link
                key={to}
                to={to}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-[#1e3a5f]/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-[#1e3a5f] text-sm group-hover:underline">{label}</span>
                  <FiArrowRight size={14} className="text-[#1e3a5f] group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-gray-500 text-xs">{desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          <strong>API Base:</strong>{' '}
          <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">
            {import.meta.env.VITE_API_URL || '/api'}
          </code>
          <span className="ml-3 text-blue-600">
            Make sure the backend server is running.
          </span>
        </div>
      </div>
    </AdminLayout>
  );
}
