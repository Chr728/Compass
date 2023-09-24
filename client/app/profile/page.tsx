'use client';
import { useState } from 'react';
import { useFormik } from 'formik';
import Image from 'next/image';
import Button from '../components/Button';
import Input from '../components/Input';
import Link from 'next/link';
import Menu from '../components/Menu';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const router = useRouter();

  return (
    <div className="bg-eggshell min-h-screen flex flex-col justify-center">
      <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
        <Link href="">
            <Image
            src="/icons/LeftArrow.svg"
            alt="LeftArrow icon"
            width={10}
            height={10}
            className="mr-4 md:hidden"
            style={{ width: 'auto', height: 'auto' }}
            />
        </Link>
        View Profile
        </span>
      <span className="rounded-2xl  mt-6 mb-10 mr-28 bg-white flex flex-col m-auto w-full md:max-w-[800px] md:min-h-[600px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
      <div className="mt-3 relative"> 
    <div>
        <p className="text-lg ml-0 font-sans text-black  font-bold text-[16px]" style={{ display: 'inline' }}>First Name : </p>
        <p className="text-md ml-2"  style={{ display: 'inline' }}>Marc</p>
        <br></br>
        <p className="text-lg ml-0 font-sans text-black  font-bold text-[16px]" style={{ display: 'inline' }}>Last Name : </p>
        <p className="text-md ml-2"  style={{ display: 'inline' }}>placeholder</p>
        <br></br>
        <p className="text-lg ml-0 font-sans text-black  font-bold text-[16px]" style={{ display: 'inline' }}>Email : </p>
        <p className="text-md ml-2"  style={{ display: 'inline' }}>placeholder</p>
        <br></br>
        <p className="text-lg ml-0 font-sans text-black  font-bold text-[16px]" style={{ display: 'inline' }}>Street Address : </p>
        <p className="text-md ml-2"  style={{ display: 'inline' }}>placeholder</p>
        <br></br>
        <p className="text-lg ml-0 font-sans text-black  font-bold text-[16px]" style={{ display: 'inline' }}>City: </p>
        <p className="text-md ml-2"  style={{ display: 'inline' }}>placeholder</p>
        <br></br>
        <p className="text-lg ml-0 font-sans text-black  font-bold text-[16px]" style={{ display: 'inline' }}>Province: </p>
        <p className="text-md ml-2"  style={{ display: 'inline' }}>placeholder</p>
        <br></br>
        <p className="text-lg ml-0 font-sans text-black  font-bold text-[16px]" style={{ display: 'inline' }}>Postal Code : </p>
        <p className="text-md ml-2"  style={{ display: 'inline' }}>placeholder</p>
        <br></br>
        <p className="text-lg ml-0 font-sans text-black  font-bold text-[16px]" style={{ display: 'inline' }}>Phone number : </p>
        <p className="text-md ml-2"  style={{ display: 'inline' }}>placeholder</p>
        <br></br>
        <p className="text-lg ml-0 font-sans text-black  font-bold text-[16px]" style={{ display: 'inline' }}>Birth Date : </p>
        <p className="text-md ml-2"  style={{ display: 'inline' }}>placeholder</p>
        <br></br>
        <p className="text-lg ml-0 font-sans text-black  font-bold text-[16px]" style={{ display: 'inline' }}>Sex : </p>
        <p className="text-md ml-2"  style={{ display: 'inline' }}>placeholder</p>
        <br></br>
   </div>
            
    </div>

    <div className="flex justify-center mt-6">
    <Link href="/editprofile"  className="mt-6">
            <Button type="submit" text="Edit Profile" style={{ width: '180px', alignContent:'center' }} />
            </Link> 
        </div>    
    </span>
    <div className="mt-4" >
    <div className={`xl:max-w-[1280px] w-full  menu-container`}>
      <Menu />
    </div>
    </div>

    </div>
  );
}