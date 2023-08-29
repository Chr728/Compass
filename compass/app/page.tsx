'use client';

import { AuthProvider } from './contexts/AuthContext';
import Form from './form';

export default function Home() {
  return (
    <AuthProvider>
      <Form />
    </AuthProvider>
  );
}
