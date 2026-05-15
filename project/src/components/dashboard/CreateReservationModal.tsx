import { useState, useEffect } from 'react';
import Modal from '../Modal';
import { useInventory, InventoryItem } from '../../hooks/useInventory';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface User {
    id: number;
    nombreCompleto: string;
    email: string;
}

interface CartItem {
    articuloId: number;
    nombre: string;
    cantidad: number;
    precio_unitario: number;
    stock_disponible: number;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
}

const CreateReservationModal = ({ isOpen, onClose, onSave }: Props) => {
    const { token } = useAuth();
    const { inventory } = useInventory(); // Usamos el hook de inventario para obtener los artículos
    const [users, setUsers] = useState<User[]>([]);

    // Estados del formulario
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [fechaEvento, setFechaEvento] = useState<string>('');
    const [lugarEvento, setLugarEvento] = useState<string>('');
    const [cart, setCart] = useState<CartItem[]>([]);

    // Cargar usuarios cuando el modal se abre
    useEffect(() => {
        if (isOpen && token) {
            fetch('http://localhost:8080/api/auth/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => setUsers(data))
                .catch(() => toast.error('No se pudieron cargar los clientes.'));
        }
    }, [isOpen, token]);

    const handleAddToCart = (item: InventoryItem) => {
        if (item.stock_disponible <= 0) {
            toast.error(`${item.nombre} está agotado.`);
            return;
        }
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.articuloId === item.id);
            if (existingItem) {
                if (existingItem.cantidad < item.stock_disponible) {
                    return prevCart.map(cartItem =>
                        cartItem.articuloId === item.id
                            ? { ...cartItem, cantidad: cartItem.cantidad + 1 }
                            : cartItem
                    );
                } else {
                    toast.error(`No hay más stock disponible para ${item.nombre}.`);
                    return prevCart;
                }
            }
            return [...prevCart, { articuloId: item.id, nombre: item.nombre, cantidad: 1, precio_unitario: 0, stock_disponible: item.stock_disponible }];
        });
    };

    const handleRemoveFromCart = (articuloId: number) => {
        setCart(prev => prev.filter(item => item.articuloId !== articuloId));
    }

    const handleSubmit = async () => {
        if (!selectedUserId || !fechaEvento || !lugarEvento || cart.length === 0) {
            toast.error('Por favor, complete todos los campos y añada al menos un artículo.');
            return;
        }

        const reservationData = {
            usuarioId: parseInt(selectedUserId),
            fecha_evento: fechaEvento,
            lugar_evento: lugarEvento,
            detalles: cart.map(item => ({
                articuloId: item.articuloId,
                cantidad: item.cantidad,
                precio_unitario: item.precio_unitario
            }))
        };

        await onSave(reservationData);
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setSelectedUserId('');
        setFechaEvento('');
        setLugarEvento('');
        setCart([]);
    }

    return (
        <Modal isOpen={isOpen} onClose={() => { resetForm(); onClose(); }} title="Crear Nueva Reserva">
            <div className="space-y-6">
                {/* Paso 1: Datos del Cliente y Evento */}
                <fieldset className="border p-4 rounded-md">
                    <legend className="text-lg font-semibold px-2">Datos del Evento</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="cliente" className="block text-sm font-medium">Cliente</label>
                            <select id="cliente" value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                <option value="">Seleccione un cliente...</option>
                                {users.map(user => <option key={user.id} value={user.id}>{user.nombreCompleto} ({user.email})</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="fecha" className="block text-sm font-medium">Fecha del Evento</label>
                            <input type="date" id="fecha" value={fechaEvento} onChange={(e) => setFechaEvento(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div>
                            <label htmlFor="lugar" className="block text-sm font-medium">Lugar del Evento</label>
                            <input type="text" id="lugar" value={lugarEvento} onChange={(e) => setLugarEvento(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                        </div>
                    </div>
                </fieldset>

                {/* Paso 2: Añadir Artículos */}
                <fieldset className="border p-4 rounded-md">
                    <legend className="text-lg font-semibold px-2">Selección de Artículos</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Lista de artículos disponibles */}
                        <div className="h-64 overflow-y-auto border rounded-md p-2 space-y-2">
                            <h4 className="font-bold">Inventario Disponible</h4>
                            {inventory.filter(item => item.estado === 'Disponible' && item.stock_disponible > 0).map(item => (
                                <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <span>{item.nombre} <span className="text-xs text-gray-500">(Disp: {item.stock_disponible})</span></span>
                                    <button onClick={() => handleAddToCart(item)} className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">+</button>
                                </div>
                            ))}
                        </div>
                        {/* Carrito de la reserva */}
                        <div className="h-64 overflow-y-auto border rounded-md p-2 space-y-2">
                            <h4 className="font-bold">Artículos en la Reserva</h4>
                            {cart.length === 0 ? <p className="text-gray-500 text-sm">Añada artículos del inventario.</p> : cart.map(item => (
                                <div key={item.articuloId} className="flex justify-between items-center p-2 bg-green-50 rounded">
                                    <span>{item.nombre} x {item.cantidad}</span>
                                    <button onClick={() => handleRemoveFromCart(item.articuloId)} className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">-</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </fieldset>

                {/* Paso 3: Guardar */}
                <div className="flex justify-end pt-4">
                    <button onClick={handleSubmit} className="px-6 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700">
                        Guardar Reserva
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CreateReservationModal;