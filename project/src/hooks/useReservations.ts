import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export interface ReservationData {
    id: number;
    clienteNombre: string;
    fechaEvento: string;
    lugar_evento: string;
    costoTotal: number;
    estado: string;
    fechaReserva?: string;
    totalArticulos?: number;
    tipoEvento?: string;
    detalles?: any[];
}

export interface ReservationFormData {
    usuarioId: number;
    fecha_evento: string;
    lugar_evento: string;
    detalles: Array<{ articuloId: number; cantidad: number; precio_unitario: number }>;
}


export const useReservations = () => {
    const { token } = useAuth();
    const [reservations, setReservations] = useState<ReservationData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReservations = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/reservas', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('No se pudieron cargar las reservaciones.');
            const data = await response.json();
            setReservations(data);
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    const createReservation = async (formData: ReservationFormData) => {
        if (!token) throw new Error("No autenticado");

        const response = await fetch('http://localhost:8080/api/reservas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify(formData)
        });

        if(!response.ok) {
            const errorData = await response.text();
            throw new Error(`Error al crear la reserva: ${errorData}`);
        }

        toast.success('Reserva creada exitosamente como "Pendiente"');
        fetchReservations();
    };

    const updateReservation = async (id: number, data: { lugar_evento: string; estado: string }) => {
        if (!token) throw new Error("No autenticado");

        const response = await fetch(`http://localhost:8080/api/reservas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify(data)
        });

        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar la reserva.');
        }

        const updatedReservationDTO = await response.json();
        setReservations(prev => prev.map(res => (res.id === id ? { ...res, ...updatedReservationDTO } : res)));
        toast.success(`Reserva #${id} actualizada.`);
    };

    return { reservations, isLoading, error, createReservation, updateReservation: updateReservation };
};