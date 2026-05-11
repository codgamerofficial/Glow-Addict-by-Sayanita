import { AuthForm } from '@/components/auth/AuthForm';

export const metadata = {
  title: 'Your Journey | Glow Addict',
  description: 'Step into a world of personalized beauty. Sign in or join our movement for a radiant future.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-[#050505] relative overflow-hidden">
      {/* Abstract background elements */}
      <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] bg-[radial-gradient(circle,_rgba(233,30,140,0.15)_0%,_transparent_70%)] blur-[80px] z-0" />
      <div className="absolute bottom-[10%] right-[5%] w-[30vw] h-[30vw] bg-[radial-gradient(circle,_rgba(124,58,237,0.1)_0%,_transparent_70%)] blur-[80px] z-0" />

      <div className="relative z-10 w-full flex justify-center">
        <AuthForm />
      </div>
    </div>
  );
}

