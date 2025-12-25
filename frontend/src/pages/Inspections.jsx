import React, { useState, useEffect } from 'react';
import {
    ClipboardList, Camera, Search, Filter,
    MapPin, Clock, CheckCircle, AlertTriangle,
    Eye, QrCode, User
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import API_BASE_URL from '../api/config';
// const API_BASE_URL = 'http://localhost:5000/api';

const Inspections = () => {
    const { user } = useAuth();
    const [inspections, setInspections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInspections();
    }, []);

    const fetchInspections = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`${API_BASE_URL}/inspections`, config);
            setInspections(res.data.data);
        } catch (err) {
            console.error('Error fetching inspections:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'COMPLETED': return { color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' };
            case 'PENDING_REPAIR': return { color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' };
            case 'IN_PROGRESS': return { color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' };
            default: return { color: 'var(--gray)', background: 'rgba(255, 255, 255, 0.05)' };
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Inspection Logs</h2>
                    <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Activity stream for component scans and manual inspections</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <QrCode size={18} /> New Scan
                    </button>
                    <button className="btn-primary" style={{ padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(59, 130, 246, 0.2)', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                        <ClipboardList size={18} /> Manual Entry
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', padding: '1rem' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
                    <input
                        type="text"
                        placeholder="Search inspections by asset, inspector or findings..."
                        style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                    />
                </div>
                <select className="input-select" style={{ width: '150px' }}>
                    <option value="">All Types</option>
                    <option value="QR">QR Scans</option>
                    <option value="Manual">Manual</option>
                    <option value="Routine">Routine</option>
                </select>
                <button className="btn-icon" style={{ padding: '0.6rem' }}><Filter size={18} /></button>
            </div>

            {/* Inspection Timeline/List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {loading ? (
                    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray)' }}>Loading inspection history...</div>
                ) : (
                    inspections.map((insp) => (
                        <div key={insp.id} className="glass-card" style={{ padding: '1.25rem', transition: 'transform 0.2s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: insp.type.includes('QR') ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.05)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        {insp.type.includes('QR') ? <QrCode size={20} color="#3b82f6" /> : <ClipboardList size={20} color="var(--gray)" />}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '700', fontSize: '1rem' }}>{insp.assetId}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <User size={12} /> {insp.inspector} • {insp.type}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.7rem',
                                        fontWeight: '700',
                                        ...getStatusStyle(insp.status)
                                    }}>
                                        {insp.status.replace('_', ' ')}
                                    </span>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                                        <Clock size={12} /> {insp.date}
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', marginBottom: '1rem' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--gray)', marginBottom: '4px' }}>Findings:</div>
                                <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{insp.findings}</p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                <button className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Camera size={14} /> View Images
                                </button>
                                <button className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Eye size={14} /> Full Report
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
                .btn-icon {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid var(--glass-border);
                    color: var(--gray);
                    padding: 8px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-icon:hover {
                    color: white;
                    background: rgba(255,255,255,0.1);
                    border-color: var(--primary);
                }
            `}</style>
        </div>
    );
};

export default Inspections;
