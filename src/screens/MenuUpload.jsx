import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CATEGORIES = ['Appetizer', 'Main', 'Dessert', 'Drink', 'Other'];

export default function MenuUpload() {
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Main', available: true });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('restaurantToken');

  const getRestaurantId = () => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.restaurantId;
    } catch { return null; }
  };

  const restaurantId = getRestaurantId();

  useEffect(() => { fetchMenus(); }, []);

  const fetchMenus = async () => {
    setFetchLoading(true);
    try {
      const res = await api.get(`/api/menus/restaurant/${restaurantId}`);
      setMenus(res.data?.menuItems || res.data?.data || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) { setMessage('Please fill name and price.'); return; }
    setLoading(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('category', form.category);
      formData.append('available', form.available);
      formData.append('restaurantId', restaurantId);
      if (imageFile) formData.append('image', imageFile);

      if (editId) {
        await api.put(`/api/menus/${editId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMessage('Menu updated!');
      } else {
        await api.post('/api/menus', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMessage('Menu added!');
      }
      setForm({ name: '', description: '', price: '', category: 'Main', available: true });
      setImageFile(null);
      setImagePreview(null);
      setEditId(null);
      fetchMenus();
    } catch (err) {
      setMessage(err.response?.data?.message || err.response?.data?.error || 'Error saving menu.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (menu) => {
    setEditId(menu.id);
    setForm({ name: menu.name, description: menu.description || '', price: menu.price, category: menu.category || 'Main', available: menu.is_available !== false });
    setImagePreview(menu.image_url || null);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await api.delete(`/api/menus/${id}`);
      fetchMenus();
    } catch (err) {
      setMessage('Error deleting menu.');
    }
  };

  const handleToggleAvailable = async (menu) => {
    const newValue = menu.is_available === false;
    setMenus(prev => prev.map(m => m.id === menu.id ? { ...m, is_available: newValue } : m));
    try {
      await api.patch(`/api/menus/${menu.id}/availability`, { isAvailable: newValue });
    } catch (err) {
      setMenus(prev => prev.map(m => m.id === menu.id ? { ...m, is_available: !newValue } : m));
      setMessage('Error updating availability.');
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', border: '2px solid var(--color-ink)',
    borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '16px',
    background: 'var(--color-paper)', color: 'var(--color-ink)', outline: 'none', boxSizing: 'border-box'
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-paper)', padding: '24px', maxWidth: '560px', margin: '0 auto', fontFamily: 'var(--font-body)' }}>

      <button onClick={() => navigate('/orders')} style={{ background: 'none', border: 'none', fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)', cursor: 'pointer', marginBottom: '16px' }}>← Back</button>

      <h1 style={{ fontFamily: 'var(--font-logo)', fontSize: '28px', marginBottom: '24px' }}>
        {editId ? 'Edit Menu Item' : 'Upload your menu'}
      </h1>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ cursor: 'pointer', display: 'block' }}>
          <div style={{ width: '100%', height: '180px', border: '2px dashed var(--color-ink)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'var(--color-light)' }}>
            {imagePreview
              ? <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontFamily: 'var(--font-hint)', color: 'var(--color-pencil)', fontSize: '14px' }}>Tap to upload photo</span>
            }
          </div>
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
        </label>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
        <input style={inputStyle} placeholder="Dish name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input style={inputStyle} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input style={inputStyle} placeholder="Price ($) *" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <select style={inputStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)' }}>Available</span>
          <div onClick={() => setForm({ ...form, available: !form.available })} style={{ width: '48px', height: '26px', borderRadius: '13px', background: form.available ? '#1A1A1A' : '#ccc', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
            <div style={{ position: 'absolute', top: '3px', left: form.available ? '24px' : '3px', width: '20px', height: '20px', borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
          </div>
        </div>
      </div>

      {message && <p style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: message.includes('Error') || message.includes('Please') ? 'red' : 'green', textAlign: 'center', marginBottom: '12px' }}>{message}</p>}

      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <button onClick={handleSubmit} disabled={loading} style={{ flex: 1, padding: '14px', background: loading ? 'var(--color-pencil)' : 'var(--color-ink)', color: 'var(--color-paper)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Saving...' : editId ? 'Update Menu' : '+ Add dish'}
        </button>
        {editId && (
          <button onClick={() => { setEditId(null); setForm({ name: '', description: '', price: '', category: 'Main', available: true }); setImagePreview(null); setImageFile(null); }} style={{ padding: '14px 20px', background: 'none', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '16px', cursor: 'pointer' }}>
            Cancel
          </button>
        )}
      </div>

      <h2 style={{ fontFamily: 'var(--font-logo)', fontSize: '20px', marginBottom: '16px' }}>Your Menu ({menus.length})</h2>

      {fetchLoading && <p style={{ fontFamily: 'var(--font-hint)', color: 'var(--color-pencil)' }}>Loading...</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {menus.map((menu) => (
          <div key={menu.id} style={{ display: 'flex', gap: '12px', padding: '12px', border: '1.5px solid var(--color-light)', borderRadius: 'var(--radius)', opacity: menu.is_available === false ? 0.5 : 1 }}>
            {menu.image_url
              ? <img src={menu.image_url} alt={menu.name} style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
              : <div style={{ width: '72px', height: '72px', borderRadius: '8px', background: 'var(--color-light)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🍽️</div>
            }
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px', fontWeight: 'bold' }}>{menu.name}</span>
                  <span style={{ marginLeft: '8px', fontSize: '11px', padding: '2px 8px', border: '1px solid var(--color-light)', borderRadius: '20px', fontFamily: 'var(--font-hint)', color: 'var(--color-pencil)' }}>{menu.category || 'Main'}</span>
                </div>
                <span style={{ fontFamily: 'var(--font-hint)', color: 'var(--color-pencil)' }}>${menu.price}</span>
              </div>
              {menu.description && <p style={{ fontFamily: 'var(--font-hint)', fontSize: '13px', color: 'var(--color-pencil)', margin: '4px 0' }}>{menu.description}</p>}
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                <button onClick={() => handleToggleAvailable(menu)} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--color-ink)', background: menu.is_available === false ? 'var(--color-ink)' : 'none', color: menu.is_available === false ? 'var(--color-paper)' : 'var(--color-ink)', cursor: 'pointer', fontFamily: 'var(--font-hint)' }}>
                  Hold
                </button>
                <button onClick={() => handleEdit(menu)} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--color-ink)', background: 'none', cursor: 'pointer', fontFamily: 'var(--font-hint)' }}> Edit</button>
                <button onClick={() => handleDelete(menu.id)} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', border: '1px solid red', color: 'red', background: 'none', cursor: 'pointer', fontFamily: 'var(--font-hint)' }}>️ Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
