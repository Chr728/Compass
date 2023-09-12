'use client';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  // Check if useRouter is defined before using it
  if (typeof window !== 'undefined') {
    if (!user && pathname !== '/register' && pathname !== '/login') {
      router.push('/login');
    }
  }
  return (
    <html lang="en">
      <head />
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
