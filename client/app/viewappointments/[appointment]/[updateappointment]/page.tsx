'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFormik } from 'formik';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { useRouter } from 'next/navigation';
import { Appointment, updateAppointment, getAppointment } from '@/app/http/appointmentAPI';
import { formatDateYearMonthDate } from '@/app/helpers/utils/datetimeformat';
import { useAuth } from "../../../contexts/AuthContext";


export default function UpdateAppointment(  {params: { appointment } } : { params: { appointment: string }} ) { 
    const { user } = useAuth()
    const router = useRouter();
    const [data, setData] = useState<Appointment>();

// Fetch the current data of the appointment that is to be updated
    useEffect(() => {
        async function updateSingleAppointment() {
        try {
           const appointmentData = await getAppointment(appointment);
           setData(appointmentData.data);
        } catch (error) {
            console.log('Error fetching appointment');
        }
    }
    updateSingleAppointment();
}, [appointment]);

useEffect(() =>{
  if (!user) 
      router.push("/login")
  }, [user])

    const formik = useFormik({
        initialValues: {
            doctor: data?.appointmentWith || '',
            reason: data?.reason || '',
            date: (data?.date || '') as any,
            time: data?.time || '',
            notes: data?.notes || '',
          },
          onSubmit: async (values) => {
            const data = {
              appointmentWith: values.doctor,
              reason: values.reason,
              date: values.date,
              time: values.time,
              notes: values.notes
            }
            await updateAppointment(appointment, data);
            router.push('/viewappointments');
          },
          validate: (values) => {
            let errors:{
              doctor?:string;
              reason?:string;
              date?:any;
              time?:string;
              notes?:string;
            } = {};

            if(!values.doctor){
              errors.doctor='Name is required';
            } else if(
                !/^[^0-9 ][^\d]*[^0-9 ]$/i.test(values.doctor)
                ){
                errors.doctor='Names cannot contain numbers and must not begin or end with a space.';
            }

            if(!values.reason){
              errors.reason='Please provide a reason for the appointment.';
            }

            if(!values.date){
              errors.date='Please provide a date for the appointment.';
            }

            if(!values.time){
              errors.time='Please provide a time for the appointment.';
            }

            return errors;
          
    }});

    useEffect(() =>{
      const  { setValues } = formik;
      setValues({
        doctor: data?.appointmentWith || '',
        reason: data?.reason || '',
        date: formatDateYearMonthDate(data?.date || '') || '',
        time: data?.time || '',
        notes: data?.notes || '',
      })
    }, [data])

  return (
    <div className="bg-eggshell min-h-screen flex flex-col appointment">
        <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4">
        <Link href="/viewappointments">
          <Image
            src="/icons/LeftArrow.svg"
            alt="LeftArrow icon"
            width={10}
            height={10}
            className="mr-4 md:hidden"
            style={{ width: 'auto', height: 'auto' }}
          />
        </Link>
        Update Appointment
      </span>
      <form
        className="rounded-3xl bg-white flex flex-col space-y-4 mt-4 w-full p-8 
                  shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
        onSubmit={formik.handleSubmit}
      >
        <div className="w-full">
            <label
                htmlFor="doctor"
                className="font-sans font-medium text-grey text-[16px]"
            >Appointment With</label>
            <br/>
            <Input 
              name="doctor" 
              id="doctor" 
              type="text" 
              value={formik.values.doctor}  
              style={{ width: '100%' }} 
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.doctor && formik.errors.doctor && (
                <p className="text-[16px] text-red font-sans">
                  {formik.errors.doctor}
                </p>
              )}
        </div>

        <div className="w-full">
            <label
                htmlFor="reason"
                className="font-sans font-medium text-grey text-[16px]"
            >Reason</label>
            <br/>
            <Input 
              name="reason" 
              id="reason" 
              type="text" 
              value={formik.values.reason}  
              style={{ width: '100%' }} 
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
             {formik.touched.reason && formik.errors.reason && (
                <p 
                  className="text-[16px] text-red font-sans">
                    {formik.errors.reason}
                </p>
              )}
        </div>
        
        <div className="date">
            <label
                htmlFor="date"
                className="font-sans font-medium text-grey text-[16px]"
            >Date</label>
            <br/>
            
            <Input 
              name="date" 
              id="date" 
              type="date" 
              value={formik.values.date} 
              style={{ width: '250px'}} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur}
            />
            {formik.touched.date && formik.errors.date && (
                <p 
                  className="text-[16px] text-red font-sans">
                    {formik.errors.date.toString()}
                </p>
              )}
      </div>

        <div className="time">
            <label
                htmlFor="time"
                className="font-sans font-medium text-grey text-[16px]"
            >Time</label>
            <br/>
            <Input 
              name="time" 
              id="time" 
              type="time" 
              value={formik.values.time} 
              style={{ width: '250px'}} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur}
            />
            {formik.touched.time && formik.errors.time && (
                <p 
                  className="text-[16px] text-red font-sans">
                    {formik.errors.time}
                </p>
              )}
        </div>

        <div>
            <label
                htmlFor="notes"
                className="font-sans font-medium text-grey text-[16px]"
            >Notes</label>
            <br/>
            <textarea 
              name="notes" 
              id="notes" 
              value={formik.values.notes} 
              className="w-full border-2 text-grey" 
              rows={4} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur}
            />
        </div>

        <div className="mx-auto space-x-2">
            <Button 
              type="button" 
              text="Cancel" 
              style={{ width: '140px', backgroundColor: 'var(--Red, #FF7171)' 
              }}
              onClick={() => router.push('/viewappointments')}
            />
            <Button 
              type="submit" 
              text="Submit" 
              style={{ width: '140px' }}
            />
        </div>
    </form>
      
    </div>
  )
}

