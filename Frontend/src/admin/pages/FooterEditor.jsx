import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout.jsx';
import API from '../api/index.js';

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
      ],
    },
    {
      title: 'Academics',
      links: [
        { label: 'Departments', href: '#' },
        { label: 'Programs Offered', href: '#' },
        { label: 'Academic Calendar', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Central Library', href: '#' },
        { label: 'Computing Facility', href: '#' },
        { label: 'Virtual Lab', href: '#' },
      ],
    },
    {
      title: 'Placements & Career',
      links: [
        { label: 'Placement Cell', href: '#' },
        { label: 'Industry Connect', href: '#' },
        { label: 'Internships', href: '#' },
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

function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-xl flex items-center gap-3 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
      {msg}
      <button onClick={onClose}><FiX size={15} /></button>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-bold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function LinkRow({ item, onChange, onRemove }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2">
      <input
        type="text"
        value={item.label || ''}
        onChange={(e) => onChange('label', e.target.value)}
        placeholder="Label"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]"
      />
      <input
        type="text"
        value={item.href || ''}
        onChange={(e) => onChange('href', e.target.value)}
        placeholder="Href"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]"
      />
      <button
        onClick={onRemove}
        className="inline-flex items-center justify-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
      >
        <FiTrash2 size={15} />
      </button>
    </div>
  );
}

export default function FooterEditor() {
  const [config, setConfig] = useState(defaultFooterConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: '' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await API.get('/settings');
        if (data.footer_config) {
          const parsed = typeof data.footer_config === 'string' ? JSON.parse(data.footer_config) : data.footer_config;
          setConfig({ ...defaultFooterConfig, ...parsed });
        }
      } catch {
        showToast('Failed to load footer config', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await API.put('/settings', {
        settings: {
          footer_config: JSON.stringify(config),
        },
      });
      showToast('Footer settings saved');
    } catch {
      showToast('Failed to save footer settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateContact = (key, value) => {
    setConfig((prev) => ({ ...prev, contact: { ...prev.contact, [key]: value } }));
  };

  const updateListItem = (key, index, field, value) => {
    setConfig((prev) => {
      const list = [...prev[key]];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [key]: list };
    });
  };

  const removeListItem = (key, index) => {
    setConfig((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
  };

  const addListItem = (key, item) => {
    setConfig((prev) => ({ ...prev, [key]: [...prev[key], item] }));
  };

  const updateSection = (sectionIndex, field, value) => {
    setConfig((prev) => {
      const sections = [...prev.sections];
      sections[sectionIndex] = { ...sections[sectionIndex], [field]: value };
      return { ...prev, sections };
    });
  };

  const updateSectionLink = (sectionIndex, linkIndex, field, value) => {
    setConfig((prev) => {
      const sections = [...prev.sections];
      const links = [...sections[sectionIndex].links];
      links[linkIndex] = { ...links[linkIndex], [field]: value };
      sections[sectionIndex] = { ...sections[sectionIndex], links };
      return { ...prev, sections };
    });
  };

  const addSectionLink = (sectionIndex) => {
    setConfig((prev) => {
      const sections = [...prev.sections];
      sections[sectionIndex] = {
        ...sections[sectionIndex],
        links: [...sections[sectionIndex].links, { label: '', href: '#' }],
      };
      return { ...prev, sections };
    });
  };

  const removeSectionLink = (sectionIndex, linkIndex) => {
    setConfig((prev) => {
      const sections = [...prev.sections];
      sections[sectionIndex] = {
        ...sections[sectionIndex],
        links: sections[sectionIndex].links.filter((_, i) => i !== linkIndex),
      };
      return { ...prev, sections };
    });
  };

  const addSection = () => {
    setConfig((prev) => ({
      ...prev,
      sections: [...prev.sections, { title: 'New Section', links: [{ label: '', href: '#' }] }],
    }));
  };

  const removeSection = (sectionIndex) => {
    setConfig((prev) => ({ ...prev, sections: prev.sections.filter((_, i) => i !== sectionIndex) }));
  };

  return (
    <AdminLayout>
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: '' })} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Footer Editor</h2>
          <p className="text-gray-500 text-sm mt-0.5">Edit every footer text and link from one dedicated admin section</p>
        </div>
        <button
          onClick={save}
          disabled={loading || saving}
          className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#152d4a] disabled:opacity-60"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave size={16} />}
          Save Footer
        </button>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400">Loading footer settings...</div>
      ) : (
        <div className="space-y-5">
          <SectionCard title="Brand and Contact">
            <input
              type="text"
              value={config.brandName}
              onChange={(e) => setConfig((prev) => ({ ...prev, brandName: e.target.value }))}
              placeholder="Brand Name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]"
            />
            <textarea
              rows={3}
              value={config.description}
              onChange={(e) => setConfig((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Footer Description"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f] resize-none"
            />
            <input
              type="text"
              value={config.contact.address}
              onChange={(e) => updateContact('address', e.target.value)}
              placeholder="Address"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]"
            />
            <input
              type="text"
              value={config.contact.phone}
              onChange={(e) => updateContact('phone', e.target.value)}
              placeholder="Phone"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]"
            />
            <input
              type="email"
              value={config.contact.email}
              onChange={(e) => updateContact('email', e.target.value)}
              placeholder="Email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]"
            />
          </SectionCard>

          <SectionCard title="Quick Links Bar">
            {config.quickLinks.map((item, i) => (
              <LinkRow
                key={`quick-${i}`}
                item={item}
                onChange={(field, value) => updateListItem('quickLinks', i, field, value)}
                onRemove={() => removeListItem('quickLinks', i)}
              />
            ))}
            <button
              onClick={() => addListItem('quickLinks', { label: '', href: '#' })}
              className="inline-flex items-center gap-1.5 text-sm text-[#1e3a5f] font-medium hover:underline"
            >
              <FiPlus size={14} /> Add Quick Link
            </button>
          </SectionCard>

          <SectionCard title="Footer Columns">
            <div className="space-y-4">
              {config.sections.map((section, sectionIndex) => (
                <div key={`section-${sectionIndex}`} className="border border-gray-200 rounded-lg p-3">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 mb-3">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                      placeholder="Section Title"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]"
                    />
                    <button
                      onClick={() => removeSection(sectionIndex)}
                      className="inline-flex items-center justify-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {section.links.map((link, linkIndex) => (
                      <LinkRow
                        key={`section-${sectionIndex}-link-${linkIndex}`}
                        item={link}
                        onChange={(field, value) => updateSectionLink(sectionIndex, linkIndex, field, value)}
                        onRemove={() => removeSectionLink(sectionIndex, linkIndex)}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => addSectionLink(sectionIndex)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#1e3a5f] font-medium hover:underline mt-2"
                  >
                    <FiPlus size={13} /> Add Section Link
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addSection}
              className="inline-flex items-center gap-1.5 text-sm text-[#1e3a5f] font-medium hover:underline"
            >
              <FiPlus size={14} /> Add Footer Section
            </button>
          </SectionCard>

          <SectionCard title="Social Links">
            {config.socialLinks.map((item, i) => (
              <div key={`social-${i}`} className="grid grid-cols-1 md:grid-cols-[180px_1fr_1fr_auto] gap-2">
                <input
                  type="text"
                  value={item.key || ''}
                  onChange={(e) => updateListItem('socialLinks', i, 'key', e.target.value)}
                  placeholder="Icon Key (facebook, twitter...)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]"
                />
                <input
                  type="text"
                  value={item.label || ''}
                  onChange={(e) => updateListItem('socialLinks', i, 'label', e.target.value)}
                  placeholder="Label"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]"
                />
                <input
                  type="text"
                  value={item.href || ''}
                  onChange={(e) => updateListItem('socialLinks', i, 'href', e.target.value)}
                  placeholder="Href"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]"
                />
                <button
                  onClick={() => removeListItem('socialLinks', i)}
                  className="inline-flex items-center justify-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            ))}
            <button
              onClick={() => addListItem('socialLinks', { key: '', label: '', href: '#' })}
              className="inline-flex items-center gap-1.5 text-sm text-[#1e3a5f] font-medium hover:underline"
            >
              <FiPlus size={14} /> Add Social Link
            </button>
          </SectionCard>

          <SectionCard title="Bottom Bar Links and Copyright">
            {config.bottomLinks.map((item, i) => (
              <LinkRow
                key={`bottom-${i}`}
                item={item}
                onChange={(field, value) => updateListItem('bottomLinks', i, field, value)}
                onRemove={() => removeListItem('bottomLinks', i)}
              />
            ))}
            <button
              onClick={() => addListItem('bottomLinks', { label: '', href: '#' })}
              className="inline-flex items-center gap-1.5 text-sm text-[#1e3a5f] font-medium hover:underline"
            >
              <FiPlus size={14} /> Add Bottom Link
            </button>
            <textarea
              rows={2}
              value={config.copyrightTemplate}
              onChange={(e) => setConfig((prev) => ({ ...prev, copyrightTemplate: e.target.value }))}
              placeholder="Use {year} token for year"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f] resize-none"
            />
          </SectionCard>
        </div>
      )}
    </AdminLayout>
  );
}
