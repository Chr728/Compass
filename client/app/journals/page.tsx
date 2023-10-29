'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '@/app/contexts/UserContext';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Link from 'next/link';
import Button from '../components/Button';
import Menu from '../components/Menu';

export default function Journal() {
  const router = useRouter();
  
  return (
    <div className="bg-eggshell p-5  min-h-screen flex flex-col justify-center">
      <div className="mt-6 mb-10 mr-28  flex flex-col m-auto w-full p-5">
      <div style={{ marginTop: '-5%' }} >
      <button className="mt-3" onClick={() => router.push('/tpage')}>
        <Header  headerText="Journals"></Header>
      </button>
      
     <p className="p-6 text-darkgrey">Use our health journals to help you keep track
        of your physical and mental health.</p>   
    
<Link href="/getActivityJournals">
      <div className="rounded-3xl  mt-1 flex flex-col  w-full md:max-w-[800px] md:h-[600px] p-5 " style={{backgroundColor: 'var(--Black, #2C2738)' }}>
        
        <div>
          <p className="text-[18px] text-white font-IBM Plex Sans font-bold text-start">
            Activity Journal
          </p>
          <p className="text-[14px] text-white font-IBM Plex Sans  text-start">
          Record the activities that get you moving.
          </p>
        </div>
      </div>
</Link>
<br></br>


<Link href="/getWeightJournals">
      <div className="rounded-3xl flex flex-col  w-full md:max-w-[800px] md:h-[600px] p-5 " style={{backgroundColor: 'var(--Red, #FF7171)' }}>
        
        <div>
          <p className="text-[18px] text-white font-IBM Plex Sans font-bold text-start">
          Weight Journal
          </p>
          <p className="text-[14px] text-white font-IBM Plex Sans  text-start">
          Log your changes in weight.
          </p>
        </div>
      </div>
</Link>
<br></br>



<Link href="/getFoodJournals">
      <div className="rounded-3xl flex flex-col  w-full md:max-w-[800px] md:h-[600px] p-5 " style={{backgroundColor: 'var(--Red, #F2AC57)' }}>
        
        <div>
          <p className="text-[18px] text-white font-IBM Plex Sans font-bold text-start">
          Food Intake Journal
          </p>
          <p className="text-[14px] text-white font-IBM Plex Sans  text-start">
          Keep track of what you eat.
                    </p>
        </div>
      </div>
</Link>
<br></br>

<Link href="/moodjournal">
      <div className="rounded-3xl flex flex-col  w-full md:max-w-[800px] md:h-[600px] p-5 " style={{backgroundColor: 'var(--Green, #4caf50)' }}>
        
        <div>
          <p className="text-[18px] text-white font-IBM Plex Sans font-bold text-start">
          Mood Journal
          </p>
          <p className="text-[14px] text-white font-IBM Plex Sans  text-start">
          Document what changes your mood.
          </p>
        </div>
      </div>
</Link>
</div>
</div>
    </div>
    
  );
}