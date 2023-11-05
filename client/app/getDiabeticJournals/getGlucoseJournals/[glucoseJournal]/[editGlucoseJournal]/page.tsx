'use client';
import Image from 'next/image';
import Button from '../../../../components/Button';
import Input from '../../../../components/Input';
import Link from 'next/link';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { createGlucoseJournal, getGlucoseJournal, getGlucoseJournals, updateGlucoseJournal } from '../../../../http/diabeticJournalAPI'; 
import { useAuth } from '../../../../contexts/AuthContext';
import { useUser } from '../../../../contexts/UserContext';
import { useEffect, useState } from 'react';
import Header from '@/app/components/Header';
import Menu from '@/app/components/Menu';
import { formatDateYearMonthDate } from '@/app/helpers/utils/datetimeformat';
import Custom403 from '@/app/pages/403';


export default function EditGlucoseJournal({params: { glucoseJournal } } : { params: { glucoseJournal: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [glucose, setglucose] = useState<any>(null);
  const { userInfo } = useUser();
  
  async function fetchGlucoseJournal() {
    try {
      const userId = user?.uid || '';
      const result = await getGlucoseJournal(glucoseJournal);
      console.log('Glucose journal entry retrieved:', result);
      setglucose(result.data);
    } catch (error) {
      console.error('Error retrieving glucose journal entry:', error);
    }
  }
  
  useEffect(() => {  
    if (!user) {
      router.push('/login')
      alert('User not found.');
    } 
    if (user) {
      fetchGlucoseJournal();
    }
  }, []);
  
  if (!user) {
    return <div><Custom403/></div>
  }
  
  const formik = useFormik({
    initialValues: {
      date: '', 
      mealTime:'', 
      bloodGlucose: 0.0 as any,
      unit:'', 
      notes: '', 
    },

    onSubmit: async (values) => {
      try {
        const userId = user?.uid || '';
        const data = {
          date: values.date,
          mealTime: values.mealTime,
          bloodGlucose: values.bloodGlucose,
          unit: values.unit,
          notes: values.notes,
        };
        const result = await updateGlucoseJournal(glucoseJournal, data); 
        console.log('Glucose journal entry updated:', result);
      } catch (error) {
        console.error('Error updating glucose journal entry:', error);
      }
    },
  });


  useEffect(() =>{
    const  { setValues } = formik;
    setValues({
      date: formatDateYearMonthDate(glucose?.date), 
      mealTime: glucose?.mealTime,
      bloodGlucose: glucose?.bloodGlucose,
      unit: glucose?.unit,
      notes: glucose?.notes,
    })
  }, [glucose])



return (
  <div className="bg-eggshell min-h-screen flex flex-col">
     <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
              <button onClick={() => router.push(`/getDiabeticJournals/getGlucoseJournals/${glucoseJournal}`)}>
              <Header headerText="Edit The Glucose Measurement"></Header>
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
          htmlFor="mealTime"
          className="font-sans font-medium text-grey text-[16px]"
        >
          Meal Time
        </label>
        <span className="text-red text-[20px]"> *</span>
        <br />
        <select
            className="text-darkgrey"
          
      name="mealTime"
            id="mealTime"
      style={{
        width: '100%',
        border: '1px solid #DBE2EA', // Border style
        borderRadius: '5px',
        marginTop: '5px',
      }}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values.mealTime}
    >
      <option className="text-darkgrey" value="Before breakfast">
      Before breakfast
      </option>
      <option className="text-darkgrey" value="30min after breakfast">
      30min after breakfast
      </option>
      <option className="text-darkgrey" value="2hrs after breakfast">
      2hrs after breakfast
      </option>
      <option className="text-darkgrey" value="Before lunch">
      Before lunch
      </option>
      <option className="text-darkgrey" value="30min after lunch">
      30min after lunch
      </option>
      <option className="text-darkgrey" value="2hrs after lunch">
      2hrs after lunch
      </option>
      <option className="text-darkgrey" value="Before dinner">
      Before dinner
      </option>
      <option className="text-darkgrey" value="30min after dinner">
      30min after dinner
      </option>
      <option className="text-darkgrey" value="2hrs after dinner">
      2hrs after dinner
      </option>
      <option className="text-darkgrey" value="Bedtime">
      Bedtime
      </option>
      <option className="text-darkgrey" value="Night">
      Night
      </option>
      <option className="text-darkgrey" value="Other">
        Other
      </option>
    </select>

{formik.touched.mealTime && !formik.values.mealTime && (
        <p className="text-red text-[14px]">This field can't be left empty.</p>
      )}      
      </div>

    <div className="flex">
<div className="mt-3">
  <label
    htmlFor="bloodGlucose"
    className="font-sans font-medium text-grey text-[16px]"
  >
    Blood Glucose
  </label>
  <span className="text-red text-[20px]"> *</span>
  <br />
  <Input
    name="bloodGlucose"
    id="bloodGlucose"
    type="number"
    style={{ width: '75%' }}
    onChange={formik.handleChange}
    value={formik.values.bloodGlucose}
    onBlur={formik.handleBlur}
  />
  {/* Check if the field is touched */}
  {formik.touched.bloodGlucose && (
    // Check if the field is empty
    !formik.values.bloodGlucose && (
      <p className="text-red text-[14px]">This field can't be left empty or zero.</p>
    ) || (
      // Check if the field is less than or equal to zero
      formik.values.bloodGlucose <= 0 && (
        <p className="text-red text-[14px]">You can't enter a negative glucose or a glucose of zero.</p>
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
      marginLeft: '-2%'
    }}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    value={formik.values.unit}
  >
    <option
      className="text-darkgrey"
      value="mg/dL"
    >
      mg/dL
    </option>
    <option
      className="text-darkgrey"
      value="mmol/L"
    >
    mmol/L          
    </option>
    <option
    className="text-darkgrey"
    value="other"
    >
    Other
      </option>
  </select>        
  {formik.touched.unit && !formik.values.unit && (
    <p className="text-red text-[14px]">This field can't be left empty.</p>
  )}
</div>
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
    
    <div className='mt-10 pb-4 space-x-2 self-center'>
      <Button
        type="button"
        text="Cancel"
        style={{ width: '140px', backgroundColor: 'var(--Red, #FF7171)' }}
        onClick={() => router.push(`/getDiabeticJournals/getGlucoseJournals/${glucoseJournal}`)}
      />

<Button
        type="submit"
        text="Submit"
        disabled={
          !(formik.isValid && formik.dirty) || // Check if the form is valid and dirty
            formik.values.bloodGlucose === 0 || // Check if  Blood Glucose is zero
            formik.values.bloodGlucose < 0 || // Check if  Blood Glucose is less than  zero
            !formik.values.unit || // Check if unit is missing or empty
            !formik.values.date || // Check if date is missing or empty
            !formik.values.mealTime  // Check if time is missing or empty
        }
        style={{ width: '140px' }}
        onClick={() => router.push(`/getDiabeticJournals/getGlucoseJournals/${glucoseJournal}`)}
      />
    </div>
  </form>
  </div>
  
);

}