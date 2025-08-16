import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useUserData from '../hooks/useAuthRedirect.js';

const PaidPayments = () => {
  const [paidPaymentsData, setPaidPaymentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 500);

  useEffect(() => {
    axios
      .get('https://api.starcityrp.com/api/payment/paid', { withCredentials: true })
      .then((res) => {
        const arr = Array.isArray(res?.data?.payments) ? res.data.payments : [];
        setPaidPaymentsData(arr);
      })
      .catch((error) => {
        console.error('Error fetching paid payments:', error);
        setErr('Failed to load paid payments.');
      })
      .finally(() => setLoading(false));

    const handleResize = () => setIsMobile(window.innerWidth < 500);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const badgeColor = (status) => {
    if (!status) return '#9e9e9e';
    const s = String(status).toLowerCase();
    if (s.includes('paid') || s === 'finished' || s === 'confirmed') return '#4caf50';
    if (s.includes('failed') || s.includes('expired') || s.includes('cancel')) return '#f44336';
    return '#9e9e9e';
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f4f6f8',
        minHeight: '100vh',
        padding: isMobile ? '20px' : '40px',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          fontSize: isMobile ? '22px' : '28px',
          marginBottom: isMobile ? '20px' : '30px',
          color: '#333',
        }}
      >
        💰 Paid Payments
      </h2>

      {loading ? (
        <p>Loading payments...</p>
      ) : err ? (
        <p style={{ color: '#f44336' }}>{err}</p>
      ) : paidPaymentsData.length === 0 ? (
        <p>No paid payments found.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(${isMobile ? '250px' : '300px'}, 1fr))`,
            gap: isMobile ? '15px' : '20px',
          }}
        >
          {paidPaymentsData.map((p) => {
            const created = p.createdAt ? new Date(p.createdAt) : null;
            const dateText = created && !isNaN(created) ? created.toLocaleString() : '—';

            return (
              <div
                key={p.id || p.payment_id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  padding: isMobile ? '15px' : '20px',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer',
                  wordBreak: 'break-all',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    gap: isMobile ? '5px' : '0',
                  }}
                >
                  <span
                    style={{
                      background: badgeColor(p.status),
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      textTransform: 'capitalize',
                      alignSelf: isMobile ? 'flex-start' : 'center',
                    }}
                  >
                    {p.status || 'unknown'}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', fontSize: '13px', color: '#666' }}>
                    <span>
                      <strong>Payment ID:</strong> #{p.id || p.payment_id || '—'}
                    </span>
                    <span>
                      <strong>Order ID:</strong> #{p.order_id || '—'}
                    </span>
                  </div>
                </div>

                <div>
                  <p style={{ margin: '6px 0', fontSize: '14px', color: '#555' }}>
                    <strong>Amount:</strong> {p.amount ?? p.pay_amount ?? '—'} {p.currency ?? p.pay_currency ?? ''}
                  </p>
                  <p style={{ margin: '6px 0', fontSize: '14px', color: '#555' }}>
                    <strong>Paid To:</strong> {p.payTo ?? p.pay_address ?? '—'}
                  </p>
                  <p style={{ margin: '6px 0', fontSize: '14px', color: '#555' }}>
                    <strong>Paid at:</strong> {dateText}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PaidPayments;
