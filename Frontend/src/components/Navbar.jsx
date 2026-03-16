import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-dark.png';
import { FiPhone, FiMail, FiMenu, FiX, FiChevronDown, FiSearch } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

const staticNavItems = [
  { label: 'About', href: '#', dropdown: [{ label: 'About SET', href: '/pages/about-set' }, { label: 'Vision & Mission', href: '/pages/vision-mission' }, { label: 'Leadership', href: '/pages/leadership' }, { label: 'Accreditations', href: '/pages/accreditations' }, { label: 'Committees', href: '/pages/committees' }, { label: 'Policy Documents', href: '/pages/policy-documents' }] },
  { label: 'Academics', href: '#', dropdown: [{ label: 'Departments', href: '#departments' }, { label: 'Programs Offered', href: '/pages/programs-offered' }, { label: 'Syllabus', href: '/pages/syllabus' }, { label: 'Academic Calendar', href: '/pages/academic-calendar' }, { label: 'Examinations', href: '/pages/examinations' }] },
  { label: 'Research', href: '#', dropdown: [{ label: 'Research Centers', href: '/pages/research-centers' }, { label: 'Publications', href: '/pages/publications' }, { label: 'Projects', href: '/pages/research-projects' }, { label: 'Patents', href: '/pages/patents' }, { label: 'PhD Program', href: '/pages/phd-program' }] },
  { label: 'Admissions', href: '#', dropdown: [{ label: 'How to Apply', href: '/pages/how-to-apply' }, { label: 'Eligibility', href: '/pages/eligibility' }, { label: 'Fee Structure', href: '/pages/fee-structure' }, { label: 'Scholarships', href: '/pages/scholarships' }, { label: 'Foreign Students', href: '/pages/foreign-students' }] },
  { label: 'Campus Life', href: '#', dropdown: [{ label: 'Facilities', href: '#campus' }, { label: 'Library', href: '/pages/library' }, { label: 'Sports', href: '/pages/sports' }, { label: 'Hostel', href: '/pages/hostel' }, { label: 'Clubs & Activities', href: '/pages/clubs-activities' }] },
  { label: 'Placements', href: '#', dropdown: [{ label: 'Placement Cell', href: '/pages/placement-cell' }, { label: 'Top Recruiters', href: '/pages/top-recruiters' }, { label: 'Internships', href: '/pages/internships' }, { label: 'Alumni', href: '#alumni' }, { label: 'Statistics', href: '#stats' }] },
  { label: 'Contact', href: '#', dropdown: [] },
];

// Normalise a dropdown entry — backend sends {label,href} objects, static data may be strings
function getSubLabel(sub) { return typeof sub === 'string' ? sub : sub.label; }
function getSubHref(sub) { return typeof sub === 'string' ? '#' : (sub.href || '#'); }
// Renders dropdown item as Link (client-side) or <a> (hash/external)
function SubLink({ sub, className, onClick }) {
  const href = getSubHref(sub);
  const label = getSubLabel(sub);
  if (href.startsWith('/') && !href.startsWith('/#')) {
    return <Link to={href} className={className} onClick={onClick}>{label}</Link>;
  }
  return <a href={href} className={className} onClick={onClick}>{label}</a>;
}

function isUsableLogoUrl(value) {
  if (!value) return false;
  const url = String(value).trim();
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/') || url.startsWith('data:image/');
}

export default function Navbar() {
  const [navItems, setNavItems] = useState(staticNavItems);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [search, setSearch] = useState('');
  const [logoUrl, setLogoUrl] = useState(logo);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || '/api'}/navbar`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setNavItems(data); })
      .catch(() => {}); // silently use static fallback

    fetch(`${import.meta.env.VITE_API_URL || '/api'}/settings`)
      .then(r => r.json())
      .then(data => {
        if (isUsableLogoUrl(data.site_logo_url)) {
          setLogoUrl(String(data.site_logo_url).trim());
        } else {
          setLogoUrl(logo);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">

      {/* Top info bar */}
      <div className="bg-primary-dark text-white text-xs py-2 hidden md:block">
        <div className="max-w-[1600px] mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <FiPhone size={12} />
              +91 231 2609424
            </span>
            <span className="flex items-center gap-1.5">
              <FiMail size={12} />
              info@set.shivajiuniversity.ac.in
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border-r border-gray-500 pr-3">
              <button 
                onClick={() => {
                  const html = document.documentElement;
                  const currentSize = parseFloat(window.getComputedStyle(html).fontSize);
                  if (currentSize < 24) html.style.fontSize = `${currentSize + 1}px`;
                }}
                className="text-gray-300 hover:text-white font-bold"
                title="Increase font size"
              >
                A+
              </button>
              <button 
                onClick={() => {
                  const html = document.documentElement;
                  const currentSize = parseFloat(window.getComputedStyle(html).fontSize);
                  if (currentSize > 10) html.style.fontSize = `${currentSize - 1}px`;
                }}
                className="text-gray-300 hover:text-white font-bold"
                title="Decrease font size"
              >
                A-
              </button>
            </div>
            <span className="text-gray-300">Follow Us:</span>
            {[
              { Icon: FaFacebook, href: '#' },
              { Icon: FaTwitter, href: '#' },
              { Icon: FaInstagram, href: '#' },
              { Icon: FaLinkedin, href: '#' },
              { Icon: FaYoutube, href: '#' },
            ].map(({ Icon, href }, i) => (
              <a key={i} href={href} className="hover:text-white transition-colors">
                <Icon size={14} />
              </a>
            ))}
            <span className="ml-3 border-l border-gray-500 pl-3 flex items-center gap-3">
              <Link to="/student-portal" className="hover:text-white transition-colors">Student Portal</Link>
              <a href="#" className="hover:text-white transition-colors">Staff Login</a>
            </span>
          </div>
        </div>
      </div>

      {/* Bar 1 - Logo + Search + Apply Now */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-[1600px] mx-auto px-4 flex items-center justify-between gap-4">
          <Link to="/" className="shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={logoUrl || logo} alt="SET Logo" className="h-16 sm:h-20 w-auto" />
          </Link>
          <div className="hidden md:flex flex-1 max-w-md items-center bg-gray-100 rounded-full px-4 py-2 gap-2">
            <FiSearch size={15} className="text-gray-400 shrink-0" />
            <form onSubmit={(e) => { e.preventDefault(); if (search.trim()) window.location.href = `/search?q=${encodeURIComponent(search)}`; }} className="w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search programs, departments, news..."
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
              />
            </form>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/apply-now"
              className="hidden sm:inline-block px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-dark transition-colors shadow"
            >
              Apply Now
            </Link>
            <button
              className="lg:hidden p-2 text-primary"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Bar 2 - Navigation links (desktop only) */}
      <nav className="hidden lg:block bg-primary">
        <div className="max-w-[1600px] mx-auto px-4 flex items-center">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors">
                {item.label}
                {item.dropdown && item.dropdown.length > 0 && <FiChevronDown size={13} />}
              </button>
              {item.dropdown && item.dropdown.length > 0 && activeDropdown === item.label && (
                <div className="absolute top-full left-0 mt-0 w-52 bg-white rounded-b-lg shadow-xl border border-gray-100 py-1 z-50">
                  {item.dropdown.map((sub, i) => (
                    <SubLink
                      key={i}
                      sub={sub}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 max-h-[80vh] overflow-y-auto shadow-lg">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 gap-2">
              <FiSearch size={14} className="text-gray-400 shrink-0" />
              <form onSubmit={(e) => { e.preventDefault(); if (search.trim()) window.location.href = `/search?q=${encodeURIComponent(search)}`; }} className="w-full">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
                />
              </form>
            </div>
          </div>
          {navItems.map((item) => (
            <div key={item.label}>
              <button
                className="w-full flex items-center justify-between px-5 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
              >
                {item.label}
                {item.dropdown && item.dropdown.length > 0 && (
                  <FiChevronDown
                    size={14}
                    className={`transition-transform ${mobileExpanded === item.label ? 'rotate-180' : ''}`}
                  />
                )}
              </button>
              {mobileExpanded === item.label && item.dropdown && item.dropdown.length > 0 && (
                <div className="bg-gray-50">
                  {item.dropdown.map((sub, i) => (
                    <SubLink
                      key={i}
                      sub={sub}
                      className="block px-8 py-2.5 text-sm text-gray-600 hover:text-primary border-b border-gray-100"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="p-4 space-y-3">
            <Link
              to="/apply-now"
              className="block w-full text-center py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors"
            >
              Apply Now
            </Link>
            <Link
              to="/student-portal"
              className="block w-full text-center py-3 border border-primary text-primary font-semibold rounded-full hover:bg-primary/5 transition-colors"
            >
              Student Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
