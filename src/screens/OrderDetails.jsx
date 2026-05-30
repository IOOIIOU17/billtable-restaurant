import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/api/orders/${orderId}`).then((res) => setOrder(res.data.order)).catch(console.error);
  }, [orderId]);

  const updateStatus = async (status) => {
    await api.patch(`/api/orders/${orderId}/status`, { status });
    setOrder({ ...order, status });
  };

  if (!order) return <div style={{ padding: '32px', fontFamily: 'var(--font-body)' }}>Loading...</div>;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-paper)',
      padding: '32px',
      maxWidth: '500px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>

      <button onClick={() => navigate('/orders')} style={{
        background: 'none', border: 'none',
        fontFamily: 'var(--font-hint)', fontSize: '14px',
        color: 'var(--color-pencil)', cursor: 'pointer', alignSelf: 'flex-start',
      }}>
        ← Back
      </button>

      <h1 style={{ fontFamily: 'var(--font-logo)', fontSize: '28px' }}>
        Order #{orderId?.slice(0, 8)}
      </h1>

      <div style={{ border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          { label: 'Status', value: order.status },
          { label: 'Guests', value: `${order.guest_count} people` },
          { label: 'Total', value: `$${order.total_amount}` },
          { label: 'Theme', value: order.theme || '-' },
          { label: 'Delivery', value: order.delivery_address || '-' },
        ].map((r) => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-light)', paddingBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)' }}>{r.label}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}>{r.value}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={() => updateStatus('accepted')} style={{
          flex: 1, padding: '14px',
          background: 'var(--color-ink)', color: 'var(--color-paper)',
          border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)',
          fontFamily: 'var(--font-body)', fontSize: '16px', cursor: 'pointer',
        }}>
          Accept
        </button>
        <button onClick={() => updateStatus('cancelled')} style={{
          flex: 1, padding: '14px',
          background: 'var(--color-paper)', color: 'var(--color-ink)',
          border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)',
          fontFamily: 'var(--font-body)', fontSize: '16px', cursor: 'pointer',
        }}>
          Reject
        </button>
      </div>

      <button style={{
        width: '100%', padding: '14px',
        background: 'var(--color-paper)', color: 'var(--color-ink)',
        border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)',
        fontFamily: 'var(--font-body)', fontSize: '16px', cursor: 'pointer',
      }}>
        Call Uber Pickup
      </button>

    </div>
  );
}
