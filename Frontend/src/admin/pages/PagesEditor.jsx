import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import API from '../api/index.js';
import {
  FiPlus, FiEdit2, FiTrash2, FiSave, FiX,
  FiToggleRight, FiToggleLeft, FiEye, FiFileText,
} from 'react-icons/fi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const SECTIONS = [
  { key: 'about', label: 'About SET' },
  { key: 'academics', label: 'Academics' },
  { key: 'research', label: 'Research' },
  { key: 'admissions', label: 'Admissions' },
  { key: 'campus', label: 'Campus Life' },
  { key: 'placements', label: 'Placements' },
];

const emptyForm = {
  title: '',
  slug: '',
  section: 'about',
  sectionLabel: 'About SET',
  content: '',
  order: 0,
  active: true,
};

function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-xl flex items-center gap-3 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
      {msg}<button onClick={onClose}><FiX size={15} /></button>
    </div>
  );
}

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function PagesEditor() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState({ msg: '', type: '' });
  const [saving, setSaving] = useState(false);
  const [filterSection, setFilterSection] = useState('all');
  const [preview, setPreview] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  const fetchPages = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/pages');
      setPages(data);
    } catch { showToast('Failed to load', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPages(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setPreview(false);
    setShowModal(true);
  };

  const openEdit = (page) => {
    setEditing(page);
    setForm({ ...page });
    setPreview(false);
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditing(null); setForm(emptyForm); setPreview(false); };

  const F = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleTitleChange = (v) => {
    setForm(f => ({
      ...f,
      title: v,
      slug: editing ? f.slug : slugify(v),
    }));
  };

  const handleSectionChange = (key) => {
    const sec = SECTIONS.find(s => s.key === key);
    setForm(f => ({ ...f, section: key, sectionLabel: sec?.label || key }));
  };

  const save = async () => {
    if (!form.title.trim()) { showToast('Title is required', 'error'); return; }
    if (!form.slug.trim()) { showToast('Slug is required', 'error'); return; }
    setSaving(true);
    try {
      if (editing) {
        await API.put(`/pages/${editing._id}`, form);
        showToast('Page updated');
      } else {
        await API.post('/pages', form);
        showToast('Page created');
      }
      fetchPages();
      closeModal();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Save failed', 'error');
    } finally { setSaving(false); }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this page?')) return;
    try {
      await API.delete(`/pages/${id}`);
      showToast('Deleted');
      fetchPages();
    } catch { showToast('Delete failed', 'error'); }
  };

  const toggleActive = async (page) => {
    try {
      await API.put(`/pages/${page._id}`, { ...page, active: !page.active });
      fetchPages();
    } catch { showToast('Failed', 'error'); }
  };

  const filtered = filterSection === 'all' ? pages : pages.filter(p => p.section === filterSection);

  return (
    <AdminLayout>
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: '' })} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Page Editor</h2>
          <p className="text-gray-500 text-sm mt-0.5">Create and edit pages linked from navbar dropdowns</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#152d4a]">
          <FiPlus size={16} /> New Page
        </button>
      </div>

      {/* Section filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setFilterSection('all')} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${filterSection === 'all' ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>All</button>
        {SECTIONS.map(s => (
          <button key={s.key} onClick={() => setFilterSection(s.key)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${filterSection === s.key ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s.label}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <FiFileText size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No pages yet. Click "New Page" to get started.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Slug / URL</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Section</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(page => (
                <tr key={page._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-800">{page.title}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <code className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">/pages/{page.slug}</code>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full capitalize">{page.sectionLabel || page.section}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(page)} className={`flex items-center gap-1.5 text-xs font-medium ${page.active ? 'text-green-600' : 'text-gray-400'}`}>
                      {page.active ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
                      {page.active ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <a href={`/pages/${page.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"><FiEye size={15} /></a>
                      <button onClick={() => openEdit(page)} className="p-1.5 text-gray-400 hover:text-[#1e3a5f] hover:bg-gray-100 rounded-lg"><FiEdit2 size={15} /></button>
                      <button onClick={() => deleteItem(page._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><FiTrash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-40 flex items-start justify-center p-4 pt-10 bg-black/40 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
              <h3 className="font-bold text-gray-900">{editing ? `Editing: ${editing.title}` : 'Create New Page'}</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setPreview(!preview)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${preview ? 'bg-[#1e3a5f] text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  <FiEye size={13} /> {preview ? 'Edit' : 'Preview'}
                </button>
                <button onClick={closeModal}><FiX size={20} /></button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Title + Slug */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Title *</label>
                  <input type="text" value={form.title} onChange={e => handleTitleChange(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="e.g. About SET" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug *</label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#1e3a5f]">
                    <span className="px-3 py-2 bg-gray-50 text-gray-400 text-xs border-r border-gray-300">/pages/</span>
                    <input type="text" value={form.slug} onChange={e => F('slug', slugify(e.target.value))} className="flex-1 px-3 py-2 text-sm focus:outline-none" placeholder="about-set" />
                  </div>
                </div>
              </div>

              {/* Section + Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Navbar Section (Sidebar Group)</label>
                  <select value={form.section} onChange={e => handleSectionChange(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]">
                    {SECTIONS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input type="number" value={form.order} onChange={e => F('order', Number(e.target.value))} className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" />
                </div>
              </div>

              {/* Active */}
              <label className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => F('active', e.target.checked)} className="w-4 h-4 accent-[#1e3a5f]" />
                Active (visible on website)
              </label>

              {/* Content editor / preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page Content
                  <span className="ml-2 text-xs text-gray-400 font-normal">— edit rich text below</span>
                </label>
                {preview ? (
                  <div
                    className="min-h-[400px] border border-gray-200 rounded-xl p-6 prose prose-sm max-w-none bg-white overflow-auto"
                    dangerouslySetInnerHTML={{ __html: form.content || '<p class="text-gray-400">Nothing to preview yet.</p>' }}
                  />
                ) : (
                  <div className="bg-white rounded-xl border border-gray-300 overflow-hidden focus-within:border-[#1e3a5f]" style={{ minHeight: '350px' }}>
                    <ReactQuill 
                      theme="snow"
                      value={form.content}
                      onChange={val => F('content', val)}
                      style={{ height: '300px', border: 'none' }}
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          ['link', 'image'],
                          ['clean']
                        ]
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t flex gap-3 shrink-0">
              <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#152d4a] disabled:opacity-60">
                {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave size={15} />}
                {editing ? 'Save Changes' : 'Create Page'}
              </button>
              <button onClick={closeModal} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              {form.slug && (
                <a href={`/pages/${form.slug}`} target="_blank" rel="noopener noreferrer" className="ml-auto flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 hover:text-[#1e3a5f]">
                  <FiEye size={14} /> View Page
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
