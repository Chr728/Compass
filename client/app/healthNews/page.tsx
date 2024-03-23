'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import HealthNews from './healthNews';

export default function GetHealthNews() {
  const router = useRouter();
  const { user } = useAuth();

  return <HealthNews />;
}
