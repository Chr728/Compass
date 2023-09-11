'use client';

import { AuthProvider } from './contexts/AuthContext';
import {useRouter, usePathname} from 'next/navigation';
import {useAuth} from './contexts/AuthContext';

import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const router = useRouter();
    const {user} = useAuth();
    const pathname = usePathname();
    if(!user && pathname !== '/register' && pathname !== '/login') {
        router.push('/login');
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
