'use client';
import Header from '@/app/components/Header';
import SingleEntry from '@/app/components/SingleEntry';
import { formatDate, formatMilitaryTime } from '@/app/helpers/utils/datetimeformat';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useProp } from '../../contexts/PropContext';
import { getBloodPressureJournal } from '@/app/http/bloodPressureJournalAPI';



export default function GetBloodPressureJournal({params: { bloodPressureJournal } } : { params: { bloodPressureJournal : string } }) {
    const logger = require('../../../logger');
    const { user } = useAuth();
    const router = useRouter();
    const [journal, setJournal] = useState<any>(null);
    const { handlePopUp} = useProp();

    async function fetchBloodPressureEntry() {
      try {
        const result = await getBloodPressureJournal(bloodPressureJournal);
        logger.info('blood pressure journal entry retrieved:', result)
        setJournal(result.data);
      } catch (error) {
        handlePopUp('error', "Error retrieving blood pressure journal entry:");
      }
    }

    useEffect(() => {
        if (!user) {
          router.push("/login")
          logger.warn('User not found.')
          alert('User not found.');
        } 
        if (user) {
          setTimeout(() => {
            fetchBloodPressureEntry();
          }, 1000);
        }
      }, [user, bloodPressureJournal]);  

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
       <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
        <button onClick={() => router.push('/getBloodPressureJournals')}>
            <Header headerText="View Blood Pressure Entry"></Header>
        </button>
      </span>
      { journal && (
      <span
        className="rounded-2xl  mt-6 mb-10 mr-28 bg-white flex flex-col m-auto w-full md:max-w-[800px] md:min-h-[600px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
        >
            <div className="mt-3 relative">
                <SingleEntry label={ 'Date:' } value={formatDate(journal.date)}></SingleEntry>
                <SingleEntry label={ 'Time:' } value={formatMilitaryTime(journal.time)}></SingleEntry>
                <SingleEntry label={ 'Blood Pressure:' } value={`${journal.systolic}/${journal.diastolic}`}></SingleEntry>
                <SingleEntry label={ 'Pulse Rate:' } value={journal.pulse}></SingleEntry>
                <SingleEntry label={ 'Notes:' } value={journal.notes}></SingleEntry>
            </div>
            <div className='mt-10 pb-4 self-center'>
                <Button 
                    type="button" 
                    text="Edit" 
                    style={{ width: '140px' }} 
                    onClick={() => router.push(`/getBloodPressureJournals/${bloodPressureJournal}/${bloodPressureJournal}`)}
                />
                <Button
                    type="button"
                    text="Cancel"
                    style={{ width: '140px', backgroundColor: 'var(--Red, #FF7171)',marginLeft:'8px' }}
                    onClick={() => router.push(`/getBloodPressureJournals`)}
                />
            </div>
      </span>
      )}
    </div>
  )
}
