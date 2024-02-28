'use client';
import Header from '@/app/components/Header';
import SingleEntry from '@/app/components/SingleEntry';
import { formatDate, formatMilitaryTime } from '@/app/helpers/utils/datetimeformat';
import Custom403 from '@/app/pages/403';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useProp } from '../../contexts/PropContext';


export default function GetBloodPressureJournal({params: { bloodPressureJournal } } : { params: { bloodPressureJournal : string } }) {
    const logger = require('../../../logger');
    const { user } = useAuth();
    const router = useRouter();
    const { handlePopUp} = useProp();

    useEffect(() => {
        if (!user) {
          router.push("/login")
          logger.warn('User not found.')
          alert('User not found.');
        } 
        if (user) {
          setTimeout(() => {
          }, 1000);
        }
      }, []);  

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
       <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
        <button onClick={() => router.push('/getActivityJournals')}>
            <Header headerText="View Blood Pressure Entry"></Header>
        </button>
      </span>
      <span
        className="rounded-2xl  mt-6 mb-10 mr-28 bg-white flex flex-col m-auto w-full md:max-w-[800px] md:min-h-[600px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
        >
            <div className="mt-3 relative">
                {/* value to be added later */}
                <SingleEntry label={ 'Date:' } value=""></SingleEntry>
                <SingleEntry label={ 'Time:' } value=""></SingleEntry>
                <SingleEntry label={ 'Blood Pressure:' } value=""></SingleEntry>
                <SingleEntry label={ 'Pulse Rate:' } value=""></SingleEntry>
                <SingleEntry label={ 'Notes:' } value=""></SingleEntry>
            </div>
            <div className='mt-10 pb-4 self-center'>
                <Button 
                    type="button" 
                    text="Edit" 
                    style={{ width: '140px' }} 
                    onClick={() => router.push(``)} 
                />
                <Button
                    type="button"
                    text="Cancel"
                    style={{ width: '140px', backgroundColor: 'var(--Red, #FF7171)',marginLeft:'8px' }}
                    onClick={() => router.push(`/getBloodPressureJournals`)}
                />
            </div>
      </span>
    </div>
  )
}
