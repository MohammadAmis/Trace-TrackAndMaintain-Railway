import React from 'react';

const SLABadge = ({ severity, timer }) => {
    const getStyles = () => {
        switch (severity?.toLowerCase()) {
            case 'critical':
                return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.2)' };
            case 'high':
                return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.2)' };
            case 'medium':
                return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'rgba(59, 130, 246, 0.2)' };
            case 'low':
                return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: 'rgba(16, 185, 129, 0.2)' };
            default:
                return { bg: 'rgba(255, 255, 255, 0.05)', color: 'var(--gray)', border: 'var(--glass-border)' };
        }
    };

    const styles = getStyles();

    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                backgroundColor: styles.bg,
                color: styles.color,
                border: `1px solid ${styles.border}`
            }}>
                {severity}
            </span>
            {timer && (
                <span style={{ fontSize: '0.75rem', color: styles.color, fontWeight: '600', fontFamily: 'monospace' }}>
                    {timer}
                </span>
            )}
        </div>
    );
};

export default SLABadge;
