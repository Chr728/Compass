'use client';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/app/components/Button';
import { useEffect, useState} from 'react';
import { Appointment, getAppointment } from '@/app/http/appointmentAPI';
import { useRouter } from 'next/navigation';
import { formatDate, formatMilitaryTime } from '@/app/helpers/utils/datetimeformat';
import Menu from '../../components/Menu';
import { useAuth } from '@/app/contexts/AuthContext';
import Custom403 from '@/app/pages/403';


export default function Appointment( {params: { appointment } } : { params: { appointment: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<Appointment>();

  async function getSingleAppointment() {
    try {
       const appointmentData = await getAppointment(appointment);
       setData(appointmentData.data);
    } catch (error) {
        console.log('Error fetching appointment');
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
    data && <div className="bg-eggshell min-h-screen flex flex-col appointment">
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
      <div className="min-h-[600px] rounded-3xl bg-white flex flex-col  mt-4 w-full p-8 
                    shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
            <div>
                <p
                    className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
                    style={{display: 'inline-block'}}
                >
                Date:
                </p>
                <p
                    className="text-md ml-2 text-darkgrey"
                    style={{display: 'inline'}}
                >
                {formatDate(data.date)}
                </p>
            </div>
            
            <div>
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
                {formatMilitaryTime(data.time)}
                </p>
            </div>
           
           <div>
            <p
                    className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
                    style={{display: 'inline'}}
                >
                Appointment:
                </p>
                <p
                    className="text-md ml-2 text-darkgrey"
                    style={{display: 'inline'}}
                >
                {data.appointmentWith}
                </p>
           </div>
           
           <div>
            <p
                    className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]"
                    style={{display: 'inline'}}
                >
                Reason:
                </p>
                <p
                    className="text-md ml-2 text-darkgrey"
                    style={{display: 'inline'}}
                >
                  {data.reason}
                </p>
           </div>
            
            <div>
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
                {data.notes}
                </p>
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

      <Menu/>
    </div>
  )
}
