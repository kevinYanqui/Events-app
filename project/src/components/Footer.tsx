import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Send } from 'lucide-react';

const Footer = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Servicom Eclea SRL</h3>
            <p className="text-gray-300 mb-4">
              Servicios excepcionales de planificación de eventos en Arequipa
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/hashtag/eclea"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold-500 transition-colors"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://www.instagram.com/hashtag/eclea"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold-500 transition-colors"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-gold-500 transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/#services"
                  className="text-gray-300 hover:text-gold-500 transition-colors"
                >
                  Servicios
                </Link>
              </li>
              <li>
                <Link
                  to="/reservations"
                  className="text-gray-300 hover:text-gold-500 transition-colors"
                >
                  Reservaciones
                </Link>
              </li>
              <li>
                <Link
                  to="/#contact"
                  className="text-gray-300 hover:text-gold-500 transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="mr-2 mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-300">
                  Calle 13 de Junio 108, Urb. Los Olivos, José Luis Bustamante y Rivero, Arequipa
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 flex-shrink-0" size={18} />
                <a
                  href="tel:+51054123456"
                  className="text-gray-300 hover:text-gold-500 transition-colors"
                >
                  +51 054 123 456
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 flex-shrink-0" size={18} />
                <a
                  href="mailto:contacto@eclea.pe"
                  className="text-gray-300 hover:text-gold-500 transition-colors"
                >
                  contacto@eclea.pe
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contáctanos</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="w-full px-3 py-2 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                  required
                />
              </div>
              <div>
                <textarea
                  placeholder="Mensaje"
                  rows={3}
                  className="w-full px-3 py-2 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-gold-600 text-white rounded-md hover:bg-gold-700 transition-colors"
              >
                Enviar <Send size={16} className="ml-2" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Servicom Eclea SRL. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;