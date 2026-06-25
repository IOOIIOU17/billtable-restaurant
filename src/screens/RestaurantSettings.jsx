import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function StripeOnboardButton({ restaurantId }) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  const handleOnboard = async () => {
    if (!restaurantId) return
    setLoading(true)
    setStatus('')
    try {
      const res = await api.post('/api/restaurants/stripe-onboard')
      if (res.data?.url) {
        window.location.href = res.data.url
      }
    } catch (err) {
      setStatus(err.response?.data?.message || 'Error connecting account')
    }
    setLoading(false)
  }

  return (
    <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
      <button
        onClick={handleOnboard}
        disabled={loading}
        style={{ fontFamily:"'Patrick Hand',sans-serif", padding:'10px 24px', border:'2px solid #1A1A1A', borderRadius:'8px', background: loading ? 'var(--color-pencil)' : '#1A1A1A', color:'#fff', cursor: loading ? 'not-allowed' : 'pointer', fontSize:'0.95rem' }}
      >
        {loading ? 'Connecting...' : 'Connect Bank Account'}
      </button>
      {status && <span style={{ fontFamily:"'Kalam',sans-serif", color:'var(--color-ink)', fontSize:'0.85rem' }}>{status}</span>}
    </div>
  )
}

export default function RestaurantSettings() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState({ id:null, name:'', phone:'', address:'', city:'', is_active:true, open_time:'09:00', close_time:'21:00', delivery_radius:10 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.get('/api/restaurants/mine').then(r => {
      const rest = r.data?.restaurants?.[0]
      if (rest) setSettings(p => ({
        ...p,
        id: rest.id,
        name: rest.name||'',
        phone: rest.phone||'',
        address: rest.address||'',
        city: rest.city||'',
        is_active: rest.is_active ?? true,
        open_time: rest.business_hours?.open || p.open_time,
        close_time: rest.business_hours?.close || p.close_time,
        delivery_radius: rest.delivery_radius_miles ?? p.delivery_radius
      }))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const save = () => {
    setSaving(true)
    const payload = {
      name: settings.name,
      phone: settings.phone,
      address: settings.address,
      city: settings.city,
      isActive: settings.is_active,
      deliveryRadiusMiles: settings.delivery_radius,
      businessHours: { open: settings.open_time, close: settings.close_time }
    }
    api.patch(`/api/restaurants/${settings.id}`, payload).then(() => {
      setMsg('Saved ✓')
      setTimeout(() => setMsg(''), 2000)
    }).catch(() => setMsg('Save error')).finally(() => setSaving(false))
  }

  const input = (label, val, onChange, type='text') => (
    <div style={{ display:'grid', gap:'4px' }}>
      <label style={{ fontFamily:"'Kalam',sans-serif", fontSize:'0.85rem', color:'#4A4A4A' }}>{label}</label>
      <input type={type} value={val} onChange={e => onChange(e.target.value)} style={{ fontFamily:"'Patrick Hand',sans-serif", padding:'8px 12px', border:'2px solid #1A1A1A', borderRadius:'8px', fontSize:'0.9rem', background:'#FEFEFE' }} />
    </div>
  )

  if (loading) return <p style={{ padding:'24px', fontFamily:"'Kalam',sans-serif" }}>Loading...</p>

  return (
    <div style={{ padding:'24px', maxWidth:'600px', margin:'0 auto' }}>
      <div style={{ display:'flex', gap:'12px', marginBottom:'24px', alignItems:'center' }}>
        <button onClick={() => navigate('/orders')} style={{ fontFamily:"'Patrick Hand',sans-serif", padding:'8px 16px', border:'2px solid #1A1A1A', borderRadius:'8px', background:'transparent', cursor:'pointer' }}>← Back</button>
        <h2 style={{ fontFamily:"'Caveat',cursive", fontSize:'1.8rem', margin:0 }}>Restaurant Settings</h2>
      </div>

      <div style={{ background:'#fff', border:'2px solid #1A1A1A', borderRadius:'16px', padding:'24px', display:'grid', gap:'16px' }}>
        <h3 style={{ fontFamily:"'Caveat',cursive", fontSize:'1.2rem', margin:0 }}>Basic Info</h3>
        {input('Restaurant Name', settings.name, v => setSettings(p=>({...p,name:v})))}
        {input('Phone', settings.phone, v => setSettings(p=>({...p,phone:v})))}
        {input('Address', settings.address, v => setSettings(p=>({...p,address:v})))}
        {input('City', settings.city, v => setSettings(p=>({...p,city:v})))}

        <div style={{ borderTop:'1px solid #E8E8E8', paddingTop:'16px' }}>
          <h3 style={{ fontFamily:"'Caveat',cursive", fontSize:'1.2rem', margin:'0 0 12px' }}>Hours & Delivery</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            {input('Open Time', settings.open_time, v => setSettings(p=>({...p,open_time:v})), 'time')}
            {input('Close Time', settings.close_time, v => setSettings(p=>({...p,close_time:v})), 'time')}
          </div>
          <div style={{ marginTop:'12px' }}>
            {input('Delivery Radius (miles)', settings.delivery_radius, v => setSettings(p=>({...p,delivery_radius:v})), 'number')}
          </div>
        </div>

        <div style={{ borderTop:'1px solid #E8E8E8', paddingTop:'16px' }}>
          <h3 style={{ fontFamily:"'Caveat',cursive", fontSize:'1.2rem', margin:'0 0 12px' }}>Status</h3>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <span style={{ fontFamily:"'Patrick Hand',sans-serif" }}>Restaurant is:</span>
            <button onClick={() => setSettings(p=>({...p,is_active:!p.is_active}))} style={{ fontFamily:"'Patrick Hand',sans-serif", padding:'6px 20px', border:'2px solid #1A1A1A', borderRadius:'20px', background: settings.is_active ? 'var(--color-ink)' : 'var(--color-pencil)', color:'#fff', cursor:'pointer', fontSize:'0.9rem' }}>
              {settings.is_active ? 'Open' : 'Closed'}
            </button>
          </div>
        </div>

        <div style={{ display:'flex', gap:'12px', alignItems:'center', borderTop:'1px solid #E8E8E8', paddingTop:'16px' }}>
          <button onClick={save} disabled={saving} style={{ fontFamily:"'Patrick Hand',sans-serif", padding:'10px 24px', border:'2px solid #1A1A1A', borderRadius:'8px', background:'#1A1A1A', color:'#fff', cursor:'pointer', fontSize:'0.95rem' }}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {msg && <span style={{ fontFamily:"'Kalam',sans-serif", color: msg.includes('✓') ? 'var(--color-ink)' : 'var(--color-ink)' }}>{msg}</span>}
        </div>

        <div style={{ borderTop:'1px solid #E8E8E8', paddingTop:'16px' }}>
          <h3 style={{ fontFamily:"'Caveat',cursive", fontSize:'1.2rem', margin:'0 0 12px' }}>Payout Account</h3>
          <p style={{ fontFamily:"'Kalam',sans-serif", fontSize:'0.85rem', color:'#4A4A4A', marginBottom:'12px' }}>
            Connect your bank account to receive payments from BillTable.
          </p>
          <StripeOnboardButton restaurantId={settings.id} />
        </div>

        <div style={{ borderTop:'1px solid #E8E8E8', paddingTop:'16px' }}>
          <h3 style={{ fontFamily:"'Caveat',cursive", fontSize:'1.2rem', margin:'0 0 12px' }}>Account</h3>
          <button onClick={() => { localStorage.removeItem('restaurantToken'); navigate('/'); }} style={{ fontFamily:"'Patrick Hand',sans-serif", padding:'10px 24px', border:'2px solid var(--color-ink)', borderRadius:'8px', background:'#fff', color:'var(--color-ink)', cursor:'pointer', fontSize:'0.95rem' }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
