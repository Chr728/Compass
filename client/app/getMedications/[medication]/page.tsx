'use client';
import Image from 'next/image';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Link from 'next/link';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { getMedication, getMedications} from '../../http/medicationAPI'; 
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { useEffect, useState } from 'react';
import Header from '@/app/components/Header';
import { formatDate, formatMilitaryTime } from '@/app/helpers/utils/datetimeformat';
import Custom403 from '@/app/pages/403';


export default function GetMedication({params: { medication } } : { params: { medication: string } }) {
  const logger = require('../../../logger');
  const { user } = useAuth();
  const router = useRouter();
  const { userInfo } = useUser();
  const [medicationdata, setmedicationdata] = useState<any>(null);
  
  async function fetchMedication() {
    try {
      const userId = user?.uid || '';
      // medication = '17';
      const result = await getMedication(medication);
      logger.info('Medication entry retrieved:', result);
      setmedicationdata(result.data);
    } catch (error) {
      logger.error('Error retrieving Medication entry:', error);
    }
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks  
  useEffect(() => {
    if (!user) {
      router.push("/login")
      logger.warn('User not found.')
      alert('User not found.');
    } 
    if (user) {
      fetchMedication();
    }
  }, []);

  if (!user) {
    return <div><Custom403/></div>
  }

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
       <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
              <button onClick={() => router.push('/getMedications')}>
              <Header headerText="View the Medication"></Header>
              </button>
              </span>
     
        {medicationdata && (
     <span
     className="rounded-2xl  mt-6 mb-10 mr-28 bg-white flex flex-col m-auto w-full md:max-w-[800px] md:min-h-[600px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
   >
     <div className="mt-3 relative">
     <div>
     <div className="flex items-center">
  <p className="text-lg ml-0 font-sans text-darkgrey font-bold text-[16px]" style={{ display: 'inline' }}>
    Medication Name: 
  </p>
  <p className="text-md ml-2 text-darkgrey">
  {medicationdata.medicationName}
  </p>
</div>
       <p
           className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
           style={{display: 'inline'}}
       >
         Start Date:
       </p>
       <p
           className="text-md ml-2 text-darkgrey"
           style={{display: 'inline'}}
       >
         {formatDate(medicationdata.dateStarted)}
       </p>
       <br></br>
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
         {formatMilitaryTime(medicationdata.time)}
       </p>
       <br></br>
       <p
           className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
           style={{display: 'inline'}}
       >
          Dosage:
       </p>
       <p
           className="text-md ml-2 text-darkgrey"
           style={{display: 'inline'}}
       >
        {medicationdata.dosage}
       </p>
       <br></br>

       <p
           className="text-lg ml-0 font-sans text-darkgrey font-bold text-[16px]"
           style={{display: 'inline'}}
       >
        Unit:
       </p>
       <p
           className="text-md ml-2 text-darkgrey"
           style={{display: 'inline'}}
       >
         {medicationdata.unit}
       </p>

       <br></br>
       <p
           className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
           style={{display: 'inline'}}
       >
         Frequency:
       </p>
       <p
           className="text-md ml-2 text-darkgrey"
           style={{display: 'inline'}}
       >
         {medicationdata.frequency}
       </p>
              <br></br>
              <p
           className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
           style={{display: 'inline'}}
       >
         Route:
       </p>
       <p
           className="text-md ml-2 text-darkgrey"
           style={{display: 'inline'}}
       >
         {medicationdata.route}
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
         {medicationdata.notes}
       </p>
       <br></br>
     </div>
   </div>
    <div className='mt-10 pb-4 self-center'>
    <Button type="button" text="Edit"style={{ width: '140px' }} onClick={() => router.push(`/getMedications/${medication}/${medication}`)} />
    <Button
    type="button"
    text="Cancel"
    style={{ width: '140px', backgroundColor: 'var(--Red, #FF7171)',marginLeft:'12px' }}
    onClick={() => router.push(`/getMedications`)}
    />
    </div>
      </span>
)}
    </div>
  );
}
