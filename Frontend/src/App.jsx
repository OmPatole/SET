import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './admin/context/AuthContext.jsx';
import ProtectedRoute from './admin/components/ProtectedRoute.jsx';

// Public site components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsSection from './components/StatsSection';
import AccreditationsSection from './components/AccreditationsSection';
import FacilitiesSection from './components/FacilitiesSection';
import DepartmentsSection from './components/DepartmentsSection';
import WhyChooseUs from './components/WhyChooseUs';
import AlumniSection from './components/AlumniSection';
import EventsSection from './components/EventsSection';
import NewsSection from './components/NewsSection';
import VirtualTour from './components/VirtualTour';
import Footer from './components/Footer';
import StudentPortal from './pages/StudentPortal.jsx';
import PageView from './pages/PageView.jsx';
import Search from './pages/Search.jsx';
import ApplyNow from './pages/ApplyNow.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsOfUse from './pages/TermsOfUse.jsx';
import NotFound from './pages/NotFound.jsx';
import EventDetails from './pages/EventDetails.jsx';
import AllEvents from './pages/AllEvents.jsx';
import AlumniPortal from './pages/AlumniPortal.jsx';

// Admin pages
import Login from './admin/pages/Login.jsx';
import Dashboard from './admin/pages/Dashboard.jsx';
import NavbarEditor from './admin/pages/NavbarEditor.jsx';
import HeroEditor from './admin/pages/HeroEditor.jsx';
import StatsEditor from './admin/pages/StatsEditor.jsx';
import DepartmentsEditor from './admin/pages/DepartmentsEditor.jsx';
import NewsEditor from './admin/pages/NewsEditor.jsx';
import EventsEditor from './admin/pages/EventsEditor.jsx';
import FacilitiesEditor from './admin/pages/FacilitiesEditor.jsx';
import AlumniEditor from './admin/pages/AlumniEditor.jsx';
import NoticeboardEditor from './admin/pages/NoticeboardEditor.jsx';
import SettingsEditor from './admin/pages/SettingsEditor.jsx';
import PagesEditor from './admin/pages/PagesEditor.jsx';
import MediaLibrary from './admin/pages/MediaLibrary.jsx';
import ApplicationsEditor from './admin/pages/ApplicationsEditor.jsx';
import FooterEditor from './admin/pages/FooterEditor.jsx';

function MainSite() {
  return (
    <div className="font-sans antialiased">
      <Navbar />
      <main>
        <Hero />
        <StatsSection />
        <AccreditationsSection />
        <FacilitiesSection />
        <DepartmentsSection />
        <WhyChooseUs />
        <AlumniSection />
        <EventsSection />
        <NewsSection />
        <VirtualTour />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/student-portal" element={<StudentPortal />} />
        <Route path="/pages/:slug" element={<PageView />} />
        <Route path="/search" element={<><Navbar /><Search /><Footer /></>} />
        <Route path="/apply-now" element={<><Navbar /><ApplyNow /><Footer /></>} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/events" element={<AllEvents />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/alumni-portal" element={<AlumniPortal />} />
        <Route path="*" element={<NotFound />} />
        
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/navbar" element={<ProtectedRoute><NavbarEditor /></ProtectedRoute>} />
        <Route path="/admin/hero" element={<ProtectedRoute><HeroEditor /></ProtectedRoute>} />
        <Route path="/admin/stats" element={<ProtectedRoute><StatsEditor /></ProtectedRoute>} />
        <Route path="/admin/departments" element={<ProtectedRoute><DepartmentsEditor /></ProtectedRoute>} />
        <Route path="/admin/news" element={<ProtectedRoute><NewsEditor /></ProtectedRoute>} />
        <Route path="/admin/events" element={<ProtectedRoute><EventsEditor /></ProtectedRoute>} />
        <Route path="/admin/facilities" element={<ProtectedRoute><FacilitiesEditor /></ProtectedRoute>} />
        <Route path="/admin/alumni" element={<ProtectedRoute><AlumniEditor /></ProtectedRoute>} />
        <Route path="/admin/notices" element={<ProtectedRoute><NoticeboardEditor /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><SettingsEditor /></ProtectedRoute>} />
        <Route path="/admin/pages" element={<ProtectedRoute><PagesEditor /></ProtectedRoute>} />
        <Route path="/admin/footer" element={<ProtectedRoute><FooterEditor /></ProtectedRoute>} />
        <Route path="/admin/media" element={<ProtectedRoute><MediaLibrary /></ProtectedRoute>} />
        <Route path="/admin/applications" element={<ProtectedRoute><ApplicationsEditor /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
