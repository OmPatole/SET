export default function AccreditationsSection() {
  const accreditations = [
    {
      badge: 'NAAC',
      title: "NAAC 'A+' Grade",
      detail: 'CGPA 3.52',
      desc: 'Accredited by the National Assessment and Accreditation Council with the highest grade.',
      color: 'from-blue-600 to-blue-800',
    },
    {
      badge: 'NBA',
      title: 'NBA Accredited',
      detail: '6 Programs',
      desc: 'National Board of Accreditation for six undergraduate engineering programs.',
      color: 'from-green-600 to-green-800',
    },
    {
      badge: 'UGC',
      title: 'UGC Recognized',
      detail: '2(f) & 12(B)',
      desc: 'Recognized under Section 2(f) and 12(B) of the University Grants Commission Act.',
      color: 'from-purple-600 to-purple-800',
    },
    {
      badge: 'AICTE',
      title: 'AICTE Approved',
      detail: 'All Programs',
      desc: 'All technical programs approved by the All India Council for Technical Education.',
      color: 'from-blue-500 to-blue-700',
    },
  ];

  const rankings = [
    { rank: '#45', scope: 'Maharashtra', desc: 'Among state public universities in NIRF 2025' },
    { rank: 'A+', scope: 'NAAC Grade', desc: 'Quality Assurance' },
    { rank: '50+', scope: 'NIRF Band', desc: 'National Ranking' },
    { rank: 'ISO', scope: '9001:2015', desc: 'Certified Institution' },
  ];

  return (
    <section id="accreditations" className="py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">
            Recognition & Excellence
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-primary">
            Rankings & Accreditations
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            Our accreditations reflect a steadfast commitment to academic quality,
            governance, and student success.
          </p>
        </div>

        {/* Accreditation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {accreditations.map((a) => (
            <div
              key={a.badge}
              className="rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100 group"
            >
              <div className={`bg-gradient-to-br ${a.color} px-6 py-8 text-white text-center`}>
                <div className="text-5xl font-black opacity-90">{a.badge}</div>
                <div className="text-sm font-medium mt-1 opacity-80">{a.detail}</div>
              </div>
              <div className="bg-white p-5">
                <h3 className="font-bold text-primary text-base mb-1">{a.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Rankings strip */}
        <div className="bg-primary rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {rankings.map((r) => (
              <div key={r.scope} className="border-r border-white/10 last:border-0">
                <div className="text-3xl md:text-4xl font-black text-white">{r.rank}</div>
                <div className="font-semibold mt-1">{r.scope}</div>
                <div className="text-white/60 text-sm mt-0.5">{r.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
