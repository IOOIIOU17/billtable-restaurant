import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useRestaurantStore from '../store/restaurantStore';
import api from '../services/api';
import logo from '../billtable-logo.png';

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  border: '2px solid var(--color-ink)',
  borderRadius: '12px',
  fontFamily: 'var(--font-body)',
  fontSize: '16px',
  background: 'var(--color-paper)',
  outline: 'none',
};

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setToken, setRestaurant } = useRestaurantStore();

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const res = await api.post('/api/auth/login', {
          email: form.email,
          password: form.password,
        });
        setToken(res.data.accessToken); localStorage.setItem("restaurantToken", res.data.accessToken);
        setRestaurant(res.data.user);
        navigate('/orders');
      } else {
        const res = await api.post('/api/auth/register', {
          name: form.name,
          email: form.email,
          password: form.password,
        });
        setToken(res.data.accessToken); localStorage.setItem("restaurantToken", res.data.accessToken);
        setRestaurant(res.data.user);
        navigate('/orders');
      }
    } catch (e) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-paper)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
      gap: '20px',
      maxWidth: '400px',
      margin: '0 auto',
    }}>
      <img
        src={logo}
        alt="BillTable"
        style={{ height: '72px', width: 'auto' }}
      />
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', textAlign: 'center', color: 'var(--color-pencil)' }}>
        {isLogin ? 'Restaurant login' : 'Join BillTable'}
      </p>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {!isLogin && <input style={inputStyle} placeholder="Restaurant name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
        <input style={inputStyle} placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input style={inputStyle} placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      </div>

      {error && <p style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-ink)' }}>{error}</p>}

      <button onClick={handleSubmit} style={{
        width: '100%',
        background: 'var(--color-ink)',
        color: 'var(--color-paper)',
        border: '2px solid var(--color-ink)',
        borderRadius: 'var(--radius)',
        padding: '14px',
        fontFamily: 'var(--font-body)',
        fontSize: '18px',
        cursor: 'pointer',
      }}>
        {isLogin ? 'Login' : 'Start Restaurant Setup'}
      </button>

      <button onClick={() => setIsLogin(!isLogin)} style={{
        background: 'none',
        border: 'none',
        fontFamily: 'var(--font-hint)',
        fontSize: '14px',
        color: 'var(--color-pencil)',
        cursor: 'pointer',
        textDecoration: 'underline',
      }}>
        {isLogin ? 'New restaurant? Sign up' : 'Already have account? Login'}
      </button>

    </div>
  );
}