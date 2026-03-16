import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsOfUse() {
  return (
    <div className="font-sans antialiased bg-gray-50 min-h-screen">
      <Navbar />
      
      <div className="pt-48 pb-20 max-w-4xl mx-auto px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#1e3a5f] mb-8">Terms of Use</h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6 text-gray-700">
          <p className="text-sm text-gray-500">Last Updated: March 2026</p>
          
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and utilizing the School of Engineering & Technology website and portals, you accept and agree to be bound by the terms and provisions of this agreement.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Purpose of the Platform</h2>
            <p>This website serves to provide academic information, admission processing, and student resource management. Any unauthorized use of our platforms to distribute spam, malware, or illicit materials will result in an immediate ban and potential disciplinary action.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. User Accounts</h2>
            <p>Students and staff provided with login credentials are responsible for maintaining the confidentiality of their passwords. Any actions taken from your account are assumed to have been performed by you.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Intellectual Property</h2>
            <p>All content published on this website (logos, notices, academic resources) remains the intellectual property of the School of Engineering & Technology, Shivaji University unless explicitly stated otherwise.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Changes to the Terms</h2>
            <p>We reserve the right to modify these terms at any time. Your continued use of the platform after any changes indicates your acceptance of the newly revised terms.</p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
