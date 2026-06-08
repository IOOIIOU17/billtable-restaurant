import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function OrderStatus() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('restaurantToken');
    api.get(`/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      setOrder(res.data.data?.order || res.data.order || res.data.data || null);
    }).catch(console.error);
  }, [orderId]);

  const markDelivered = async () => {
    const token = localStorage.getItem('restaurantToken');
    await api.patch(`/api/orders/${orderId}/status`, { status: 'delivered' }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setOrder({ ...order, status: 'delivered' });
  };

  if (!order) return <div style={{ padding: '32px', fontFamily: 'var(--font-body)' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-paper)', padding: '32px', maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <button onClick={() => navigate('/orders')} style={{ background: 'none', border: 'none', fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)', cursor: 'pointer', alignSelf: 'flex-start' }}>← Back</button>

      <h1 style={{ fontFamily: 'var(--font-logo)', fontSize: '28px' }}>Order #{orderId?.toString().slice(0, 8)}</h1>

      {/* Status Badge */}
      <div style={{ border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', padding: '20px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)', marginBottom: '8px' }}>Status</p>
        <p style={{ fontFamily: 'var(--font-logo)', fontSize: '28px', color: 'var(--color-ink)' }}>
          {order.status === 'accepted' ? '🍳 Cooking' : order.status === 'delivered' ? '✅ Delivered' : order.status}
        </p>
      </div>

      {/* Order Info */}
      <div style={{ border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-light)', paddingBottom: '8px' }}>
          <span style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)' }}>Guests</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}>{order.guest_count} people</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-light)', paddingBottom: '8px' }}>
          <span style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)' }}>Delivery</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px', textAlign: 'right', maxWidth: '60%' }}>{order.delivery_address || '-'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)' }}>Time</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}>{order.delivery_time || '-'}</span>
        </div>
      </div>

      {/* Menu */}
      {order.items && order.items.length > 0 && (
        <div style={{ border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', padding: '16px' }}>
          <p style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)', marginBottom: '12px' }}>Menu</p>
          {order.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid var(--color-light)' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px' }}>{item.item_name} x{item.quantity}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px' }}>${item.total_price}</span>
            </div>
          ))}
        </div>
      )}

      {/* Deliver Complete Button */}
      {order.status !== 'delivered' && (
        <button onClick={markDelivered} style={{ width: '100%', padding: '16px', background: 'var(--color-ink)', color: 'var(--color-paper)', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '18px', cursor: 'pointer' }}>
          Deliver Complete ✓
        </button>
      )}

      {order.status === 'delivered' && (
        <div style={{ textAlign: 'center', padding: '16px', fontFamily: 'var(--font-logo)', fontSize: '20px', color: 'var(--color-ink)' }}>
          🎉 Order Complete!
        </div>
      )}
    </div>
  );
}
