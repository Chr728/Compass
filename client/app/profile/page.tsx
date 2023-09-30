'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {useUser} from '@/app/contexts/UserContext';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Link from 'next/link';
import Button from '../components/Button';
import Menu from '../components/Menu';
import Custom403 from '../pages/403';
import ProfilePage from './profilePage';

export default function Profile() {
  const router = useRouter();
  const { user } = useAuth();
  const { userInfo } = useUser();

  const [profile, setProfile] = useState<any>(null
  );

    useEffect(() => {
            setProfile(userInfo)
    }, [userInfo]);

    React.useEffect(() => {
      if (!user) 
        router.push("/login")
    }, [user])
  
    if (!user) {
      return <div><Custom403/></div>
    }

  return (
    <div><ProfilePage/></div>
      );
}
