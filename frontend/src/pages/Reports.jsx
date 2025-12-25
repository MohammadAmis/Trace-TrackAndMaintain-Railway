import React, { useState, useEffect } from 'react';
import {
    Plus, Search, Filter, Eye, Edit,
    AlertTriangle, Clock, CheckCircle, FileText,
    Train, ChevronRight, MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

import API_BASE_URL from '../api/config';
// const API_BASE_URL = 'http://localhost:5000/api';

const Reports = () => {
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Master data state
    const [trains, setTrains] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [components, setComponents] = useState([]);
    const [departments, setDepartments] = useState([]);

    // Form state
    const [newReport, setNewReport] = useState({
        trainId: '',
        coachId: '',
        componentId: '',
        departmentId: '',
        title: '',
        description: '',
        severity: 'MEDIUM',
        priority: 'MEDIUM',
        location: ''
    });

    useEffect(() => {
        fetchReports();
        fetchMasterData();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`${API_BASE_URL}/reports`, config);
            setReports(res.data.data);
        } catch (err) {
            console.error('Error fetching reports:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMasterData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [trainsRes, coachesRes, componentsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/masters/trains`, config),
                axios.get(`${API_BASE_URL}/masters/coaches`, config),
                axios.get(`${API_BASE_URL}/masters/components`, config)
            ]);

            setTrains(trainsRes.data.data);
            setCoaches(coachesRes.data.data);
            setComponents(componentsRes.data.data);
        } catch (err) {
            console.error('Error fetching master data:', err);
        }
    };

    const handleTrainChange = (trainId) => {
        setNewReport({ ...newReport, trainId, coachId: '', componentId: '' });
    };

    const handleCoachChange = (coachId) => {
        setNewReport({ ...newReport, coachId, componentId: '' });
    };

    const getSeverityStyle = (severity) => {
        switch (severity) {
            case 'CRITICAL': return { color: '#ff4d4d', background: 'rgba(255, 77, 77, 0.1)' };
            case 'HIGH': return { color: '#ff944d', background: 'rgba(255, 148, 77, 0.1)' };
            case 'MEDIUM': return { color: '#ffdb4d', background: 'rgba(255, 219, 77, 0.1)' };
            default: return { color: '#4dff88', background: 'rgba(77, 255, 136, 0.1)' };
        }
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Map form state to backend expected field names
            const reportData = {
                reportId: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
                train: newReport.trainId,
                coach: newReport.coachId,
                component: newReport.componentId,
                severity: newReport.severity,
                findings: newReport.description,
                zone: user.zone
            };

            await axios.post(`${API_BASE_URL}/reports`, reportData, config);
            setShowCreateModal(false);
            fetchReports();
            setNewReport({
                trainId: '',
                coachId: '',
                componentId: '',
                departmentId: '',
                title: '',
                description: '',
                severity: 'MEDIUM',
                priority: 'MEDIUM',
                location: ''
            });
        } catch (err) {
            console.error('Error submitting report:', err);
            alert('Failed to submit report. Please check if all fields are selected.');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'OPEN': return { color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)' };
            case 'IN_PROGRESS': return { color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' };
            case 'RESOLVED': return { color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' };
            default: return { color: 'var(--gray)', background: 'rgba(255, 255, 255, 0.05)' };
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Maintenance Reports</h2>
                    <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Comprehensive view of all logged issues and their status</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary glass-card"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={18} /> New Report
                </button>
            </div>

            {/* Filters Bar */}
            <div className="glass-card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', padding: '1rem' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
                    <input
                        type="text"
                        placeholder="Search by Report ID, Title or Train..."
                        style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                    />
                </div>
                <select className="input-select" style={{ width: '150px' }}>
                    <option value="">All Severities</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                </select>
                <select className="input-select" style={{ width: '150px' }}>
                    <option value="">All Statuses</option>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                </select>
            </div>

            {/* Reports List */}
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>
                        <tr>
                            <th style={{ padding: '1rem' }}>Report Details</th>
                            <th style={{ padding: '1rem' }}>Train & Assets</th>
                            <th style={{ padding: '1rem' }}>Severity</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray)' }}>Loading reports...</td>
                            </tr>
                        ) : (
                            reports.map((report) => (
                                <tr key={report._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem', fontWeight: '600' }}>{report.reportId}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{report.findings || 'No description provided'}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <MapPin size={10} /> {report.location || 'Global'}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontSize: '0.85rem' }}>{report.train?.trainId}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{report.coach?.coachId}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', ...getSeverityStyle(report.severity) }}>
                                            {report.severity}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                                            {report.status === 'RESOLVED' ? <CheckCircle size={14} color="#10b981" /> : <Clock size={14} color="#f59e0b" />}
                                            {report.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--gray)' }}>
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn-icon" title="View Details"><Eye size={16} /></button>
                                            <button className="btn-icon" title="Edit Report"><Edit size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create Report Modal (Implementation of Demo Logic) */}
            {showCreateModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="glass-card" style={{ width: '600px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Create New Maintenance Report</h3>
                            <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div className="form-group">
                                <label style={{ fontSize: '0.8rem', color: 'var(--gray)', display: 'block', marginBottom: '4px' }}>Train</label>
                                <select
                                    className="input-select"
                                    value={newReport.trainId}
                                    onChange={(e) => handleTrainChange(e.target.value)}
                                    style={{ width: '100%' }}
                                >
                                    <option value="">Select Train</option>
                                    {trains.map(t => <option key={t._id} value={t._id}>{t.trainId} - {t.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.8rem', color: 'var(--gray)', display: 'block', marginBottom: '4px' }}>Coach</label>
                                <select
                                    className="input-select"
                                    disabled={!newReport.trainId}
                                    value={newReport.coachId}
                                    onChange={(e) => handleCoachChange(e.target.value)}
                                    style={{ width: '100%' }}
                                >
                                    <option value="">Select Coach</option>
                                    {coaches
                                        .filter(c => (c.trainRef?._id || c.trainRef) === newReport.trainId)
                                        .map(c => <option key={c._id} value={c._id}>{c.coachId}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.8rem', color: 'var(--gray)', display: 'block', marginBottom: '4px' }}>Component</label>
                                <select
                                    className="input-select"
                                    disabled={!newReport.coachId}
                                    value={newReport.componentId}
                                    onChange={(e) => setNewReport({ ...newReport, componentId: e.target.value })}
                                    style={{ width: '100%' }}
                                >
                                    <option value="">Select Component</option>
                                    {components
                                        .filter(c => (c.coachRef?._id || c.coachRef) === newReport.coachId)
                                        .map(comp => <option key={comp._id} value={comp._id}>{comp.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.8rem', color: 'var(--gray)', display: 'block', marginBottom: '4px' }}>Department</label>
                                <select
                                    className="input-select"
                                    value={newReport.departmentId}
                                    onChange={(e) => setNewReport({ ...newReport, departmentId: e.target.value })}
                                    style={{ width: '100%' }}
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--gray)', display: 'block', marginBottom: '4px' }}>Report Title</label>
                            <input
                                type="text"
                                className="input-select"
                                style={{ width: '100%' }}
                                placeholder="Brief summary of the issue"
                                value={newReport.title}
                                onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--gray)', display: 'block', marginBottom: '4px' }}>Detailed Description</label>
                            <textarea
                                className="input-select"
                                style={{ width: '100%', minHeight: '80px', padding: '10px' }}
                                placeholder="Provide more details about the problem..."
                                value={newReport.description}
                                onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div className="form-group">
                                <label style={{ fontSize: '0.8rem', color: 'var(--gray)', display: 'block', marginBottom: '4px' }}>Severity</label>
                                <select
                                    className="input-select"
                                    style={{ width: '100%' }}
                                    value={newReport.severity}
                                    onChange={(e) => setNewReport({ ...newReport, severity: e.target.value })}
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="CRITICAL">Critical</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.8rem', color: 'var(--gray)', display: 'block', marginBottom: '4px' }}>Priority</label>
                                <select
                                    className="input-select"
                                    style={{ width: '100%' }}
                                    value={newReport.priority}
                                    onChange={(e) => setNewReport({ ...newReport, priority: e.target.value })}
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="URGENT">Urgent</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowCreateModal(false)} className="btn" style={{ border: '1px solid var(--glass-border)', background: 'transparent' }}>Cancel</button>
                            <button className="btn-primary" onClick={handleSubmit}>Submit Report</button>
                        </div>
                    </div>
                </div>
            )}

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
                .input-select {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid var(--glass-border);
                    border-radius: 8px;
                    padding: 0.6rem;
                    color: white;
                    outline: none;
                }
                .input-select:focus {
                    border-color: var(--primary);
                    background: rgba(255,255,255,0.1);
                }
                .input-select option {
                    background: #1a1c24;
                    color: white;
                }
            `}</style>
        </div>
    );
};

export default Reports;
