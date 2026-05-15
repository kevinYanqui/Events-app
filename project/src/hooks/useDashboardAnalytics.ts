import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export interface DashboardAnalytics {
    totalReservas: number;
    totalClientes: number;
    ingresosTotales: number;
    alertasInventario: number;
    ingresosMensuales: { name: string; ingresos: number }[];
    estadoReservas: { name: string; value: number }[];
    articulosPopulares: { name: string; rentabilidad: number }[];
}

export const useDashboardAnalytics = () => {
    const { token } = useAuth();
    const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalytics = useCallback(async (startDate?: string, endDate?: string) => {
        if (!token) {
            setError("No autenticado. Por favor, inicie sesión.");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);

        let url = 'http://localhost:8080/api/dashboard/analytics';
        if (startDate && endDate) {
            url += `?startDate=${startDate}&endDate=${endDate}`;
        }

        try {
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'No se pudieron cargar las analíticas del dashboard.');
            }
            const data = await response.json();
            setAnalytics(data);
        } catch (err: any) {
            setError(err.message);
            toast.error(`Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    return { analytics, isLoading, error, fetchAnalytics };
};