'use client';
import Image from 'next/image';
import Button from '../components/Button';
import Input from '../components/Input';
import Link from 'next/link';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { createGlucoseJournal } from '../http/diabeticJournalAPI'; // Replace '../api/yourApiFile' with the correct path
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { useEffect, useState } from 'react';
import Header from '../components/Header';

export default function CreateGlucoseJournalPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { userInfo } = useUser();

  useEffect(() => {
    if (!userInfo) {
      alert('User not found.');
    } 
  }, [userInfo, router]);

  
  const formik = useFormik({
    initialValues: {
      date: '', // Initialize the form fields with empty values
      mealTime: '',
      bloodGlucose: 0.0,
      unit: '',
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
        const result = await createGlucoseJournal(data); 
        console.log('glucose journal entry created:', result);
        router.push('/getDiabeticJournals');
      } catch (error) {
        console.error('Error creating glucose journal entry:', error);
      }
    },
  });


  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
       <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
              <button onClick={() => router.push('/getDiabeticJournals')}>
              <Header headerText="Create glucose Journal"></Header>
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
          Meal
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
      htmlFor="glucose"
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
      style={{ width: '100%' }}
      onChange={formik.handleChange}
      value={formik.values.bloodGlucose.toString()}
      onBlur={formik.handleBlur}
    />
    {/* Check if the field is touched */}
    {formik.touched.bloodGlucose && (
      // Check if the field is empty
      !formik.values.bloodGlucose && 
      (
        <p className="text-red text-[14px]">This field can't be left empty or zero.</p>
      ) 
      || (
        // Check if the field is less than or equal to zero
        formik.values.bloodGlucose <= 0 && (
          <p className="text-red text-[14px]">You can't enter a negative  Blood Glucose or a  Blood Glucose of zero.</p>
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
      <option
        className="text-darkgrey"
        value="mg/dL"
      >
       mg/dL
      </option>
      <option
        className="text-darkgrey"
        value="lb"
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
      <div className='mt-10 pb-4 self-center'>
      <div className="mt-5 mb-5 space-x-2">
        <Button
          type="button"
          text="Cancel"
          style={{ width: '140px', backgroundColor: 'var(--Red, #FF7171)' }}
          onClick={() => router.push("/getDiabeticJournals")}
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
          style={{ width: '140px', textAlign: 'center' }}
          onClick={() => router.push("getDiabeticJournals")}
        />
        </div>
      </div>
    </form>
    </div>
  );
}