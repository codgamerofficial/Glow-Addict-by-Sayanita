// Environment variable validation utility for Glow Addict
// This ensures critical configuration is present at startup

export const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
] as const;

export function validateEnv(): void {
  const missing: string[] = [];

  // Required environment variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
      console.error(`Missing required environment variable: ${envVar}`);
    }
  }

  // Optional NVIDIA_API_KEY - warn if missing
  if (!process.env.NVIDIA_API_KEY) {
    console.warn('NVIDIA_API_KEY is not set. AI features will use fallback mode.');
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}
