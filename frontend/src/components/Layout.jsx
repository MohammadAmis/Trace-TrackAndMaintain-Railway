import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, Database, Users, Settings, LogOut, Activity } from 'lucide-react';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} />, roles: ['Super Admin', 'Zonal Admin', 'Depot Officer', 'Maintenance Engineer', 'Inspector', 'Passenger'] },
        { name: 'Analytics', path: '/analytics', icon: <Activity size={20} />, roles: ['Super Admin', 'Zonal Admin', 'Depot Officer'] },
        { name: 'Reports', path: '/reports', icon: <FileText size={20} />, roles: ['Super Admin', 'Zonal Admin', 'Depot Officer', 'Maintenance Engineer', 'Inspector', 'Passenger'] },
        { name: 'Assets', path: '/assets', icon: <Database size={20} />, roles: ['Super Admin', 'Zonal Admin', 'Depot Officer'] },
        { name: 'QR Logs', path: '/qr-logs', icon: <Database size={20} />, roles: ['Super Admin', 'Zonal Admin', 'Depot Officer', 'Inspector'] },
        { name: 'SLA & Escalations', path: '/sla', icon: <Activity size={20} />, roles: ['Super Admin', 'Zonal Admin'] },
        { name: 'User Management', path: '/users', icon: <Users size={20} />, roles: ['Super Admin'] },
        { name: 'Settings', path: '/settings', icon: <Settings size={20} />, roles: ['Super Admin', 'Zonal Admin', 'Depot Officer'] },
    ];

    const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role));

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside style={{ width: '260px', background: 'var(--glass)', borderRight: '1px solid var(--glass-border)', padding: '2rem 1rem' }}>
                <h2 style={{ marginBottom: '2rem', color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>RailTrack Admin</h2>

                <nav>
                    {filteredMenu.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0.75rem 1rem',
                                marginBottom: '0.5rem',
                                borderRadius: '8px',
                                background: isActive ? 'var(--primary)' : 'transparent',
                                color: 'white',
                                gap: '12px'
                            })}
                        >
                            {item.icon}
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    style={{
                        marginTop: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '1rem',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--gray)',
                        cursor: 'pointer',
                        width: '100%'
                    }}
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <header style={{
                    padding: '1rem 2rem',
                    background: 'var(--glass)',
                    borderBottom: '1px solid var(--glass-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                }}>
                    <div>
                        <h1 style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                            {user?.role === 'Super Admin' ? 'Railways HQ Dashboard' :
                                user?.role === 'Zonal Admin' ? `${user?.zone} Zonal Dashboard` :
                                    user?.role === 'Depot Officer' ? `${user?.depot} Depot Dashboard` :
                                        `${user?.role} Portal`}
                        </h1>
                        <p style={{ color: 'var(--gray)', fontSize: '0.75rem' }}>
                            {user?.name} | {user?.role === 'Super Admin' ? 'All India' : user?.zone || 'Field Ops'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {/* Status Indicator */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', color: 'var(--success)' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></div>
                            Live Data
                        </div>
                    </div>
                </header>
                <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                    {children}
                </div>
            </main>
        </div >
    );
};

export default Layout;
