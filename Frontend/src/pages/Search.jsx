import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../admin/api/index.js'; // Assumed from somewhere, or we can just fetch if needed.

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState({ pages: [], news: [], notices: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    // Let's do a simple mock search by filtering our endpoints.
    // In a real app we would have a unified /api/search endpoint.
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL || '/api'}/pages`).then(r => r.json()).catch(() => []),
      fetch(`${import.meta.env.VITE_API_URL || '/api'}/news`).then(r => r.json()).catch(() => []),
      fetch(`${import.meta.env.VITE_API_URL || '/api'}/notices`).then(r => r.json()).catch(() => [])
    ]).then(([pages, news, notices]) => {
      const q = query.toLowerCase();
      setResults({
        pages: (Array.isArray(pages) ? pages : []).filter(p => p.title?.toLowerCase().includes(q) || p.content?.toLowerCase().includes(q)),
        news: (Array.isArray(news) ? news : []).filter(n => n.title?.toLowerCase().includes(q) || n.description?.toLowerCase().includes(q)),
        notices: (Array.isArray(notices) ? notices : []).filter(n => n.title?.toLowerCase().includes(q))
      });
      setLoading(false);
    });
  }, [query]);

  return (
    <div className="pt-48 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Results for "{query}"</h1>
        
        {loading ? (
          <div className="text-center py-10 text-gray-500 font-medium">Searching...</div>
        ) : (
          <div className="space-y-8">
            {(!results.pages.length && !results.news.length && !results.notices.length) ? (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
                No results found. Try a different search term.
              </div>
            ) : null}

            {results.pages.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-[#1e3a5f] mb-4 border-b pb-2">Pages</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y">
                  {results.pages.map(p => (
                    <Link key={p._id} to={`/pages/${p.slug}`} className="block p-4 hover:bg-gray-50 transition-colors">
                      <div className="font-semibold text-[#1e3a5f] text-lg">{p.title}</div>
                      <div className="text-sm text-gray-500 mt-1 line-clamp-2" dangerouslySetInnerHTML={{ __html: p.content }}></div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {results.news.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-[#1e3a5f] mb-4 border-b pb-2">News & Updates</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y">
                  {results.news.map(n => (
                    <a 
                      key={n._id} 
                      href="/#news" 
                      onClick={(e) => {
                        if (window.location.pathname !== '/') {
                          window.location.href = '/#news';
                        }
                      }}
                      className="block p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-semibold text-[#1e3a5f] text-lg">{n.title}</div>
                      <div className="text-sm text-gray-500 mt-1">{n.description}</div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {results.notices.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-[#1e3a5f] mb-4 border-b pb-2">Notices</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y">
                  {results.notices.map(n => {
                    const isAttachment = !!(n.fileUrl || n.attachmentUrl);
                    const linkUrl = isAttachment ? (n.fileUrl || n.attachmentUrl) : '/#noticeboard';
                    
                    return (
                      <a 
                        key={n._id} 
                        href={linkUrl}
                        target={isAttachment ? '_blank' : '_self'}
                        rel={isAttachment ? 'noopener noreferrer' : ''}
                        onClick={(e) => {
                          if (!isAttachment && window.location.pathname !== '/') {
                            window.location.href = '/#noticeboard';
                          }
                        }}
                        className="block p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-semibold text-[#1e3a5f] text-lg">{n.title}</div>
                        {isAttachment && <span className="text-sm text-primary hover:underline mt-1 inline-block">View Attachment</span>}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
