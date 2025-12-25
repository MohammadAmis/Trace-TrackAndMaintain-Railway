import React, { useState, useEffect, useCallback } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
    Download, Calendar, Filter, TrendingUp, AlertTriangle,
    CheckCircle, Clock, Zap, RefreshCw, BarChart3
} from 'lucide-react';
import axios from 'axios';

// Constants
const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#10b981'];
import API_BASE_URL from '../api/config';

// Utility components
const Badge = ({ children, variant = 'neutral' }) => {
    const styles = {
        padding: '2px 8px',
        fontSize: '0.75rem',
        fontWeight: '600',
        borderRadius: '6px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
    };

    const variants = {
        positive: { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
        negative: { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
        neutral: { backgroundColor: 'rgba(100, 116, 139, 0.1)', color: '#94a3b8' }
    };

    return (
        <span style={{ ...styles, ...variants[variant] }}>
            {children}
        </span>
    );
};

const Card = ({ children, style = {}, className = '' }) => (
    <div className={`glass-card ${className}`} style={{ marginBottom: '1rem', ...style }}>
        {children}
    </div>
);

const Skeleton = ({ height = '1rem', width = '100%' }) => (
    <div style={{
        height,
        width,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: '8px',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        marginBottom: '0.5rem'
    }} />
);

// Main component
const Analytics = () => {
    const [performanceData, setPerformanceData] = useState([]);
    const [distributionData, setDistributionData] = useState([]);
    const [kpis, setKpis] = useState([]);
    const [loading, setLoading] = useState({ kpis: true, charts: true });
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchAnalytics = useCallback(async () => {
        setLoading({ kpis: true, charts: true });
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [statsRes, componentsRes, trendsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/analytics/stats`, config),
                axios.get(`${API_BASE_URL}/analytics/components`, config),
                axios.get(`${API_BASE_URL}/analytics/trends`, config)
            ]);

            if (statsRes.data?.success) {
                const stats = statsRes.data.data;
                setKpis([
                    { label: 'Avg Resolution Time', value: stats.avgResolutionTime, trend: '-12%', trendColor: 'positive', icon: Clock },
                    { label: 'Success Rate', value: `${stats.successRate}%`, trend: `+${stats.successRateChange}%`, trendColor: 'positive', icon: TrendingUp },
                    { label: 'Critical Failures', value: stats.criticalIssues.toString(), trend: `-${stats.criticalIssuesChange}`, trendColor: 'negative', icon: AlertTriangle },
                    { label: 'System Uptime', value: '99.9%', trend: 'Stable', trendColor: 'neutral', icon: Zap }
                ]);
            }

            if (componentsRes.data?.success) {
                setDistributionData(
                    componentsRes.data.data.map((c, i) => ({
                        name: c.name,
                        value: Math.round(c.val),
                        color: COLORS[i % COLORS.length]
                    }))
                );
            }

            if (trendsRes.data?.success) {
                setPerformanceData(
                    trendsRes.data.data.map((d) => ({
                        name: d.name,
                        v: d.v
                    }))
                );
            }

            setLastUpdated(new Date());
        } catch (err) {
            const message = axios.isAxiosError(err) ? err.response?.data?.message : 'Failed to load analytics';
            setError(message || 'An unexpected error occurred');
            console.error('Analytics fetch error:', err);
        } finally {
            setLoading({ kpis: false, charts: false });
        }
    }, []);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    return (
        <div style={{ padding: '1rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        <Zap size={16} />
                        <span>SYSTEM ANALYTICS</span>
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Analytics Overview</h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--gray)' }}>
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                    <button
                        onClick={fetchAnalytics}
                        className="btn glass-card"
                        style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        disabled={loading.charts || loading.kpis}
                    >
                        <RefreshCw size={18} className={loading.charts || loading.kpis ? 'animate-spin' : ''} />
                    </button>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Download size={18} />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Grid Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* KPI Sidebar Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Card style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>Key Metrics</h2>
                            <Filter size={16} style={{ color: 'var(--gray)', cursor: 'pointer' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {loading.kpis ? (
                                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height="4rem" />)
                            ) : (
                                kpis.map((kpi, idx) => {
                                    const Icon = kpi.icon;
                                    return (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
                                            <div style={{
                                                padding: '0.5rem',
                                                borderRadius: '8px',
                                                backgroundColor: 'rgba(255,255,255,0.05)',
                                                color: kpi.trendColor === 'positive' ? 'var(--success)' : kpi.trendColor === 'negative' ? 'var(--danger)' : 'var(--gray)'
                                            }}>
                                                <Icon size={20} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--gray)', fontWeight: '500' }}>{kpi.label}</p>
                                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{kpi.value}</span>
                                                    <Badge variant={kpi.trendColor}>{kpi.trend}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </Card>

                    <Card style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(200, 16, 46, 0.1), rgba(0, 0, 0, 0))' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <CheckCircle size={20} style={{ color: 'var(--success)' }} />
                            <div>
                                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>System Healthy</h4>
                                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--gray)' }}>All nodes operational. Automated checks running every 5s.</p>
                            </div>
                        </div>
                    </Card>

                    {error && (
                        <Card style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <AlertTriangle size={20} style={{ color: 'var(--danger)' }} />
                                <div>
                                    <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--danger)' }}>Error Loading Data</h4>
                                    <p style={{ margin: 0, fontSize: '0.875rem' }}>{error}</p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Main Content Column */}
                <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Performance Trends */}
                    <Card style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Performance Trends</h3>
                            <Badge variant="neutral">LIVE</Badge>
                        </div>
                        <div style={{ height: '350px', width: '100%' }}>
                            {loading.charts ? (
                                <Skeleton height="100%" />
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={performanceData}>
                                        <defs>
                                            <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis dataKey="name" stroke="var(--gray)" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="var(--gray)" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ background: 'var(--dark)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
                                        <Area type="monotone" dataKey="v" stroke="var(--primary)" strokeWidth={2} fill="url(#performanceGradient)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </Card>

                    {/* Bottom Charts Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        <Card style={{ padding: '1.5rem' }}>
                            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1rem' }}>Issue Distribution</h3>
                            <div style={{ height: '200px' }}>
                                {loading.charts ? (
                                    <Skeleton height="100%" />
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={distributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                                {distributionData.map((entry, index) => (
                                                    <Cell key={index} fill={entry.color} stroke="none" />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                {distributionData.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                                            <span style={{ fontSize: '0.875rem', color: 'var(--gray)' }}>{item.name}</span>
                                        </div>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card style={{ padding: '1.5rem' }}>
                            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1rem' }}>Category Breakdown</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {distributionData.map((item, idx) => (
                                    <div key={idx}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                            <span>{item.name}</span>
                                            <span style={{ fontWeight: 'bold' }}>{item.value}%</span>
                                        </div>
                                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${item.value}%`, background: item.color, borderRadius: '3px' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
