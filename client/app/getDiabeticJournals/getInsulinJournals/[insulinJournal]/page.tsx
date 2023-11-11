'use client';
import Image from 'next/image';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Link from 'next/link';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { getInsulinJournal, getInsulinJournals} from '../../../http/diabeticJournalAPI'; 
import { useAuth } from '../../../contexts/AuthContext';
import { useUser } from '../../../contexts/UserContext';
import { useEffect, useState } from 'react';
import Header from '@/app/components/Header';
import Menu from '@/app/components/Menu';
import { formatDate, formatMilitaryTime } from '@/app/helpers/utils/datetimeformat';
import Custom403 from '@/app/pages/403';



export default function GetInsulinJournal({params: { insulinJournal } } : { params: { insulinJournal: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [insulin, setinsulin] = useState<any>(null);

  async function fetchInsulinJournal() {
    try {
      const userId = user?.uid || '';
      const result = await getInsulinJournal(insulinJournal);
      setinsulin(result.data);
    } catch (error) {
      console.error('Error retrieving Insulin journal entry:', error);
    }
  }

  useEffect(() => {
    if (!user) {
      router.push("/login")
      alert('User not found.');
    } 
    if (user) {
      fetchInsulinJournal();
    }
  }, []);  

  if (!user) {
    return <div><Custom403/></div>
  }

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
       <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
              <button onClick={() => router.push('/getDiabeticJournals')}>
              <Header headerText="View the Insulin Journal"></Header>
              </button>
              </span>
     
        {insulin && (
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
    {formatDate(insulin.date)}
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
         {formatMilitaryTime(insulin.time)}
       </p>
       <br></br>
       <p
           className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
           style={{display: 'inline'}}
       >
         Type:
       </p>
       <p
           className="text-md ml-2 text-darkgrey"
           style={{display: 'inline'}}
       >
         {insulin.typeOfInsulin}
       </p>
       <br></br>
       <p
           className="text-lg ml-0 font-sans text-darkgrey font-bold text-[16px]"
           style={{display: 'inline'}}
       >
         Units:
       </p>
       <p
           className="text-md ml-2 text-darkgrey"
           style={{display: 'inline'}}
       >
         {insulin.unit}
       </p>

              <br></br>
              <p
           className="text-lg ml-0 font-sans text-darkgrey font-bold text-[16px]"
           style={{display: 'inline'}}
       >
         Body Site:
       </p>
       <p
           className="text-md ml-2 text-darkgrey"
           style={{display: 'inline'}}
       >
         {insulin.bodySite}
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
         {insulin.notes}
       </p>
       <br></br>
     </div>
   </div>
    <div className='mt-10 pb-4 self-center'>
    <Button type="button" text="Edit" style={{ width: '140px' }} onClick={() => router.push(`/getDiabeticJournals/getInsulinJournals/${insulinJournal}/${insulinJournal}`)} />
    <Button
    type="button"
    text="Cancel"
    style={{ width: '140px', backgroundColor: 'var(--Red, #FF7171)',marginLeft:'8px' }}
    onClick={() => router.push(`/getDiabeticJournals`)}
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