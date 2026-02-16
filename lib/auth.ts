import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db/drizzle';
import { nextCookies } from 'better-auth/next-js';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
  rateLimit: {
    storage: "database"
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, //5 minutes
    },
  },
  plugins: [nextCookies()],
});
