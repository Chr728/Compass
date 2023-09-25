'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './contexts/AuthContext';
import Welcome from './welcome/page';
import Login from './login/page';
import Settings from './settings/page';
import Register from './register/page';


export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
 },[user, router]);

  return <Welcome />;
}
