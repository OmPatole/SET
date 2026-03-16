import { useState, useEffect } from 'react';
import { FiArrowRight, FiUsers, FiClock } from 'react-icons/fi';

const API = import.meta.env.VITE_API_URL || '/api';

const tabs = ['All', 'B.Tech', 'M.Tech', 'PhD'];

export default function DepartmentsSection() {
  const [activeTab, setActiveTab] = useState('All');
  const [hovered, setHovered] = useState(null);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetch(`${API}/departments`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setDepartments(d); })
      .catch(() => {});
  }, []);

  const filtered =
    activeTab === 'All' ? departments : departments.filter((d) => d.type === activeTab);

  return (
    <section id="departments" className="py-20 bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">
            Our Programs
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-primary">
            Academic Programs for Every Ambition
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            World-class undergraduate and postgraduate programs designed to produce
            industry-ready engineers and researchers.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dept) => (
            <div
              key={dept._id || dept.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 group cursor-pointer"
              onMouseEnter={() => setHovered(dept._id || dept.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={dept.image}
                  alt={dept.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span
                  className={`absolute top-3 left-3 ${dept.color} text-white text-xs font-bold px-3 py-1 rounded-full`}
                >
                  {dept.type}
                </span>
              </div>

              {/* Body */}
              <div className="p-5">
                <h3 className="font-bold text-primary text-base leading-tight mb-2">
                  {dept.name}
                </h3>
                <div className="flex items-center gap-4 text-gray-400 text-xs mb-3">
                  <span className="flex items-center gap-1">
                    <FiClock size={12} />
                    {dept.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiUsers size={12} />
                    Intake: {dept.intake}
                  </span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                  {dept.desc}
                </p>
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {dept.tags.map((tag) => (
                    <span key={tag} className="bg-primary/5 text-primary text-xs px-2.5 py-1 rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href="#"
                  className="flex items-center gap-2 text-primary hover:text-primary-dark text-sm font-semibold group/link transition-colors"
                >
                  Explore Department
                  <FiArrowRight
                    size={14}
                    className="group-hover/link:translate-x-1 transition-transform"
                  />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-white transition-all"
          >
            View All Programs <FiArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
