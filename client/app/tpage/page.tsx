'use client';
import React from 'react';
import Menu from '../components/Menu';
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import Custom403 from '../pages/403';

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
  <div className="bg-eggshell min-h-screen flex flex-col">
      
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
      </div>
        
      <div 
        className="bg-darkgrey rounded-xl h-36 py-14 bg-opacity-90 hover:-translate-y-1.5"
        onClick = {() => router.push('/')}
      >
        Medications
      </div>

      <div 
      className="bg-yellow rounded-xl h-36 py-14 bg-opacity-90 hover:-translate-y-1.5"
      onClick = {() => router.push('/journals')}
      >
        Journals
      </div>

      <div 
        className="bg-green rounded-xl h-36 py-14 bg-opacity-90 hover:-translate-y-1.5"
        onClick = {() => router.push('/profile')}
      >
        Profile
      </div>

    </div>
    <Menu />
</div>
  )
}