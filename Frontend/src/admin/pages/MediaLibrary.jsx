import { useState, useEffect, useRef } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import API from '../api/index.js';
import {
  FiUpload, FiTrash2, FiCopy, FiCheck, FiImage,
  FiFileText, FiRefreshCw, FiX, FiLink,
} from 'react-icons/fi';

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImage(filename) {
  return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(filename);
}

function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-xl flex items-center gap-3 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
      {msg}<button onClick={onClose}><FiX size={15} /></button>
    </div>
  );
}

export default function MediaLibrary() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState('');
  const [toast, setToast] = useState({ msg: '', type: '' });
  const [preview, setPreview] = useState(null); // { url, filename }
  const [dragOver, setDragOver] = useState(false);
  const [filter, setFilter] = useState('all'); // all | images | docs
  const fileInputRef = useRef();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/upload/list');
      setFiles(data);
    } catch { showToast('Failed to load files', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFiles(); }, []);

  const uploadFiles = async (fileList) => {
    const arr = Array.from(fileList);
    if (!arr.length) return;
    setUploading(true);
    let successCount = 0;
    for (const file of arr) {
      const fd = new FormData();
      fd.append('file', file);
      try {
        await API.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        successCount++;
      } catch (err) {
        showToast(`Failed: ${file.name} — ${err?.response?.data?.message || 'error'}`, 'error');
      }
    }
    setUploading(false);
    if (successCount) {
      showToast(`${successCount} file${successCount > 1 ? 's' : ''} uploaded`);
      fetchFiles();
    }
  };

  const handleFileInput = (e) => { uploadFiles(e.target.files); e.target.value = ''; };
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); uploadFiles(e.dataTransfer.files); };

  const copyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(''), 2000);
    } catch {
      showToast('Copy failed — try manually selecting the URL', 'error');
    }
  };

  const deleteFile = async (filename) => {
    if (!window.confirm(`Delete "${filename}"?`)) return;
    try {
      await API.delete(`/upload/${filename}`);
      showToast('File deleted');
      if (preview?.filename === filename) setPreview(null);
      fetchFiles();
    } catch { showToast('Delete failed', 'error'); }
  };

  const filtered = files.filter(f => {
    if (filter === 'images') return isImage(f.filename);
    if (filter === 'docs') return !isImage(f.filename);
    return true;
  });

  return (
    <AdminLayout>
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: '' })} />

      {/* Preview lightbox */}
      {preview && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="relative bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <span className="text-sm font-medium text-gray-700 truncate max-w-xs">{preview.filename}</span>
              <button onClick={() => setPreview(null)}><FiX size={18} /></button>
            </div>
            {isImage(preview.filename) ? (
              <img src={preview.url} alt={preview.filename} className="w-full max-h-[70vh] object-contain bg-gray-50" />
            ) : (
              <div className="flex items-center justify-center h-40 bg-gray-50">
                <FiFileText size={48} className="text-gray-300" />
              </div>
            )}
            <div className="px-5 py-3 border-t bg-gray-50 flex items-center gap-2">
              <input
                readOnly
                value={preview.url}
                onClick={e => e.target.select()}
                className="flex-1 text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 font-mono text-gray-600 focus:outline-none focus:border-teal-500 cursor-text"
              />
              <button
                onClick={() => copyUrl(preview.url)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors shrink-0 ${copiedUrl === preview.url ? 'bg-green-500 text-white' : 'bg-[#1e3a5f] text-white hover:bg-[#152d4a]'}`}
              >
                {copiedUrl === preview.url ? <><FiCheck size={13} /> Copied!</> : <><FiCopy size={13} /> Copy URL</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Media Library</h2>
          <p className="text-gray-500 text-sm mt-0.5">Upload images & files — copy the URL to use anywhere</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchFiles} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><FiRefreshCw size={16} /></button>
          <button
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#152d4a] disabled:opacity-60"
          >
            {uploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiUpload size={16} />}
            {uploading ? 'Uploading…' : 'Upload Files'}
          </button>
          <input ref={fileInputRef} type="file" multiple accept="image/*,application/pdf" className="hidden" onChange={handleFileInput} />
        </div>
      </div>

      {/* Drag & drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors mb-6 ${dragOver ? 'border-[#1e3a5f] bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
      >
        <FiUpload size={28} className={`mx-auto mb-2 ${dragOver ? 'text-[#1e3a5f]' : 'text-gray-300'}`} />
        <p className="text-sm text-gray-500">Drag & drop files here, or <span className="text-[#1e3a5f] font-semibold">click to browse</span></p>
        <p className="text-xs text-gray-400 mt-1">Supports: JPG, PNG, WEBP, PDF · Max 15 MB each</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {[['all', 'All'], ['images', 'Images'], ['docs', 'Documents']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${filter === val ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{label} {val === 'all' ? `(${files.length})` : val === 'images' ? `(${files.filter(f => isImage(f.filename)).length})` : `(${files.filter(f => !isImage(f.filename)).length})`}</button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <FiImage size={36} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No files yet. Upload something above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map(file => (
            <div key={file.filename} className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5">
              {/* Thumbnail */}
              <div
                className="h-32 bg-gray-50 flex items-center justify-center cursor-pointer overflow-hidden"
                onClick={() => setPreview(file)}
              >
                {isImage(file.filename) ? (
                  <img src={file.url} alt={file.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <FiFileText size={36} className="text-gray-300" />
                )}
              </div>

              {/* Info */}
              <div className="p-2.5">
                <p className="text-xs font-medium text-gray-700 truncate leading-tight" title={file.filename}>
                  {file.filename.replace(/^\d+_/, '')}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{formatSize(file.size)}</p>
              </div>

              {/* Actions — appear on hover */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => copyUrl(file.url)}
                  title="Copy URL"
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shadow transition-colors ${copiedUrl === file.url ? 'bg-green-500 text-white' : 'bg-white text-gray-600 hover:bg-[#1e3a5f] hover:text-white'}`}
                >
                  {copiedUrl === file.url ? <FiCheck size={12} /> : <FiCopy size={12} />}
                </button>
                <button
                  onClick={() => deleteFile(file.filename)}
                  title="Delete"
                  className="w-7 h-7 rounded-lg bg-white text-gray-600 hover:bg-red-500 hover:text-white flex items-center justify-center shadow transition-colors"
                >
                  <FiTrash2 size={12} />
                </button>
              </div>

              {/* Copied badge */}
              {copiedUrl === file.url && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                  URL Copied!
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* URL tip */}
      {files.length > 0 && (
        <div className="mt-6 flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-700">
          <FiLink size={16} className="shrink-0 mt-0.5" />
          <span>Click any file to open it and copy its URL. Paste the URL into any admin field (Hero image, Page content <code className="bg-blue-100 px-1 rounded">&lt;img src="..."&gt;</code>, etc.)</span>
        </div>
      )}
    </AdminLayout>
  );
}
