import { FiExternalLink } from 'react-icons/fi';

export default function VirtualTour() {
  return (
    <section id="tour" className="relative py-28 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=70)',
        }}
      />
      <div className="absolute inset-0 bg-primary/80" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center text-white">
        <span className="inline-block bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
          Virtual Experience
        </span>
        <h2 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">
          Experience Our Campus
          <br />
          <span className="text-white">In 360° Virtual Tour</span>
        </h2>
        <p className="text-white/75 text-lg mb-9 max-w-xl mx-auto leading-relaxed">
          Take an immersive virtual tour of our campus from anywhere in the world.
          Explore state-of-the-art classrooms, labs, library, sports complex, and vibrant campus life.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-full transition-all shadow-xl hover:bg-blue-50 hover:-translate-y-0.5"
          >
            <FiExternalLink size={18} />
            Start Virtual Tour
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur border border-white/30 text-white font-bold rounded-full hover:bg-white/20 transition-all"
          >
            Download Brochure
          </a>
        </div>
      </div>
    </section>
  );
}
