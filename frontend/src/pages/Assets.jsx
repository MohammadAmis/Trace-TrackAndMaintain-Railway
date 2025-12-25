import React, { useState, useEffect } from 'react';
import {
    Plus, Search, Filter, Eye, Edit,
    Train, Settings, Wrench, Building,
    Trash2, ChevronRight, Activity
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import API_BASE_URL from '../api/config';
// const API_BASE_URL = 'http://localhost:5000/api';

const Assets = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('trains');
    const [loading, setLoading] = useState(false);

    // Master data state
    const [trains, setTrains] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [components, setComponents] = useState([]);

    useEffect(() => {
        fetchAssets();
    }, [activeTab]);

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (activeTab === 'trains') {
                const res = await axios.get(`${API_BASE_URL}/masters/trains`, config);
                setTrains(res.data.data);
            } else if (activeTab === 'coaches') {
                const res = await axios.get(`${API_BASE_URL}/masters/coaches`, config);
                setCoaches(res.data.data);
            } else if (activeTab === 'components') {
                const res = await axios.get(`${API_BASE_URL}/masters/components`, config);
                setComponents(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching assets:', err);
        } finally {
            setLoading(true); // Small delay feel
            setTimeout(() => setLoading(false), 300);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Active': case 'Healthy': return { color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' };
            case 'In Repair': case 'Warning': return { color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' };
            case 'Inactive': return { color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' };
            default: return { color: 'var(--gray)', background: 'rgba(255, 255, 255, 0.05)' };
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Asset Management</h2>
                    <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Comprehensive database of Trains, Coaches, and Components</p>
                </div>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Add New Asset
                </button>
            </div>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
                {[
                    { id: 'trains', icon: Train, label: 'Trains' },
                    { id: 'coaches', icon: Settings, label: 'Coaches' },
                    { id: 'components', icon: Wrench, label: 'Components' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                            color: activeTab === tab.id ? 'white' : 'var(--gray)',
                            fontSize: '0.9rem',
                            fontWeight: activeTab === tab.id ? '600' : '400'
                        }}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Filters Bar */}
            <div className="glass-card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', padding: '1rem' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                    />
                </div>
                <button className="btn" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Filter size={16} /> Filters
                </button>
            </div>

            {/* Assets Table */}
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>
                        {activeTab === 'trains' && (
                            <tr>
                                <th style={{ padding: '1rem' }}>Train ID</th>
                                <th style={{ padding: '1rem' }}>Name</th>
                                <th style={{ padding: '1rem' }}>Zone/Div</th>
                                <th style={{ padding: '1rem' }}>Coaches</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        )}
                        {activeTab === 'coaches' && (
                            <tr>
                                <th style={{ padding: '1rem' }}>Coach ID</th>
                                <th style={{ padding: '1rem' }}>Parent Train</th>
                                <th style={{ padding: '1rem' }}>Position</th>
                                <th style={{ padding: '1rem' }}>Type</th>
                                <th style={{ padding: '1rem' }}>Components</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        )}
                        {activeTab === 'components' && (
                            <tr>
                                <th style={{ padding: '1rem' }}>UID</th>
                                <th style={{ padding: '1rem' }}>Component Name</th>
                                <th style={{ padding: '1rem' }}>Type/Dept</th>
                                <th style={{ padding: '1rem' }}>Coach</th>
                                <th style={{ padding: '1rem' }}>Health</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        )}
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray)' }}>Fetching assets...</td>
                            </tr>
                        ) : activeTab === 'trains' ? (
                            trains.map((train) => (
                                <tr key={train.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem', fontWeight: '600' }}>{train.trainId}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div>{train.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{train.type}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontSize: '0.85rem' }}>{train.zone} Zone</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{train.division} Division</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{train.coaches}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', ...getStatusStyle(train.status) }}>
                                            {train.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn-icon"><Eye size={16} /></button>
                                            <button className="btn-icon"><Edit size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : activeTab === 'coaches' ? (
                            coaches.map((coach) => (
                                <tr key={coach._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem', fontWeight: '600' }}>{coach.coachId}</td>
                                    <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Train size={12} color="var(--primary)" /> {coach.trainId}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{coach.position}</td>
                                    <td style={{ padding: '1rem' }}><span style={{ padding: '2px 8px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '0.7rem' }}>{coach.type}</span></td>
                                    <td style={{ padding: '1rem' }}>{coach.components}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', ...getStatusStyle(coach.status) }}>
                                            {coach.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}><button className="btn-icon"><Eye size={16} /></button></td>
                                </tr>
                            ))
                        ) : (
                            components.map((comp) => (
                                <tr key={comp._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem', fontWeight: '600', fontSize: '0.85rem' }}>{comp.uid}</td>
                                    <td style={{ padding: '1rem' }}>{comp.name}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontSize: '0.85rem' }}>{comp.type}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{comp.department}</div>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.85rem' }}>Coach {comp.coachId}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', ...getStatusStyle(comp.status) }}>
                                            {comp.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}><button className="btn-icon"><Activity size={16} /></button></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <style>{`
                .btn-icon {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid var(--glass-border);
                    color: var(--gray);
                    padding: 6px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-icon:hover {
                    color: white;
                    background: rgba(255,255,255,0.1);
                    border-color: var(--primary);
                }
            `}</style>
        </div >
    );
};

export default Assets;
