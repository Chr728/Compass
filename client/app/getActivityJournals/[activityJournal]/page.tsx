'use client';
import Image from 'next/image';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Link from 'next/link';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { getActivityJournal, getActivityJournals} from '../../http/activityJournalAPI'; 
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { useEffect, useState } from 'react';
import Header from '@/app/components/Header';
import Menu from '@/app/components/Menu';
import { formatMilitaryTime } from '@/app/helpers/utils/datetimeformat';


export default function GetActivityJournal({params: { activityJournal } } : { params: { activityJournal: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const { userInfo } = useUser();
  const [activity, setactivity] = useState<any>(null);

  useEffect(() => {
    if (!userInfo) {
      alert('User not found.');
    } 
  }, [userInfo, router]);


  useEffect(() => {
    async function fetchActivityJournal() {
      try {
        const userId = user?.uid || '';
        const result = await getActivityJournal(activityJournal);
        console.log('Activity journal entry retrieved:', result);
        setactivity(result.data);
      } catch (error) {
        console.error('Error retrieving activity journal entry:', error);
      }
    }

    fetchActivityJournal();
  }, [user]);


  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
       <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
              <button onClick={() => router.back()}>
              <Header headerText="View the Activity Journal"></Header>
              </button>
              </span>
     
        {activity && (
     <span
     className="rounded-2xl  mt-6 mb-10 mr-28 bg-white flex flex-col m-auto w-full md:max-w-[800px] md:min-h-[600px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
   >
     <div className="mt-3 relative">
     <div>
     <div className="flex items-center">
  <p className="text-lg ml-0 font-sans text-darkgrey font-bold text-[16px]" style={{ display: 'inline' }}>
    Date: 
  </p>
  <p className="text-md ml-2 text-darkgrey">
    {new Date(activity.date).toISOString().split('T')[0]}
  </p>
</div>
       <p
           className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
           style={{display: 'inline'}}
       >
         Time:
       </p>
       <p
           className="text-md ml-2 text-darkgrey"
           style={{display: 'inline'}}
       >
         {/* {new Date(`1970-01-01T${activity.time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} */}
         {formatMilitaryTime(activity.time)}
       </p>
       <br></br>
       <p
           className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
           style={{display: 'inline'}}
       >
         Activity:
       </p>
       <p
           className="text-md ml-2 text-darkgrey"
           style={{display: 'inline'}}
       >
         {activity.activity}
       </p>
       <br></br>
       <p
           className="text-lg ml-0 font-sans text-darkgrey font-bold text-[16px]"
           style={{display: 'inline'}}
       >
         Duration(min):
       </p>
       <p
           className="text-md ml-2 text-darkgrey"
           style={{display: 'inline'}}
       >
         {activity.duration}
       </p>

       <br></br>
       <p
           className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
           style={{display: 'inline'}}
       >
         Notes:
       </p>
       <p
           className="text-md ml-2 text-darkgrey"
           style={{display: 'inline'}}
       >
         {activity.notes}
       </p>
       <br></br>
     </div>
   </div>
    <div className='mt-10 mb-2 items-center'>
    <Button type="button" text="Edit"style={{ width: '140px' }} onClick={() => router.push(`/getActivityJournals/${activityJournal}/${activityJournal}`)} />
    <Button
    type="button"
    text="Cancel"
    style={{ width: '140px', backgroundColor: 'var(--Red, #FF7171)',marginLeft:'8px' }}
    onClick={() => router.push(`/getActivityJournals`)}
    />
    </div>
      </span>
)}
<div className="mt-8">
        <div className={`xl:max-w-[1280px] w-full  menu-container`}>
          <Menu />
        </div>
      </div>
    </div>
  );
}