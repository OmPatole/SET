import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import API from '../api/index.js';
import { FiSave, FiX, FiGlobe, FiPhone, FiMail, FiMapPin, FiShare2, FiSettings } from 'react-icons/fi';

const GROUPS = [
  { key: 'general', label: 'General', icon: FiSettings, fields: [
    { key: 'institute_name', label: 'Institute Name', type: 'text', placeholder: 'School of Engineering & Technology' },
    { key: 'institute_tagline', label: 'Tagline', type: 'text', placeholder: 'Excellence in Technical Education' },
    { key: 'site_logo_url', label: 'Site Logo URL', type: 'text', placeholder: '/uploads/logo.png or https://...' },
    { key: 'footer_description', label: 'Footer Description', type: 'textarea', placeholder: 'Brief description shown in footer...' },
    { key: 'apply_now_url', label: 'Apply Now URL', type: 'text', placeholder: 'https://...' },
    { key: 'student_portal_url', label: 'Student Portal URL', type: 'text', placeholder: 'https://...' },
    { key: 'staff_login_url', label: 'Staff Login URL', type: 'text', placeholder: 'https://...' },
    { key: 'maps_embed_url', label: 'Google Maps Embed URL', type: 'text', placeholder: 'https://maps.google.com/embed?...' },
  ]},
  { key: 'contact', label: 'Contact', icon: FiPhone, fields: [
    { key: 'phone', label: 'Phone Number', type: 'text', placeholder: '+91 XXXXX XXXXX' },
    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'info@set.edu' },
    { key: 'address', label: 'Address', type: 'textarea', placeholder: 'Full campus address...' },
  ]},
  { key: 'social', label: 'Social Media', icon: FiShare2, fields: [
    { key: 'facebook', label: 'Facebook URL', type: 'text', placeholder: 'https://facebook.com/...' },
    { key: 'twitter', label: 'Twitter / X URL', type: 'text', placeholder: 'https://twitter.com/...' },
    { key: 'instagram', label: 'Instagram URL', type: 'text', placeholder: 'https://instagram.com/...' },
    { key: 'linkedin', label: 'LinkedIn URL', type: 'text', placeholder: 'https://linkedin.com/in/...' },
    { key: 'youtube', label: 'YouTube URL', type: 'text', placeholder: 'https://youtube.com/@...' },
  ]},
  { key: 'links', label: 'Quick Links', icon: FiGlobe, fields: [
    { key: 'quick_links', label: 'Footer Quick Links (One per line: Label|URL)', type: 'textarea', placeholder: 'DCS Document|https://...\nFRA Fee Structure|https://...' },
  ]},
];

function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-xl flex items-center gap-3 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
      {msg}<button onClick={onClose}><FiX size={15} /></button>
    </div>
  );
}

export default function SettingsEditor() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeGroup, setActiveGroup] = useState('general');
  const [toast, setToast] = useState({ msg: '', type: '' });

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast({ msg: '', type: '' }), 3000); };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/settings');
      setSettings(data);
    } catch { showToast('Failed to load settings', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await API.put('/settings', { settings });
      showToast('Settings saved successfully');
    } catch { showToast('Failed to save settings', 'error'); }
    finally { setSaving(false); }
  };

  const currentGroup = GROUPS.find(g => g.key === activeGroup);

  return (
    <AdminLayout>
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: '' })} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Site Settings</h2>
          <p className="text-gray-500 text-sm mt-0.5">Global configuration for the website</p>
        </div>
        <button onClick={saveSettings} disabled={saving || loading} className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#152d4a] disabled:opacity-60">
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave size={16} />}
          Save All Settings
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Group tabs sidebar */}
        <div className="lg:w-52 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {GROUPS.map(g => {
              const Icon = g.icon;
              return (
                <button
                  key={g.key}
                  onClick={() => setActiveGroup(g.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left transition-colors border-b last:border-b-0 border-gray-100 ${activeGroup === g.key ? 'bg-[#1e3a5f] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Icon size={15} />
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fields panel */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-gray-400">Loading settings...</div>
          ) : (
            <div className="space-y-5">
              {currentGroup?.fields.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      rows={4}
                      value={settings[field.key] || ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f] resize-none"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={settings[field.key] || ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
