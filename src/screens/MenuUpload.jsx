import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function MenuUpload() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', price: '', cuisineType: '', spicyLevel: 1 });
  const [menus, setMenus] = useState([]);
  const [saved, setSaved] = useState(false);

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)',
    fontFamily: 'var(--font-body)', fontSize: '16px',
    background: 'var(--color-paper)', color: 'var(--color-ink)', outline: 'none',
  };

  const addMenu = () => {
    if (!form.name || !form.price) return;
    setMenus([...menus, { ...form }]);
    setForm({ name: '', price: '', cuisineType: '', spicyLevel: 1 });
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-paper)',
      padding: '32px', maxWidth: '500px', margin: '0 auto',
      display: 'flex', flexDirection: 'column', gap: '16px',
    }}>

      <button onClick={() => navigate('/orders')} style={{
        background: 'none', border: 'none',
        fontFamily: 'var(--font-hint)', fontSize: '14px',
        color: 'var(--color-pencil)', cursor: 'pointer', alignSelf: 'flex-start',
      }}>← Back</button>

      <h1 style={{ fontFamily: 'var(--font-logo)', fontSize: '28px' }}>Upload your menu</h1>

      <input style={inputStyle} placeholder="Dish name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input style={inputStyle} placeholder="Price ($)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
      <input style={inputStyle} placeholder="Cuisine (e.g. Thai)" value={form.cuisineType} onChange={(e) => setForm({ ...form, cuisineType: e.target.value })} />

      <button onClick={addMenu} style={{
        width: '100%', padding: '12px',
        background: 'var(--color-paper)', color: 'var(--color-ink)',
        border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)',
        fontFamily: 'var(--font-body)', fontSize: '16px', cursor: 'pointer',
      }}>+ Add dish</button>

      {menus.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menus.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', border: '1px solid var(--color-light)', borderRadius: 'var(--radius)' }}>
              <span style={{ fontFamily: 'var(--font-body)' }}>{m.name}</span>
              <span style={{ fontFamily: 'var(--font-hint)', color: 'var(--color-pencil)' }}>${m.price}</span>
            </div>
          ))}
        </div>
      )}

      {saved && <p style={{ fontFamily: 'var(--font-hint)', color: 'var(--color-pencil)', textAlign: 'center' }}>✓ Menu saved!</p>}

      <button onClick={() => { setSaved(true); setTimeout(() => navigate("/orders"), 1000); }} style={{
        width: '100%', padding: '14px',
        background: 'var(--color-ink)', color: 'var(--color-paper)',
        border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)',
        fontFamily: 'var(--font-body)', fontSize: '18px', cursor: 'pointer',
      }}>Save & Continue</button>

    </div>
  );
}
