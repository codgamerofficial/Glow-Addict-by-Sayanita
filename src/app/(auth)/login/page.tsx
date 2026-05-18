import Link from 'next/link';

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, rgba(124, 44, 255, 0.1) 0%, rgba(255, 235, 247, 0.05) 100%)'
    }}>
      <div style={{
        padding: '48px 32px',
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
        color: 'white',
        maxWidth: '400px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Sign In Unavailable</h1>
        <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '24px' }}>
          Authentication is currently disabled. Please check back later.
        </p>
        <Link href="/" style={{
          display: 'inline-block',
          padding: '12px 24px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #7c2cff 0%, #9d5cff 100%)',
          color: 'white',
          fontWeight: 700,
          fontSize: '14px',
          textDecoration: 'none'
        }}>
          Return to Home
        </Link>
      </div>
    </div>
  );
}