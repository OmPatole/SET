import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  FiGrid, FiNavigation, FiImage, FiBarChart2, FiBook, FiFileText,
  FiCalendar, FiBell, FiHome, FiUsers, FiSettings, FiLogOut,
  FiMenu, FiX, FiChevronRight, FiLayout, FiFolder,
} from 'react-icons/fi';

const navLinks = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, exact: true },
  { label: '─── Content ───', divider: true },
  { to: '/admin/navbar', label: 'Navbar Editor', icon: FiNavigation },
  { to: '/admin/hero', label: 'Hero Slides', icon: FiImage },
  { to: '/admin/stats', label: 'Statistics', icon: FiBarChart2 },
  { to: '/admin/departments', label: 'Departments', icon: FiBook },
  { to: '/admin/news', label: 'News & Updates', icon: FiFileText },
  { to: '/admin/events', label: 'Events', icon: FiCalendar },
  { to: '/admin/notices', label: 'Noticeboard', icon: FiBell },
  { to: '/admin/facilities', label: 'Facilities', icon: FiHome },
  { to: '/admin/alumni', label: 'Alumni', icon: FiUsers },
  { to: '/admin/pages', label: 'Page Content', icon: FiLayout },
  { to: '/admin/media', label: 'Media Library', icon: FiFolder },
  { to: '/admin/applications', label: 'Applications', icon: FiFileText },
  { label: '─── Footer ───', divider: true },
  { to: '/admin/footer', label: 'Footer Editor', icon: FiLayout },
  { label: '─── Config ───', divider: true },
  { to: '/admin/settings', label: 'Site Settings', icon: FiSettings },
];

export default function AdminLayout({ children }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (to, exact) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="text-white font-bold text-lg leading-tight">SET Admin</div>
        <div className="text-white/50 text-xs mt-0.5">Shivaji University</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navLinks.map((item, i) => {
          if (item.divider) {
            return (
              <div key={i} className="text-white/30 text-xs font-semibold px-3 py-2 mt-2 mb-1 uppercase tracking-widest">
                {item.label}
              </div>
            );
          }
          const Icon = item.icon;
          const active = isActive(item.to, item.exact);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all ${
                active
                  ? 'bg-white/15 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={16} className="shrink-0" />
              <span className="flex-1">{item.label}</span>
              {active && <FiChevronRight size={14} className="text-white/50" />}
            </Link>
          );
        })}
      </nav>

      {/* User info & logout */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
            {admin?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-semibold truncate">{admin?.username || 'Admin'}</div>
            <div className="text-white/50 text-xs">Administrator</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white text-sm transition-all"
        >
          <FiLogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-[#1e3a5f] shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-64 flex flex-col bg-[#1e3a5f] z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center gap-4 shrink-0">
          <button
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-gray-800 font-semibold text-base lg:text-lg">
              SET Admin Panel
            </h1>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#1e3a5f] font-medium hover:underline hidden sm:block"
          >
            View Website ↗
          </a>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
