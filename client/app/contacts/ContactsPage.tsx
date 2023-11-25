'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import Custom403 from '../pages/403';


export default function Contacts() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user){
      router.push("/login")
    }
}, [user]);

if (!user) {
  return <div><Custom403/></div>
}
  
  return (
    <div className="bg-eggshell p-2 min-h-screen flex flex-col">
        <div className="mb-10 flex flex-col w-full p-4">
        <div style={{ marginTop: '-5%' }} >
        <button className="mt-3 mb-4" onClick={() => router.push('/tpage')}>
          <Header  headerText="Your Contacts"></Header>
        </button>
        
      <p className="text-darkgrey mb-4">Contact your loved ones with the click of a button.</p>   

    </div>
  </div>
</div>
);
}