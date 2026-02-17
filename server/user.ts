'use server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const authSession = async () => {
  try {
    const session = auth.api.getSession({ headers: await headers() });
    if (!session) {
      throw new Error('Unauthorized: No session found.');
    }
    return session;
  } catch {
    throw new Error('Unauthorized: Failed to get session.');
  }
};

export const authIsNotRequired = async () => {
    const session = await authSession();
    if (session) {
        redirect("/")
    }
}

export const authIsRequired = async () => {
    const session = await authSession();

    if (!session) {
        redirect("/login");
    }

    return session;
};
