import { useEffect, useState } from 'react';
import Modal from '../Modal';
import { InventoryItem, InventoryFormData } from '../../hooks/useInventory';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: InventoryFormData) => void;
    mode: 'create' | 'edit';
    item: InventoryItem | null;
}

const CreateEditItemModal = ({ isOpen, onClose, onSubmit, mode, item }: Props) => {
    const [formData, setFormData] = useState<InventoryFormData>({
        nombre: '',
        descripcion: '',
        categoria: 'General',
        precio: 0,
        stock_total: 0,
        estado: 'Disponible',
    });

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && item) {
                setFormData({
                    nombre: item.nombre,
                    descripcion: item.descripcion || '',
                    categoria: item.categoria || 'General',
                    precio: item.precio || 0,
                    stock_total: item.stock_total,
                    estado: item.estado,
                });
            } else {
                // Resetear para el modo 'create'
                setFormData({
                    nombre: '',
                    descripcion: '',
                    categoria: 'General',
                    precio: 0,
                    stock_total: 0,
                    estado: 'Disponible',
                });
            }
        }
    }, [item, mode, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'stock_total' ? parseInt(value) || 0 : name === 'precio' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${mode === 'create' ? 'Crear' : 'Editar'} Artículo`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre del Artículo</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gold-500 focus:border-gold-500"/>
                </div>
                <div>
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gold-500 focus:border-gold-500"></textarea>
                </div>
                <div>
                    <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
                    <input
                        type="text"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gold-500 focus:border-gold-500"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="precio" className="block text-sm font-medium text-gray-700">Precio (S/.)</label>
                        <input
                            type="number"
                            name="precio"
                            value={formData.precio}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gold-500 focus:border-gold-500"
                            step="0.01"
                        />
                    </div>
                    <div>
                        <label htmlFor="stock_total" className="block text-sm font-medium text-gray-700">Stock Total</label>
                        <input type="number" name="stock_total" value={formData.stock_total} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gold-500 focus:border-gold-500"/>
                    </div>
                </div>
                <div>
                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado Administrativo</label>
                    <select name="estado" id="estado" value={formData.estado} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gold-500 focus:border-gold-500">
                        <option value="Disponible">Disponible (se puede reservar)</option>
                        <option value="Mantenimiento">Mantenimiento (no se puede reservar)</option>
                    </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
                    <button type="submit" className="bg-gold-600 text-white px-4 py-2 rounded-md hover:bg-gold-700">Guardar</button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateEditItemModal;