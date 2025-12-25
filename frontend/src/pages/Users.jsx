import React, { useState, useEffect } from 'react';
import {
    Plus, Search, Filter, Eye, Edit,
    Users as UsersIcon, Shield, UserPlus,
    CheckCircle, XCircle, Mail, MapPin, Activity, Clock
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import API_BASE_URL from '../api/config';
// const API_BASE_URL = 'http://localhost:5000/api';

const Users = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`${API_BASE_URL}/users`, config);
            setUsers(res.data.data);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const getRoleStyle = (role) => {
        switch (role) {
            case 'Super Admin': return { color: '#a855f7', background: 'rgba(168, 85, 247, 0.1)' };
            case 'Zonal Admin': return { color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)' };
            case 'Depot Officer': return { color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' };
            default: return { color: '#94a3b8', background: 'rgba(148, 163, 184, 0.1)' };
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>User Management</h2>
                    <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Manage system access, roles, and administrative permissions</p>
                </div>
                {currentUser?.role === 'Super Admin' && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <UserPlus size={18} /> Add User
                    </button>
                )}
            </div>

            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {[
                    { label: 'Total Users', value: '124', icon: UsersIcon, color: '#3b82f6' },
                    { label: 'Active Now', value: '18', icon: Activity, color: '#10b981' },
                    { label: 'Pending Approval', value: '3', icon: Clock, color: '#f59e0b' },
                    { label: 'Admins', value: '12', icon: Shield, color: '#a855f7' }
                ].map((stat, i) => (
                    <div key={i} className="glass-card" style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>{stat.label}</span>
                            <stat.icon size={16} color={stat.color} />
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="glass-card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', padding: '1rem' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
                    <input
                        type="text"
                        placeholder="Search by name, email or zone..."
                        style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                    />
                </div>
                <select className="input-select" style={{ width: '180px' }}>
                    <option value="">All Roles</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Zonal Admin">Zonal Admin</option>
                    <option value="Depot Officer">Depot Officer</option>
                    <option value="Engineer">Maintenance Engineer</option>
                </select>
                <select className="input-select" style={{ width: '150px' }}>
                    <option value="">Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            {/* User Table */}
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>
                        <tr>
                            <th style={{ padding: '1rem' }}>User Information</th>
                            <th style={{ padding: '1rem' }}>Role & Permissions</th>
                            <th style={{ padding: '1rem' }}>Zone / Division</th>
                            <th style={{ padding: '1rem' }}>Last Portal Access</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray)' }}>Loading user database...</td>
                            </tr>
                        ) : (
                            users.map((u) => (
                                <tr key={u._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '600' }}>
                                                {u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{u.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Mail size={10} /> {u.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.7rem',
                                            fontWeight: '600',
                                            ...getRoleStyle(u.role)
                                        }}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <MapPin size={12} color="var(--primary)" /> {u.zone}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--gray)', marginLeft: '1rem' }}>{u.division} Division</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontSize: '0.85rem' }}>{u.lastLogin}</div>
                                        <div style={{ fontSize: '0.75rem', color: u.status === 'Active' ? '#10b981' : '#ef4444' }}>
                                            {u.status === 'Active' ? '● Online' : '○ Offline'}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn-icon"><Eye size={16} /></button>
                                            <button className="btn-icon"><Edit size={16} /></button>
                                        </div>
                                    </td>
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
                .input-select {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid var(--glass-border);
                    border-radius: 8px;
                    padding: 0.6rem;
                    color: white;
                    outline: none;
                }
                .Activity { 
                    /* lucide icons handled by component props */
                }
            `}</style>
        </div>
    );
};

export default Users;
