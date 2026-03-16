import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import API from '../api/index.js';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiChevronUp, FiChevronDown, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const emptyForm = {
  image: '',
  tag: '',
  title: '',
  subtitle: '',
  cta1: { label: '', href: '#' },
  cta2: { label: '', href: '#' },
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

export default function HeroEditor() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState({ msg: '', type: '' });
  const [saving, setSaving] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/hero/all');
      setSlides(data);
    } catch { showToast('Failed to load slides', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSlides(); }, []);

  const openEdit = (slide) => {
    setEditing(slide);
    setForm({ ...slide, cta1: { ...slide.cta1 }, cta2: { ...slide.cta2 } });
    setShowModal(true);
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditing(null); setForm(emptyForm); };

  const save = async () => {
    if (!form.image.trim() || !form.title.trim()) { showToast('Image URL and Title are required', 'error'); return; }
    setSaving(true);
    try {
      if (editing) { await API.put(`/hero/${editing._id}`, form); showToast('Slide updated'); }
      else { await API.post('/hero', form); showToast('Slide added'); }
      fetchSlides(); closeModal();
    } catch (err) { showToast(err.response?.data?.message || 'Save failed', 'error'); }
    finally { setSaving(false); }
  };

  const deleteSlide = async (id) => {
    if (!window.confirm('Delete this slide?')) return;
    try { await API.delete(`/hero/${id}`); showToast('Deleted'); fetchSlides(); }
    catch { showToast('Delete failed', 'error'); }
  };

  const toggleActive = async (slide) => {
    try { await API.put(`/hero/${slide._id}`, { ...slide, active: !slide.active }); fetchSlides(); }
    catch { showToast('Failed', 'error'); }
  };

  const move = async (i, dir) => {
    if ((dir === -1 && i === 0) || (dir === 1 && i === slides.length - 1)) return;
    const updated = [...slides];
    [updated[i], updated[i + dir]] = [updated[i + dir], updated[i]];
    const reordered = updated.map((s, idx) => ({ ...s, order: idx }));
    setSlides(reordered);
    try {
      await Promise.all(reordered.map(s => API.put(`/hero/${s._id}`, { order: s.order })));
    } catch { fetchSlides(); }
  };

  const F = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <AdminLayout>
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: '' })} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hero Slides</h2>
          <p className="text-gray-500 text-sm mt-0.5">Manage the homepage carousel slides</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#152d4a] transition-colors">
          <FiPlus size={16} /> Add Slide
        </button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="bg-white rounded-xl border p-8 text-center text-gray-400">Loading...</div>
        ) : slides.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center text-gray-400">No slides found.</div>
        ) : slides.map((slide, i) => (
          <div key={slide._id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-4">
            <div className="flex flex-col gap-1 shrink-0">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-20"><FiChevronUp size={14} /></button>
              <button onClick={() => move(i, 1)} disabled={i === slides.length - 1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-20"><FiChevronDown size={14} /></button>
            </div>
            <img src={slide.image} alt={slide.title} className="w-32 h-20 object-cover rounded-lg shrink-0 hidden sm:block" onError={e => { e.target.style.display = 'none'; }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-[#1e3a5f]/10 text-[#1e3a5f] font-semibold px-2 py-0.5 rounded-full">{slide.tag || 'Slide'}</span>
                <span className={`text-xs font-medium ${slide.active ? 'text-green-600' : 'text-gray-400'}`}>{slide.active ? '● Active' : '○ Hidden'}</span>
              </div>
              <h4 className="font-bold text-gray-800 text-sm truncate max-w-[200px]" title={slide.title}>{slide.title?.replace('\n', ' ')}</h4>
              <p className="text-gray-500 text-xs line-clamp-2 mt-0.5">{slide.subtitle}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => toggleActive(slide)} className="p-1.5 text-gray-400 hover:text-[#1e3a5f] hover:bg-gray-100 rounded-lg">
                {slide.active ? <FiToggleRight size={18} className="text-green-500" /> : <FiToggleLeft size={18} />}
              </button>
              <button onClick={() => openEdit(slide)} className="p-1.5 text-gray-400 hover:text-[#1e3a5f] hover:bg-gray-100 rounded-lg"><FiEdit2 size={15} /></button>
              <button onClick={() => deleteSlide(slide._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><FiTrash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-900">{editing ? 'Edit Slide' : 'Add Slide'}</h3>
              <button onClick={closeModal}><FiX size={20} /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                <input type="url" value={form.image} onChange={e => F('image', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="https://..." />
                {form.image && <img src={form.image} alt="preview" className="mt-2 h-24 rounded-lg object-cover w-full" onError={e => { e.target.style.display = 'none'; }} />}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
                  <input type="text" value={form.tag} onChange={e => F('tag', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="Welcome to SET" />
                </div>
                <div className="flex items-end gap-2">
                  <input type="checkbox" id="slideActive" checked={form.active} onChange={e => F('active', e.target.checked)} className="w-4 h-4 accent-[#1e3a5f]" />
                  <label htmlFor="slideActive" className="text-sm text-gray-700 font-medium">Active</label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title * (use \n for line break)</label>
                <input type="text" value={form.title} onChange={e => F('title', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="Shaping Engineers,\nBuilding Futures" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <textarea rows={3} value={form.subtitle} onChange={e => F('subtitle', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CTA 1 Label</label>
                  <input type="text" value={form.cta1?.label || ''} onChange={e => setForm(f => ({ ...f, cta1: { ...f.cta1, label: e.target.value } }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="Explore Programs" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CTA 1 Link</label>
                  <input type="text" value={form.cta1?.href || ''} onChange={e => setForm(f => ({ ...f, cta1: { ...f.cta1, href: e.target.value } }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="#departments" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CTA 2 Label</label>
                  <input type="text" value={form.cta2?.label || ''} onChange={e => setForm(f => ({ ...f, cta2: { ...f.cta2, label: e.target.value } }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="Apply Now" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CTA 2 Link</label>
                  <input type="text" value={form.cta2?.href || ''} onChange={e => setForm(f => ({ ...f, cta2: { ...f.cta2, href: e.target.value } }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="#admissions" />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex gap-3">
              <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#152d4a] disabled:opacity-60">
                {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave size={15} />}
                {editing ? 'Save Changes' : 'Add Slide'}
              </button>
              <button onClick={closeModal} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
