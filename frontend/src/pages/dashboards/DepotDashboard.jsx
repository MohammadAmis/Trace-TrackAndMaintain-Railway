import React from 'react';
import {
    ClipboardList, Package, CheckCircle, Clock,
    Plus, UserPlus, FileText, AlertTriangle
} from 'lucide-react';
import KPICard from '../../components/dashboard/KPICard';
import SLABadge from '../../components/dashboard/SLABadge';
import axios from 'axios';
import API_BASE_URL from '../../api/config';

const DepotDashboard = ({ depotName = "Lucknow Depot" }) => {
    const [kpis, setKpis] = React.useState([
        { title: 'Incidents Assigned', value: '...', icon: ClipboardList, color: '#3b82f6', change: 'Calculating...', trend: 'up' },
        { title: 'Pending Inspections', value: '...', icon: FileText, color: '#f59e0b', change: 'Calculating...', trend: 'up' },
        { title: 'Resolved Today', value: '...', icon: CheckCircle, color: '#10b981', change: 'Calculating...', trend: 'up' },
        { title: 'Warranty Claims', value: '...', icon: Package, color: '#8b5cf6', change: 'Awaiting Vendor', trend: 'down' },
    ]);

    const [incidentQueue, setIncidentQueue] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const [statsRes, reportsRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/analytics/stats`, { headers }),
                    axios.get(`${API_BASE_URL}/reports`, { headers })
                ]);

                if (statsRes.data.success) {
                    const stats = statsRes.data.data;
                    setKpis([
                        { title: 'Incidents Assigned', value: stats.totalReports24h.toString(), icon: ClipboardList, color: '#3b82f6', change: '6 Urgent', trend: 'up' },
                        { title: 'Pending Inspections', value: stats.criticalIssues.toString(), icon: FileText, color: '#f59e0b', change: 'Due Today', trend: 'up' },
                        { title: 'Resolved Today', value: '8', icon: CheckCircle, color: '#10b981', change: '+2 vs yesterday', trend: 'up' },
                        { title: 'Warranty Claims', value: '4', icon: Package, color: '#8b5cf6', change: 'Awaiting Vendor', trend: 'down' },
                    ]);
                }

                if (reportsRes.data.success) {
                    setIncidentQueue(reportsRes.data.data.slice(0, 5).map(r => ({
                        id: r.reportId,
                        train: r.train?.trainId || 'Unknown',
                        coach: r.coach?.coachId || 'Unknown',
                        component: r.component?.name || 'Unknown',
                        status: r.status,
                        severity: r.severity,
                        timer: '02:00:00' // Mock timer
                    })));
                }

            } catch (err) {
                console.error('Error fetching depot dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                {kpis.map((kpi, idx) => (
                    <KPICard key={idx} {...kpi} />
                ))}
            </div>

            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Active Incident Queue</h3>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                        <Plus size={16} /> Log Manual Issue
                    </button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={{ padding: '1rem', color: 'var(--gray)', fontSize: '0.75rem', fontWeight: '600' }}>INCIDENT</th>
                                <th style={{ padding: '1rem', color: 'var(--gray)', fontSize: '0.75rem', fontWeight: '600' }}>TRAIN / COACH</th>
                                <th style={{ padding: '1rem', color: 'var(--gray)', fontSize: '0.75rem', fontWeight: '600' }}>COMPONENT</th>
                                <th style={{ padding: '1rem', color: 'var(--gray)', fontSize: '0.75rem', fontWeight: '600' }}>SEVERITY / SLA</th>
                                <th style={{ padding: '1rem', color: 'var(--gray)', fontSize: '0.75rem', fontWeight: '600' }}>STATUS</th>
                                <th style={{ padding: '1rem', color: 'var(--gray)', fontSize: '0.75rem', fontWeight: '600' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incidentQueue.map((inc, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                                    <td style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary)' }}>{inc.id}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontSize: '0.85rem' }}>{inc.train}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{inc.coach}</div>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.85rem' }}>{inc.component}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <SLABadge severity={inc.severity} timer={inc.timer} />
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}>
                                            {inc.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button className="btn" style={{ padding: '4px 8px', fontSize: '0.7rem', background: 'var(--secondary)', color: 'white' }}>
                                            Assign
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="glass-card">
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.25rem' }}>Inventory Status</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { item: 'Ceiling Fans (DC)', stock: 45, min: 20 },
                            { item: 'LED Reading Lights', stock: 12, min: 25 },
                            { item: 'Berth Fittings (Upper)', stock: 58, min: 40 },
                        ].map((inv, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '0.85rem' }}>{inv.item}</div>
                                    <div style={{ fontSize: '0.7rem', color: inv.stock < inv.min ? '#ef4444' : 'var(--gray)' }}>
                                        {inv.stock < inv.min ? 'Low Stock - Reorder' : `Min. Level: ${inv.min}`}
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>{inv.stock}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="glass-card">
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.25rem' }}>Recent Resolutions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { task: 'Fan Replacement', eng: 'R. Sharma', time: '10:30 AM' },
                            { task: 'Tap Repair', eng: 'M. Verma', time: '09:15 AM' },
                            { task: 'Seat Polishing', eng: 'S. K. Singh', time: 'Yesterday' },
                        ].map((r, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                <span>{r.task} (<span style={{ color: 'var(--gray)' }}>{r.eng}</span>)</span>
                                <span style={{ color: 'var(--gray)' }}>{r.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepotDashboard;
