import React from 'react';
import {
    Activity, AlertCircle, CheckCircle2, Clock,
    Layers, MapPin, TrendingUp, Users
} from 'lucide-react';
import KPICard from '../../components/dashboard/KPICard';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import API_BASE_URL from '../../api/config';

const ZonalDashboard = ({ zoneName = "Northern Railway" }) => {
    const [kpis, setKpis] = React.useState([
        { title: 'Active Trains in Zone', value: '...', icon: MapPin, color: '#3b82f6', change: 'Calculating...', trend: 'up' },
        { title: 'Open Incidents', value: '...', icon: AlertCircle, color: '#f59e0b', change: 'Calculating...', trend: 'up' },
        { title: 'High-Severity (Unassigned)', value: '...', icon: AlertCircle, color: '#ef4444', change: 'Needs Attention', trend: 'down' },
        { title: 'SLA at Risk', value: '...', icon: Clock, color: '#ef4444', change: 'Calculating...', trend: 'up' },
    ]);

    const [depotWorkload, setDepotWorkload] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const [statsRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/analytics/stats`, { headers })
                ]);

                if (statsRes.data.success) {
                    const stats = statsRes.data.data;
                    setKpis([
                        { title: 'Active Trains in Zone', value: stats.totalActiveTrains.toLocaleString(), icon: MapPin, color: '#3b82f6', change: '84% On-Time', trend: 'up' },
                        { title: 'Open Incidents', value: stats.totalReports24h.toString(), icon: AlertCircle, color: '#f59e0b', change: '+5 since morning', trend: 'up' },
                        { title: 'High-Severity (Unassigned)', value: stats.criticalIssues.toString(), icon: AlertCircle, color: '#ef4444', change: 'Needs Attention', trend: 'down' },
                        { title: 'SLA at Risk', value: '8', icon: Clock, color: '#ef4444', change: '-4h avg breach', trend: 'up' },
                    ]);
                }

                // Mocking depot workload for now as we don't have depot-specific analytics endpoint yet
                setDepotWorkload([
                    { name: 'Lucknow', pending: 45, resolved: 30 },
                    { name: 'Ambala', pending: 28, resolved: 25 },
                    { name: 'Delhi', pending: 62, resolved: 40 },
                    { name: 'Firozpur', pending: 21, resolved: 18 },
                ]);

            } catch (err) {
                console.error('Error fetching zonal dashboard data:', err);
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

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                <div className="glass-card">
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Depot Workload & Compliance</h3>
                    <div style={{ height: '350px' }}>
                        <BarChart width={500} height={300} data={depotWorkload}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--gray)', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--gray)', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ background: 'var(--dark)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                                itemStyle={{ color: 'white' }}
                            />
                            <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={30} />
                            <Bar dataKey="resolved" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                    </div>
                </div>

                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Top Delayed Resolutions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                        {[
                            { id: 'INC-742', train: '12423 UP', delay: '14h overdue', severity: 'Critical' },
                            { id: 'INC-811', train: '12001 DN', delay: '8h overdue', severity: 'High' },
                            { id: 'INC-825', train: '22436 UP', delay: '5h overdue', severity: 'High' },
                            { id: 'INC-830', train: '12260 DN', delay: '2h overdue', severity: 'Medium' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{item.train} <span style={{ color: 'var(--primary)', marginLeft: '8px' }}>{item.id}</span></div>
                                    <div style={{ fontSize: '0.75rem', color: '#ef4444' }}>{item.delay}</div>
                                </div>
                                <div style={{ fontSize: '0.7rem', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', background: item.severity === 'Critical' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: item.severity === 'Critical' ? '#ef4444' : '#f59e0b' }}>
                                    {item.severity}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="btn" style={{ marginTop: '1.5rem', width: '100%', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}>
                        View All Incidents
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ZonalDashboard;
