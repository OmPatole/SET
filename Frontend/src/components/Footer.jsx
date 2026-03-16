import { useState, useEffect } from 'react';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-dark.png';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from 'react-icons/fa';

const socialIconMap = {
  facebook: FaFacebook,
  twitter: FaTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
};

const defaultFooterConfig = {
  brandName: 'School of Engineering & Technology, Shivaji University, Kolhapur',
  description:
    'Department of Technology, Shivaji University, established in 2006. AICTE approved and DTE Maharashtra recognised. Recipient of World Bank TEQIP grants. Offering B.Tech and M.Tech programs.',
  contact: {
    address: 'Kolhapur - 416 004, Maharashtra, India',
    phone: '+91 231 2609000 / 2609100',
    email: 'info@set.shivajiuniversity.ac.in',
  },
  quickLinks: [
    { label: 'DCS Document', href: '#' },
    { label: 'FRA Fee Structure', href: '#' },
    { label: 'OBE Manual', href: '#' },
    { label: 'AICTE Mandatory Disclosure', href: '#' },
    { label: 'Student Grievance Redressal', href: '#' },
    { label: 'Anti-Ragging Committee', href: '#' },
    { label: 'RTI', href: '#' },
    { label: 'Feedback', href: '#' },
  ],
  sections: [
    {
      title: 'About',
      links: [
        { label: 'About SET', href: '#' },
        { label: 'Vision & Mission', href: '#' },
        { label: 'Leadership', href: '#' },
        { label: 'Statutory Committees', href: '#' },
        { label: 'Non-Statutory Committees', href: '#' },
        { label: 'Accreditations', href: '#' },
        { label: 'Good Governance', href: '#' },
        { label: 'Policy Documents', href: '#' },
      ],
    },
    {
      title: 'Academics',
      links: [
        { label: 'Departments', href: '#' },
        { label: 'Programs Offered', href: '#' },
        { label: 'Academic Calendar', href: '#' },
        { label: 'Syllabus', href: '#' },
        { label: 'Exam Cell', href: '#' },
        { label: 'Results', href: '#' },
        { label: 'E-Learning', href: '#' },
        { label: 'Research Centers', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Central Library', href: '#' },
        { label: 'Computing Facility', href: '#' },
        { label: 'Virtual Lab', href: '#' },
        { label: 'Language Lab', href: '#' },
        { label: 'E-Office', href: '#' },
        { label: 'IRINS Portal', href: '#' },
        { label: 'Citizen Charter', href: '#' },
        { label: 'IQAC', href: '#' },
      ],
    },
    {
      title: 'Placements & Career',
      links: [
        { label: 'Placement Cell', href: '#' },
        { label: 'Recruitment Training', href: '#' },
        { label: 'Entrepreneurship Cell', href: '#' },
        { label: 'Alumni Network', href: '#' },
        { label: 'Industry Connect', href: '#' },
        { label: 'Internships', href: '#' },
        { label: 'Career Services', href: '#' },
        { label: 'International Relations', href: '#' },
      ],
    },
  ],
  socialLinks: [
    { key: 'facebook', label: 'Facebook', href: '#' },
    { key: 'twitter', label: 'Twitter', href: '#' },
    { key: 'instagram', label: 'Instagram', href: '#' },
    { key: 'linkedin', label: 'LinkedIn', href: '#' },
    { key: 'youtube', label: 'YouTube', href: '#' },
  ],
  bottomLinks: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Use', href: '/terms-of-use' },
    { label: 'Student Portal', href: '/student-portal' },
  ],
  copyrightTemplate: '© {year} School of Engineering & Technology, Shivaji University, Kolhapur. All rights reserved.',
};

function isInternalPath(href = '') {
  return href.startsWith('/') && !href.startsWith('/#');
}

function FooterLink({ href = '#', className, children }) {
  if (isInternalPath(href)) {
    return <Link to={href} className={className}>{children}</Link>;
  }

  const isExternal = href.startsWith('http');
  return (
    <a
      href={href}
      className={className}
      target={isExternal ? '_blank' : '_self'}
      rel={isExternal ? 'noopener noreferrer' : ''}
    >
      {children}
    </a>
  );
}

function isUsableLogoUrl(value) {
  if (!value) return false;
  const url = String(value).trim();
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/') || url.startsWith('data:image/');
}

export default function Footer() {
  const [footer, setFooter] = useState(defaultFooterConfig);
  const [logoUrl, setLogoUrl] = useState(logo);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || '/api'}/settings`)
      .then(r => r.json())
      .then(data => {
        if (isUsableLogoUrl(data.site_logo_url)) {
          setLogoUrl(String(data.site_logo_url).trim());
        } else {
          setLogoUrl(logo);
        }
        if (data.footer_config) {
          const parsed = typeof data.footer_config === 'string' ? JSON.parse(data.footer_config) : data.footer_config;
          setFooter({ ...defaultFooterConfig, ...parsed });
        }
      })
      .catch(() => {});
  }, []);

  const copyrightText = (footer.copyrightTemplate || defaultFooterConfig.copyrightTemplate)
    .replace('{year}', String(new Date().getFullYear()));

  return (
    <footer className="bg-primary-dark text-white">
      {/* Quick links bar */}
      <div className="bg-primary/90 border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center text-xs">
            {(footer.quickLinks || []).map((link, i) => (
              <FooterLink
                key={i}
                href={link.href}
                className="text-white/60 hover:text-white transition-colors"
              >
                {link.label}
              </FooterLink>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-[1600px] mx-auto px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="mb-5">
              <img src={logoUrl || logo} alt={footer.brandName || 'SET Logo'} className="h-12 w-auto invert" />
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              {footer.description || defaultFooterConfig.description}
            </p>
            {/* Contact */}
            <div className="space-y-3 text-sm text-white/70">
              <div className="flex items-start gap-2.5">
                <FiMapPin size={14} className="shrink-0 mt-0.5 text-white/80" />
                <span>{footer.contact?.address || defaultFooterConfig.contact.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiPhone size={14} className="text-white/80" />
                <span>{footer.contact?.phone || defaultFooterConfig.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiMail size={14} className="text-white/80" />
                <a href={`mailto:${footer.contact?.email || defaultFooterConfig.contact.email}`} className="hover:text-white transition-colors">
                  {footer.contact?.email || defaultFooterConfig.contact.email}
                </a>
              </div>
            </div>
            {/* Socials */}
            <div className="flex gap-3 mt-6">
              {(footer.socialLinks || []).map((item, i) => {
                const Icon = socialIconMap[(item.key || '').toLowerCase()] || FaFacebook;
                return (
                  <a
                    key={`${item.key || 'social'}-${i}`}
                    href={item.href || '#'}
                    aria-label={item.label || item.key || 'Social Link'}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-all hover:-translate-y-0.5"
                    target={(item.href || '#').startsWith('http') ? '_blank' : '_self'}
                    rel={(item.href || '#').startsWith('http') ? 'noopener noreferrer' : ''}
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links columns */}
          {(footer.sections || []).map((section, sectionIndex) => (
            <div key={`${section.title || 'section'}-${sectionIndex}`}>
              <h4 className="font-bold text-white text-sm mb-4 pb-3 border-b border-white/10">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {(section.links || []).map((link, linkIndex) => (
                  <li key={`${link.label || 'link'}-${linkIndex}`}>
                    <FooterLink
                      href={link.href || '#'}
                      className="text-white/55 hover:text-white text-xs transition-colors leading-relaxed"
                    >
                      {link.label}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1600px] mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/40">
          <span>{copyrightText}</span>
          <div className="flex gap-4">
            {(footer.bottomLinks || []).map((link, i) => (
              <FooterLink
                key={`${link.label || 'bottom'}-${i}`}
                href={link.href || '#'}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </FooterLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
