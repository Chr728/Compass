'use client';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/app/components/Button';
import { useEffect, useState} from 'react';
import { Appointment, getAppointment } from '@/app/http/appointmentAPI';
import { useRouter } from 'next/navigation';
import { formatDate } from '../page';
import { formatMilitaryTime } from '../page';

export default function Appointment( {params: { appointment } } : { params: { appointment: string } }) {
  const router = useRouter();
  const [data, setData] = useState<Appointment>();

  useEffect(() => {
    async function getSingleAppointment() {
        try {
           const appointmentData = await getAppointment(appointment);
           setData(appointmentData.data);
        } catch (error) {
            console.log('Error fetching appointments');
        }
    }
    getSingleAppointment();
}, [appointment]);

console.log(data);
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
      <div className="min-h-[600px] rounded-3xl bg-white flex flex-col space-y-2 mt-4 w-full p-8 
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
           
            <Button 
              type="button" 
              text="Return to Appointments" 
              style={{ width: '180px', marginTop: 'auto', alignSelf: 'center', fontFamily: 'sans', color: '#EBF4F8' }}
              onClick={() => router.push('/viewappointments')}
            />
            
      </div>
    </div>
  )
}
