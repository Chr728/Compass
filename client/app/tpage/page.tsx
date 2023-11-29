'use client';
import React from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import Custom403 from '../pages/403';
import {
  MdEditNote,
  MdCalendarMonth
} from 'react-icons/md';
import Image from 'next/image';

export default function MainMenu() {
  const { user } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!user) 
      router.push("/login")
  }, [user])

  if (!user) {
    return <div><Custom403/></div>
  }
  
return (
  <div className="bg-eggshell min-h-screen flex flex-col pb-32">
      
      <div className="grid grid-cols-2 gap-3 p-4 my-auto text-center">
      <div className="text-darkgrey font-bold col-span-2 text-[24px]">Welcome to Compass</div>
      <div className="text-grey font-sans font-semibold col-span-2">
        Quickstart Your Journey...
      </div>

      <div 
        className="bg-red rounded-xl h-36 py-14 bg-opacity-90 hover:-translate-y-1.5"
        onClick = {() => router.push('/viewappointments')}
      >
          Appointments
          <div className="flex text-2xl justify-center">
            <MdCalendarMonth/>
          </div>
      </div>
        
      <div 
        className="bg-darkgrey rounded-xl h-36 py-14 bg-opacity-90 hover:-translate-y-1.5"
        onClick = {() => router.push('/getMedications')}
      >
        Medications
        <div className="flex justify-center">
          <Image
            src="/icons/medication.svg"
            alt="Medicine icon"
            width={20}
            height={20}
          />
        </div>
      </div>

      <div 
      className="bg-yellow rounded-xl h-36 py-14 bg-opacity-90 hover:translate-y-1.5"
      onClick = {() => router.push('/journals')}
      >
        Journals
        <div className="flex text-3xl justify-center">
          <MdEditNote/>
        </div>
        
      </div>

      <div 
        className="bg-green rounded-xl h-36 py-14 bg-opacity-90 hover:translate-y-1.5"
        onClick = {() => router.push('/profile')}
      >
        Profile
        <div className="flex justify-center">
          <Image
            src="/icons/whiteMask.svg"
            alt="Profile icon"
            width={18}
            height={18}
          />
        </div>
      </div>
    </div>
</div>
  )
}