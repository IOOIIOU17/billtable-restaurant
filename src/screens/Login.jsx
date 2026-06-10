import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.password) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/auth/restaurant-login', {
        email: form.email,
        password: form.password,
      });
      const token = res.data?.accessToken;
      if (token) {
        localStorage.setItem('restaurantToken', token);
        navigate('/orders');
      } else {
        setError('Login failed. No token received.');
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid var(--color-ink)',
    borderRadius: '12px',
    fontFamily: 'var(--font-body)',
    fontSize: '16px',
    background: 'var(--color-paper)',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', maxWidth: '400px', margin: '0 auto' }}>
      <img src='/src/assets/billtable-logo.png' alt='BillTable' style={{ width: '180px', marginBottom: '8px' }} />
    <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', color: 'var(--color-pencil)', marginBottom: '24px' }}>Restaurant login</p>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input style={inputStyle} placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input style={inputStyle} placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      </div>
      {error && <p style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'red', marginTop: '12px' }}>{error}</p>}
      <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', background: 'var(--color-ink)', color: 'var(--color-paper)', border: 'none', borderRadius: 'var(--radius)', padding: '14px', fontFamily: 'var(--font-body)', fontSize: '18px', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '16px' }}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  );
}
