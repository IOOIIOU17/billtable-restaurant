import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!newPassword || !confirm) { setError('Please fill in all fields'); return; }
    if (newPassword !== confirm) { setError('Passwords do not match'); return; }
    if (newPassword.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    setError('');
    try {
      await api.post('/api/auth/reset-password', { token, newPassword });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired link');
    }
    setLoading(false);
  };

  if (!token) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'32px' }}>
      <p style={{ fontFamily:"'Patrick Hand',sans-serif", fontSize:'16px', color:'#dc2626' }}>Invalid reset link.</p>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'var(--color-paper)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px', maxWidth:'400px', margin:'0 auto' }}>
      <p style={{ fontFamily:"'Caveat',cursive", fontSize:'2rem', marginBottom:'8px' }}>BillTable</p>
      <p style={{ fontFamily:"'Kalam',sans-serif", fontSize:'14px', color:'var(--color-pencil)', marginBottom:'32px' }}>Set a new password</p>

      {done ? (
        <div style={{ textAlign:'center', display:'flex', flexDirection:'column', gap:'16px' }}>
          <p style={{ fontFamily:"'Patrick Hand',sans-serif", fontSize:'16px' }}>Password reset successfully!</p>
          <button onClick={() => navigate('/')} style={{ padding:'14px', background:'var(--color-ink)', color:'var(--color-paper)', border:'none', borderRadius:'var(--radius)', fontFamily:"'Patrick Hand',sans-serif", fontSize:'16px', cursor:'pointer' }}>Back to Login</button>
        </div>
      ) : (
        <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:'16px' }}>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            style={{ padding:'14px 16px', border:'2px solid var(--color-ink)', borderRadius:'var(--radius)', fontFamily:"'Patrick Hand',sans-serif", fontSize:'16px', outline:'none' }}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            style={{ padding:'14px 16px', border:'2px solid var(--color-ink)', borderRadius:'var(--radius)', fontFamily:"'Patrick Hand',sans-serif", fontSize:'16px', outline:'none' }}
          />
          {error && <p style={{ fontFamily:"'Kalam',sans-serif", fontSize:'13px', color:'#dc2626' }}>{error}</p>}
          <button onClick={handleSubmit} disabled={loading} style={{ padding:'14px', background:'var(--color-ink)', color:'var(--color-paper)', border:'none', borderRadius:'var(--radius)', fontFamily:"'Patrick Hand',sans-serif", fontSize:'16px', cursor:'pointer' }}>
            {loading ? 'Saving...' : 'Set new password →'}
          </button>
        </div>
      )}
    </div>
  );
}
