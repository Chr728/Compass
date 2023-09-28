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
    <div className="bg-eggshell min-h-screen flex flex-col justify-center">
      <button onClick={() => router.back()}>
        <Header headerText="View Profile"></Header>
      </button>
      {profile && <span
          className="rounded-2xl  mt-6 mb-10 mr-28 bg-white flex flex-col m-auto w-full md:max-w-[800px] md:min-h-[600px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
        <div className="mt-3 relative">
          <div>
            <p
                className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
                style={{display: 'inline'}}
            >
              First Name :{' '}
            </p>
            <p
                className="text-md ml-2 text-darkgrey"
                style={{display: 'inline'}}
            >
              {profile.firstName}
            </p>
            <br></br>
            <p
                className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
                style={{display: 'inline'}}
            >
              Last Name :{' '}
            </p>
            <p
                className="text-md ml-2 text-darkgrey"
                style={{display: 'inline'}}
            >
              {profile.lastName}
            </p>
            <br></br>
            <p
                className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
                style={{display: 'inline'}}
            >
              Email :{' '}
            </p>
            <p
                className="text-md ml-2 text-darkgrey"
                style={{display: 'inline'}}
            >
              {profile.email}
            </p>
            <br></br>
            <p
                className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
                style={{display: 'inline'}}
            >
              Street Address :{' '}
            </p>
            <p
                className="text-md ml-2 text-darkgrey"
                style={{display: 'inline'}}
            >
              {profile.streetAddress}
            </p>
            <br></br>
            <p
                className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
                style={{display: 'inline'}}
            >
              City:{' '}
            </p>
            <p
                className="text-md ml-2 text-darkgrey"
                style={{display: 'inline'}}
            >
              {profile.city}
            </p>
            <br></br>
            <p
                className="text-lg ml-0 font-sans text-darkgrey font-bold text-[16px]"
                style={{display: 'inline'}}
            >
              Province:{' '}
            </p>
            <p
                className="text-md ml-2 text-darkgrey"
                style={{display: 'inline'}}
            >
              {profile.province}
            </p>
            <br></br>
            <p
                className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
                style={{display: 'inline'}}
            >
              Postal Code :{' '}
            </p>
            <p
                className="text-md ml-2 text-darkgrey"
                style={{display: 'inline'}}
            >
              {profile.postalCode}
            </p>
            <br></br>
            <p
                className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
                style={{display: 'inline'}}
            >
              Phone number :{' '}
            </p>
            <p
                className="text-md ml-2 text-darkgrey"
                style={{display: 'inline'}}
            >
              {profile.phoneNumber}
            </p>
            <br></br>

            <p
                className="text-lg ml-0 font-sans text-darkgrey font-bold text-[16px]"
                style={{display: 'inline'}}
            >
              Birth Date :{' '}
            </p>
            <p
                className="text-md ml-2 text-darkgrey"
                style={{display: 'inline'}}
            >
              {profile.birthDate
                  ? new Date(profile.birthDate).toISOString().split('T')[0]
                  : ''}
            </p>

            <br></br>
            <p
                className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
                style={{display: 'inline'}}
            >
              Sex :{' '}
            </p>
            <p
                className="text-md ml-2 text-darkgrey"
                style={{display: 'inline'}}
            >
              {profile.sex}
            </p>
            <br></br>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Link href="/editprofile" className="mt-6">
            <Button
                type="submit"
                text="Edit Profile"
                style={{width: '180px', alignContent: 'center'}}
            />
          </Link>
        </div>
      </span>}
      <div className="mt-4">
        <div className={`xl:max-w-[1280px] w-full  menu-container`}>
          <Menu />
        </div>
      </div>
    </div>
  );
}
