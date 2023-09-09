'use client';
import {useState} from 'react'
import Link from 'next/link';
import Menu from '../components/Menu';

export default function MainMenu() {
return (
   
    <div className="bg-eggshell min-h-screen flex flex-col">
  <div className={`sm:px-16 px-6 flex justify-center items-center`}>
    <div className={`xl:max-w-[1280px] w-full`}>
      <Menu />
    </div>
  </div>
</div>
  )
}