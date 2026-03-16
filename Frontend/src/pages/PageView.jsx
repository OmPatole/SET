import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const API = import.meta.env.VITE_API_URL || '/api';

export default function PageView() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [sidebarPages, setSidebarPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetch(`${API}/pages/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error('not found');
        return r.json();
      })
      .then(data => {
        setPage(data);
        return fetch(`${API}/pages/section/${data.section}`);
      })
      .then(r => r.json())
      .then(list => setSidebarPages(list))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="font-sans antialiased min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notFound ? (
          <div className="flex flex-col items-center justify-center py-32 text-center px-4">
            <div className="text-6xl font-bold text-gray-200 mb-4">404</div>
            <h1 className="text-2xl font-bold text-gray-700 mb-2">Page Not Found</h1>
            <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
            <Link to="/" className="px-6 py-2.5 bg-teal-600 text-white rounded-full font-semibold hover:bg-teal-700 transition-colors">
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            {/* Breadcrumb banner */}
            <div className="pt-48 bg-[#1e3a5f] text-white py-10 px-4">
              <div className="max-w-[1600px] mx-auto">
                <nav className="text-xs text-white/60 mb-2 flex items-center gap-1.5">
                  <Link to="/" className="hover:text-white transition-colors">Home</Link>
                  <span>›</span>
                  <span className="text-white/80">{page.sectionLabel || page.section}</span>
                  <span>›</span>
                  <span className="text-white">{page.title}</span>
                </nav>
                <h1 className="text-2xl md:text-3xl font-bold">{page.title}</h1>
              </div>
            </div>

            {/* Body: sidebar + content */}
            <div className="max-w-[1600px] mx-auto px-4 py-10">
              <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Left sidebar */}
                <aside className="w-full lg:w-64 shrink-0">
                  <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 sticky top-24">
                    <div className="bg-[#1e3a5f] px-5 py-4">
                      <h2 className="text-white font-bold text-sm uppercase tracking-widest">
                        {page.sectionLabel || page.section}
                      </h2>
                    </div>
                    <nav className="bg-white py-2">
                      {sidebarPages.map(p => (
                        <Link
                          key={p.slug}
                          to={`/pages/${p.slug}`}
                          className={`flex items-center gap-2.5 px-5 py-3 text-sm transition-colors border-l-4 ${
                            p.slug === slug
                              ? 'border-[#1e3a5f] bg-blue-50 text-[#1e3a5f] font-semibold'
                              : 'border-transparent text-gray-600 hover:text-[#1e3a5f] hover:bg-blue-50 hover:border-blue-300'
                          }`}
                        >
                          <span className={`text-xs ${p.slug === slug ? 'text-[#1e3a5f]' : 'text-blue-300'}`}>›</span>
                          {p.title}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </aside>

                {/* Content area */}
                <article className="flex-1 min-w-0">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a5f] italic mb-6 border-b border-gray-100 pb-4">
                      {page.title}
                    </h2>
                    {page.content ? (
                      <div
                        className="page-content"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                      />
                    ) : (
                      <p className="text-gray-400 italic">No content available for this page yet.</p>
                    )}
                  </div>
                </article>

              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
