import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <div className="font-sans antialiased min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center pt-48 pb-32 px-4 text-center bg-gray-50 relative z-0">
        <h1 className="text-9xl font-extrabold text-gray-200">404</h1>
        <h2 className="text-3xl font-bold text-[#1e3a5f] mt-4 mb-2">Page Not Found</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          to="/" 
          className="bg-[#1e3a5f] text-white px-8 py-3 rounded-xl font-medium shadow-md hover:-translate-y-0.5 transition-all hover:bg-[#152d4a]"
        >
          Return Home
        </Link>
      </div>

      <Footer />
    </div>
  );
}
