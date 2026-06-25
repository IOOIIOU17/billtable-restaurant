import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function OrderHistory() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.get('/api/orders/restaurant').then(r => {
      const data = r.data?.data?.orders || r.data?.orders || r.data?.data || r.data || []
      setOrders(Array.isArray(data) ? data : [])
    }).catch(() => setOrders([])).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const statuses = ['all', 'pending', 'accepted', 'delivered', 'cancelled']

  const statusColor = (s) => ({
    pending: 'var(--color-ink)', accepted: '#3b82f6',
    delivered: 'var(--color-ink)', cancelled: 'var(--color-ink)'
  }[s] || '#4A4A4A')

  return (
    <div style={{ padding:'24px', maxWidth:'900px', margin:'0 auto', fontFamily:"'Patrick Hand',sans-serif" }}>
      <div style={{ display:'flex', gap:'12px', marginBottom:'24px', alignItems:'center' }}>
        <button onClick={() => navigate('/orders')} style={{ fontFamily:"'Patrick Hand',sans-serif", padding:'8px 16px', border:'2px solid #1A1A1A', borderRadius:'8px', background:'transparent', cursor:'pointer' }}>← Back</button>
        <h2 style={{ fontFamily:"'Caveat',cursive", fontSize:'1.8rem', margin:0 }}>Order History</h2>
      </div>

      <div style={{ display:'flex', gap:'8px', marginBottom:'24px', flexWrap:'wrap' }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ fontFamily:"'Patrick Hand',sans-serif", padding:'6px 16px', border:'2px solid #1A1A1A', borderRadius:'20px', background: filter === s ? '#1A1A1A' : 'transparent', color: filter === s ? '#fff' : '#1A1A1A', cursor:'pointer', fontSize:'0.85rem', textTransform:'capitalize' }}>{s}</button>
        ))}
      </div>

      {loading ? <p style={{ fontFamily:"'Kalam',sans-serif" }}>Loading...</p> : (
        <div style={{ display:'grid', gap:'12px' }}>
          {filtered.length === 0 && <p style={{ fontFamily:"'Kalam',sans-serif", color:'#4A4A4A' }}>No orders found</p>}
          {filtered.map(o => (
            <div key={o.id} style={{ background:'#fff', border:'2px solid #1A1A1A', borderRadius:'16px', padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <p style={{ fontWeight:'bold', margin:'0 0 4px', fontSize:'0.95rem' }}>#{o.order_number || o.id}</p>
                <p style={{ margin:'0 0 4px', fontSize:'0.85rem', color:'#4A4A4A' }}>{o.theme || '-'} · {o.guest_count || 0} guests · ${parseFloat(o.total_amount||0).toFixed(2)}</p>
                <p style={{ margin:0, fontSize:'0.8rem', color:'#4A4A4A', fontFamily:"'Kalam',sans-serif" }}>{o.created_at ? new Date(o.created_at).toLocaleDateString('en-US') : '-'}</p>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <span style={{ fontFamily:"'Kalam',sans-serif", fontSize:'0.85rem', color: statusColor(o.status), fontWeight:'bold', textTransform:'capitalize' }}>{o.status}</span>
                <button onClick={() => navigate(`/orders/${o.id}`)} style={{ fontFamily:"'Patrick Hand',sans-serif", padding:'6px 14px', border:'2px solid #1A1A1A', borderRadius:'8px', background:'transparent', cursor:'pointer', fontSize:'0.85rem' }}>View</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop:'24px', padding:'16px', background:'#f9f9f9', borderRadius:'12px', border:'1px solid #E8E8E8' }}>
        <p style={{ margin:0, fontFamily:"'Kalam',sans-serif", fontSize:'0.85rem', color:'#4A4A4A' }}>
          Total: {orders.length} orders · Delivered: {orders.filter(o=>o.status==='delivered').length} · Cancelled: {orders.filter(o=>o.status==='cancelled').length}
        </p>
      </div>
    </div>
  )
}
