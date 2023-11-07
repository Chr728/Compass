'use client';
import Image from 'next/image';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Link from 'next/link';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { createWeightJournal, getWeightJournal, getWeightJournals, updateWeightJournal } from '../../../http/weightJournalAPI'; // Replace '../api/yourApiFile' with the correct path
import { useAuth } from '../../../contexts/AuthContext';
import { useUser } from '../../../contexts/UserContext';
import { useEffect, useState } from 'react';
import Header from '@/app/components/Header';
import Menu from '@/app/components/Menu';
import { formatDateYearMonthDate } from '@/app/helpers/utils/datetimeformat';
import Custom403 from '@/app/pages/403';


export default function EditWeightJournal({params: { weightJournal } } : { params: { weightJournal: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [weight, setweight] = useState<any>(null);
  const { userInfo } = useUser();
  
  async function fetchWeightJournal() {
    try {
      const userId = user?.uid || '';
      const result = await getWeightJournal(weightJournal);
      console.log('Weight journal entry retrieved:', result);
      setweight(result.data);
    } catch (error) {
      console.error('Error retrieving weight journal entry:', error);
    }
  }
  
  useEffect(() => {  
    if (!user) {
      router.push('/login')
      alert('User not found.');
    } 
    if (user) {
      setTimeout(() => {
      fetchWeightJournal();
    }, 1000);
    }
  }, []);
  
  if (!user) {
    return <div><Custom403/></div>
  }
  
  const formik = useFormik({
    initialValues: {
      date: '', 
      time:'', 
      weight: 0.0 as any,
      height: 0.0 as any,
      unit:'', 
      notes: '', 
    },

    onSubmit: async (values) => {
      try {
        const userId = user?.uid || '';
        const data = {
          date: values.date,
          time: values.time,
          weight: values.weight,
          height: values.height,
          unit: values.unit,
          notes: values.notes,
        };
        const result = await updateWeightJournal(weightJournal, data); 
        console.log('Weight journal entry updated:', result);
        router.push(`/getWeightJournals/${weightJournal}`)
      } catch (error) {
        console.error('Error updating weight journal entry:', error);
      }
    },
  });


  useEffect(() =>{
    const  { setValues } = formik;
    setValues({
      date: formatDateYearMonthDate(weight?.date), 
      time: weight?.time,
      weight: weight?.weight,
      height: weight?.height,
      unit: weight?.unit,
      notes: weight?.notes,
    })
  }, [weight])



return (
  <div className="bg-eggshell min-h-screen flex flex-col">
     <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
              <button onClick={() => router.push(`/getWeightJournals/${weightJournal}`)}>
              <Header headerText="Edit The Weight Journal"></Header>
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
    htmlFor="weight"
    className="font-sans font-medium text-grey text-[16px]"
  >
    Weight
  </label>
  <span className="text-red text-[20px]"> *</span>
  <br />
  <Input
    name="weight"
    id="weight"
    type="number"
    style={{ width: '100%' }}
    onChange={formik.handleChange}
    value={formik.values.weight}
    onBlur={formik.handleBlur}
  />
  {/* Check if the field is touched */}
  {formik.touched.weight && (
    // Check if the field is empty
    !formik.values.weight && (
      <p className="text-red text-[14px]">This field can't be left empty or zero.</p>
    ) || (
      // Check if the field is less than or equal to zero
      formik.values.weight <= 0 && (
        <p className="text-red text-[14px]">You can't enter a negative weight or a weight of zero.</p>
      )
    )
  )}
</div>

<div className="mt-3  ml-3"
style={{
  width: '25%',
}}
>
  <label
    htmlFor="unit"
    className="font-sans font-medium text-grey text-[16px]"
  >
    Unit
  </label>
  <span className="text-red text-[20px]"> *</span>
  <br />
  <select
    className="text-darkgrey"
    name="unit"
    id="unit"
    style={{
      width: '100%',
      border: '1px solid #DBE2EA', // Border style
      borderRadius: '5px',
      marginTop: '5px',
    }}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    value={formik.values.unit}
  >
    <option className="text-darkgrey" value="">
        Choose one
      </option>
            <option
      className="text-darkgrey"
      value="kg"
    >
      kg
    </option>
    <option
      className="text-darkgrey"
      value="lb"
    >
      lb
    </option>
  </select>        
  {formik.touched.unit && !formik.values.unit && (
    <p className="text-red text-[14px]">This field can't be left empty.</p>
  )}
</div>
</div>
    <div className="mt-3">
      <label
        htmlFor="height"
        className="font-sans font-medium text-grey text-[16px]"
      >
        Height (in centimeters)
      </label>
      <span className="text-red text-[20px]"> *</span>
      <br />
      <Input
        name="height"
        id="height"
        type="number"
        style={{ width: '100%' }}
        onChange={formik.handleChange}
        value={formik.values.height}
        onBlur={formik.handleBlur}
      />
      

     {/* Check if the field is touched */}
{formik.touched.height && (
  // Check if the field is empty
  !formik.values.height && (
    <p className="text-red text-[14px]">This field can't be left empty or zero.</p>
  ) || (
    // Check if the field is less than or equal to zero
    formik.values.height <= 0 && (
      <p className="text-red text-[14px]">You can't enter a negative height or a height of zero.</p>
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
              <textarea
                name="notes"
                id="notes"
                className="w-full border border-solid border-lightgrey text-darkgrey rounded-md shadow-[0_4px_8px_0_rgba(44,39,56,0.04)]"
                  rows={4}
                onChange={formik.handleChange}
                value={formik.values.notes}
                onBlur={formik.handleBlur}
              />
            </div>
    
    <div className='mt-10 pb-4 space-x-2 self-center'>
      <Button
        type="button"
        text="Cancel"
        style={{ width: '140px', backgroundColor: 'var(--Red, #FF7171)' }}
        onClick={() => router.push(`/getWeightJournals/${weightJournal}`)}
      />

<Button
        type="submit"
        text="Submit"
        disabled={
          !(formik.isValid && formik.dirty) || // Check if the form is valid and dirty
          formik.values.weight === 0 || // Check if weight is zero
          formik.values.weight < 0 || // Check if weight is less than  zero
          formik.values.height === 0 || // Check if height is zero
          formik.values.height < 0 || // Check if height is less than zero
          !formik.values.unit || // Check if unit is missing or empty
          !formik.values.date || // Check if date is missing or empty
          !formik.values.time || // Check if time is missing or empty
          !formik.values.weight || // Check if weight is missing or empty
          !formik.values.height // Check if height is missing or empty
        }
        style={{ width: '140px' }}
        onClick={() => router.push(`/getWeightJournals/${weightJournal}`)}
      />
    </div>
  </form>
  </div>
);

}