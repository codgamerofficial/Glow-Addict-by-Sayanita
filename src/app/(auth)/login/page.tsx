import { AuthForm } from '@/components/auth/AuthForm';

export const metadata = {
  title: 'Login | Glow Addict',
  description: 'Sign in to your Glow Addict account for personalized skincare recommendations.',
};

export default function LoginPage() {
  return (
    <div className="container-main" style={{ 
      minHeight: 'calc(100vh - 68px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '40px 16px'
    }}>
      <AuthForm />
    </div>
  );
}
