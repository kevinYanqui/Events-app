import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Servicios', path: '/#services' },
    { name: 'Reservaciones', path: '/reservations' },
    { name: 'Contacto', path: '/#contact' },
  ];

  const navbarClasses = `fixed w-full z-30 transition-all duration-300 ${
    scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
  }`;

  const linkClasses = `text-sm font-medium transition duration-200 hover:text-gold-600 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gold-600 after:origin-center after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100`;

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-2xl text-blue-900">
              ECLEA
              <span className="text-gold-600">EVENTS</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`${linkClasses} ${
                    location.pathname === link.path || 
                    (location.pathname === '/' && link.path.startsWith('/#'))
                      ? 'text-gold-600 after:scale-x-100'
                      : scrolled ? 'text-blue-900' : 'text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'ADMIN' && (
                  <Link
                    to="/dashboard"
                    className="text-sm font-medium px-4 py-2 rounded-full bg-blue-900 text-white hover:bg-blue-800 transition duration-200"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="flex items-center text-sm font-medium text-blue-900 hover:text-gold-600"
                >
                  <LogOut size={16} className="mr-1" />
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium px-4 py-2 rounded-full bg-blue-900 text-white hover:bg-blue-800 transition duration-200"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Mobile Navigation Toggle */}
          <button
            className="lg:hidden text-blue-900"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-white shadow-md transition-transform duration-300 transform ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-blue-900 py-2 ${
                location.pathname === link.path ? 'font-bold' : 'font-medium'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <Link
                  to="/dashboard"
                  className="py-2 px-4 bg-blue-900 text-white rounded-md font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex items-center py-2 text-blue-900 font-medium"
              >
                <LogOut size={16} className="mr-2" />
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="py-2 px-4 bg-blue-900 text-white rounded-md font-medium"
              onClick={() => setIsOpen(false)}
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;