import { useState, useMemo } from 'react';
import { useInventory, InventoryItem, InventoryFormData } from '../../hooks/useInventory';
import CreateEditItemModal from './CreateEditItemModal';
import toast from 'react-hot-toast';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 5;

const InventoryTab = () => {
    const { inventory, isLoading, error, createItem, updateItem } = useInventory();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [categoryFilter, setCategoryFilter] = useState('Todas');
    const [currentPage, setCurrentPage] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);

    const getItemVisualStatus = (item: InventoryItem) => {
        if (item.estado === 'Mantenimiento') {
            return 'Mantenimiento';
        }
        if (item.stock_disponible === 0) {
            return 'Agotado';
        }
        return 'Disponible';
    };

    const filteredInventory = useMemo(() => {
        return inventory
            .filter(item => item.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(item => statusFilter === 'Todos' || getItemVisualStatus(item) === statusFilter)
            .filter(item => categoryFilter === 'Todas' || item.categoria === categoryFilter);
    }, [inventory, searchTerm, statusFilter, categoryFilter]);

    const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE);
    const paginatedInventory = filteredInventory.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleOpenCreateModal = () => {
        setModalMode('create');
        setCurrentItem(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: InventoryItem) => {
        setModalMode('edit');
        setCurrentItem(item);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (formData: InventoryFormData) => {
        try {
            if (modalMode === 'edit' && currentItem) {
                await updateItem(currentItem.id, formData);
            } else {
                await createItem(formData);
            }
            setIsModalOpen(false);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    if (isLoading) return <p>Cargando inventario...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h3 className="font-bold text-blue-900 text-xl">Gestión de Inventario</h3>
                <button onClick={handleOpenCreateModal} className="px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700">
                    Nuevo Artículo
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                    <option value="Todos">Todos los Estados</option>
                    <option value="Disponible">Disponible</option>
                    <option value="Agotado">Agotado</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                </select>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                    <option value="Todas">Todas las Categorías</option>
                    <option value="General">General</option>
                    <option value="Sillas">Sillas</option>
                    <option value="Mesas">Mesas</option>
                    <option value="Decoración">Decoración</option>
                </select>
            </div>

            {/* Tabla de Inventario */}
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                    <tr className="text-sm font-medium text-gray-600">
                        <th className="py-3 px-4 text-left">ID</th>
                        <th className="py-3 px-4 text-left">Artículo</th>
                        <th className="py-3 px-4 text-left">Categoría</th>
                        <th className="py-3 px-4 text-right">Precio (S/.)</th>
                        <th className="py-3 px-4 text-center">Stock Total</th>
                        <th className="py-3 px-4 text-center">Disponible</th>
                        <th className="py-3 px-4 text-center">Estado Visual</th>
                        <th className="py-3 px-4 text-center">Acciones</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {paginatedInventory.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="py-4 px-4 text-sm text-gray-500">{item.id}</td>
                            <td className="py-4 px-4 font-medium">{item.nombre}</td>
                            <td className="py-4 px-4 text-sm text-gray-500">{item.categoria}</td>
                            <td className="py-4 px-4 text-sm text-gray-800 font-semibold text-right">
                                {item.precio.toFixed(2)}
                            </td>
                            <td className="py-4 px-4 text-center">{item.stock_total}</td>
                            <td className="py-4 px-4 font-bold text-center">{item.stock_disponible}</td>
                            <td className="py-4 px-4 text-center">
                                     <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                                         getItemVisualStatus(item) === 'Disponible' ? 'bg-green-100 text-green-800' :
                                             getItemVisualStatus(item) === 'Agotado' ? 'bg-red-100 text-red-800' :
                                                 'bg-orange-100 text-orange-800'
                                     }`}>
                                        {getItemVisualStatus(item)}
                                    </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                                <button onClick={() => handleOpenEditModal(item)} className="font-medium text-blue-600 hover:text-blue-800">Editar</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                    Mostrando {paginatedInventory.length} de {filteredInventory.length} resultados
                </p>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm font-medium">Página {currentPage} de {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <CreateEditItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                mode={modalMode}
                item={currentItem}
            />
        </div>
    );
};

export default InventoryTab;