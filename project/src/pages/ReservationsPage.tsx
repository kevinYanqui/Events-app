import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { RefreshCw, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from "../context/AuthContext.tsx";

// Interfaces
interface Articulo {
  id: number;
  nombre: string;
  descripcion: string;
  stock_total: number;
  stock_disponible: number;
  estado: string;
  precio: number;
  price?: number;
  image?: string;
}

interface CartItem {
  itemId: number;
  quantity: number;
  name: string;
  price: number;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  eventType: string;
  location: string;
  specialRequests: string;
}

const paquetes = [
  {
    id: 15,
    image: "/images/paquete-matrimonio.jpg",
    productos: [
      { articuloId: 2, cantidad: 10 },
      { articuloId: 1, cantidad: 5 },
      { articuloId: 9, cantidad: 1 },
    ],
    estado: "Paquete",
  },
  {
    id: 16,
    image: "/images/paquete-cumpleaños.jpg",
    productos: [
      { articuloId: 14, cantidad: 5 },
      { articuloId: 5, cantidad: 1 },
    ],
    estado: "Paquete",
  }
];

const ReservationsPage = () => {
  const [inventoryItems, setInventoryItems] = useState<Articulo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaymentClicked, setIsPaymentClicked] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', phone: '', eventDate: '', eventType: 'Boda', location: '', specialRequests: '' });
  const [selectedPackage, setSelectedPackage] = useState<typeof paquetes[0] | null>(null);
  const [showPackageDetails, setShowPackageDetails] = useState(false);
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const fetching = useRef(false);
  const [reservaId, setReservaId] = useState<number | null>(null);

  useEffect(() => {
    if (fetching.current) return;
    if (!token) {
      toast.error("Por favor, inicia sesión para poder hacer una reserva.");
      navigate('/login');
      return;
    }

    const formatImageName = (nombre: string): string => {
      return nombre
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9\-]/g, '')
          + '.jpg';
    };

    const fetchArticulos = async () => {
      fetching.current = true;
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/articulos', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('No se pudo obtener la lista de artículos.');
        const data: Articulo[] = await response.json();
        const processedData = data.map(item => ({
          ...item,
          price: item.precio,
          image: `/images/${formatImageName(item.nombre)}`
        }));
        setInventoryItems(processedData);
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
        fetching.current = false;
      }
    };
    fetchArticulos();
  }, [token, navigate]);

  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        name: user.name || '',
        email: user.email || '',
        phone: user.telefono || ''
      }));
    }
  }, [user]);


  useEffect(() => {
    if (currentStep === 3) {
      setIsPaymentClicked(false);
    }
  }, [currentStep]);

  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      if (currentStep === 3 && reservaId && token) {
        e.preventDefault();
        e.returnValue = 'Si abandonas esta página, se cancelará la reserva.';

        try {
          await fetch(`http://localhost:8080/api/reservas/${reservaId}/cancelar`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.warn("Error cancelando al cerrar/refrescar:", error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentStep, reservaId, token]);


  const addToCart = (itemId: number) => {
    const item = inventoryItems.find(i => i.id === itemId);
    if (!item) return;
    if (item.stock_disponible <= 0) {
      toast.error(`Lo sentimos, ${item.nombre} no tiene stock disponible.`);
      return;
    }

    const existingCartItem = cart.find(ci => ci.itemId === itemId);
    if (existingCartItem) {
      if (existingCartItem.quantity >= item.stock_disponible) {
        toast.error(`No hay más unidades disponibles de ${item.nombre}`);
        return;
      }
      setCart(cart.map(ci => ci.itemId === itemId ? { ...ci, quantity: ci.quantity + 1 } : ci));
    } else {
      setCart([...cart, { itemId: item.id, quantity: 1, name: item.nombre, price: item.price || 0 }]);
    }
    toast.success(`${item.nombre} agregado al carrito`);
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter(item => item.itemId !== itemId));
    toast.error("Artículo eliminado del carrito.");
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    const item = inventoryItems.find(i => i.id === itemId);
    if (!item) return;
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    if (newQuantity > item.stock_disponible) {
      toast.error(`Solo hay ${item.stock_disponible} unidades disponibles`);
      return;
    }
    setCart(cart.map(cartItem => cartItem.itemId === itemId ? { ...cartItem, quantity: newQuantity } : cartItem));
  };

  const calculateTotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleDateSelect = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignorar la hora para la comparación
    const minSelectableDate = new Date(new Date().setDate(today.getDate() + 7));


    if (date < minSelectableDate) {
      toast.error('Debes seleccionar una fecha con al menos 7 días de anticipación.');
      return;
    }
    setSelectedDate(date);
    setFormData({ ...formData, eventDate: date.toISOString().split('T')[0] });
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days: JSX.Element[] = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minSelectableDate = new Date(new Date().setDate(today.getDate() + 6));


    for (let i = 0; i < firstDayOfMonth; i++) { days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>); }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isToday = new Date().toDateString() === date.toDateString();
      const isPastOrInPreparation = date < minSelectableDate;

      days.push(
          <button key={`day-${day}`} type="button" onClick={() => !isPastOrInPreparation && handleDateSelect(date)} disabled={isPastOrInPreparation} className={`h-10 w-10 rounded-full flex items-center justify-center text-sm transition-colors ${isSelected ? 'bg-gold-600 text-white' : isToday ? 'bg-blue-100 text-blue-900' : isPastOrInPreparation ? 'text-gray-400 cursor-not-allowed line-through' : 'hover:bg-blue-50'}`}>
            {day}
          </button>
      );
    }
    return days;
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
      toast.error("Debes iniciar sesión para confirmar la reserva.");
      return;
    }
    setIsSubmitting(true);

    const payload = {
      usuarioId: user.id,
      fecha_evento: formData.eventDate,
      lugar_evento: formData.location,
      detalles: cart.map(item => ({
        articuloId: item.itemId,
        cantidad: item.quantity,
        precio_unitario: item.price,
      }))
    };

    try {
      const response = await fetch('http://localhost:8080/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || 'Ocurrió un error al crear la reserva.');
        } catch (jsonError) {
          throw new Error(errorText || 'Ocurrió un error desconocido.');
        }
      }

      const reservaCreada = await response.json();
      setReservaId(reservaCreada.id);
      toast.success('¡Reserva creada exitosamente!');
      setCurrentStep(3);

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleCartPayment = async () => {
    if (isPaymentClicked) return; setIsPaymentClicked(true);
    if (cart.length === 0) { toast.error("El carrito está vacío"); return; } if (!reservaId || reservaId === 0) {
      toast.error("Error: La reserva aún no se ha creado. Intenta nuevamente.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/mercadopago', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ reservaId: reservaId, items: cart.map(item => ({ title: item.name, quantity: item.quantity, unitPrice: item.price, })), }),
      });
      const data = await response.json();
      if (data.init_point) {
        window.open(data.init_point, '_blank');
        navigate('/');
      } else {
        toast.error("No se pudo generar el enlace de pago");
      }
    } catch (error) {
      console.error('Error al conectar con Mercado Pago:', error);
      toast.error("Error al generar el pago");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !reservaId) { toast.error("No se puede actualizar la reserva. Faltan datos."); return; }
    try {
      const response = await fetch(`http://localhost:8080/api/reservas/${reservaId}/ubicacion`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ubicacion: formData.location })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar la ubicación.");
      }

      toast.success("Ubicación actualizada correctamente.");
      await handleCartPayment();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleBackToStep2 = async () => {

    if (!reservaId || !token) {
      toast.error("No se pudo cancelar la reserva.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/api/reservas/${reservaId}/cancelar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al cancelar la reserva.");
      }
      toast.success("Reserva cancelada y stock restaurado.");
      setReservaId(null);
      setCurrentStep(2);
      setCart([]);
      setSelectedPackage(null);
      if ((window as any).__tx) {
        (window as any).__tx.retry();
        (window as any).__tx = null;
      }
      if (pendingRoute) {
        navigate(pendingRoute);
      }
    } catch (error: any) {
      toast.error("No se pudo cancelar la reserva: " + error.message);
    } finally {
      setShowCancelModal(false);
      setPendingRoute(null);
    }
  };

  if (isLoading) return <div className="pt-24 pb-16 flex justify-center items-center min-h-screen"><RefreshCw className="animate-spin text-gold-600" size={32} /></div>;
  if (error) return <div className="pt-24 pb-16 flex justify-center items-center min-h-screen"><AlertCircle className="text-red-500" size={32} /><p className="ml-4">{error}</p></div>;

  const CancelModal = () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full">
          <h3 className="text-xl font-bold text-gray-800 mb-4">¿Cancelar reserva?</h3><p className="text-gray-600 mb-6">Si vuelves al paso anterior, la reserva será cancelada y se restaurará el stock.</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowCancelModal(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800">No</button>
            <button onClick={handleBackToStep2} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white">Sí, cancelar</button>
          </div>
        </div>
      </div>
  );

  return (
      <>
        {showCancelModal && <CancelModal />}
        <div className="pt-24 pb-16 bg-neutral-50 min-h-screen">

          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 text-center">Reserva tu Evento</h1>
              <div className="bg-white rounded-2xl shadow-md overflow-hidden p-6">
                {currentStep === 1 && (
                    <div>
                      <h2 className="text-xl font-bold text-blue-900 mb-4">Paso 1: Selecciona la fecha</h2>
                      <div className="flex items-center justify-between mb-4"><button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-2 rounded-full hover:bg-blue-50"><ChevronLeft size={20} /></button><h3 className="text-lg font-medium">{currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</h3><button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-2 rounded-full hover:bg-blue-50"><ChevronRight size={20} /></button></div>
                      <div className="grid grid-cols-7 gap-1 mb-2 text-center text-sm font-medium text-gray-600">{['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => <div key={day}>{day}</div>)}</div>
                      <div className="grid grid-cols-7 gap-1">{generateCalendarDays()}</div>
                      <div className="flex justify-end mt-6"><button type="button" onClick={() => setCurrentStep(2)} disabled={!selectedDate} className="px-6 py-2 rounded-md font-medium bg-gold-600 text-white hover:bg-gold-700 disabled:bg-gray-300">Continuar</button></div>
                    </div>
                )}
                {currentStep === 2 && (
                    <div>
                      <h2 className="text-xl font-bold text-blue-900 mb-4">Paso 2: Selecciona los artículos</h2><div className="mb-6">
                      <label htmlFor="packageSelect" className="block mb-2 font-semibold">Selecciona un paquete</label>
                      <select id="packageSelect" className="border p-2 rounded w-full" onChange={(e) => {
                        const paqueteId = parseInt(e.target.value);
                        const paquete = paquetes.find(p => p.id === paqueteId) || null; setSelectedPackage(paquete); setShowPackageDetails(true);
                      }}
                              value={selectedPackage?.id || ''}>
                        <option value="" disabled>-- Elige un paquete --</option>{paquetes.map((p) => {
                        const paqueteInfo = inventoryItems.find(item => item.id === p.id); return (
                            <option key={p.id} value={p.id}>
                              {paqueteInfo ? paqueteInfo.nombre : `Paquete ${p.id}`}</option>);
                      })}</select>
                    </div>{showPackageDetails && selectedPackage && (<div className="bg-white p-4 rounded shadow mb-6 border border-gray-300">
                          {selectedPackage.image && (<img src={selectedPackage.image} alt="Imagen del paquete" className="w-full h-40 object-cover rounded-md mb-4" />)}
                          {(() => {
                            const paqueteInfo = inventoryItems.find(i => i.id === selectedPackage.id);
                            return (<><h3 className="font-semibold mb-2">{paqueteInfo?.nombre || `Paquete ${selectedPackage.id}`}</h3>
                              <p className="mb-4">{paqueteInfo?.descripcion || 'Sin descripción'}</p></>);
                          })()}<h4 className="font-semibold">Incluye:</h4>
                          <ul className="list-disc list-inside mb-4 max-h-40 overflow-auto">{selectedPackage.productos.map(({ articuloId, cantidad }) => {
                            const articulo = inventoryItems.find(i => i.id === articuloId); return (<li key={articuloId}>{articulo ? articulo.nombre : "Artículo no encontrado"} - Cantidad: {cantidad}</li>
                            );
                          })}</ul>
                          <button
                              className="px-4 py-2 bg-gold-600 text-white rounded hover:bg-gold-700"
                              onClick={() => {
                                let nuevoCarrito: CartItem[] = [];
                                selectedPackage.productos.forEach(({ articuloId, cantidad }) => {
                                  const articulo = inventoryItems.find(i => i.id === articuloId);
                                  if (!articulo) return;
                                  const cantidadFinal = Math.min(cantidad, articulo.stock_disponible);
                                  if (cantidadFinal > 0) {
                                    nuevoCarrito.push({
                                      itemId: articulo.id,
                                      quantity: cantidadFinal,
                                      name: articulo.nombre,
                                      price: articulo.price || 0,
                                    });
                                  }
                                });
                                setCart(nuevoCarrito);
                                setShowPackageDetails(false);
                                const paqueteInfo = inventoryItems.find(i => i.id === selectedPackage.id);
                                toast.success(`Paquete "${paqueteInfo?.nombre || selectedPackage.id}" agregado al carrito.`);
                              }}
                          >
                            Confirmar paquete
                          </button>
                          <button
                              className="ml-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                              onClick={() => setShowPackageDetails(false)}
                          >
                            Cancelar
                          </button>
                        </div>
                    )}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {inventoryItems.filter(item => !paquetes.some(paquete => paquete.id === item.id))
                            .map(item => (
                                <div key={item.id} className="border rounded-lg p-4 flex flex-col">
                                  <img src={item.image} alt={item.nombre} className="w-full h-40 object-cover rounded-md mb-3" />
                                  <div className="flex-grow">
                                    <h3 className="font-bold text-blue-900">{item.nombre}</h3>
                                    <p className="text-sm text-gray-500">Disponibles: {item.stock_disponible}</p>
                                  </div>
                                  <button onClick={() => addToCart(item.id)} className="w-full mt-2 px-4 py-2 bg-blue-900 text-white text-sm rounded hover:bg-blue-800">
                                    Agregar
                                  </button>
                                </div>
                            ))}
                      </div>
                      <div className="flex justify-between mt-6">
                        <button type="button" onClick={() => setCurrentStep(1)} className="px-6 py-2 rounded-md font-medium bg-gray-200 hover:bg-gray-300">
                          Volver
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e as any)}
                            disabled={cart.length === 0}
                            className="px-6 py-2 rounded-md font-medium bg-gold-600 text-white hover:bg-gold-700 disabled:bg-gray-300"
                        >
                          Continuar
                        </button>
                      </div>
                    </div>
                )}
                {currentStep === 3 && (
                    <div>
                      <h2 className="text-xl font-bold text-blue-900 mb-4">Paso 3: Detalles y confirmación</h2>
                      <form onSubmit={handleUpdateLocation}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <input type="text" name="name" placeholder="Nombre completo *" required value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md" />
                          <input type="email" name="email" placeholder="Email *" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md" />
                          <input type="tel" name="phone" placeholder="Teléfono *" required value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md" />
                          <input type="text" name="location" placeholder="Ubicación del evento *" required value={formData.location} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md" />
                        </div>
                        <div className="flex justify-between mt-6">
                          <button type="button" onClick={() => setShowCancelModal(true)} className="px-6 py-2 rounded-md font-medium bg-gray-200 hover:bg-gray-300">Volver</button>
                          <button type="submit" disabled={isSubmitting || isPaymentClicked} className="px-6 py-2 rounded-md font-medium bg-gold-600 text-white hover:bg-gold-700 disabled:bg-gray-400">{isSubmitting ? 'Enviando...' : 'Completar Pago'}</button>
                        </div>
                      </form>
                    </div>
                )}
              </div>
              {currentStep > 1 && cart.length > 0 && !showCancelModal && (
                  <div className="mt-8 p-6 bg-white rounded-2xl shadow-md">
                    <h3 className="text-xl font-bold text-blue-900 mb-4">Resumen de tu reserva</h3>
                    {cart.map(item => (
                        <div key={item.itemId} className="flex justify-between items-center py-2 border-b">
                          <div><p className="font-medium">{item.name}</p><p className="text-sm text-gray-500">S/. {item.price.toFixed(2)} c/u</p></div>
                          <div className="flex items-center gap-2"><button onClick={() => updateQuantity(item.itemId, item.quantity - 1)} className="px-2 py-1 bg-gray-200 rounded">-</button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.itemId, item.quantity + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button><button onClick={() => removeFromCart(item.itemId)} className="ml-2 text-red-500 hover:text-red-700">Eliminar</button></div>
                          <p className="font-medium">S/. {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                    <div className="flex justify-between font-bold text-lg mt-4"><p>Total Estimado:</p><p>S/. {calculateTotal().toFixed(2)}</p></div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </>
  );
};

export default ReservationsPage;