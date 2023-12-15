'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import Button from '../components/Button';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';


export default function AboutUsPage() {
  const logger = require('../../logger');
  const router = useRouter();
  const { user } = useAuth();
  const { userInfo } = useUser();
  
  useEffect(() => {
    if (!userInfo) {
      logger.warn('User not found.');
      alert('User not found.');
    } 
  }, [userInfo, router]);




    return (
      <div className="bg-eggshell min-h-screen flex flex-col">
        <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
          <button onClick={() => router.push('/journals')}>
            <Header headerText="Food Journals "></Header>
          </button>
        </span>
        <p className="font-sans text-darkgrey ml-5 text-[14px]">Keep track of what you eat each day.</p>
        <br></br>
        <p className="font-sans text-darkgrey ml-5 text-[14px]">Remember, eating healthy is all about eating
          the right foods in the right amounts.</p>
    
        
  <div className="rounded-3xl bg-white flex flex-col mt-4 mb-44 w-full md:max-w-[800px] md:min-h-[550px] p-4 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
    <div className="flex justify-between items-center">
      <div>
        <Button type="button" text="Add an Entry" style={{ width: '120px', fontSize: '14px', padding: '1px 10px' }} onClick={() => router.push(`/createFoodJournal`)} />
      </div>
    </div>
    <br></br>
<div className="flex" style={{ justifyContent: 'space-between' }}>
    <div className="flex-2" style={{ marginRight: '14%' }}>
      <div className="font-sans  text-darkgrey font-bold text-[18px] text-center">
        Date/Time
        <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
      </div>
    </div>
    <div className="flex-2" style={{ marginRight: '20%' }}>
      <div className="font-sans  text-darkgrey font-bold text-[18px] text-center">
       Food Item
        <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
      </div>
    </div>
  </div>

  </div>

      </div>
    );
    
}
