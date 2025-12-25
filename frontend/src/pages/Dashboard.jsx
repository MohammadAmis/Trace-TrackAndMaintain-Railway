import React from 'react';
import { useAuth } from '../context/AuthContext';
import HQDashboard from './dashboards/HQDashboard';
import ZonalDashboard from './dashboards/ZonalDashboard';
import DepotDashboard from './dashboards/DepotDashboard';
import MaintenanceDashboard from './dashboards/MaintenanceDashboard';
import InspectorDashboard from './dashboards/InspectorDashboard';
import PassengerDashboard from './dashboards/PassengerDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    switch (user?.role) {
        case 'Super Admin':
            return <HQDashboard />;
        case 'Zonal Admin':
            return <ZonalDashboard zoneName={user?.zone} />;
        case 'Depot Officer':
            return <DepotDashboard depotName={user?.depot} />;
        case 'Maintenance Engineer':
            return <MaintenanceDashboard />;
        case 'Inspector':
            return <InspectorDashboard />;
        case 'Passenger':
            return <PassengerDashboard />;
        default:
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: 'var(--gray)' }}>
                    <p>Redirecting to your authorized dashboard...</p>
                </div>
            );
    }
};

export default Dashboard;
