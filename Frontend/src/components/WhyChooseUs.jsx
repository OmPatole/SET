import { useState } from 'react';

const reasons = [
  {
    num: '01',
    title: 'Academic Excellence',
    body: "SET consistently ranks among Maharashtra's top engineering institutions, recognized for academic rigor, research output, and industry-relevant curriculum designed in collaboration with leading companies.",
  },
  {
    num: '02',
    title: 'Expert Faculty',
    body: 'Learn from highly qualified faculty — PhDs, industry veterans, and researchers — who bring real-world experience into the classroom with personalized mentoring and guidance.',
  },
  {
    num: '03',
    title: 'Industry Connections',
    body: 'Over 50 active MoUs with top companies ensure internships, live projects, guest lectures, and strong placement support from Day 1 of your engineering journey.',
  },
  {
    num: '04',
    title: 'Holistic Development',
    body: 'Beyond academics, we nurture leadership, communication, and entrepreneurship through cultural events, sports, clubs, hackathons, and the E-Cell — creating well-rounded professionals.',
  },
];

export default function WhyChooseUs() {
  const [active, setActive] = useState(0);

  return (
    <section id="research" className="py-20 bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="lg:grid lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <div className="relative mb-10 lg:mb-0">
            <div className="rounded-3xl overflow-hidden h-80 lg:h-[440px] shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=75"
                alt="Campus"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -right-4 lg:-right-8 bg-primary text-white rounded-2xl p-5 shadow-xl max-w-xs">
              <div className="text-3xl font-black text-white">40+</div>
              <div className="font-semibold mt-0.5">Years of Excellence</div>
              <div className="text-white/70 text-sm mt-1">Proudly Serving Since 1983</div>
            </div>
            {/* Badge */}
            <div className="absolute -top-4 -left-4 lg:-left-8 bg-primary text-white rounded-2xl p-4 shadow-xl text-center">
              <div className="text-2xl font-black">NAAC</div>
              <div className="text-xs font-bold mt-0.5">A+ Grade</div>
            </div>
          </div>

          {/* Content side */}
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">
              Why Choose Us
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-primary leading-tight">
              Legacy of Excellence &amp;{' '}
              <span className="text-primary">Proven Success</span>
            </h2>
            <p className="mt-4 text-gray-500 leading-relaxed mb-8">
              School of Engineering & Technology, Shivaji University has been shaping
              engineers and innovators for over four decades. We combine academic rigour
              with real-world relevance.
            </p>

            <div className="space-y-4">
              {reasons.map((r, i) => (
                <div
                  key={r.num}
                  onClick={() => setActive(i)}
                  className={`rounded-xl p-5 cursor-pointer transition-all border ${
                    active === i
                      ? 'bg-primary text-white border-primary shadow-lg'
                      : 'bg-white text-gray-700 border-gray-100 hover:border-primary/30 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`text-2xl font-black shrink-0 ${
                        active === i ? 'text-white' : 'text-primary/20'
                      }`}
                    >
                      {r.num}
                    </span>
                    <div>
                      <h3 className={`font-bold text-base mb-1 ${active === i ? 'text-white' : 'text-primary'}`}>
                        {r.title}
                      </h3>
                      {active === i && (
                        <p className="text-white/80 text-sm leading-relaxed">{r.body}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
