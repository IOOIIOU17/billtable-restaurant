import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function RefundPanel() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [mode, setMode] = useState(null) // 'partial' | 'full'
  const [percent, setPercent] = useState(50)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState('')

  const handleRefund = async () => {
    setLoading(true)
    setError('')
    try {
      await api.post(`/api/orders/${orderId}/refund`, {
        refundType: mode,
        refundPercent: mode === 'partial' ? percent : 100,
      })
      setDone(true)
    } catch (e) {
      console.error(e)
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    }
    setLoading(false)
  }

  if (done) return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-paper)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
      fontFamily: 'var(--font-body)',
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
      <p style={{ fontFamily: 'var(--font-logo)', fontSize: '24px', marginBottom: '8px' }}>
        {mode === 'full' ? 'ยกเลิก Order แล้ว' : `คืนเงิน ${percent}% แล้ว`}
      </p>
      <p style={{ fontFamily: 'var(--font-hint)', color: 'var(--color-pencil)', marginBottom: '32px' }}>
        Customer will be notified
      </p>
      <button
        onClick={() => navigate('/orders')}
        style={{
          padding: '14px 32px',
          background: 'var(--color-ink)',
          color: 'var(--color-paper)',
          border: 'none',
          borderRadius: 'var(--radius)',
          fontFamily: 'var(--font-body)',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        กลับหน้า Orders
      </button>
    </div>
  )

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
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'none',
          border: 'none',
          fontFamily: 'var(--font-hint)',
          fontSize: '14px',
          color: 'var(--color-pencil)',
          cursor: 'pointer',
          alignSelf: 'flex-start',
        }}
      >
        ← Back
      </button>

      <h1 style={{ fontFamily: 'var(--font-logo)', fontSize: '28px', margin: '0' }}>
        คืนเงิน Order #{orderId?.slice(0, 8)}
      </h1>

      <p style={{ fontFamily: 'var(--font-hint)', color: 'var(--color-pencil)', margin: '0' }}>
        เลือกรูปแบบการคืนเงิน
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button
          onClick={() => setMode('partial')}
          style={{
            padding: '20px',
            border: `2px solid var(--color-ink)`,
            borderRadius: 'var(--radius)',
            background: mode === 'partial' ? 'var(--color-ink)' : 'var(--color-paper)',
            color: mode === 'partial' ? 'var(--color-paper)' : 'var(--color-ink)',
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          💰 คืนเงินบางส่วน (เลือก %)
        </button>

        <button
          onClick={() => setMode('full')}
          style={{
            padding: '20px',
            border: '2px solid var(--color-ink)',
            borderRadius: 'var(--radius)',
            background: mode === 'full' ? 'var(--color-ink)' : 'var(--color-paper)',
            color: mode === 'full' ? 'var(--color-paper)' : 'var(--color-ink)',
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          🔄 ยกเลิก Order (คืน 100%)
        </button>
      </div>

      {mode === 'partial' && (
        <div style={{
          border: '2px solid var(--color-ink)',
          borderRadius: 'var(--radius)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          <p style={{ fontFamily: 'var(--font-body)', margin: '0' }}>
            คืนเงิน: <strong>{percent}%</strong>
          </p>
          <input
            type="range"
            min="10"
            max="90"
            step="10"
            value={percent}
            onChange={(e) => setPercent(Number(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((p) => (
              <button
                key={p}
                onClick={() => setPercent(p)}
                style={{
                  padding: '6px 8px',
                  border: '1px solid var(--color-ink)',
                  borderRadius: '8px',
                  background: percent === p ? 'var(--color-ink)' : 'var(--color-paper)',
                  color: percent === p ? 'var(--color-paper)' : 'var(--color-ink)',
                  fontFamily: 'var(--font-hint)',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                {p}%
              </button>
            ))}
          </div>
        </div>
      )}

      {mode && (
        <button
          onClick={handleRefund}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px',
            marginTop: '8px',
            background: 'var(--color-ink)',
            color: 'var(--color-paper)',
            border: 'none',
            borderRadius: 'var(--radius)',
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Processing...' : mode === 'full' ? 'Confirm Cancellation' : `Confirm Refund ${percent}%`}
        </button>
      )}
    </div>
  )
}
