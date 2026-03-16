import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import API from '../api/index.js';
import { FiTrash2, FiDownload } from 'react-icons/fi';

export default function ApplicationsEditor() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchApplications = async () => {
    try {
      const { data } = await API.get('/applications');
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/applications/${id}`, { status });
      fetchApplications();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const deleteApplication = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await API.delete(`/applications/${id}`);
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
      fetchApplications();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(applications.map(app => app._id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selId => selId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const deleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected applications?`)) return;
    
    setLoading(true);
    try {
      await Promise.all(selectedIds.map(id => API.delete(`/applications/${id}`)));
      setSelectedIds([]);
      fetchApplications();
    } catch (err) {
      alert('Failed to delete some selected applications');
      setLoading(false);
      fetchApplications();
    }
  };

  const exportToExcel = () => {
    if (applications.length === 0) {
      alert('No applications to export.');
      return;
    }
    
    const dataToExport = selectedIds.length > 0 
      ? applications.filter(app => selectedIds.includes(app._id))
      : applications;

    const headers = ['Applicant Name', 'Email', 'Phone', 'Program', 'Previous Education', 'Marks', 'Message', 'Status', 'Date Applied'];
    
    const rows = dataToExport.map(app => {
      const name = (app.fullName || '').replace(/"/g, '""');
      const email = (app.email || '').replace(/"/g, '""');
      const phone = (app.phone || '').replace(/"/g, '""');
      const program = (app.program || '').replace(/"/g, '""');
      const prevEd = (app.previousEducation || '').replace(/"/g, '""');
      const marks = (app.marks || '').replace(/"/g, '""');
      const message = (app.message || '').replace(/"/g, '""');
      const status = (app.status || '').replace(/"/g, '""');
      const date = new Date(app.createdAt).toLocaleDateString();
      
      return `"${name}","${email}","${phone}","${program}","${prevEd}","${marks}","${message}","${status}","${date}"`;
    });
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    
    // Add BOM for Excel to properly read UTF-8 characters if any
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SET_Applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isAllSelected = applications.length > 0 && selectedIds.length === applications.length;

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Student Applications</h2>
          <p className="text-gray-500 text-sm mt-0.5">Manage new admissions</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {selectedIds.length > 0 && (
            <button 
              onClick={deleteSelected}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
            >
              <FiTrash2 size={16} /> Delete Selected ({selectedIds.length})
            </button>
          )}
          <button 
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#152d4a] transition-colors shadow-sm"
          >
            <FiDownload size={16} /> {selectedIds.length > 0 ? 'Export Selected' : 'Export All'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No applications found.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 w-10">
                  <input 
                    type="checkbox" 
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-[#1e3a5f] focus:ring-[#1e3a5f]"
                  />
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Applicant</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Program</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Details</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(app._id)}
                      onChange={() => toggleSelect(app._id)}
                      className="w-4 h-4 rounded text-[#1e3a5f] focus:ring-[#1e3a5f] cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-800">{app.fullName}</div>
                    <div className="text-xs text-gray-500">{app.email}</div>
                    <div className="text-xs text-gray-500">{app.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-medium">
                    {app.program}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs">
                      <span className="font-semibold">Prev:</span> {app.previousEducation}
                    </div>
                    <div className="text-xs">
                      <span className="font-semibold">Marks:</span> {app.marks}
                    </div>
                    {app.message && (
                      <div className="text-xs text-gray-500 mt-1 truncate max-w-[150px]" title={app.message}>
                        "{app.message}"
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app._id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded border outline-none ${
                        app.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        app.status === 'Reviewed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        app.status === 'Accepted' ? 'bg-green-50 text-green-700 border-green-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => deleteApplication(app._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <FiTrash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
