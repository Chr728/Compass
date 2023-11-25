'use client';
import Image from 'next/image';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Link from 'next/link';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { getGlucoseJournal, getGlucoseJournals} from '../../../http/diabeticJournalAPI'; 
import { useAuth } from '../../../contexts/AuthContext';
import { useUser } from '../../../contexts/UserContext';
import { useEffect, useState } from 'react';
import Header from '@/app/components/Header';
import Menu from '@/app/components/Menu';
import { formatDate, formatMilitaryTime } from '@/app/helpers/utils/datetimeformat';
import Custom403 from '@/app/pages/403';


export default function GetGlucoseJournal({params: { glucoseJournal } } : { params: { glucoseJournal: string } }) {
  const logger = require('../../../../logger');
  const { user } = useAuth();
  const router = useRouter();
  const { userInfo } = useUser();
  const [glucose, setglucose] = useState<any>(null);
  
  async function fetchGlucoseJournal() {
    try {
      const userId = user?.uid || '';
      const result = await getGlucoseJournal(glucoseJournal);
      logger.info('Glucose journal entry retrieved:', result);
      setglucose(result.data);
    } catch (error) {
      logger.error('Error retrieving Glucose journal entry:', error);
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
        fetchGlucoseJournal();
      }, 1000);
    }
  }, []);

  if (!user) {
    return <div><Custom403/></div>
  }

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
       <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
              <button onClick={() => router.push('/getDiabeticJournals')}>
              <Header headerText="View the Glucose Journal"></Header>
              </button>
              </span>
     
        {glucose && (
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
    {formatDate(glucose.date)}
  </p>
</div>
       <p
           className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
           style={{display: 'inline'}}
       >
         Meal Time:
       </p>
       <p
           className="text-md ml-2 text-darkgrey"
           style={{display: 'inline'}}
       >
         {glucose.mealTime}
       </p>
       <br></br>
       <p
           className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
           style={{display: 'inline'}}
       >
        Blood Glucose:
       </p>
       <p
           className="text-md ml-2 text-darkgrey"
           style={{display: 'inline'}}
       >
         {glucose.bloodGlucose}
       </p>
       <br></br>
       <p
           className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
           style={{display: 'inline'}}
       >
         Unit:
       </p>
       <p
           className="text-md ml-2 text-darkgrey"
           style={{display: 'inline'}}
       >
        {glucose.unit}
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
         {glucose.notes}
       </p>
       <br></br>
     </div>
   </div>
    <div className='mt-10 pb-4 self-center'>
    <Button type="button" text="Edit"style={{ width: '140px' }} onClick={() => router.push(`/getDiabeticJournals/getGlucoseJournals/${glucoseJournal}/${glucoseJournal}`)} />
    <Button
    type="button"
    text="Cancel"
    style={{ width: '140px', backgroundColor: 'var(--Red, #FF7171)',marginLeft:'12px' }}
    onClick={() => router.push(`/getDiabeticJournals`)}
    />
    </div>
      </span>
)}
    </div>
  );
// }
}