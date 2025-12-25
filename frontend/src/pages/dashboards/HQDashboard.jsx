import React from 'react';
import {
    Train, AlertTriangle, CheckCircle, Clock,
    BarChart3, Map as MapIcon, Calendar, Filter
} from 'lucide-react';
import KPICard from '../../components/dashboard/KPICard';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import axios from 'axios';
import API_BASE_URL from '../../api/config';

const HQDashboard = () => {
    const [kpis, setKpis] = React.useState([
        { title: 'Total Active Trains', value: '...', icon: Train, color: '#3b82f6', change: 'Live Tracking', trend: 'up' },
        { title: 'Total Reports (24h)', value: '...', icon: AlertTriangle, color: '#f59e0b', change: '+0%', trend: 'up' },
        { title: 'Critical Safety Issues', value: '...', icon: AlertTriangle, color: '#ef4444', change: '0%', trend: 'down' },
        { title: 'Avg Resolution Time', value: '...', icon: Clock, color: '#10b981', change: 'Within SLA', trend: 'up' },
    ]);

    const [zoneData, setZoneData] = React.useState([]);
    const [trends, setTrends] = React.useState([]);
    const [components, setComponents] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const [statsRes, zonesRes, componentsRes, trendsRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/analytics/stats`, { headers }),
                    axios.get(`${API_BASE_URL}/analytics/zones`, { headers }),
                    axios.get(`${API_BASE_URL}/analytics/components`, { headers }),
                    axios.get(`${API_BASE_URL}/analytics/trends`, { headers })
                ]);

                if (statsRes.data.success) {
                    const stats = statsRes.data.data;
                    setKpis([
                        { title: 'Total Active Trains', value: stats.totalActiveTrains.toLocaleString(), icon: Train, color: '#3b82f6', change: 'Live Tracking', trend: 'up' },
                        { title: 'Total Reports (24h)', value: stats.totalReports24h.toString(), icon: AlertTriangle, color: '#f59e0b', change: '+12%', trend: 'up' },
                        { title: 'Critical Safety Issues', value: stats.criticalIssues.toString(), icon: AlertTriangle, color: '#ef4444', change: '-2%', trend: 'down' },
                        { title: 'Avg Resolution Time', value: stats.avgResolutionTime, icon: Clock, color: '#10b981', change: 'Within SLA', trend: 'up' },
                    ]);
                }

                if (zonesRes.data.success) setZoneData(zonesRes.data.data);
                if (trendsRes.data.success) setTrends(trendsRes.data.data);
                if (componentsRes.data.success) setComponents(componentsRes.data.data);

            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* KPI Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                {kpis.map((kpi, idx) => (
                    <KPICard key={idx} {...kpi} />
                ))}
            </div>

            {/* Main Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                {/* Zone-wise Heatmap Placeholder */}
                <div className="glass-card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>India Zone-wise Incident Heatmap</h3>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}>
                                <Filter size={14} style={{ marginRight: '4px' }} /> Filter
                            </button>
                        </div>
                    </div>
                    <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '1rem', border: '1px dashed var(--glass-border)' }}>
                        <MapIcon size={48} style={{ color: 'var(--gray)', opacity: 0.5 }} />
                        <p style={{ color: 'var(--gray)' }}>Interactive Railway Map Loading...</p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }}></div> <span style={{ fontSize: '0.75rem' }}>Critical</span></div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }}></div> <span style={{ fontSize: '0.75rem' }}>High</span></div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3b82f6' }}></div> <span style={{ fontSize: '0.75rem' }}>Low</span></div>
                        </div>
                    </div>
                </div>

                {/* Zone Performance */}
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Zone Performance</h3>
                    <div style={{ flex: 1, minHeight: '300px' }}>
                        <BarChart width={300} height={300} data={zoneData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--gray)', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ background: 'var(--dark)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                                itemStyle={{ color: 'white' }}
                            />
                            <Bar dataKey="issues" fill="rgba(59, 130, 246, 0.5)" radius={[0, 4, 4, 0]} barSize={20} />
                            <Bar dataKey="resolved" fill="var(--success)" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                <div className="glass-card">
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--gray)', marginBottom: '1rem' }}>Resolution Trends</h4>
                    <div style={{ height: '200px' }}>
                        <LineChart width={250} height={180} data={trends}>
                            <Line type="monotone" dataKey="v" stroke="var(--primary)" strokeWidth={2} dot={false} />
                            <Tooltip hide />
                        </LineChart>
                    </div>
                </div>
                <div className="glass-card">
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--gray)', marginBottom: '1rem' }}>Recent Critical Issues</h4>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--gray)' }}>Issue ID</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--gray)' }}>Train</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--gray)' }}>Severity</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--gray)' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: '600' }}>REP-742</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>Brake pressure drop in B2</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>Shatabdi Exp</td>
                                    <td style={{ padding: '1rem' }}><span style={{ color: '#ef4444', fontWeight: '700' }}>CRITICAL</span></td>
                                    <td style={{ padding: '1rem' }}>Escalated (Level 2)</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: '600' }}>REP-419</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>AC failure across Coach A1</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>Rajdhani Exp</td>
                                    <td style={{ padding: '1rem' }}><span style={{ color: '#ef4444', fontWeight: '700' }}>CRITICAL</span></td>
                                    <td style={{ padding: '1rem' }}>Escalated (Level 3)</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: '600' }}>REP-811</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>Water pump bearing failure</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>Nanda Devi Exp</td>
                                    <td style={{ padding: '1rem' }}><span style={{ color: '#ff944d', fontWeight: '700' }}>HIGH</span></td>
                                    <td style={{ padding: '1rem' }}>Resolution Pending</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="glass-card">
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--gray)', marginBottom: '1rem' }}>Vendor SLAs</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {['L&T Electricals', 'BHEL Systems', 'Modern Rail Tech'].map((v, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.85rem' }}>{v}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: '600' }}>98.2%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HQDashboard;
