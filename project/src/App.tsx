import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ReservationsPage from './pages/ReservationsPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatbotWidget from './components/ChatbotWidget';
import ScrollToTop from './utils/ScrollToTop';
import { ChatbotProvider } from './context/ChatbotContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
      <Router>
        <AuthProvider>
          <ChatbotProvider>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen bg-neutral-50">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/reservations" element={<ReservationsPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Routes>
              </main>
              <ChatbotWidget />
              <Footer />
              <Toaster position="top-center" />
            </div>
          </ChatbotProvider>
        </AuthProvider>
      </Router>
  );
}

export default App;