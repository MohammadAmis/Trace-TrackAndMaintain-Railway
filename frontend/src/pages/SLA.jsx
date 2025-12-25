import React, { useState, useEffect } from 'react';
import {
    Clock, AlertTriangle, Zap, TrendingUp,
    ChevronRight, Bell, ShieldAlert, BarChart3
} from 'lucide-react';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, LineChart, Line
} from 'recharts';

import axios from 'axios';

import API_BASE_URL from '../api/config';
// const API_BASE_URL = 'http://localhost:5000/api';

const SLA = () => {
    const [slaMetrics, setSlaMetrics] = useState({
        overall: 94.2,
        critical: 98.5,
        high: 92.1,
        medium: 89.4,
        low: 95.8
    });

    const [reports, setReports] = useState([]);
    const [summary, setSummary] = useState({ overallCompliance: 94.2, criticalEscalations: 0 });
    const [escalationList, setEscalationList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSLAData();
    }, []);

    const fetchSLAData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [summaryRes, escalationsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/sla/summary`, config),
                axios.get(`${API_BASE_URL}/sla/escalations`, config)
            ]);

            if (summaryRes.data.success) {
                setSummary(summaryRes.data.data);
            }
            if (escalationsRes.data.success) {
                setEscalationList(escalationsRes.data.data);
            }
        } catch (err) {
            console.error('Error fetching SLA data:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculateTimeLeft = (deadline) => {
        const now = new Date();
        const due = new Date(deadline);
        const diff = due - now;

        const hours = Math.floor(Math.abs(diff) / (1000 * 60 * 60));
        const minutes = Math.floor((Math.abs(diff) % (1000 * 60 * 60)) / (1000 * 60));

        const sign = diff < 0 ? '-' : '';
        return `${sign}${hours}h ${minutes}m`;
    };

    const weeklyPerformance = [
        { day: 'Mon', compliance: 92 },
        { day: 'Tue', compliance: 95 },
        { day: 'Wed', compliance: 94 },
        { day: 'Thu', compliance: 91 },
        { day: 'Fri', compliance: 96 },
        { day: 'Sat', compliance: 98 },
        { day: 'Sun', compliance: 94 },
    ];

    const getSLAColor = (value) => {
        if (value >= 95) return '#10b981';
        if (value >= 90) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>SLA & Escalations</h2>
                    <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Real-time monitoring of Service Level Agreements and critical alerts</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)', padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Bell size={16} /> Notification Rules
                    </button>
                    <button className="btn-primary glass-card" style={{ padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>Update Thresholds</button>
                </div>
            </div>

            {/* Performance Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="glass-card" style={{ borderLeft: '4px solid #ef4444' }}>
                    <div style={{ color: 'var(--gray)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Active Crit. Escalations</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ef4444' }}>{summary.criticalEscalations}</div>
                    <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>Tickets past deadline | <span style={{ color: '#ef4444' }}>Action Req.</span></div>
                </div>
                <div className="glass-card" style={{ borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ color: 'var(--gray)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Overall SLA Compliance</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: getSLAColor(summary.overallCompliance) }}>{summary.overallCompliance}%</div>
                    <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>Target: 95.0% | <span style={{ color: summary.overallCompliance >= 95 ? '#10b981' : '#ef4444' }}>
                        {summary.overallCompliance >= 95 ? 'Above Target' : 'Below Target'}
                    </span></div>
                </div>
                <div className="glass-card" style={{ borderLeft: '4px solid #3b82f6' }}>
                    <div style={{ color: 'var(--gray)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Total Tickets</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#3b82f6' }}>{summary.totalTickets || 0}</div>
                    <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>All categories | <span style={{ color: 'var(--gray)' }}>Live</span></div>
                </div>
                <div className="glass-card" style={{ borderLeft: '4px solid #a855f7' }}>
                    <div style={{ color: 'var(--gray)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>System Integrity</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#a855f7' }}>99.9%</div>
                    <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>Platform Uptime | <span style={{ color: '#10b981' }}>Stable</span></div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                {/* Performance Chart */}
                <div className="glass-card">
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Weekly Compliance Trend</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyPerformance}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--gray)', fontSize: 12 }} />
                                <YAxis domain={[80, 100]} axisLine={false} tickLine={false} tick={{ fill: 'var(--gray)', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ background: 'var(--dark)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'white' }}
                                />
                                <Bar dataKey="compliance" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Active Escalations */}
                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Active Escalations</h3>
                        <ShieldAlert size={18} color="#ef4444" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                        {escalationList.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--gray)', padding: '2rem' }}>No active escalations</div>
                        ) : (
                            escalationList.map((esc) => {
                                const timeLeft = calculateTimeLeft(esc.slaDeadline);
                                const isBreached = timeLeft.startsWith('-');
                                return (
                                    <div key={esc._id} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{esc.reportId}</span>
                                            <span style={{
                                                fontSize: '0.7rem',
                                                color: isBreached ? '#ef4444' : '#f59e0b',
                                                fontWeight: '700'
                                            }}>
                                                {isBreached ? 'BREACHED' : 'DUE SOON'}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--gray)', display: 'flex', justifyContent: 'space-between' }}>
                                            <span>{esc.severity === 'CRITICAL' ? 'Level 2' : 'Level 1'} Escalation</span>
                                            <span>{timeLeft}</span>
                                        </div>
                                        <div style={{ marginTop: '8px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: 'white' }}>{esc.assignedTo?.name || 'Unassigned'}</span>
                                            <button className="btn" style={{ padding: '2px 8px', fontSize: '0.7rem', border: '1px solid var(--glass-border)' }}>View</button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Threshold Definitions (Demo logic) */}
            <div className="glass-card">
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Defined SLA Thresholds (Railway Standard)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {[
                        { level: 'CRITICAL', time: '4 Hours', color: '#ef4444', desc: 'Direct escalation to Sr. DME/DEE and Zonal HQ' },
                        { level: 'HIGH', time: '24 Hours', color: '#ff944d', desc: 'Escalation to Depot Officer and AME/ADEE' },
                        { level: 'MEDIUM', time: '3 Days', color: '#f59e0b', desc: 'Auto-reminder to SSE and Maintenance Lead' },
                        { level: 'LOW', time: '7 Days', color: '#10b981', desc: 'Standard maintenance cycle resolution' }
                    ].map((sla, i) => (
                        <div key={i} style={{ padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}>
                            <div style={{ color: sla.color, fontWeight: '700', fontSize: '0.8rem', marginBottom: '4px' }}>{sla.level}</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>{sla.time}</div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--gray)', lineHeight: '1.4' }}>{sla.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SLA;
