'use client';
import {useState} from 'react'
import Link from 'next/link';
import Menu from '../components/Menu';
import {useUser} from '@/app/contexts/UserContext';

export default function MainMenu() {
    const {userInfo} = useUser();
    console.log('userInfo', userInfo)
return (
   
    <div className="bg-eggshell min-h-screen flex flex-col">
  <div className={`sm:px-16 px-6 flex justify-center items-center`}>
  <div className="mb-6 mt-1">
        
    <div className={`xl:max-w-[1280px] w-full`}>
    <p className="text-[24px] mt-72 flex justify-center items-center text-darkgrey font-IBM Plex Sans font-bold text-center">
            Hello, welcome to the Main Menu !
          </p>
        </div>
      <Menu />
    </div>
  </div>
</div>
  )
}