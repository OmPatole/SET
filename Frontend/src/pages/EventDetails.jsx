import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiCalendar, FiMapPin, FiArrowLeft, FiTag } from 'react-icons/fi';

const API = import.meta.env.VITE_API_URL || '/api';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API}/events/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Event not found');
        return res.json();
      })
      .then(data => {
        setEvent(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="font-sans antialiased min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-48 pb-20 max-w-4xl mx-auto px-4 text-center">
          <div className="w-8 h-8 mx-auto border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="font-sans antialiased min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="pt-48 pb-20 max-w-4xl mx-auto px-4 text-center flex-1">
          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">Event Not Found</h2>
          <p className="text-gray-500 mb-8">The event you are looking for does not exist or has been removed.</p>
          <Link to="/" className="inline-flex items-center gap-2 text-[#1e3a5f] font-semibold hover:underline">
            <FiArrowLeft /> Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-sans antialiased min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Banner with Image */}
      <div className="pt-24 bg-[#1e3a5f] relative">
        <div className="w-full h-[40vh] md:h-[50vh] relative">
          <div className="absolute inset-0 bg-black/50 z-10" />
          {event.image && (
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 z-20 pb-12 pt-16 bg-gradient-to-t from-[#1e3a5f] to-transparent">
          <div className="max-w-5xl mx-auto px-4 text-white">
            <Link to="/#events" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-4 transition-colors">
              <FiArrowLeft /> Back to Events
            </Link>
            <div className="flex flex-wrap gap-2 items-center mb-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-sm border border-white/30 truncate max-w-xs">{event.tag}</span>
              {event.date?.day && (
                 <span className="flex items-center gap-1.5 text-sm text-white/90 bg-black/20 px-3 py-1 rounded-full"><FiCalendar size={14} />{event.date.day} {event.date.month}</span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4 max-w-4xl">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 font-medium">
              <span className="flex items-center gap-1.5"><FiMapPin size={16} /> {event.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6 border-b border-gray-100 pb-4">Event Information</h2>
          <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap">
            {event.desc}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
