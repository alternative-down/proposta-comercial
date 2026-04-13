import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get('token')?.value;
  if (!token) {
    redirect('/login');
  }
  const payload = await verifyToken(token);
  if (!payload) {
    redirect('/login');
  }
  return <>{children}</>;
}
