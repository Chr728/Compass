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
import { usePathname } from 'next/navigation'
import Header from '@/app/components/Header';

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

export default function EditWeightJournal() {
  const router = useRouter();
  const { user } = useAuth();
  const { userInfo } = useUser();
  const pathname = usePathname();
  const generatedWeightId = pathname.split('/')[3];
  const [weight, setweight] = useState<any>(null);

  useEffect(() => {  

    if (!userInfo) {
      alert('User not found.');
    } 
  }, [userInfo, router]);
  
  useEffect(() => {
    async function fetchWeightJournal() {
      try {
        const userId = user?.uid || '';
        const x = await getWeightJournals(userId);   
        // const weightJournalId = '1'; // Replace '1' with the correct weight journal entry ID
        const result = await getWeightJournal(userId, generatedWeightId);
        console.log(result.data);
        console.log('Weight journal entry retrieved:', result);
        setweight(result.data);
      } catch (error) {
        console.error('Error retrieving weight journal entry:', error);
      }
    }

    fetchWeightJournal();
  }, [user]);
  
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
        const x = await getWeightJournals(userId);   

        const data = {
          date: values.date,
          time: values.time,
          weight: values.weight,
          height: values.height,
          unit: values.unit,
          notes: values.notes,
        };
        const result = await updateWeightJournal(userId,generatedWeightId, data); 
        console.log('Weight journal entry updated:', result);
        router.push('/getWeightJournals');
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
              <button onClick={() => router.back()}>
              <Header headerText="Edit the Weight Journal"></Header>
              </button>
              </span>
      <form
        className="rounded-3xl bg-white flex flex-col m-auto w-full md:max-w-[800px] md:min-h-[550px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
        onSubmit={formik.handleSubmit}
      >
        <div className="mt-3 mb-3">
          <label
            htmlFor="date" 
            className="font-sans font-medium text-grey text-[16px]"
          >
            Date
          </label>
          <br />
          <Input
            name="date"
            id="date"
            type="date"
            style={{ width: '100%' }}
            onChange={formik.handleChange}
            value={formik.values.date}
            onBlur={formik.handleBlur}
          />
        </div>
<div className="mt-3">
              <label
                htmlFor="time"
                className="font-sans font-medium text-grey text-[16px]"
              >
                Time
              </label>
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
            </div>

            <div className="mt-3">
              <label
                htmlFor="weight"
                className="font-sans font-medium text-grey text-[16px]"
              >
                Weight
              </label>
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
            </div>

            <div className="mt-3">
              <label
                htmlFor="height"
                className="font-sans font-medium text-grey text-[16px]"
              >
               Height
              </label>
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
            </div>

            <div className="mt-3">
              <label
                htmlFor="Unit"
                className="font-sans font-medium text-grey text-[16px]"
              >
                Unit
              </label>
              <br />
              <Input
                name="unit"
                id="unit"
                type="text"
                style={{ width: '100%' }}
                onChange={formik.handleChange}
                value={formik.values.unit}
                onBlur={formik.handleBlur}
              />
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

              

            <div className="mx-auto space-x-2">
              <Button
                type="button"
                text="Cancel"
                style={{ width: '140px', backgroundColor: 'var(--Red, #FF7171)' }}
                onClick={ () => router.push("/profile")}
              />

              <Button
                type="submit"
                text="Submit"
                disabled={!(formik.isValid && formik.dirty)}
                style={{ width: '140px' }}
              />
            </div>

      </form>
    </div>
  );
}