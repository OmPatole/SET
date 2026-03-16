import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="font-sans antialiased bg-gray-50 min-h-screen">
      <Navbar />
      
      <div className="pt-48 pb-20 max-w-4xl mx-auto px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#1e3a5f] mb-8">Privacy Policy</h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6 text-gray-700">
          <p className="text-sm text-gray-500">Last Updated: March 2026</p>
          
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
            <p>We collect information that you manually provide us (like your name, email, and contact details) when you apply for admission, use our contact forms, or register for the student portal. We also automatically collect some technical data involving your browser and IP address for security logs and website optimization.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <p>Your information is primarily used to process admission requests, communicate time-sensitive alerts (like exam schedules), and improve our website's user experience. We do not sell your personal data to any third-party advertisers.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Data Security</h2>
            <p>We deploy standard security measures to shield your data from unauthorized access. Our student databases are heavily encrypted and strictly accessible only to authorized administrative personnel.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Cookies</h2>
            <p>We use local cookies to remember your session preferences and ensure you remain logged in during your visit to the Student Portal. You can always clear cookies from your browser settings.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Contact Us</h2>
            <p>If you have any questions or concerns regarding this policy, please email us directly at the contact address provided on our site's footer.</p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
