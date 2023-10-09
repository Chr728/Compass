'use client';
import Image from 'next/image';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Link from 'next/link';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { getWeightJournal, getWeightJournals} from '../../http/weightJournalAPI'; 
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'
import Header from '@/app/components/Header';
import Menu from '@/app/components/Menu';
import { formatMilitaryTime } from '@/app/helpers/utils/datetimeformat';


export default function GetWeightJournal({params: { weightJournal } } : { params: { weightJournal: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const { userInfo } = useUser();
  const [weight, setweight] = useState<any>(null);
  // const pathname = usePathname();
  // const generatedWeightId = pathname.split('/')[2];

  useEffect(() => {
    if (!userInfo) {
      alert('User not found.');
    } 
  }, [userInfo, router]);


  useEffect(() => {
    async function fetchWeightJournal() {
      try {
        const userId = user?.uid || '';
        // const x = await getWeightJournals();   
        // const weightJournalId = '1'; // Replace '1' with the correct weight journal entry ID
        const result = await getWeightJournal(weightJournal);
        console.log('Weight journal entry retrieved:', result);
        setweight(result.data);
      } catch (error) {
        console.error('Error retrieving weight journal entry:', error);
      }
    }

    fetchWeightJournal();
  }, [user]);


  return (

    // <p>Date: {weight.date}</p>
    // <p>Time: {weight.time}</p>
    // <p>Weight: {weight.weight}</p>
    // <p>Height: {weight.height}</p>
    // <p>Unit: {weight.unit}</p>
    // <p>Notes: {weight.notes}</p>
    
    <div className="bg-eggshell min-h-screen flex flex-col">
       <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
              <button onClick={() => router.back()}>
              <Header headerText="View the Weight Journal"></Header>
              </button>
              </span>
     
        {weight && (
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
    {new Date(weight.date).toISOString().split('T')[0]}
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
         {/* {new Date(`1970-01-01T${weight.time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} */}
         {formatMilitaryTime(weight.time)}
       </p>
       <br></br>
       <p
           className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
           style={{display: 'inline'}}
       >
         Weight:
       </p>
       <p
           className="text-md ml-2 text-darkgrey"
           style={{display: 'inline'}}
       >
         {weight.weight}
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
        {weight.unit}
       </p>
       <br></br>

       <p
           className="text-lg ml-0 font-sans text-darkgrey font-bold text-[16px]"
           style={{display: 'inline'}}
       >
         Height:
       </p>
       <p
           className="text-md ml-2 text-darkgrey"
           style={{display: 'inline'}}
       >
         {weight.height}
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
         {weight.notes}
       </p>
       <br></br>
     </div>
   </div>
            <div className='mt-10 mb-2'>
                  <Button type="button" text="Edit"style={{ width: '140px' }} onClick={() => router.push(`/getWeightJournals/${weightJournal}/${weightJournal}`)} />
                  <Button
                  type="button"
                  text="Cancel"
                  style={{ width: '140px', backgroundColor: 'var(--Red, #FF7171)' }}
                  onClick={() => router.push(`/getWeightJournals`)}
                />
                </div>
      </span>
)}
<div className="mt-4">
        <div className={`xl:max-w-[1280px] w-full  menu-container`}>
          <Menu />
        </div>
      </div>
    </div>
  );
}