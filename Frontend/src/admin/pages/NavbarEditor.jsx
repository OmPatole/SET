import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import API from '../api/index.js';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiChevronUp, FiChevronDown, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const emptyItem = { label: '', href: '#', dropdown: [], active: true };
const emptyDrop = { label: '', href: '#' };

function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-xl flex items-center gap-3 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
      {msg}
      <button onClick={onClose}><FiX size={15} /></button>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-900 text-base">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}

export default function NavbarEditor() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyItem);
  const [toast, setToast] = useState({ msg: '', type: '' });
  const [saving, setSaving] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/navbar/all');
      setItems(data);
    } catch {
      showToast('Failed to load navbar items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyItem, dropdown: [] });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ ...item, dropdown: item.dropdown ? [...item.dropdown.map(d => ({ ...d }))] : [] });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm(emptyItem);
  };

  const save = async () => {
    if (!form.label.trim()) { showToast('Label is required', 'error'); return; }
    setSaving(true);
    try {
      if (editing) {
        await API.put(`/navbar/${editing._id}`, form);
        showToast('Navbar item updated');
      } else {
        await API.post('/navbar', form);
        showToast('Navbar item added');
      }
      fetchItems();
      closeModal();
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this navbar item?')) return;
    try {
      await API.delete(`/navbar/${id}`);
      showToast('Deleted successfully');
      fetchItems();
    } catch {
      showToast('Delete failed', 'error');
    }
  };

  const toggleActive = async (item) => {
    try {
      await API.put(`/navbar/${item._id}`, { ...item, active: !item.active });
      fetchItems();
    } catch {
      showToast('Failed to update', 'error');
    }
  };

  const move = async (index, dir) => {
    if ((dir === -1 && index === 0) || (dir === 1 && index === items.length - 1)) return;
    const updated = [...items];
    const swap = index + dir;
    [updated[index], updated[swap]] = [updated[swap], updated[index]];
    const reordered = updated.map((it, i) => ({ ...it, order: i }));
    setItems(reordered);
    try {
      await API.put('/navbar/reorder/bulk', { items: reordered.map(it => ({ id: it._id, order: it.order })) });
    } catch {
      showToast('Reorder failed', 'error');
      fetchItems();
    }
  };

  // Dropdown management
  const addDrop = () => setForm(f => ({ ...f, dropdown: [...f.dropdown, { ...emptyDrop }] }));
  const updateDrop = (i, key, val) => setForm(f => {
    const d = [...f.dropdown];
    d[i] = { ...d[i], [key]: val };
    return { ...f, dropdown: d };
  });
  const removeDrop = (i) => setForm(f => ({ ...f, dropdown: f.dropdown.filter((_, di) => di !== i) }));
  const moveDrop = (i, dir) => {
    const d = [...form.dropdown];
    const swap = i + dir;
    if (swap < 0 || swap >= d.length) return;
    [d[i], d[swap]] = [d[swap], d[i]];
    setForm(f => ({ ...f, dropdown: d }));
  };

  return (
    <AdminLayout>
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: '' })} />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Navbar Editor</h2>
          <p className="text-gray-500 text-sm mt-0.5">Manage navigation menu items and dropdown links</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#152d4a] transition-colors"
        >
          <FiPlus size={16} /> Add Item
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No navbar items found. Click "Add Item" to create one.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 w-12">Order</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Label</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Link</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Dropdowns</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => move(i, -1)} disabled={i === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-20">
                        <FiChevronUp size={14} />
                      </button>
                      <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-20">
                        <FiChevronDown size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{item.label}</td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell font-mono text-xs">{item.href}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {item.dropdown && item.dropdown.length > 0 ? (
                      <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {item.dropdown.length} items
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">No dropdown</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(item)} className={`flex items-center gap-1.5 text-xs font-medium ${item.active ? 'text-green-600' : 'text-gray-400'}`}>
                      {item.active ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
                      {item.active ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(item)} className="p-1.5 text-gray-500 hover:text-[#1e3a5f] hover:bg-gray-100 rounded-lg transition-colors">
                        <FiEdit2 size={15} />
                      </button>
                      <button onClick={() => deleteItem(item._id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <Modal title={editing ? 'Edit Navbar Item' : 'Add Navbar Item'} onClose={closeModal}>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label *</label>
                <input
                  type="text"
                  value={form.label}
                  onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 focus:border-[#1e3a5f]"
                  placeholder="e.g. About"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link (href)</label>
                <input
                  type="text"
                  value={form.href}
                  onChange={e => setForm(f => ({ ...f, href: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 focus:border-[#1e3a5f]"
                  placeholder="#about"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Dropdown Items</label>
                <button
                  onClick={addDrop}
                  className="text-xs flex items-center gap-1 text-[#1e3a5f] hover:underline font-medium"
                >
                  <FiPlus size={13} /> Add Dropdown
                </button>
              </div>

              {form.dropdown.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-2">No dropdown items. Click "Add Dropdown" to add links.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {form.dropdown.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                      <div className="flex flex-col gap-0.5">
                        <button onClick={() => moveDrop(i, -1)} disabled={i === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-20">
                          <FiChevronUp size={12} />
                        </button>
                        <button onClick={() => moveDrop(i, 1)} disabled={i === form.dropdown.length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-20">
                          <FiChevronDown size={12} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={d.label}
                        onChange={e => updateDrop(i, 'label', e.target.value)}
                        className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#1e3a5f]"
                        placeholder="Label"
                      />
                      <input
                        type="text"
                        value={d.href}
                        onChange={e => updateDrop(i, 'href', e.target.value)}
                        className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#1e3a5f]"
                        placeholder="href"
                      />
                      <button onClick={() => removeDrop(i)} className="text-red-400 hover:text-red-600 p-1">
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="activeCheck"
                checked={form.active}
                onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                className="w-4 h-4 rounded accent-[#1e3a5f]"
              />
              <label htmlFor="activeCheck" className="text-sm text-gray-700 font-medium">Active (visible on site)</label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={save}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#152d4a] disabled:opacity-60"
              >
                {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave size={15} />}
                {editing ? 'Save Changes' : 'Add Item'}
              </button>
              <button onClick={closeModal} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}