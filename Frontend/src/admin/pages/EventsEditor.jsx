import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import API from '../api/index.js';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiToggleRight, FiToggleLeft } from 'react-icons/fi';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const TAGS = ['Technical', 'Academic', 'Cultural', 'Sports', 'Workshop', 'Conference', 'Seminar', 'Other'];
const emptyForm = { tag: 'Technical', date: { day: '01', month: 'Jan' }, title: '', location: '', desc: '', image: '', href: '#', active: true, eventDate: '' };

function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-xl flex items-center gap-3 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
      {msg}<button onClick={onClose}><FiX size={15} /></button>
    </div>
  );
}

export default function EventsEditor() {
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
    try { const { data } = await API.get('/events/all'); setItems(data); }
    catch { showToast('Failed to load', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const openEdit = (item) => {
    setEditing(item);
    const ed = item.eventDate ? new Date(item.eventDate).toISOString().split('T')[0] : '';
    setForm({ ...item, date: { ...item.date }, eventDate: ed });
    setShowModal(true);
  };
  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(emptyForm); };

  const save = async () => {
    if (!form.title.trim()) { showToast('Title is required', 'error'); return; }
    const payload = { ...form, eventDate: form.eventDate ? new Date(form.eventDate) : new Date() };
    setSaving(true);
    try {
      if (editing) { await API.put(`/events/${editing._id}`, payload); showToast('Event updated'); }
      else { await API.post('/events', payload); showToast('Event added'); }
      fetchItems(); closeModal();
    } catch { showToast('Save failed', 'error'); }
    finally { setSaving(false); }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try { await API.delete(`/events/${id}`); showToast('Deleted'); fetchItems(); }
    catch { showToast('Delete failed', 'error'); }
  };

  const toggleActive = async (item) => {
    try { await API.put(`/events/${item._id}`, { ...item, active: !item.active }); fetchItems(); }
    catch { showToast('Failed', 'error'); }
  };

  const F = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <AdminLayout>
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: '' })} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Events</h2>
          <p className="text-gray-500 text-sm mt-0.5">Manage upcoming events and happenings</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#152d4a]">
          <FiPlus size={16} /> Add Event
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        {loading ? <div className="p-8 text-center text-gray-400">Loading...</div> : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Tag</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Location</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-[#1e3a5f] whitespace-nowrap">
                    {item.date?.day} {item.date?.month}
                  </td>
                  <td className="px-4 py-3 text-gray-800">
                    <div className="font-semibold truncate max-w-xs" title={item.title}>
                      {item.title}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="bg-[#1e3a5f]/10 text-[#1e3a5f] text-xs font-semibold px-2 py-0.5 rounded-full">{item.tag}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">{item.location}</td>
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
              <h3 className="font-bold text-gray-900">{editing ? 'Edit Event' : 'Add Event'}</h3>
              <button onClick={closeModal}><FiX size={20} /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={form.title} onChange={e => F('title', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                  <input type="text" value={form.date?.day || ''} onChange={e => setForm(f => ({ ...f, date: { ...f.date, day: e.target.value } }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="15" maxLength={2} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                  <select value={form.date?.month || 'Jan'} onChange={e => setForm(f => ({ ...f, date: { ...f.date, month: e.target.value } }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]">
                    {MONTHS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
                  <select value={form.tag} onChange={e => F('tag', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]">
                    {TAGS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input type="text" value={form.location} onChange={e => F('location', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                  <input type="date" value={form.eventDate} onChange={e => F('eventDate', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} value={form.desc} onChange={e => F('desc', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="url" value={form.image} onChange={e => F('image', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="https://..." />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="evActive" checked={form.active} onChange={e => F('active', e.target.checked)} className="w-4 h-4 accent-[#1e3a5f]" />
                <label htmlFor="evActive" className="text-sm text-gray-700 font-medium">Active</label>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex gap-3">
              <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#152d4a] disabled:opacity-60">
                {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave size={15} />}
                {editing ? 'Save Changes' : 'Add Event'}
              </button>
              <button onClick={closeModal} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
