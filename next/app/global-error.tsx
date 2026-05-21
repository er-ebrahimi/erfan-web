'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error('Global error:', error);

  return (
    <html dir="rtl" lang="fa">
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#09090b',
            color: '#fafafa',
            fontFamily:
              "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
            padding: '1rem',
            margin: 0,
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
            <h1
              style={{
                fontSize: '3.75rem',
                fontWeight: 700,
                color: '#06b6d4',
                marginBottom: '1rem',
              }}
            >
              500
            </h1>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              خطای سرور
            </h2>
            <p
              style={{
                color: '#a1a1aa',
                marginBottom: '2rem',
                lineHeight: 1.6,
              }}
            >
              متأسفانه مشکلی در سرور رخ داده است. لطفاً مجدداً تلاش کنید.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => reset()}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#06b6d4',
                  color: '#09090b',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
              >
                تلاش مجدد
              </button>
              <button
                onClick={() => {
                  window.location.href = '/fa';
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'transparent',
                  color: '#fafafa',
                  border: '1px solid #27272a',
                  borderRadius: '0.5rem',
                  fontWeight: 500,
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
              >
                بازگشت به خانه
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
