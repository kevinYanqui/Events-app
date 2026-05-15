import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area, CartesianGrid } from 'recharts';
import { Calendar, Users, DollarSign, AlertTriangle } from 'lucide-react';
import { useDashboardAnalytics } from '../../hooks/useDashboardAnalytics';

const COLORS = ['#f9ab00', '#1a73e8', '#1e8e3e', '#d93025'];

const OverviewTab = () => {
    const { analytics, isLoading, error } = useDashboardAnalytics();

    if (isLoading) return <p className="text-center p-8">Cargando datos de la visión general...</p>;
    if (error || !analytics) return <p className="text-red-500 text-center p-8">{error || 'No se pudieron cargar los datos.'}</p>;

    // Ordenar los estados para que tengan un orden lógico en el gráfico
    const sortedStatusData = analytics.estadoReservas.sort((a, b) => {
        const order = { 'Pendiente': 1, 'Confirmada': 2, 'Completada': 3, 'Cancelada': 4 };
        return (order[a.name] || 99) - (order[b.name] || 99);
    });

    return (
        <div className="space-y-8">
            {/* Tarjetas de KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                    <div className="flex justify-between items-center mb-4"><h3 className="text-gray-500 font-medium">Total Reservas</h3><div className="p-2 bg-blue-100 rounded-lg"><Calendar className="text-blue-500" size={20}/></div></div>
                    <p className="text-3xl font-bold text-blue-900">{analytics.totalReservas}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-gold-500">
                    <div className="flex justify-between items-center mb-4"><h3 className="text-gray-500 font-medium">Ingresos Totales</h3><div className="p-2 bg-gold-100 rounded-lg"><DollarSign className="text-gold-600" size={20}/></div></div>
                    <p className="text-3xl font-bold text-blue-900">S/. {analytics.ingresosTotales.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                    <div className="flex justify-between items-center mb-4"><h3 className="text-gray-500 font-medium">Clientes Registrados</h3><div className="p-2 bg-green-100 rounded-lg"><Users className="text-green-500" size={20}/></div></div>
                    <p className="text-3xl font-bold text-blue-900">{analytics.totalClientes}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
                    <div className="flex justify-between items-center mb-4"><h3 className="text-gray-500 font-medium">Alertas Inventario</h3><div className="p-2 bg-red-100 rounded-lg"><AlertTriangle className="text-red-500" size={20}/></div></div>
                    <p className="text-3xl font-bold text-blue-900">{analytics.alertasInventario}</p>
                </div>
            </div>

            {/* Gráficos Principales */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white rounded-xl shadow-md p-6">
                    <h3 className="font-bold text-blue-900 mb-4">Ingresos Mensuales (Eventos Completados)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={analytics.ingresosMensuales} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => `S/. ${value.toFixed(2)}`} />
                            <Area type="monotone" dataKey="ingresos" stroke="#345a9a" fill="#345a9a" fillOpacity={0.3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
                    <h3 className="font-bold text-blue-900 mb-4">Distribución de Reservas</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={sortedStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={100} fill="#8884d8" paddingAngle={5}>
                                {sortedStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip formatter={(value, name) => [`${value} reservas`, name]} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;