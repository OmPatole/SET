import { useState, useEffect } from 'react';
import { FiLinkedin, FiBriefcase, FiAward } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API = import.meta.env.VITE_API_URL || '/api';

export default function AlumniPortal() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/alumni`)
      .then(r => r.json())
      .then(d => { 
        if (Array.isArray(d)) setAlumni(d); 
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="font-sans antialiased min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="pt-48 pb-12 bg-[#1e3a5f]">
        <div className="max-w-[1600px] mx-auto px-4 text-center">
          <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest mb-2">Our Legacy</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">Alumni Portal</h1>
          <p className="text-blue-200 text-base md:text-lg max-w-xl mx-auto">
            Our graduates lead organizations and drive innovation across industries worldwide. Discover our notable alumni.
          </p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 py-16 flex-1 w-full">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading alumni records...</div>
        ) : alumni.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Alumni Found</h3>
            <p className="text-gray-500">No alumni records have been published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {alumni.map((a) => (
              <div
                key={a._id || a.name}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group text-center flex flex-col"
              >
                <div className="relative mx-auto w-32 h-32 rounded-3xl overflow-hidden mb-5 border-4 border-gray-50 shadow-inner group-hover:border-[#1e3a5f]/10 transition-colors">
                  {a.image ? (
                    <img
                      src={a.image}
                      alt={a.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1e3a5f] flex items-center justify-center text-white text-4xl font-bold">
                      {a.name.charAt(0)}
                    </div>
                  )}
                  {a.linkedin && (
                    <a 
                      href={a.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-[#1e3a5f]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
                    >
                      <FiLinkedin size={28} className="text-white drop-shadow-md" />
                    </a>
                  )}
                </div>
                
                <h3 className="font-extrabold text-[#1e3a5f] text-xl mb-1">{a.name}</h3>
                
                {a.company && (
                  <div className="flex items-center justify-center gap-1.5 text-gray-800 font-semibold mb-1">
                    <FiBriefcase size={14} className="text-[#1e3a5f]" />
                    {a.company}
                  </div>
                )}
                
                {a.role && (
                  <p className="text-gray-500 text-sm mb-4 leading-tight">
                    {a.role}
                  </p>
                )}
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-center">
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#1e3a5f] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    <FiAward size={14} /> Batch {a.batch || 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
