import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    const demoUsers = [
        { role: 'Super Admin', email: 'amit.hq@railways.gov.in', password: 'password123' },
        { role: 'Zonal Admin', email: 'sanjay.nz@railways.gov.in', password: 'password123' },
        { role: 'Engineer', email: 'rajesh.mech@railways.gov.in', password: 'password123' }
    ];

    const fillDemo = (u) => {
        setEmail(u.email);
        setPassword(u.password);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '1rem' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '450px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>RailTrack</h1>
                    <p style={{ color: 'var(--gray)' }}>Internal Portal Login</p>
                </div>

                {/* Demo Credentials Section */}
                <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px dashed var(--glass-border)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray)', marginBottom: '0.75rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Access (Demo)</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                        {demoUsers.map((u, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => fillDemo(u)}
                                style={{
                                    padding: '8px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--glass-border)',
                                    background: 'var(--glass)',
                                    color: 'white',
                                    fontSize: '0.65rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    textAlign: 'center'
                                }}
                                onMouseOver={(e) => e.target.style.borderColor = 'var(--primary)'}
                                onMouseOut={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                            >
                                {u.role}
                            </button>
                        ))}
                    </div>
                </div>

                {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass)', color: 'white' }}
                            placeholder="admin@railways.gov.in"
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass)', color: 'white' }}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                        <LogIn size={20} />
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
