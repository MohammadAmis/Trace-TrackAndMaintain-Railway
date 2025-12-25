import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const KPICard = ({ title, value, change, icon: Icon, color, bg, trend }) => {
    return (
        <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ padding: '0.75rem', borderRadius: '12px', background: bg || 'rgba(255, 255, 255, 0.05)' }}>
                    <Icon size={24} style={{ color: color || 'var(--primary)' }} />
                </div>
                {change && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: trend === 'up' ? 'var(--success)' : trend === 'down' ? 'var(--danger)' : 'var(--gray)'
                    }}>
                        {trend === 'up' ? <ArrowUpRight size={14} /> : trend === 'down' ? <ArrowDownRight size={14} /> : null}
                        {change}
                    </div>
                )}
            </div>
            <div style={{ marginTop: '1rem' }}>
                <p style={{ color: 'var(--gray)', fontSize: '0.875rem', fontWeight: '500' }}>{title}</p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginTop: '0.25rem', color: 'white' }}>{value}</h3>
            </div>
        </div>
    );
};

export default KPICard;
