import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import API from '../api/index.js';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiToggleRight, FiToggleLeft } from 'react-icons/fi';

const TAGS = ['Notice', 'News', 'Workshop', 'Achievement', 'Research', 'Placement', 'Academic', 'Event'];
const emptyForm = { tag: 'News', date: '', author: '', read: '2 min', title: '', excerpt: '', image: '', href: '#', active: true, pinned: false };

function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-xl flex items-center gap-3 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
      {msg}<button onClick={onClose}><FiX size={15} /></button>
    </div>
  );
}

export default function NewsEditor() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState({ msg: '', type: '' });
  const [saving, setSaving] = useState(false);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast({ msg: '', type: '' }), 3000); };

  const fetchItems = async () => {
    setLoading(true);
    try { const { data } = await API.get('/news/all'); setItems(data); }
    catch { showToast('Failed to load', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const openEdit = (item) => { setEditing(item); setForm({ ...item }); setShowModal(true); };
  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(emptyForm); };

  const save = async () => {
    if (!form.title.trim()) { showToast('Title is required', 'error'); return; }
    setSaving(true);
    try {
      if (editing) { await API.put(`/news/${editing._id}`, form); showToast('News updated'); }
      else { await API.post('/news', form); showToast('News added'); }
      fetchItems(); closeModal();
    } catch { showToast('Save failed', 'error'); }
    finally { setSaving(false); }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this news item?')) return;
    try { await API.delete(`/news/${id}`); showToast('Deleted'); fetchItems(); }
    catch { showToast('Delete failed', 'error'); }
  };

  const toggleActive = async (item) => {
    try { await API.put(`/news/${item._id}`, { ...item, active: !item.active }); fetchItems(); }
    catch { showToast('Failed', 'error'); }
  };

  const F = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <AdminLayout>
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: '' })} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">News & Updates</h2>
          <p className="text-gray-500 text-sm mt-0.5">Manage news articles displayed on the homepage</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#152d4a]">
          <FiPlus size={16} /> Add News
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        {loading ? <div className="p-8 text-center text-gray-400">Loading...</div> : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Tag</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-800 truncate max-w-xs" title={item.title}>{item.title}</div>
                    <div className="text-xs text-gray-400">{item.author}</div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="bg-[#1e3a5f]/10 text-[#1e3a5f] text-xs font-semibold px-2 py-0.5 rounded-full">{item.tag}</span>
                    {item.pinned && <span className="ml-1 bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-0.5 rounded-full">Pinned</span>}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-500 text-xs">{item.date}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(item)} className={`flex items-center gap-1.5 text-xs font-medium ${item.active ? 'text-green-600' : 'text-gray-400'}`}>
                      {item.active ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
                      {item.active ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-[#1e3a5f] hover:bg-gray-100 rounded-lg"><FiEdit2 size={15} /></button>
                      <button onClick={() => deleteItem(item._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><FiTrash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-900">{editing ? 'Edit News' : 'Add News'}</h3>
              <button onClick={closeModal}><FiX size={20} /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={form.title} onChange={e => F('title', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
                  <select value={form.tag} onChange={e => F('tag', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]">
                    {TAGS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input type="text" value={form.author} onChange={e => F('author', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="text" value={form.date} onChange={e => F('date', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="Mar 2026" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Read Time</label>
                  <input type="text" value={form.read} onChange={e => F('read', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="2 min" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea rows={3} value={form.excerpt} onChange={e => F('excerpt', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="url" value={form.image} onChange={e => F('image', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">External Link (PDF or URL)</label>
                <input type="text" value={form.href} onChange={e => F('href', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="#" />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={e => F('active', e.target.checked)} className="w-4 h-4 accent-[#1e3a5f]" />
                  Active
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-pointer">
                  <input type="checkbox" checked={form.pinned} onChange={e => F('pinned', e.target.checked)} className="w-4 h-4 accent-[#1e3a5f]" />
                  Pinned (show first)
                </label>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex gap-3">
              <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#152d4a] disabled:opacity-60">
                {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave size={15} />}
                {editing ? 'Save Changes' : 'Add News'}
              </button>
              <button onClick={closeModal} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
