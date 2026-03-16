import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiCalendar, FiMapPin, FiArrowRight } from 'react-icons/fi';

const API = import.meta.env.VITE_API_URL || '/api';

export default function AllEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/events?limit=100`)
      .then(r => r.json())
      .then(data => { 
        if (Array.isArray(data)) setEvents(data); 
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="font-sans antialiased min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="pt-48 pb-12 bg-[#1e3a5f]">
        <div className="max-w-[1600px] mx-auto px-4 text-center">
          <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest mb-2">Campus Life</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">All Events & Happenings</h1>
          <p className="text-blue-200 text-base md:text-lg max-w-xl mx-auto">
            Discover all upcoming technical fests, workshops, and cultural celebrations at SET.
          </p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 py-16 flex-1 w-full">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Upcoming Events</h3>
            <p className="text-gray-500">There are no events scheduled at this moment. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((e) => (
              <div
                key={e._id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100 flex flex-col group"
              >
                <div className="relative h-48 overflow-hidden shrink-0">
                  <img
                    src={e.image}
                    alt={e.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-4 left-4 bg-white rounded-xl p-2 text-center min-w-[48px] shadow-md">
                    <div className="text-xl font-black text-[#1e3a5f] leading-none">{e.date?.day}</div>
                    <div className="text-[#1e3a5f] text-xs font-bold uppercase">{e.date?.month}</div>
                  </div>
                  <span className="absolute top-4 right-4 bg-[#1e3a5f] text-white text-xs font-bold px-3 py-1 rounded-full truncate max-w-[120px]">
                    {e.tag}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-[#1e3a5f] text-lg leading-tight mb-2 line-clamp-2">
                    {e.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium mb-3 truncate" title={e.location}>
                    <FiMapPin size={12} className="shrink-0" />
                    <span className="truncate">{e.location}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">{e.desc}</p>
                  <Link
                    to={`/events/${e._id}`}
                    className="inline-flex items-center gap-1.5 text-[#1e3a5f] hover:text-blue-800 font-semibold text-sm group/link transition-colors w-fit border-b-2 border-transparent hover:border-blue-800 pb-0.5"
                  >
                    View Details
                    <FiArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
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
