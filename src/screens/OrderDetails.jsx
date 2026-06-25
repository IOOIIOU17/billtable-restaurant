import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function OrderDetails() {
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

  const handleAccept = async () => {
    const token = localStorage.getItem('restaurantToken');
    await api.patch(`/api/orders/${orderId}/status`, { status: 'accepted' }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    navigate(`/orders/${orderId}/status`);
  };

  const handleReject = async () => {
    const token = localStorage.getItem('restaurantToken');
    await api.patch(`/api/orders/${orderId}/status`, { status: 'cancelled' }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setOrder({ ...order, status: 'cancelled' });
  };

  if (!order) return <div style={{ padding: '32px', fontFamily: 'var(--font-body)' }}>Loading...</div>;

  const rows = [
    { label: 'Status', value: order.status },
    { label: 'Guests', value: `${order.guest_count} people` },
    { label: 'Total', value: `$${order.total_amount}` },
    { label: 'Theme', value: order.theme || '-' },
    { label: 'Allergy', value: order.allergies || 'None' },
    { label: 'Comment', value: order.customer_comment || 'None' },
    { label: 'Delivery', value: order.delivery_address || '-' },
    { label: 'Time', value: order.delivery_time || '-' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-paper)', padding: '32px', maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <button onClick={() => navigate('/orders')} style={{ background: 'none', border: 'none', fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)', cursor: 'pointer', alignSelf: 'flex-start' }}>← Back</button>

      <h1 style={{ fontFamily: 'var(--font-logo)', fontSize: '28px' }}>Order #{orderId?.toString().slice(0, 8)}</h1>

      <div style={{ border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {rows.map((r) => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-light)', paddingBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)' }}>{r.label}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}>{r.value}</span>
          </div>
        ))}
      </div>

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

      {order.subtotal > 0 && (
        <div style={{ border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)', marginBottom: '4px' }}>Invoice Summary</p>
          {[
            { label: 'Subtotal (food)', value: `$${parseFloat(order.subtotal||0).toFixed(2)}`, color: 'var(--color-ink)' },
            { label: 'Platform fee (10%)', value: `-$${parseFloat(order.platform_fee||0).toFixed(2)}`, color: '#dc2626' },
            { label: 'Delivery fee (5%)', value: `-$${parseFloat(order.delivery_fee_amount||0).toFixed(2)}`, color: '#dc2626' },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-light)', paddingBottom: '6px' }}>
              <span style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)' }}>{r.label}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: r.color }}>{r.value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px', fontWeight: 'bold' }}>Your payout</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px', fontWeight: 'bold', color: '#16a34a' }}>${parseFloat(order.restaurant_payout||0).toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', background: '#fefce8', borderRadius: '8px', padding: '8px 4px', marginTop: '4px' }}>
            <span style={{ fontFamily: 'var(--font-hint)', fontSize: '13px', color: '#92400e' }}>Tax collected ({order.tax_rate ? (parseFloat(order.tax_rate)*100).toFixed(2)+'%' : '8.75%'})</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#92400e' }}>${parseFloat(order.tax_amount||0).toFixed(2)} — remitted by BillTable</span>
          </div>
        </div>
      )}

      {order.status === 'pending' && (
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleAccept} style={{ flex: 1, padding: '14px', background: 'var(--color-ink)', color: 'var(--color-paper)', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '16px', cursor: 'pointer' }}>Accept</button>
          <button onClick={handleReject} style={{ flex: 1, padding: '14px', background: 'var(--color-paper)', color: 'var(--color-ink)', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '16px', cursor: 'pointer' }}>Reject</button>
        </div>
      )}

      {order.status === 'accepted' && (
        <button onClick={() => navigate(`/orders/${orderId}/status`)} style={{ width: '100%', padding: '14px', background: 'var(--color-ink)', color: 'var(--color-paper)', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '16px', cursor: 'pointer' }}>View Status →</button>
      )}

      {order.status === 'cancelled' && (
        <div style={{ textAlign: 'center', padding: '16px', fontFamily: 'var(--font-logo)', fontSize: '20px', color: 'var(--color-ink)' }}>
          ❌ Order Rejected
        </div>
      )}
    </div>
  );
}
