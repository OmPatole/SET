import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import API from '../api/index.js';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiToggleRight, FiToggleLeft, FiLinkedin, FiArrowUp, FiArrowDown } from 'react-icons/fi';

const emptyForm = { name: '', role: '', company: '', batch: '', image: '', linkedin: '', order: 0, active: true };

function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-xl flex items-center gap-3 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
      {msg}<button onClick={onClose}><FiX size={15} /></button>
    </div>
  );
}

export default function AlumniEditor() {
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
    try { const { data } = await API.get('/alumni/all'); setItems(data); }
    catch { showToast('Failed to load', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const openEdit = (item) => { setEditing(item); setForm({ ...item }); setShowModal(true); };
  const openAdd = () => { setEditing(null); setForm({ ...emptyForm, order: items.length }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(emptyForm); };

  const save = async () => {
    if (!form.name.trim()) { showToast('Name is required', 'error'); return; }
    setSaving(true);
    try {
      if (editing) { await API.put(`/alumni/${editing._id}`, form); showToast('Alumni updated'); }
      else { await API.post('/alumni', form); showToast('Alumni added'); }
      fetchItems(); closeModal();
    } catch { showToast('Save failed', 'error'); }
    finally { setSaving(false); }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Remove this alumni profile?')) return;
    try { await API.delete(`/alumni/${id}`); showToast('Deleted'); fetchItems(); }
    catch { showToast('Delete failed', 'error'); }
  };

  const toggleActive = async (item) => {
    try { await API.put(`/alumni/${item._id}`, { ...item, active: !item.active }); fetchItems(); }
    catch { showToast('Failed', 'error'); }
  };

  const reorder = async (idx, dir) => {
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= items.length) return;
    const updated = [...items];
    [updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]];
    try {
      await Promise.all(updated.map((it, i) => API.put(`/alumni/${it._id}`, { order: i })));
      fetchItems();
    } catch { showToast('Reorder failed', 'error'); }
  };

  const F = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <AdminLayout>
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: '' })} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Alumni</h2>
          <p className="text-gray-500 text-sm mt-0.5">Manage notable alumni profiles</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#152d4a]">
          <FiPlus size={16} /> Add Alumni
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No alumni profiles yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 w-16">Order</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Alumni</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Role & Company</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Batch</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => reorder(idx, -1)} disabled={idx === 0} className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-20"><FiArrowUp size={13} /></button>
                      <button onClick={() => reorder(idx, 1)} disabled={idx === items.length - 1} className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-20"><FiArrowDown size={13} /></button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full object-cover border-2 border-gray-200" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white font-bold text-sm shrink-0">{item.name.charAt(0)}</div>
                      )}
                      <div>
                        <div className="font-semibold text-gray-800">{item.name}</div>
                        {item.linkedin && <a href={item.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 mt-0.5 flex items-center gap-1 text-xs"><FiLinkedin size={11} /> LinkedIn</a>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                    <div className="font-medium text-gray-800 line-clamp-1 truncate max-w-[150px]" title={item.role}>{item.role}</div>
                    <div className="text-xs text-gray-500 line-clamp-1 truncate max-w-[150px]" title={item.company}>{item.company}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {item.batch && <span className="text-xs font-semibold bg-[#1e3a5f]/10 text-[#1e3a5f] px-2 py-0.5 rounded-full">Batch {item.batch}</span>}
                  </td>
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-900">{editing ? 'Edit Alumni' : 'Add Alumni'}</h3>
              <button onClick={closeModal}><FiX size={20} /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" value={form.name} onChange={e => F('name', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="e.g. Ananya Mehta" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role / Position</label>
                  <input type="text" value={form.role} onChange={e => F('role', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="e.g. Software Engineer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input type="text" value={form.company} onChange={e => F('company', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="e.g. Google" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch Year</label>
                  <input type="text" value={form.batch} onChange={e => F('batch', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="e.g. 2018" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
                <input type="text" value={form.image} onChange={e => F('image', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="https://..." />
                {form.image && (
                  <div className="mt-2 flex items-center gap-3">
                    <img src={form.image} alt="preview" className="w-14 h-14 rounded-full object-cover border-2 border-gray-200" onError={e => e.target.style.display = 'none'} />
                    <span className="text-xs text-gray-400">Photo preview</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile URL</label>
                <input type="text" value={form.linkedin} onChange={e => F('linkedin', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="https://linkedin.com/in/..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input type="number" value={form.order} onChange={e => F('order', Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-pointer">
                    <input type="checkbox" checked={form.active} onChange={e => F('active', e.target.checked)} className="w-4 h-4 accent-[#1e3a5f]" />
                    Active
                  </label>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex gap-3">
              <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#152d4a] disabled:opacity-60">
                {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave size={15} />}
                {editing ? 'Save Changes' : 'Add Alumni'}
              </button>
              <button onClick={closeModal} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
