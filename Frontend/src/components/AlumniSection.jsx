import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiLinkedin, FiBriefcase } from 'react-icons/fi';

const API = import.meta.env.VITE_API_URL || '/api';

export default function AlumniSection() {
  const [alumni, setAlumni] = useState([]);

  useEffect(() => {
    fetch(`${API}/alumni`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setAlumni(d); })
      .catch(() => {});
  }, []);

  return (
    <section id="alumni" className="py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">
              Notable Alumni
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-primary">
              Our Proud Alumni
            </h2>
            <p className="mt-4 text-gray-500 max-w-lg">
              Our graduates lead organizations and drive innovation across industries worldwide.
            </p>
          </div>
          <Link
            to="/alumni-portal"
            className="shrink-0 px-6 py-2.5 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-white transition-all text-sm"
          >
            Alumni Portal
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {alumni.map((a) => (
            <div
              key={a._id || a.name}
              className="group text-center cursor-pointer"
            >
              <div className="relative mx-auto w-24 h-24 rounded-2xl overflow-hidden mb-3 shadow group-hover:shadow-lg transition-all group-hover:-translate-y-1">
                <img
                  src={a.image}
                  alt={a.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <FiLinkedin size={20} className="text-white" />
                </div>
              </div>
              <h3 className="font-bold text-primary text-sm leading-tight">{a.name}</h3>
              {a.company && (
                <div className="flex items-center justify-center gap-1 text-gray-700 font-semibold text-xs mt-1 leading-tight">
                  <FiBriefcase size={10} /> {a.company}
                </div>
              )}
              <p className="text-gray-500 text-xs mt-0.5 leading-tight">{a.role}</p>
              <span className="inline-block mt-1.5 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                {a.batch}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
