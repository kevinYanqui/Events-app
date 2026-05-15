import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// La interfaz para un artículo del inventario
export interface InventoryItem {
    id: number;
    nombre: string;
    categoria: string;
    precio: number;
    stock_total: number;
    stock_disponible: number;
    estado: string;
    descripcion?: string;
}

// La interfaz para los datos del formulario (crear/editar)
export interface InventoryFormData {
    nombre: string;
    descripcion: string;
    stock_total: number;
    estado: string;
}


export const useInventory = () => {
    const { token } = useAuth();
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInventory = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/articulos/dto', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('No se pudo cargar el inventario.');
            const data = await response.json();
            setInventory(data);
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    const createItem = async (formData: InventoryFormData) => {
        if (!token) throw new Error("No autenticado");
        const response = await fetch('http://localhost:8080/api/articulos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Error al crear: ${errorData}`);
        }

        const newItem = await response.json();
        setInventory(prev => [...prev, newItem]);
        toast.success('¡Artículo creado con éxito!');
    };

    const updateItem = async (id: number, formData: InventoryFormData) => {
        if (!token) throw new Error("No autenticado");
        const response = await fetch(`http://localhost:8080/api/articulos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Error al actualizar: ${errorData}`);
        }

        const updatedItem = await response.json();
        setInventory(prev => prev.map(item => item.id === id ? updatedItem : item));
        toast.success('¡Artículo actualizado con éxito!');
    };

    return { inventory, isLoading, error, createItem, updateItem };
};