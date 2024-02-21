'use client';
import Header from '@/app/components/Header';
import Menu from '@/app/components/Menu';
import SingleEntry from '@/app/components/SingleEntry';
import { formatDate, formatMilitaryTime } from '@/app/helpers/utils/datetimeformat';
import Custom403 from '@/app/pages/403';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useProp } from '../../contexts/PropContext';
import { getActivityJournal } from '../../http/activityJournalAPI';


export default function GetActivityJournal({params: { activityJournal } } : { params: { activityJournal: string } }) {
  const logger = require('../../../logger');
  const { user } = useAuth();
  const router = useRouter();
  const [activity, setactivity] = useState<any>(null);
    const { handlePopUp} = useProp();

  async function fetchActivityJournal() {
    try {
      const result = await getActivityJournal(activityJournal);
      logger.info('activity journal entry retrieved:', result)
      setactivity(result.data);
    } catch (error) {
      handlePopUp('error', "Error retrieving activity journal entry:");

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
        fetchActivityJournal();
      }, 1000);
    }
  }, []);  

  // if (!user) {
  //   return <div><Custom403/></div>
  // }

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
       <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
       <button onClick={() => router.push('/getActivityJournals')}>
      <Header headerText="View the Activity Journal"></Header>
      </button>
      </span>
        {activity && (
     <span
     className="rounded-2xl  mt-6 mb-10 mr-28 bg-white flex flex-col m-auto w-full md:max-w-[800px] md:min-h-[600px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
   >
     <div className="mt-3 relative">
    <SingleEntry label={ 'Date:' } value={formatDate(activity.date)}></SingleEntry>
    <SingleEntry label={ 'Time:' } value={formatMilitaryTime(activity.time) }></SingleEntry>
    <SingleEntry label={ 'Activity:' } value={activity.activity}></SingleEntry>
    <SingleEntry label={ 'Duration(min):' } value={ activity.duration }></SingleEntry>
    <SingleEntry label={ 'Notes:' } value={ activity.notes }></SingleEntry>
   </div>
    <div className='mt-10 pb-4 self-center'>
    <Button type="button" text="Edit" style={{ width: '140px' }} onClick={() => router.push(`/getActivityJournals/${activityJournal}/${activityJournal}`)} />
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
// }
}