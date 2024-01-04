'use client';
import Button from '@/app/components/Button';
import SingleEntry from '@/app/components/SingleEntry';
import { useAuth } from '@/app/contexts/AuthContext';
import { formatDate, formatMilitaryTime } from '@/app/helpers/utils/datetimeformat';
import { Appointment, getAppointment } from '@/app/http/appointmentAPI';
import Custom403 from '@/app/pages/403';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function Appointment( {params: { appointment } } : { params: { appointment: string } }) {
  const logger = require('../../../logger');
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<Appointment>();

  async function getSingleAppointment() {
    try {
       const appointmentData = await getAppointment(appointment);
       setData(appointmentData.data);
    } catch (error) {
        logger.error('Error fetching appointment');
    }
}

  useEffect(() => {
    if (!user){
      router.push("/login")
    }
    if (user) {
    getSingleAppointment();
  }
}, [user, appointment]);

if (!user) {
  return <div><Custom403/></div>
}

  return (
    data && <div className="bg-eggshell min-h-screen flex flex-col appointment mb-[60px]">
      <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4">
        <Link href="/viewappointments">
          <Image
            src="/icons/LeftArrow.svg"
            alt="LeftArrow icon"
            width={10}
            height={10}
            className="mr-4"
            style={{ width: 'auto', height: 'auto' }}
          />
        </Link>
        View Appointment
      </span>
      <div className="min-h-[500px] rounded-3xl bg-white flex flex-col  mt-4 w-full p-8 
                    shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
        <div>
          <SingleEntry label={ 'Date:' } value={ formatDate( data.date ) }></SingleEntry>
        </div>  
        <div> 
        <SingleEntry label={ 'Time:' } value={ formatMilitaryTime( data.time ) }></SingleEntry>
        </div>  
        
        <div>
          <SingleEntry label={ 'Appointment:' } value={ data.appointmentWith }></SingleEntry>
        </div>

        <div>
          <SingleEntry label={ 'Reason:' } value={ data.reason }></SingleEntry>
        </div>

        <div>
        <SingleEntry label={ 'Notes:' } value={ data.notes }></SingleEntry>
        </div>
           <div className="mt-auto self-center font-sans space-x-4">
              <Button 
                type="button" 
                text="Return to Appointments" 
                style={{ width: '140px'}}
                onClick={() => router.push('/viewappointments')}
              />
              <Button 
                type="button" 
                text="Update Appointment" 
                style={{ width: '140px'}}
                onClick={() => router.push(`/viewappointments/${appointment}/${appointment}`)}
              />
            </div>
            
      </div>
    </div>
  )
}
