import React from 'react';
import {
    QrCode, Search, CheckSquare, AlertCircle,
    Camera, History, MapPin, ShieldCheck
} from 'lucide-react';
import KPICard from '../../components/dashboard/KPICard';

const InspectorDashboard = () => {
    const kpis = [
        { title: 'Inspections Due', value: '12', icon: CheckSquare, color: '#3b82f6' },
        { title: 'Completed (7d)', value: '48', icon: ShieldCheck, color: '#10b981' },
        { title: 'Critical Flags', value: '3', icon: AlertCircle, color: '#ef4444' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            {/* Primary Action */}
            <button className="btn btn-primary" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', boxShadow: '0 8px 24px rgba(200, 16, 46, 0.3)' }}>
                <QrCode size={48} />
                <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>Scan QR to Inspect</span>
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button className="btn" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                    <Search size={18} /> Manual Search
                </button>
                <button className="btn" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                    <History size={18} /> My Logs
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {kpis.map((kpi, idx) => (
                    <div key={idx} className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: kpi.color }}>{kpi.value}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--gray)', textTransform: 'uppercase', marginTop: '4px' }}>{kpi.title}</div>
                    </div>
                ))}
            </div>

            <div className="glass-card">
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.25rem' }}>Upcoming Inspections</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                        { train: '12001 DN', coach: 'C4', time: 'Arriving In 20m', status: 'Near' },
                        { train: '22436 UP', coach: 'B2', time: 'Arriving In 1h 10m', status: 'Far' },
                    ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{item.train} | Coach {item.coach}</div>
                                <div style={{ fontSize: '0.75rem', color: item.status === 'Near' ? 'var(--warning)' : 'var(--gray)' }}>{item.time}</div>
                            </div>
                            <MapPin size={18} style={{ color: 'var(--gray)' }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InspectorDashboard;
