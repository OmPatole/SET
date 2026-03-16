import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import API from '../api/index.js';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiToggleRight, FiToggleLeft, FiAlertCircle, FiPaperclip, FiUpload, FiLink } from 'react-icons/fi';

const CATEGORIES = ['General', 'Exam', 'Academic', 'Event', 'Scholarship', 'Placement', 'Holiday'];
const PROGRAMS = ['All', 'B.Tech', 'M.Tech', 'PhD'];
const CAT_COLORS = {
  General: 'bg-gray-100 text-gray-700',
  Exam: 'bg-red-100 text-red-700',
  Academic: 'bg-blue-100 text-blue-700',
  Event: 'bg-purple-100 text-purple-700',
  Scholarship: 'bg-green-100 text-green-700',
  Placement: 'bg-yellow-100 text-yellow-700',
  Holiday: 'bg-orange-100 text-orange-700',
};

const emptyForm = {
  title: '',
  content: '',
  category: 'General',
  program: 'All',
  attachmentUrl: '',
  isImportant: false,
  active: true,
  publishedAt: new Date().toISOString().split('T')[0],
};

function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-xl flex items-center gap-3 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
      {msg}<button onClick={onClose}><FiX size={15} /></button>
    </div>
  );
}

export default function NoticeboardEditor() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState({ msg: '', type: '' });
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState('All');
  const [filterProgram, setFilterProgram] = useState('All');
  const [uploading, setUploading] = useState(false);
  const [attachMode, setAttachMode] = useState('url'); // 'url' | 'upload'
  const [quickLinks, setQuickLinks] = useState({
    sp_exam_results_url: '',
    sp_academic_calendar_url: '',
    sp_library_portal_url: '',
    sp_scholarships_url: '',
    sp_suk_apps_url: '',
  });
  const [savingLinks, setSavingLinks] = useState(false);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast({ msg: '', type: '' }), 3000); };

  const fetchItems = async () => {
    setLoading(true);
    try { 
      const { data: notices } = await API.get('/notices/all'); 
      setItems(notices); 
      
      const { data: settings } = await API.get('/settings');
      setQuickLinks({
        sp_exam_results_url: settings.sp_exam_results_url || '',
        sp_academic_calendar_url: settings.sp_academic_calendar_url || '',
        sp_library_portal_url: settings.sp_library_portal_url || '',
        sp_scholarships_url: settings.sp_scholarships_url || '',
        sp_suk_apps_url: settings.sp_suk_apps_url || '',
      });
    }
    catch { showToast('Failed to load', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const openEdit = (item) => {
    setEditing(item);
    const pd = item.publishedAt ? new Date(item.publishedAt).toISOString().split('T')[0] : '';
    setForm({ ...item, publishedAt: pd });
    setShowModal(true);
  };
  const openAdd = () => {
    setEditing(null);
    setAttachMode('url');
    setForm({ ...emptyForm, publishedAt: new Date().toISOString().split('T')[0] });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(emptyForm); setAttachMode('url'); };

  const save = async () => {
    if (!form.title.trim()) { showToast('Title is required', 'error'); return; }
    const payload = { ...form, publishedAt: form.publishedAt ? new Date(form.publishedAt) : new Date() };
    setSaving(true);
    try {
      if (editing) { await API.put(`/notices/${editing._id}`, payload); showToast('Notice updated'); }
      else { await API.post('/notices', payload); showToast('Notice published'); }
      fetchItems(); closeModal();
    } catch { showToast('Save failed', 'error'); }
    finally { setSaving(false); }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    try { await API.delete(`/notices/${id}`); showToast('Deleted'); fetchItems(); }
    catch { showToast('Delete failed', 'error'); }
  };

  const toggleActive = async (item) => {
    try { await API.put(`/notices/${item._id}`, { ...item, active: !item.active }); fetchItems(); }
    catch { showToast('Failed', 'error'); }
  };

  const F = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const uploadFile = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    try {
      const { data } = await API.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      F('attachmentUrl', data.url);
      showToast('File uploaded successfully');
    } catch { showToast('Upload failed', 'error'); }
    finally { setUploading(false); }
  };

  const catFiltered = filterCat === 'All' ? items : items.filter(i => i.category === filterCat);
  const filtered = filterProgram === 'All'
    ? catFiltered
    : catFiltered.filter(i => !i.program || i.program === 'All' || i.program === filterProgram);

  const saveQuickLinks = async () => {
    setSavingLinks(true);
    try {
      await API.put('/settings', { settings: quickLinks });
      showToast('Quick Links saved successfully');
    } catch {
      showToast('Failed to save Quick Links', 'error');
    } finally {
      setSavingLinks(false);
    }
  };

  return (
    <AdminLayout>
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: '' })} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Noticeboard</h2>
          <p className="text-gray-500 text-sm mt-0.5">Manage notices displayed in the Student Section</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#152d4a]">
          <FiPlus size={16} /> Post Notice
        </button>
      </div>

      {/* Student Portal Quick Links Editor */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 border-b-2 border-[#1e3a5f] pb-1 inline-block">Student Portal Quick Links</h3>
          <button onClick={saveQuickLinks} disabled={savingLinks} className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors disabled:opacity-60">
            {savingLinks ? <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /> : <FiSave size={14} />}
            Save Links
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Exam Results URL</label>
            <input type="text" value={quickLinks.sp_exam_results_url} onChange={e => setQuickLinks(s => ({ ...s, sp_exam_results_url: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Academic Calendar URL</label>
            <input type="text" value={quickLinks.sp_academic_calendar_url} onChange={e => setQuickLinks(s => ({ ...s, sp_academic_calendar_url: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Library Portal URL</label>
            <input type="text" value={quickLinks.sp_library_portal_url} onChange={e => setQuickLinks(s => ({ ...s, sp_library_portal_url: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Scholarships URL</label>
            <input type="text" value={quickLinks.sp_scholarships_url} onChange={e => setQuickLinks(s => ({ ...s, sp_scholarships_url: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">SUK Apps URL</label>
            <input type="text" value={quickLinks.sp_suk_apps_url} onChange={e => setQuickLinks(s => ({ ...s, sp_suk_apps_url: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="https://..." />
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6" />

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-3">
        {['All', ...CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${filterCat === cat ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Program filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {PROGRAMS.map(p => (
          <button
            key={p}
            onClick={() => setFilterProgram(p)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${filterProgram === p ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {p === 'All' ? 'All Programs' : p}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No notices found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Program</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Flags</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item._id} className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 ${item.isImportant ? 'bg-red-50/30' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-800 flex items-center gap-1.5">
                      {item.isImportant && <FiAlertCircle size={14} className="text-red-500 shrink-0" />}
                      <span className="truncate max-w-xs" title={item.title}>{item.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${CAT_COLORS[item.category] || 'bg-gray-100 text-gray-700'}`}>{item.category}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {item.program && item.program !== 'All' ? (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">{item.program}</span>
                    ) : (
                      <span className="text-xs text-gray-400">All</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">
                    {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {item.isImportant && <span className="text-xs bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded">URGENT</span>}
                      {item.attachmentUrl && <FiPaperclip size={13} className="text-gray-400" title="Has attachment" />}
                    </div>
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-900">{editing ? 'Edit Notice' : 'Post Notice'}</h3>
              <button onClick={closeModal}><FiX size={20} /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={form.title} onChange={e => F('title', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="e.g. Exam Form Submission Last Date Extended" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={form.category} onChange={e => F('category', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                  <input type="date" value={form.publishedAt} onChange={e => F('publishedAt', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                <select value={form.program || 'All'} onChange={e => F('program', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]">
                  {PROGRAMS.map(p => <option key={p} value={p}>{p === 'All' ? 'All Programs' : p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea rows={5} value={form.content} onChange={e => F('content', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f] resize-none" placeholder="Full notice text here..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attachment (PDF / Document)</label>
                {/* Mode toggle */}
                <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-2 w-fit">
                  <button type="button" onClick={() => setAttachMode('upload')} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${attachMode === 'upload' ? 'bg-[#1e3a5f] text-white' : 'text-gray-500 hover:bg-gray-50'}`}><FiUpload size={12} /> Upload File</button>
                  <button type="button" onClick={() => setAttachMode('url')} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${attachMode === 'url' ? 'bg-[#1e3a5f] text-white' : 'text-gray-500 hover:bg-gray-50'}`}><FiLink size={12} /> Paste URL</button>
                </div>
                {attachMode === 'upload' ? (
                  <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${uploading ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-[#1e3a5f] bg-gray-50 hover:bg-gray-100'}`}>
                    {uploading ? (
                      <div className="flex items-center gap-2 text-blue-600 text-sm"><div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" /> Uploading...</div>
                    ) : (
                      <>
                        <FiUpload size={20} className="text-gray-400 mb-1" />
                        <span className="text-xs text-gray-500">Click to upload PDF or image</span>
                        <span className="text-[10px] text-gray-400 mt-0.5">Max 15 MB • PDF, JPG, PNG, WEBP</span>
                      </>
                    )}
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" onChange={e => uploadFile(e.target.files?.[0])} disabled={uploading} />
                  </label>
                ) : (
                  <input type="text" value={form.attachmentUrl} onChange={e => F('attachmentUrl', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]" placeholder="https://example.com/notice.pdf" />
                )}
                {form.attachmentUrl && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <FiPaperclip size={12} className="text-green-600 shrink-0" />
                    <a href={form.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline truncate max-w-xs">{form.attachmentUrl}</a>
                    <button type="button" onClick={() => F('attachmentUrl', '')} className="text-gray-400 hover:text-red-500 ml-auto shrink-0"><FiX size={12} /></button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={e => F('active', e.target.checked)} className="w-4 h-4 accent-[#1e3a5f]" />
                  Active (visible to students)
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-pointer">
                  <input type="checkbox" checked={form.isImportant} onChange={e => F('isImportant', e.target.checked)} className="w-4 h-4 accent-red-500" />
                  <span className="text-red-600">Mark as Important</span>
                </label>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex gap-3">
              <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#152d4a] disabled:opacity-60">
                {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave size={15} />}
                {editing ? 'Save Changes' : 'Publish Notice'}
              </button>
              <button onClick={closeModal} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
