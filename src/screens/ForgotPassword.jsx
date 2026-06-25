import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email) { setError('Please enter your email'); return; }
    setLoading(true);
    setError('');
    try {
      await api.post('/api/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--color-paper)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px', maxWidth:'400px', margin:'0 auto' }}>
      <p style={{ fontFamily:"'Caveat',cursive", fontSize:'2rem', marginBottom:'8px' }}>BillTable</p>
      <p style={{ fontFamily:"'Kalam',sans-serif", fontSize:'14px', color:'var(--color-pencil)', marginBottom:'32px' }}>Reset your password</p>

      {sent ? (
        <div style={{ textAlign:'center', display:'flex', flexDirection:'column', gap:'16px' }}>
          <p style={{ fontFamily:"'Patrick Hand',sans-serif", fontSize:'16px' }}>Check your email for a reset link.</p>
          <p style={{ fontFamily:"'Kalam',sans-serif", fontSize:'13px', color:'var(--color-pencil)' }}>Link expires in 1 hour.</p>
          <button onClick={() => navigate('/')} style={{ padding:'14px', background:'var(--color-ink)', color:'var(--color-paper)', border:'none', borderRadius:'var(--radius)', fontFamily:"'Patrick Hand',sans-serif", fontSize:'16px', cursor:'pointer' }}>Back to Login</button>
        </div>
      ) : (
        <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:'16px' }}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ padding:'14px 16px', border:'2px solid var(--color-ink)', borderRadius:'var(--radius)', fontFamily:"'Patrick Hand',sans-serif", fontSize:'16px', outline:'none' }}
          />
          {error && <p style={{ fontFamily:"'Kalam',sans-serif", fontSize:'13px', color:'#dc2626' }}>{error}</p>}
          <button onClick={handleSubmit} disabled={loading} style={{ padding:'14px', background:'var(--color-ink)', color:'var(--color-paper)', border:'none', borderRadius:'var(--radius)', fontFamily:"'Patrick Hand',sans-serif", fontSize:'16px', cursor:'pointer' }}>
            {loading ? 'Sending...' : 'Send reset link →'}
          </button>
          <button onClick={() => navigate('/')} style={{ padding:'14px', background:'transparent', color:'var(--color-ink)', border:'2px solid var(--color-ink)', borderRadius:'var(--radius)', fontFamily:"'Patrick Hand',sans-serif", fontSize:'16px', cursor:'pointer' }}>Back</button>
        </div>
      )}
    </div>
  );
}
