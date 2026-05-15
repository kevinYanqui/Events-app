import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, MessageCircle, BarChart3, Check, ArrowRight, MapPin, Phone, Mail, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';

// --- Carrusel de Imágenes ---
const slides = [
  {
    image: "https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Bodas de Ensueño",
    subtitle: "Creamos el ambiente perfecto para tu día más especial."
  },
  {
    image: "https://images.pexels.com/photos/2399097/pexels-photo-2399097.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Eventos Corporativos Exitosos",
    subtitle: "Profesionalismo y elegancia para tus reuniones de negocio."
  },
  {
    image: "https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Cumpleaños Inolvidables",
    subtitle: "Celebra la vida con fiestas temáticas y personalizadas."
  }
];

const HomePage = () => {
  const servicesRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const location = useLocation();

  // Lógica para el carrusel
  const prevSlide = () => setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  const nextSlide = () => setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);

  useEffect(() => {
    // Auto-scroll para el carrusel
    const slideInterval = setInterval(nextSlide, 5000); // Cambia cada 5 segundos
    return () => clearInterval(slideInterval);
  }, [currentSlide]);

  useEffect(() => {
    // Lógica para los anclajes #services y #contact
    if (window.location.hash === '#services' && servicesRef.current) {
      servicesRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (window.location.hash === '#contact' && contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const { hash } = location;
    if (hash === '#services' && servicesRef.current) {
      servicesRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (hash === '#contact' && contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  return (
      <div className="w-full">
        {/* --- INICIO DEL CARRUSEL --- */}
        <section className="relative h-screen w-full overflow-hidden">
          {slides.map((slide, index) => (
              <div
                  key={index}
                  className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              >
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-900/40" />
              </div>
          ))}

          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div className="container mx-auto px-4 relative z-20">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
                  {slides[currentSlide].title}
                </h1>
                <p className="text-xl text-white/90 mb-8 max-w-xl mx-auto animate-fade-in-delayed">
                  {slides[currentSlide].subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delayed-more">
                  <Link to="/reservations" className="px-8 py-3 bg-gold-600 text-white font-medium rounded-full hover:bg-gold-700 transition duration-300 transform hover:scale-105 shadow-lg text-center">
                    Reserva ahora
                  </Link>
                  <a href="#services" className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-full hover:bg-white/10 transition duration-300 text-center">
                    Conoce nuestros servicios
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de Navegación del Carrusel */}
          <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/30 rounded-full text-white hover:bg-black/50">
            <ChevronLeft size={28} />
          </button>
          <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/30 rounded-full text-white hover:bg-black/50">
            <ChevronRightIcon size={28} />
          </button>
        </section>
        {/* --- FIN DEL CARRUSEL --- */}

        {/* Features Section */}
        <section className="py-20 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                ¿Por qué elegirnos?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Nuestro sistema digital facilita todo el proceso de planificación de tu evento, brindándote herramientas para una experiencia sin complicaciones.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
                <div className="rounded-full bg-gold-100 p-3 w-fit mb-6">
                  <Calendar className="text-gold-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">Reservas en línea</h3>
                <p className="text-gray-600 mb-4">
                  Elige la fecha, el mobiliario y la cantidad que necesitas de manera fácil y rápida, con confirmación instantánea.
                </p>
                <Link
                    to="/reservations"
                    className="text-gold-600 font-medium flex items-center hover:text-gold-700 transition"
                >
                  Reserva ahora <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
                <div className="rounded-full bg-gold-100 p-3 w-fit mb-6">
                  <MessageCircle className="text-gold-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">Asistente virtual</h3>
                <p className="text-gray-600 mb-4">
                  Resuelve todas tus dudas al instante con nuestro asistente virtual disponible todos los días, a cualquier hora.
                </p>
                <button
                    className="text-gold-600 font-medium flex items-center hover:text-gold-700 transition"
                    onClick={() => window.dispatchEvent(new CustomEvent('openChatbot'))}
                >
                  Iniciar chat <ArrowRight size={16} className="ml-1" />
                </button>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
                <div className="rounded-full bg-gold-100 p-3 w-fit mb-6">
                  <BarChart3 className="text-gold-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">Inventario en tiempo real</h3>
                <p className="text-gray-600 mb-4">
                  Consulta la disponibilidad actual de nuestro mobiliario y servicios. Sin sorpresas ni contratiempos de último momento.
                </p>
                <Link
                    to="/reservations"
                    className="text-gold-600 font-medium flex items-center hover:text-gold-700 transition"
                >
                  Ver disponibilidad <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section ref={servicesRef} id="services" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                Nuestros Servicios
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Ofrecemos soluciones completas para todo tipo de eventos, desde íntimas reuniones familiares hasta grandes celebraciones corporativas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative rounded-2xl overflow-hidden group">
                <img
                    src="https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Bodas y celebraciones"
                    className="w-full h-80 object-cover transition duration-500 transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-blue-900/30 flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Bodas y Celebraciones</h3>
                  <p className="text-white/90 mb-4">
                    Hacemos realidad la boda de tus sueños con un mobiliario elegante y una decoración perfecta para tu día especial.
                  </p>
                  <Link
                      to="/reservations"
                      className="px-6 py-2 bg-gold-600 text-white font-medium rounded-full w-fit hover:bg-gold-700 transition duration-300"
                  >
                    Reservar
                  </Link>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden group">
                <img
                    src="https://images.pexels.com/photos/2399097/pexels-photo-2399097.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Eventos corporativos"
                    className="w-full h-80 object-cover transition duration-500 transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-blue-900/30 flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Eventos Corporativos</h3>
                  <p className="text-white/90 mb-4">
                    Convenciones, lanzamientos de productos o reuniones empresariales con un ambiente profesional y de primera categoría.
                  </p>
                  <Link
                      to="/reservations"
                      className="px-6 py-2 bg-gold-600 text-white font-medium rounded-full w-fit hover:bg-gold-700 transition duration-300"
                  >
                    Reservar
                  </Link>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden group">
                <img
                    src="https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Fiestas de cumpleaños"
                    className="w-full h-80 object-cover transition duration-500 transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-blue-900/30 flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Fiestas de Cumpleaños</h3>
                  <p className="text-white/90 mb-4">
                    Celebra tu día especial con decoraciones temáticas y ambientes personalizados para todas las edades.
                  </p>
                  <Link
                      to="/reservations"
                      className="px-6 py-2 bg-gold-600 text-white font-medium rounded-full w-fit hover:bg-gold-700 transition duration-300"
                  >
                    Reservar
                  </Link>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden group">
                <img
                    src="https://images.pexels.com/photos/1405528/pexels-photo-1405528.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Eventos sociales"
                    className="w-full h-80 object-cover transition duration-500 transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-blue-900/30 flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Eventos Sociales</h3>
                  <p className="text-white/90 mb-4">
                    Aniversarios, graduaciones o reuniones familiares con ambientes acogedores y elegantes.
                  </p>
                  <Link
                      to="/reservations"
                      className="px-6 py-2 bg-gold-600 text-white font-medium rounded-full w-fit hover:bg-gold-700 transition duration-300"
                  >
                    Reservar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-blue-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Beneficios de Elegirnos
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto">
                Nuestro enfoque en la excelencia y atención al detalle hace que tu experiencia sea excepcional de principio a fin.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-blue-800/50 p-6 rounded-2xl">
                <div className="text-gold-500 mb-4">
                  <Check size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Experiencia Comprobada</h3>
                <p className="text-white/80">
                  Más de 10 años organizando eventos exitosos en Arequipa.
                </p>
              </div>

              <div className="bg-blue-800/50 p-6 rounded-2xl">
                <div className="text-gold-500 mb-4">
                  <Check size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Mobiliario de Calidad</h3>
                <p className="text-white/80">
                  Muebles y decoraciones elegantes que transforman cualquier espacio.
                </p>
              </div>

              <div className="bg-blue-800/50 p-6 rounded-2xl">
                <div className="text-gold-500 mb-4">
                  <Check size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Atención Personalizada</h3>
                <p className="text-white/80">
                  Cada evento recibe un trato único, adaptado a tus necesidades específicas.
                </p>
              </div>

              <div className="bg-blue-800/50 p-6 rounded-2xl">
                <div className="text-gold-500 mb-4">
                  <Check size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Puntualidad Garantizada</h3>
                <p className="text-white/80">
                  Entrega y recogida de mobiliario en los tiempos acordados, siempre.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                Lo que Dicen Nuestros Clientes
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                La satisfacción de nuestros clientes es nuestro mayor logro. Estas son algunas de sus experiencias.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex text-gold-500">
                    {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "Servicom Eclea hizo de nuestra boda un evento mágico. El mobiliario y la decoración superaron nuestras expectativas. ¡Altamente recomendado!"
                </p>
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="font-bold text-blue-900">María y Carlos</p>
                    <p className="text-gray-500 text-sm">Boda en Arequipa, 2024</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex text-gold-500">
                    {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "La conferencia empresarial fue un éxito. El sistema de reservas en línea facilitó todo el proceso y el equipo de Servicom fue muy profesional."
                </p>
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="font-bold text-blue-900">Grupo Empresarial AQP</p>
                    <p className="text-gray-500 text-sm">Conferencia Anual, 2024</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex text-gold-500">
                    {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "La fiesta de 15 años de mi hija fue perfecta. El chatbot respondió todas nuestras dudas a cualquier hora y el servicio fue impecable."
                </p>
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="font-bold text-blue-900">Familia Rodríguez</p>
                    <p className="text-gray-500 text-sm">Fiesta de 15 años, 2023</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section ref={contactRef} id="contact" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
                  Contáctanos
                </h2>
                <p className="text-gray-600 mb-8">
                  ¿Tienes alguna pregunta o quieres más información sobre nuestros servicios? Estamos aquí para ayudarte a hacer tu evento inolvidable.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="text-gold-600 mr-4 mt-1" size={24} />
                    <div>
                      <h3 className="font-bold text-blue-900 mb-1">Dirección</h3>
                      <p className="text-gray-600">
                        Calle 13 de Junio 108, Urb. Los Olivos<br />
                        José Luis Bustamante y Rivero, Arequipa
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="text-gold-600 mr-4 mt-1" size={24} />
                    <div>
                      <h3 className="font-bold text-blue-900 mb-1">Teléfono</h3>
                      <p className="text-gray-600">
                        +51 054 123 456
                      </p>
                      <p className="text-gray-600">
                        +51 954 789 123 (WhatsApp)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="text-gold-600 mr-4 mt-1" size={24} />
                    <div>
                      <h3 className="font-bold text-blue-900 mb-1">Email</h3>
                      <p className="text-gray-600">
                        contacto@eclea.pe
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <form className="bg-neutral-50 p-8 rounded-2xl shadow-md">
                  <h3 className="text-2xl font-bold text-blue-900 mb-6">Envíanos un mensaje</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                      </label>
                      <input
                          type="text"
                          id="name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                          required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                          type="email"
                          id="email"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                          required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Mensaje
                    </label>
                    <textarea
                        id="message"
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                        required
                    />
                  </div>

                  <button
                      type="submit"
                      className="w-full px-6 py-3 bg-gold-600 text-white font-medium rounded-md hover:bg-gold-700 transition duration-300"
                  >
                    Enviar Mensaje
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Listo para hacer tu evento inolvidable?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Comienza a planificar hoy y transforma tu visión en una celebración perfecta.
            </p>
            <Link
                to="/reservations"
                className="px-8 py-3 bg-gold-600 text-white font-medium rounded-full hover:bg-gold-700 transition duration-300 transform hover:scale-105 shadow-lg"
            >
              ¡Reserva ahora!
            </Link>
          </div>
        </section>
      </div>
  );
};

export default HomePage;