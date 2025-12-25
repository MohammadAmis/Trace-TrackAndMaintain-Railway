import React from 'react';
import {
    CheckCircle2, Clock, MapPin, Camera,
    MessageSquare, AlertTriangle, Play
} from 'lucide-react';
import KPICard from '../../components/dashboard/KPICard';
import SLABadge from '../../components/dashboard/SLABadge';

const MaintenanceDashboard = () => {
    const kpis = [
        { title: 'Tasks Assigned Today', value: '6', icon: Play, color: '#3b82f6' },
        { title: 'Overdue Tasks', value: '1', icon: Clock, color: '#ef4444' },
        { title: 'Completed Today', value: '4', icon: CheckCircle2, color: '#10b981' },
    ];

    const tasks = [
        { id: 'TSK-942', train: 'Shatabdi Exp (12001)', coach: 'C4', seat: '42', component: 'Ceiling Fan', desc: 'Fan making loud noise, needs bearing replacement', status: 'In Progress', severity: 'High', timer: '00:45:10' },
        { id: 'TSK-945', train: 'Vande Bharat (22436)', coach: 'E2', seat: '12', component: 'Charging Port', desc: 'Port damaged, pins broken', status: 'Pending', severity: 'Medium', timer: '02:15:00' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {kpis.map((kpi, idx) => (
                    <div key={idx} className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ color: kpi.color, marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                            <kpi.icon size={20} />
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{kpi.value}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--gray)', textTransform: 'uppercase' }}>{kpi.title}</div>
                    </div>
                ))}
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Current Tasks</h3>

            {tasks.map((task, i) => (
                <div key={i} className="glass-card" style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <SLABadge severity={task.severity} timer={task.timer} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>ID: {task.id}</span>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'white' }}>{task.component} Replacement</h4>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--gray)' }}>
                                <MapPin size={14} /> {task.train} | Coach {task.coach}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--gray)' }}>
                                <AlertTriangle size={14} /> Seat {task.seat}
                            </div>
                        </div>
                        <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.4' }}>
                            {task.desc}
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '0.8rem', background: 'var(--secondary)', color: 'white' }}>
                            <Camera size={16} /> Upload Photo
                        </button>
                        <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.8rem' }}>
                            Mark Resolved
                        </button>
                    </div>
                </div>
            ))}

            <button className="btn" style={{ background: 'transparent', border: '1px dashed var(--glass-border)', color: 'var(--gray)', padding: '1rem' }}>
                View Completed Tasks
            </button>
        </div>
    );
};

export default MaintenanceDashboard;
