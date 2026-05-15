import { useState, useMemo } from 'react';
import { useReservations, ReservationData, ReservationFormData } from '../../hooks/useReservations';
import EditReservationModal from './EditReservationModal';
import CreateReservationModal from './CreateReservationModal';
import toast from 'react-hot-toast';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

const ReservationsTab = () => {
    const { reservations, isLoading, error, createReservation, updateReservation } = useReservations();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [currentPage, setCurrentPage] = useState(1);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [currentReservation, setCurrentReservation] = useState<ReservationData | null>(null);

    const filteredReservations = useMemo(() => {
        return reservations
            .filter(res =>
                res.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(res.id).includes(searchTerm) ||
                res.lugar_evento.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter(res => statusFilter === 'Todos' || res.estado === statusFilter);
    }, [reservations, searchTerm, statusFilter]);

    const totalPages = Math.ceil(filteredReservations.length / ITEMS_PER_PAGE);
    const paginatedReservations = filteredReservations.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleOpenEditModal = (reservation: ReservationData) => {
        setCurrentReservation(reservation);
        setIsEditModalOpen(true);
    };

    const handleSave = async (data: { lugar_evento: string; estado: string }) => {
        if (!currentReservation) return;
        try {
            await updateReservation(currentReservation.id, data);
        } catch(err: any) {
            toast.error(err.message);
        }
    };

    const handleCreateReservation = async (formData: ReservationFormData) => {
        try {
            await createReservation(formData);
        } catch(err: any) {
            toast.error(err.message);
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Confirmada': return 'bg-green-100 text-green-800';
            case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
            case 'Cancelada': return 'bg-red-100 text-red-800';
            case 'Completada': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) return <p>Cargando reservaciones...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-blue-900 text-xl">Gestión de Reservaciones</h3>
                <button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700">
                    Nueva Reserva
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Buscar por cliente, ID o lugar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                    <option value="Todos">Todos los Estados</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="Completada">Completada</option>
                    <option value="Cancelada">Cancelada</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                    <tr className="text-sm font-medium text-gray-600">
                        <th className="py-3 px-4 text-left">ID</th>
                        <th className="py-3 px-4 text-left">Cliente</th>
                        <th className="py-3 px-4 text-left">Lugar del Evento</th>
                        <th className="py-3 px-4 text-left">Fecha Evento</th>
                        <th className="py-3 px-4 text-right">Costo (S/.)</th>
                        <th className="py-3 px-4 text-center">Estado</th>
                        <th className="py-3 px-4 text-center">Acciones</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {paginatedReservations.map((res) => (
                        <tr key={res.id} className="hover:bg-gray-50">
                            <td className="py-4 px-4 text-sm font-bold text-gray-500">{res.id}</td>
                            <td className="py-4 px-4 font-medium">{res.clienteNombre}</td>
                            <td className="py-4 px-4 text-sm text-gray-500">{res.lugar_evento}</td>
                            <td className="py-4 px-4 text-sm text-gray-500">{new Date(res.fechaEvento).toLocaleDateString('es-ES')}</td>
                            <td className="py-4 px-4 text-sm text-gray-800 font-semibold text-right">{res.costoTotal.toFixed(2)}</td>
                            <td className="py-4 px-4 text-center">
                                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getStatusClass(res.estado)}`}>
                                        {res.estado}
                                    </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                                <button onClick={() => handleOpenEditModal(res)} className="font-medium text-blue-600 hover:text-blue-800">
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                    Mostrando {paginatedReservations.length} de {filteredReservations.length} resultados
                </p>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm font-medium">
                        Página {currentPage} de {totalPages || 1}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <EditReservationModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSave}
                reservation={currentReservation}
            />
            <CreateReservationModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleCreateReservation}
            />
        </div>
    );
};

export default ReservationsTab;