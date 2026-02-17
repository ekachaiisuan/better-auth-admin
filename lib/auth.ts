import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { Resend } from 'resend';
import VerifyEmail from '@/components/email/verify-email';

const resend = new Resend(process.env.RESEND_API_KEY!);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }, request) => {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: user.email,
        subject: 'Verify your email address',
        react: VerifyEmail({
          username: user.name,
          verifyUrl: url,
        }),
      });
    },
    sendOnSignUp: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, //5 minutes
    },
  },
  plugins: [nextCookies()],
});
