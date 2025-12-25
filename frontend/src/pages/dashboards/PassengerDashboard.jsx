import React from 'react';
import {
    MessageCircle, List, User, Bell,
    Send, CheckCircle, Clock, MapPin
} from 'lucide-react';

const PassengerDashboard = () => {
    const reports = [
        { id: 'PAS-782', component: 'Ceiling Fan', status: 'Resolved', date: '21 Dec, 14:20' },
        { id: 'PAS-911', component: 'Charging Port', status: 'Assigned', date: '21 Dec, 16:45' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '500px', margin: '0 auto' }}>
            {/* Promo / Hero */}
            <div style={{ padding: '1.5rem', borderRadius: '24px', background: 'linear-gradient(135deg, var(--primary) 0%, #a00d25 100%)', color: 'white' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>How's your journey?</h2>
                <p style={{ fontSize: '0.85rem', opacity: 0.9, lineHeight: '1.4' }}>Help us maintain world-class cleanliness and fittings. Report any issue instantly.</p>
                <button className="btn" style={{ marginTop: '1.5rem', width: '100%', background: 'white', color: 'var(--primary)', fontWeight: '700', borderRadius: '12px' }}>
                    Report a Problem
                </button>
            </div>

            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>My Reports</h3>
                    <List size={18} style={{ color: 'var(--gray)' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {reports.map((report, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: report.status === 'Resolved' ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {report.status === 'Resolved' ? <CheckCircle size={20} style={{ color: 'var(--success)' }} /> : <Clock size={20} style={{ color: '#3b82f6' }} />}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{report.component}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{report.date} • {report.id}</div>
                            </div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: report.status === 'Resolved' ? 'var(--success)' : '#3b82f6' }}>
                                {report.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '1rem', background: 'var(--glass)', borderRadius: '20px', position: 'sticky', bottom: '1rem', border: '1px solid var(--glass-border)', backdropFilter: 'blur(20px)' }}>
                <div style={{ color: 'var(--primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <MessageCircle size={20} />
                    <span style={{ fontSize: '0.65rem' }}>Reports</span>
                </div>
                <div style={{ color: 'var(--gray)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <Bell size={20} />
                    <span style={{ fontSize: '0.65rem' }}>Alerts</span>
                </div>
                <div style={{ color: 'var(--gray)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <User size={20} />
                    <span style={{ fontSize: '0.65rem' }}>Profile</span>
                </div>
            </div>
        </div>
    );
};

export default PassengerDashboard;
