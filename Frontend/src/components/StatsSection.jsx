import { useState, useEffect, useRef } from 'react';
import { FiUsers, FiAward, FiBook, FiTrendingUp, FiGlobe, FiBriefcase, FiBarChart2 } from 'react-icons/fi';

const API = import.meta.env.VITE_API_URL || '/api';

const ICON_MAP = { FiUsers, FiAward, FiBook, FiTrendingUp, FiGlobe, FiBriefcase, FiBarChart2 };

function Counter({ value, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 2000;
          const step = Math.ceil(value / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-3xl xl:text-4xl font-bold text-primary truncate" title={`${count.toLocaleString()}${suffix}`}>
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export default function StatsSection() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetch(`${API}/stats`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setStats(d); })
      .catch(() => {});
  }, []);

  return (
    <section id="stats" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">
            SET at a Glance
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-primary leading-tight">
            Numbers That Reflect Our{' '}
            <span className="text-primary">Legacy of Excellence</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            A tradition of academic excellence, research innovation, and holistic development
            spanning four decades.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat) => {
            const Icon = (typeof stat.icon === 'string' ? ICON_MAP[stat.icon] : stat.icon) || FiBarChart2;
            const { value, suffix, label, sublabel } = stat;
            return (
            <div
              key={label}
              className="group bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md border border-gray-100 hover:border-primary/30 transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-colors">
                <Icon size={22} className="text-primary" />
              </div>
              <Counter value={Number(value)} suffix={suffix} />
              <div className="mt-2 font-semibold text-gray-800 text-sm">{label}</div>
              <div className="text-gray-400 text-xs mt-0.5">{sublabel}</div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
