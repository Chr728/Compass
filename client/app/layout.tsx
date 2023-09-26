'use client';

import { AuthProvider } from './contexts/AuthContext';
import {UserProvider} from '@/app/contexts/UserContext';

import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <AuthProvider>
            <UserProvider>
                {children}
            </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
