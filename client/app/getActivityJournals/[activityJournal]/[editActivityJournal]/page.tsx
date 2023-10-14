'use client';
import Image from 'next/image';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Link from 'next/link';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { createActivityJournal, getActivityJournal, getActivityJournals, updateActivityJournal } from '../../../http/activityJournalAPI'; // Replace '../api/yourApiFile' with the correct path
import { useAuth } from '../../../contexts/AuthContext';
import { useUser } from '../../../contexts/UserContext';
import { useEffect, useState } from 'react';
import Header from '@/app/components/Header';
import Menu from '@/app/components/Menu';
import Custom403 from '@/app/pages/403';


export function formatDateYearMonthDate(date: any) {
  var d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);

  var month = '' + (d.getUTCMonth() + 1),
      day = '' + d.getUTCDate(),
      year = d.getUTCFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

export default function EditActivityJournal({params: { activityJournal } } : { params: { activityJournal: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [activity, setactivity] = useState<any>(null);
  const { userInfo } = useUser();

  async function fetchActivityJournal() {
    try {
      const userId = user?.uid || '';
      const result = await getActivityJournal(activityJournal);
      console.log('activity journal entry retrieved:', result);
      setactivity(result.data);
    } catch (error) {
      console.error('Error retrieving activity journal entry:', error);
    }
  }

  useEffect(() => {  
    if (!user) {
      router.push('/login')
      alert('User not found.');
    }
    if (user) {
      fetchActivityJournal();
    }
  }, [user, activity]);
  
  if (!user) {
    return <div><Custom403/></div>
  }
  
  const formik = useFormik({
    initialValues: {
      date: '', 
      time:'', 
      activity: '',
      duration: 0 as any, 
      notes: '', 
    },

    onSubmit: async (values) => {
      try {
        const userId = user?.uid || '';
        const data = {
          date: values.date,
          time: values.time,
          activity: values.activity,
          duration: values.duration,
          notes: values.notes,
        };
        const result = await updateActivityJournal(activityJournal, data); 
        console.log('activity journal entry updated:', result);
        router.push(`/getActivityJournals/${activityJournal}`)
      } catch (error) {
        console.error('Error updating activity journal entry:', error);
      }
    },
  });


  useEffect(() =>{
    const  { setValues } = formik;
    setValues({
      date: formatDateYearMonthDate(activity?.date), 
      time: activity?.time,
      activity: activity?.activity,
      duration: activity?.duration,
      notes: activity?.notes,
    })
  }, [activity])



return (
  <div className="bg-eggshell min-h-screen flex flex-col">
     <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
              <button onClick={() => router.back()}>
              <Header headerText="Edit The Activity Journal"></Header>
              </button>
              </span>
    <form
    className="rounded-3xl bg-white flex flex-col mb-8 w-full md:max-w-[800px] md:min-h-[550px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
    onSubmit={formik.handleSubmit}
  >
    <div className="mt-3 mb-3">
      <label
        htmlFor="date"
        className="font-sans font-medium text-grey text-[16px]"
      >
        Date
      </label>
      <span className="text-red text-[20px]"> *</span>
      <br />
      <Input 
  name="date"
  id="date"
  type="date"
  style={{ width: '100%' }}
  onChange={formik.handleChange}
  value={formik.values.date}
  onBlur={formik.handleBlur}
  required={true} 
  />
{formik.touched.date && !formik.values.date && (
      <p className="text-red text-[14px]">This field can't be left empty.</p>
    )}      </div>

    <div className="mt-3">
      <label
        htmlFor="time"
        className="font-sans font-medium text-grey text-[16px]"
      >
        Time
      </label>
      <span className="text-red text-[20px]"> *</span>
      <br />
      <Input
  name="time"
  id="time"
  type="time"
  style={{ width: '100%' }}
  onChange={formik.handleChange}
  value={formik.values.time}
  onBlur={formik.handleBlur}
/>
{formik.touched.time && !formik.values.time && (
      <p className="text-red text-[14px]">This field can't be left empty.</p>
    )}      
    </div>

    <div className="flex">
<div className="mt-3">
  <label
    htmlFor="activity"
    className="font-sans font-medium text-grey text-[16px]"
  >
    Activity
  </label>
  <span className="text-red text-[20px]"> *</span>
  <br />
  <Input
    name="activity"
    id="activity"
    type="text"
    style={{ width: '100%' }}
    onChange={formik.handleChange}
    value={formik.values.activity}
    onBlur={formik.handleBlur}
  />
  {/* Check if the field is touched */}
  {formik.touched.activity && (
    // Check if the field is empty
    !formik.values.activity && (
      <p className="text-red text-[14px]">This field can't be left empty or zero.</p>
    )
  )}
</div>
</div>

    <div className="mt-3">
      <label
        htmlFor="duration"
        className="font-sans font-medium text-grey text-[16px]"
      >
        Duration (in minutes)
      </label>
      <span className="text-red text-[20px]"> *</span>
      <br />
      <Input
        name="duration"
        id="duration"
        type="number"
        style={{ width: '100%' }}
        onChange={formik.handleChange}
        value={formik.values.duration}
        onBlur={formik.handleBlur}
      />
      

     {/* Check if the field is touched */}
{formik.touched.duration && (
  // Check if the field is empty
  !formik.values.duration && (
    <p className="text-red text-[14px]">This field can't be left empty or zero.</p>
  ) || (
    // Check if the field is less than or equal to zero
    formik.values.duration <= 0 && (
      <p className="text-red text-[14px]">You can't enter a negative duration or a duration of zero.</p>
    )
  )
)}
    
    </div>

    

    <div className="mt-3">
              <label
                htmlFor="notes"
                className="font-sans font-medium text-grey text-[16px]"
              >
                Notes
              </label>
              <br />
              <Input
                name="notes"
                id="notes"
                type="text"
                style={{ width: '100%' }}
                onChange={formik.handleChange}
                value={formik.values.notes}
                onBlur={formik.handleBlur}
              />
            </div>
    
    <div className="items-center">
    <div className="mt-5 mb-5 space-x-2">
      <Button
        type="button"
        text="Cancel"
        style={{ width: '140px', backgroundColor: 'var(--Red, #FF7171)' }}
        onClick={() => router.push(`/getActivityJournals/${activityJournal}`)}
      />

<Button
        type="submit"
        text="Submit"
        disabled={
          !(formik.isValid && formik.dirty) || // Check if the form is valid and dirty

          formik.values.duration === 0 || // Check if duration is zero
          formik.values.duration < 0 || // Check if duration is less than zero
          !formik.values.date || // Check if date is missing or empty
          !formik.values.time || // Check if time is missing or empty
          !formik.values.activity || // Check if activity is missing or empty
          !formik.values.duration // Check if duration is missing or empty
        }
        style={{ width: '140px' }}
        onClick={() => router.push(`/getActivityJournals/${activityJournal}`)}
      />
    </div>
    </div>
  </form>
  <div className="mt-8">
        <div className={`xl:max-w-[1280px] w-full  menu-container`}>
          <Menu />
        </div>
      </div>
  </div>
);

}