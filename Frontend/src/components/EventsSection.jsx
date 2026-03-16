import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiArrowRight } from 'react-icons/fi';

export default function EventsSection() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || '/api'}/events?limit=3`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setEvents(data); })
      .catch(() => {});
  }, []);

  return (
    <section id="events" className="py-20 bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">
              Events & Happenings
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-primary">
              Experience Holistic Learning
            </h2>
            <p className="mt-4 text-gray-500 max-w-lg">
              From technical fests and international conferences to cultural celebrations —
              life at SET is always vibrant.
            </p>
          </div>
          <Link
            to="/events"
            className="shrink-0 flex items-center gap-2 text-primary font-semibold text-sm hover:text-primary-dark transition-colors"
          >
            All Events <FiArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((e) => (
            <div
              key={e.title}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100 group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={e.image}
                  alt={e.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {/* Date badge */}
                <div className="absolute top-4 left-4 bg-white rounded-xl p-2 text-center min-w-[48px] shadow-md">
                  <div className="text-xl font-black text-primary leading-none">{e.date.day}</div>
                  <div className="text-primary text-xs font-bold uppercase">{e.date.month}</div>
                </div>
                {/* Tag */}
                <span className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                  {e.tag}
                </span>
              </div>
              {/* Body */}
              <div className="p-5">
                <h3 className="font-bold text-primary text-base leading-tight mb-2 line-clamp-2">
                  {e.title}
                </h3>
                <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
                  <FiMapPin size={12} />
                  {e.location}
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{e.desc}</p>
                <Link
                  to={`/events/${e._id}`}
                  className="flex items-center gap-1.5 text-primary hover:text-primary-dark font-semibold text-sm group/link transition-colors"
                >
                  Learn More
                  <FiArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
