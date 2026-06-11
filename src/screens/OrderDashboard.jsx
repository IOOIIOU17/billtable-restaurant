import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function OrderDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('restaurantToken');
    api.get('/api/orders/restaurant', {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      setOrders(res.data.data.orders || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statusColor = (status) => {
    if (status === 'pending') return '#888';
    if (status === 'accepted') return '#1A1A1A';
    if (status === 'delivered') return '#1A1A1A';
    return '#4A4A4A';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-paper)', padding: '32px', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-logo)', fontSize: '32px' }}>Orders</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => navigate('/menu')} style={{ padding: '8px 16px', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '14px', cursor: 'pointer', background: 'var(--color-paper)' }}>+ Menu</button>
          <button onClick={() => navigate('/history')} style={{ padding: '8px 16px', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '14px', cursor: 'pointer', background: 'var(--color-paper)' }}>History</button>
          <button onClick={() => navigate('/settings')} style={{ padding: '8px 16px', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '14px', cursor: 'pointer', background: 'var(--color-paper)' }}>Settings</button>
        </div>
      </div>

      {loading && <p style={{ fontFamily: 'var(--font-hint)', color: 'var(--color-pencil)' }}>Loading...</p>}

      {!loading && orders.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', color: 'var(--color-pencil)' }}>No orders yet.</p>
          <p style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-light)', marginTop: '8px' }}>Orders will appear here when customers place them.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => navigate(`/orders/${order.id}`)}
            style={{ border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', padding: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}>Order #{order.order_number?.slice(0, 8) || order.id?.toString().slice(0, 8)}</p>
              <p style={{ fontFamily: 'var(--font-hint)', fontSize: '13px', color: 'var(--color-pencil)', marginTop: '4px' }}>{order.guest_count} people · ${order.total_amount}</p>
            </div>
            <span style={{ fontFamily: 'var(--font-hint)', fontSize: '13px', color: statusColor(order.status), border: '1px solid var(--color-light)', borderRadius: '999px', padding: '4px 12px' }}>{order.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
