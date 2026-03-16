import { useState, useEffect } from 'react';
import { FiArrowRight, FiClock, FiUser } from 'react-icons/fi';

export default function NewsSection() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || '/api'}/news?limit=3`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setNews(data); })
      .catch(() => {});
  }, []);

  return (
    <section id="news" className="py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">
              News & Updates
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-primary">
              2026's Highlights
            </h2>
            <p className="mt-4 text-gray-500 max-w-lg">
              Stay updated with the latest achievements, announcements, and developments
              from SET, Shivaji University.
            </p>
          </div>
          <a
            href="#"
            className="shrink-0 flex items-center gap-2 text-primary font-semibold text-sm hover:text-primary transition-colors"
          >
            All News <FiArrowRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((n, i) => (
            <article
              key={n.title}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={n.image}
                  alt={n.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                  {n.tag}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-4 text-gray-400 text-xs mb-3">
                  <span className="flex items-center gap-1">
                    <FiUser size={11} />
                    {n.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiClock size={11} />
                    {n.read} Read
                  </span>
                  <span>{n.date}</span>
                </div>
                <h3 className="font-bold text-primary text-base leading-tight mb-2 line-clamp-2 group-hover:text-primary-dark transition-colors">
                  {n.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                  {n.excerpt}
                </p>
                <a
                  href={n.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-primary hover:text-primary-dark font-semibold text-sm group/link transition-colors"
                >
                  Read More / Download
                  <FiArrowRight
                    size={14}
                    className="group-hover/link:translate-x-1 transition-transform"
                  />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
