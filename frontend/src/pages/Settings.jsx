import React, { useState } from 'react';
import {
    User, Bell, Shield, Database,
    Key, Mail, Smartphone, Globe,
    Save, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Account Settings</h2>
                <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Manage your profile, preferences, and security settings</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
                {/* Sidebar Navigation */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[
                        { id: 'profile', icon: User, label: 'Profile' },
                        { id: 'notifications', icon: Bell, label: 'Notifications' },
                        { id: 'security', icon: Key, label: 'Security' },
                        { id: 'system', icon: Database, label: 'System Configuration' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '10px',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                background: activeTab === tab.id ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                                color: activeTab === tab.id ? 'white' : 'var(--gray)',
                                fontSize: '0.9rem',
                                textAlign: 'left'
                            }}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                    <button
                        onClick={logout}
                        style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>

                {/* Content Area */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                    {activeTab === 'profile' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Profile Information</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--primary), #a855f7)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', fontWeight: '800' }}>
                                    {user?.name?.charAt(0)}
                                </div>
                                <div>
                                    <button className="btn" style={{ padding: '4px 12px', fontSize: '0.8rem', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)' }}>Change Photo</button>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--gray)', marginTop: '8px' }}>JPG, GIF or PNG. Max size of 800K</p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label style={{ color: 'var(--gray)', fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>Full Name</label>
                                    <input type="text" value={user?.name} className="input-field" readOnly />
                                </div>
                                <div className="form-group">
                                    <label style={{ color: 'var(--gray)', fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>Email Address</label>
                                    <input type="email" value={user?.email} className="input-field" readOnly />
                                </div>
                                <div className="form-group">
                                    <label style={{ color: 'var(--gray)', fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>Railway Zone</label>
                                    <input type="text" value={user?.zone || 'N/A'} className="input-field" readOnly />
                                </div>
                                <div className="form-group">
                                    <label style={{ color: 'var(--gray)', fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>Designation</label>
                                    <input type="text" value={user?.role} className="input-field" readOnly />
                                </div>
                            </div>

                            <button className="btn-primary" style={{ width: 'fit-content', marginTop: '1rem' }}>
                                <Save size={18} style={{ marginRight: '8px' }} /> Save Changes
                            </button>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Notification Preferences</h3>
                            {[
                                { title: 'SLA Breach Alerts', desc: 'Notify when critical issues exceed resolution time', icon: Shield, default: true },
                                { title: 'Weekly Reports', desc: 'Receive performance summary every Monday', icon: Database, default: false },
                                { title: 'Portal Updates', desc: 'Information about new system features', icon: Globe, default: true },
                                { title: 'Direct Messages', desc: 'Alerts when other users tag you in reports', icon: Mail, default: true }
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <item.icon size={20} color="var(--primary)" />
                                        <div>
                                            <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>{item.title}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>{item.desc}</div>
                                        </div>
                                    </div>
                                    <div style={{ width: '40px', height: '20px', background: item.default ? 'var(--primary)' : '#444', borderRadius: '10px', position: 'relative', cursor: 'pointer' }}>
                                        <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: item.default ? '22px' : '2px', transition: 'all 0.2s' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Security & Credentials</h3>
                            <div className="form-group">
                                <label style={{ color: 'var(--gray)', fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>Current Password</label>
                                <input type="password" placeholder="••••••••" className="input-field" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label style={{ color: 'var(--gray)', fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>New Password</label>
                                    <input type="password" placeholder="Enter new password" className="input-field" />
                                </div>
                                <div className="form-group">
                                    <label style={{ color: 'var(--gray)', fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>Confirm New Password</label>
                                    <input type="password" placeholder="Repeat new password" className="input-field" />
                                </div>
                            </div>
                            <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px' }}>
                                <p style={{ fontSize: '0.8rem', color: '#f59e0b' }}>Password must be at least 12 characters and include numbers and special symbols.</p>
                            </div>
                            <button className="btn-primary" style={{ width: 'fit-content' }}>Update Password</button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .input-field {
                    width: 100%;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid var(--glass-border);
                    border-radius: 8px;
                    padding: 0.8rem;
                    color: white;
                    outline: none;
                }
                .input-field:focus {
                    border-color: var(--primary);
                }
            `}</style>
        </div>
    );
};

export default Settings;
