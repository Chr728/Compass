'use client';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/app/components/Button';

export default function Appointment() {
  return (
    <div className="bg-eggshell min-h-screen flex flex-col appointment">
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
      <div className="min-h-[600px] rounded-3xl bg-white flex flex-col space-y-4 mt-4 w-full p-8 
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
                Hello there
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
                time text
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
                dr. name
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
                    my reason
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
                notes text
                </p>
            </div>
           
            <Button 
              type="button" 
              text="Return to Appointments" 
              style={{ width: '180px', marginTop: 'auto', alignSelf: 'center', fontFamily: 'sans', color: '#EBF4F8' }}
            />
            
      </div>
    </div>
  )
}
