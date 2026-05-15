import { useState } from 'react';
import { Search } from 'lucide-react';
import OverviewTab from '../components/dashboard/OverviewTab';
import ReservationsTab from '../components/dashboard/ReservationsTab';
import InventoryTab from '../components/dashboard/InventoryTab';
import ReportsTab from '../components/dashboard/ReportsTab';

const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'reservations':
                return <ReservationsTab />;
            case 'inventory':
                return <InventoryTab />;
            case 'reports':
                return <ReportsTab />;
            case 'overview':
            default:
                return <OverviewTab />;
        }
    };

    const getButtonClass = (tabName: string) => `py-4 px-1 font-medium text-sm border-b-2 ${
        activeTab === tabName
            ? 'border-gold-600 text-gold-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`;

    return (
        <div className="pt-24 pb-16 bg-neutral-50 min-h-screen">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Panel de Administración</h1>
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                        />
                    </div>
                </div>

                {/* Pestañas de Navegación */}
                <div className="mb-8 border-b border-gray-200">
                    <nav className="flex space-x-8">
                        <button onClick={() => setActiveTab('overview')} className={getButtonClass('overview')}>
                            Visión General
                        </button>
                        <button onClick={() => setActiveTab('reservations')} className={getButtonClass('reservations')}>
                            Reservaciones
                        </button>
                        <button onClick={() => setActiveTab('inventory')} className={getButtonClass('inventory')}>
                            Inventario
                        </button>
                        <button onClick={() => setActiveTab('reports')} className={getButtonClass('reports')}>
                            Reportes
                        </button>
                    </nav>
                </div>

                {/* Contenido de la Pestaña Activa */}
                <div>{renderTabContent()}</div>
            </div>
        </div>
    );
};

export default DashboardPage;