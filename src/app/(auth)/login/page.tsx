import { AuthForm } from '@/components/auth/AuthForm';

export const metadata = {
  title: 'Your Journey | Glow Addict',
  description: 'Step into a world of personalized beauty. Sign in or join our movement for a radiant future.',
};

export default function LoginPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      background: '#050505',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Abstract background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '40vw',
        height: '40vw',
        background: 'radial-gradient(circle, rgba(233, 30, 140, 0.15) 0%, transparent 70%)',
        filter: 'blur(80px)',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: '30vw',
        height: '30vw',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)',
        filter: 'blur(80px)',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <AuthForm />
      </div>
    </div>
  );
}

