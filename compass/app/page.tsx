'use client';

import { AuthProvider } from './contexts/AuthContext';
import Login from './login/page';

export default function Home() {
  return (
    <AuthProvider>
      <Login />
    </AuthProvider>
  );
}
