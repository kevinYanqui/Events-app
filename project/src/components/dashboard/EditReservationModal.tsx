import { useState, useEffect } from 'react';
import Modal from '../Modal';
import { ReservationData } from '../../hooks/useReservations';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { lugar_evento: string; estado: string }) => void;
    reservation: ReservationData | null;
}

const EditReservationModal = ({ isOpen, onClose, onSave, reservation }: Props) => {
    const [lugar, setLugar] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (reservation) {
            setLugar(reservation.lugar_evento);
            setStatus(reservation.estado);
        }
    }, [reservation]);

    const handleSave = () => {
        onSave({ lugar_evento: lugar, estado: status });
        onClose();
    };

    if (!reservation) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Editar Reserva #${reservation.id}`}>
            <div className="space-y-4">
                <div>
                    <p><strong>Cliente:</strong> {reservation.clienteNombre}</p>
                    <p><strong>Fecha del Evento:</strong> {new Date(reservation.fechaEvento).toLocaleDateString('es-ES')}</p>
                </div>

                <div>
                    <label htmlFor="lugar" className="block text-sm font-medium text-gray-700">Lugar del Evento</label>
                    <input type="text" id="lugar" value={lugar} onChange={(e) => setLugar(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>

                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estado de la Reserva</label>
                    <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                        <option>Pendiente</option>
                        <option>Confirmada</option>
                        <option>Completada</option>
                        <option>Cancelada</option>
                    </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
                    <button type="button" onClick={handleSave} className="bg-gold-600 text-white px-4 py-2 rounded-md hover:bg-gold-700">Guardar Cambios</button>
                </div>
            </div>
        </Modal>
    );
};

export default EditReservationModal;