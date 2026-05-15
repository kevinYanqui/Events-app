import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useDashboardAnalytics } from '../../hooks/useDashboardAnalytics';
import { useState } from 'react';

const ReportsTab = () => {
    const { analytics, isLoading, error, fetchAnalytics: runReport } = useDashboardAnalytics();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleFilter = () => {
        runReport(startDate, endDate);
    };

    if (isLoading) {
        return <p className="text-center p-8 text-gray-500">Cargando reportes...</p>;
    }


    return (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <h3 className="font-bold text-blue-900 text-xl mb-4 md:mb-0">Análisis y Reportes Detallados</h3>
                <div className="flex items-center gap-2">
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border rounded-md p-2 text-sm"/>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border rounded-md p-2 text-sm"/>
                    <button onClick={handleFilter} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" disabled={isLoading}>
                        {isLoading ? 'Cargando...' : 'Filtrar'}
                    </button>
                </div>
            </div>

            {error && <p className="text-center p-8 text-red-500">Error al cargar los datos: {error}</p>}

            {!isLoading && !error && analytics && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="p-4 border rounded-lg">
                        <h4 className="font-bold text-blue-900 mb-3">Top 5 Artículos más Rentables (Eventos Completados)</h4>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.articulosPopulares} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="name" width={120} />
                                <Tooltip formatter={(value: number) => `S/. ${value.toFixed(2)}`} />
                                <Legend />
                                <Bar dataKey="rentabilidad" fill="#cd881d" name="Ingresos Reales Generados" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <h4 className="font-bold text-blue-900 mb-3">Conteo de Reservas por Estado</h4>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.estadoReservas} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#1a73e8" name="Número de Reservas"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsTab;